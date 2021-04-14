import * as BABYLON from 'babylonjs';
import {
  FrontMoveDirection,
  SideMoveDirection,
  RotationDirection,
  CharacterKind,
} from '@reapers/game-shared';
import config from '../../config';
import PositionableEntity from './positionable.entity';
import BoundedValue from './bounded-value';
import AttackEntity from './attack.entity';
import VariableValue from './variable-value';
import charactersByIds from '../../globals/characters-by-ids';
export default class CharacterEntity extends PositionableEntity {
  public readonly name: string;
  public readonly level: number;
  public readonly life: BoundedValue;
  public readonly attackRange: number = 1;
  public readonly attackDamageAmount: number;
  public readonly attackLinearSpeed: number = 1;
  public readonly attackTimeToCast: number = 0.1;
  public readonly speedFactor: VariableValue;

  public isAttacking: boolean = false;
  public frontMoveDirection: FrontMoveDirection = FrontMoveDirection.None;
  public sideMoveDirection: SideMoveDirection = SideMoveDirection.None;
  public rotationDirection: RotationDirection = RotationDirection.None;

  protected readonly _attackDuration: number = 0.75; // in seconds
  protected readonly _shouldMoveWithCollisions: boolean = true;
  protected readonly _kind: CharacterKind = CharacterKind.Player;

  protected _isAlive = true;

  private readonly _currentAttacks: AttackEntity[] = [];

  private _isDeleting = false;
  private _low_speed: BABYLON.Vector3;
  private _speed: BABYLON.Vector3;

  public constructor(
    name: string,
    level: number,
    mesh: BABYLON.Mesh,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
  ) {
    super(mesh, position, rotation);

    charactersByIds[this.id] = this;

    this.speedFactor = new VariableValue(1, (newCurrent: number) => {
      this._speed = new BABYLON.Vector3(
        config.moveStep,
        config.moveStep,
        config.moveStep,
      ).multiply(new BABYLON.Vector3().setAll(newCurrent));
      this._low_speed = this._speed.multiply(
        new BABYLON.Vector3(Math.SQRT1_2, Math.SQRT1_2, Math.SQRT1_2),
      );
    });
    this._speed = new BABYLON.Vector3(
      config.moveStep,
      config.moveStep,
      config.moveStep,
    ).multiply(new BABYLON.Vector3().setAll(this.speedFactor.current));
    this._low_speed = this._speed.multiply(
      new BABYLON.Vector3(Math.SQRT1_2, Math.SQRT1_2, Math.SQRT1_2),
    );
    this.name = name;
    this.level = level;
    this.life = this._createLifeBoudedValue();
    this.attackDamageAmount = this._createAttackDamageAmount();
  }

  public get isAlive() {
    return this._isAlive;
  }

  public get kind() {
    return this._kind;
  }

  public get currentAttack() {
    return this._currentAttacks[this._currentAttacks.length - 1] ?? null;
  }

  public get isDeleting() {
    return this._isDeleting;
  }

  public get canMove() {
    return this._isAlive && !this.isAttacking;
  }

  protected _createLifeBoudedValue() {
    return new BoundedValue();
  }

  protected _createAttackDamageAmount() {
    return 0;
  }

  public update() {
    if (this._shouldMoveWithCollisions) {
      this._moveWithCollisions();
    } else {
      this._moveWithoutCollisions();
    }

    this._updateRotation();

    for (let i = 0; i < this._currentAttacks.length; i++) {
      if (this._currentAttacks[i].isDeleting) {
        this._currentAttacks.splice(i, 1);
      } else {
        this._currentAttacks[i].update();
      }
    }
  }

