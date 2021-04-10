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
export default class CharacterEntity extends PositionableEntity {
  public readonly name: string;
  public readonly level: number;
  public readonly life: BoundedValue;
  public readonly attackRange: number = 1;
  public readonly attackDamageAmount: number = 0;
  public readonly attackLinearSpeed: number = 1;
  public readonly attackTimeToCast: number = 0.1;

  public isAttacking: boolean = false;
  public currentAttack: AttackEntity | null = null;
  public frontMoveDirection: FrontMoveDirection = FrontMoveDirection.None;
  public sideMoveDirection: SideMoveDirection = SideMoveDirection.None;
  public rotationDirection: RotationDirection = RotationDirection.None;

  protected readonly _speedFactor = new BABYLON.Vector3(1, 1, 1);
  protected readonly _shouldMoveWithCollisions: boolean = true;
  protected readonly _kind: CharacterKind = CharacterKind.Player;
  protected readonly _attackDuration: number = 0.75; // in seconds
  private readonly _speed: BABYLON.Vector3;
  private readonly _low_speed: BABYLON.Vector3;

  public constructor(
    name: string,
    level: number,
    mesh: BABYLON.Mesh,
    position?: number[],
    rotation?: number[],
  ) {
    super(mesh, position, rotation);
    this._speed = new BABYLON.Vector3(
      config.moveStep,
      config.moveStep,
      config.moveStep,
    ).multiply(this._speedFactor);
    this._low_speed = this._speed.multiply(
      new BABYLON.Vector3(Math.SQRT1_2, Math.SQRT1_2, Math.SQRT1_2),
    );
    this.name = name;
    this.level = level;
    this.life = this._createLifeBoudedValue();
  }

  public get kind() {
    return this._kind;
  }

  protected _createLifeBoudedValue() {
    return new BoundedValue();
  }

  public update() {
    if (this._shouldMoveWithCollisions) {
      this._moveWithCollisions();
    } else {
      this._moveWithoutCollisions();
    }

    this._updateRotation();
    this.currentAttack?.update();
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
      amountForward = config.moveStep;
    } else if (this.frontMoveDirection === FrontMoveDirection.Backward) {
      amountForward = config.moveStep * -1;
    } else {
      isMovingFront = false;
    }

    if (this.sideMoveDirection === SideMoveDirection.Right) {
      amountRight = config.moveStep;
    } else if (this.sideMoveDirection === SideMoveDirection.Left) {
      amountRight = config.moveStep * -1;
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
    this.currentAttack = new AttackEntity(this, target, {
      damageAmount: this.attackDamageAmount,
      timeToCast: this.attackTimeToCast,
      timeToHit: distanceToTarget / this.attackLinearSpeed,
    });
  }
}