  private _moveWithCollisions() {
    const move = new BABYLON.Vector3(0, config.gravity, 0);
    let isMovingFront = true;

    if (this.frontMoveDirection === FrontMoveDirection.Forward) {
      move.x -= Math.sin(this._mesh.rotation.y);
      move.z -= Math.cos(this._mesh.rotation.y);
    } else if (this.frontMoveDirection === FrontMoveDirection.Backward) {
      move.x += Math.sin(this._mesh.rotation.y);
      move.z += Math.cos(this._mesh.rotation.y);
    } else {
      isMovingFront = false;
    }

    let isMovingSide = true;
    if (this.sideMoveDirection === SideMoveDirection.Right) {
      move.x -= Math.sin(this._mesh.rotation.y + Math.PI / 2);
      move.z -= Math.cos(this._mesh.rotation.y + Math.PI / 2);
    } else if (this.sideMoveDirection === SideMoveDirection.Left) {
      move.x += Math.sin(this._mesh.rotation.y + Math.PI / 2);
      move.z += Math.cos(this._mesh.rotation.y + Math.PI / 2);
    } else {
      isMovingSide = false;
    }

    this._mesh.moveWithCollisions(
      move.multiply(isMovingFront && isMovingSide ? this._low_speed : this._speed),
    );
  }

  private _moveWithoutCollisions() {
    let isMovingFront = true;
    let isMovingSide = true;
    let amountRight = 0;
    let amountUp = 0;
    let amountForward = 0;

    if (this.frontMoveDirection === FrontMoveDirection.Forward) {
      amountForward = this._speed.x;
    } else if (this.frontMoveDirection === FrontMoveDirection.Backward) {
      amountForward = this._speed.x * -1;
    } else {
      isMovingFront = false;
    }

    if (this.sideMoveDirection === SideMoveDirection.Right) {
      amountRight = this._speed.x;
    } else if (this.sideMoveDirection === SideMoveDirection.Left) {
      amountRight = this._speed.x * -1;
    } else {
      isMovingSide = false;
    }

    if (isMovingFront && isMovingSide) {
      amountRight *= Math.SQRT1_2;
      amountForward *= Math.SQRT1_2;
    }

    this._mesh.movePOV(amountRight, amountUp, amountForward);
  }

  private _updateRotation() {
    let rotationAmount = 0;

    if (this.rotationDirection === RotationDirection.Left) {
      rotationAmount = config.rotationStep * -1;
    } else if (this.rotationDirection === RotationDirection.Right) {
      rotationAmount = config.rotationStep;
    }

    this._mesh.rotation = new BABYLON.Vector3(
      0,
      (this._mesh.rotation.y + rotationAmount) % (2 * Math.PI),
      0,
    );
  }

  public setRotation(rotationY: number) {
    this._mesh.rotation.y = rotationY;
  }

  public attackIfInRange(target: CharacterEntity) {
    const distanceToTarget = BABYLON.Vector3.Distance(
      target.meshPosition,
      this._mesh.position,
    );

    if (distanceToTarget <= this.attackRange) {
      this._attack(target, distanceToTarget);
    }
  }

  protected _attack(target: CharacterEntity, distanceToTarget: number) {
    this._mesh.lookAt(target.meshPosition, Math.PI);

    this.frontMoveDirection = FrontMoveDirection.None;
    this.sideMoveDirection = SideMoveDirection.None;
    this.isAttacking = true;
    this._currentAttacks.push(
      new AttackEntity(this, target, {
        damageAmount: this.attackDamageAmount,
        timeToCast: this.attackTimeToCast,
        timeToHit: this.attackLinearSpeed ? distanceToTarget / this.attackLinearSpeed : 0,
      }),
    );
  }

  public receiveAttack(attack: AttackEntity) {
    this.life.remove(attack.damageAmount);

    if (!this._isDeleting && this.life.value <= 0) {
      this.dieAsync();
    }
  }

  public dieAsync() {
    this._isAlive = false;
    setTimeout(() => this._die(), 2000);
  }

  protected _die() {
    console.warn('No _die implementation', this.kind);
  }

  public destroy() {
    super.destroy();
    this._isDeleting = true;
    this._isAlive = false;
    delete charactersByIds[this.id];
  }
}
