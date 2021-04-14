import * as BABYLON from 'babylonjs';
import {
  FrontMoveDirection,
  SideMoveDirection,
  CharacterKind,
} from '@reapers/game-shared';
import config from '../config';
import Positionable from './positionable';
import BoundedValue from './shared/bounded-value';
import Attack from './shared/attack';
import VariableValue from './shared/variable-value';
import charactersByIds from '../globals/characters-by-ids';
export default class Character extends Positionable {
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

  protected readonly _attackDuration: number = 0.75; // in seconds
  protected readonly _shouldMoveWithCollisions: boolean = false;
  protected readonly _kind: CharacterKind = CharacterKind.Player;

  protected _isAlive = true;

  private _currentAttacks: Attack[] = [];
  private _isDeleting = false;
  private _speed = config.game.moveStep;
  private _low_speed = this._speed * Math.SQRT1_2;

  public constructor(
    name: string,
    level: number,
    mesh: BABYLON.Mesh,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
  ) {
    super(mesh, position, rotation);

    charactersByIds[this.id] = this;

    this.name = name;
    this.level = level;
    this.life = this._createLifeBoudedValue();
    this.attackDamageAmount = this._createAttackDamageAmount();
    this.speedFactor = new VariableValue(1, (newCurrent: number) => {
      this._speed = config.game.moveStep * newCurrent;
      this._low_speed = this._speed * Math.SQRT1_2;
    });
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

  public get currentSpeed() {
    return this.sideMoveDirection === SideMoveDirection.None ||
      this.frontMoveDirection === FrontMoveDirection.None
      ? this._speed
      : this._low_speed;
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

    for (let i = 0; i < this._currentAttacks.length; i++) {
      if (this._currentAttacks[i].isDeleting) {
        this._currentAttacks.splice(i, 1);
      } else {
        this._currentAttacks[i].update();
      }
    }
  }

  private _moveWithCollisions() {
    // front move
    const move = new BABYLON.Vector3(
      this.frontMoveDirection * Math.sin(this.rotation.y) * -1,
      config.game.gravity,
      this.frontMoveDirection * Math.cos(this.rotation.y) * -1,
    );

    // side move
    move.x -= Math.sin(this.rotation.y + Math.PI / 2) * this.sideMoveDirection;
    move.z -= Math.cos(this.rotation.y + Math.PI / 2) * this.sideMoveDirection;

    this._mesh.moveWithCollisions(
      move.multiply(new BABYLON.Vector3().setAll(this.currentSpeed)),
    );
  }

  private _moveWithoutCollisions() {
    this._mesh.movePOV(
      this.sideMoveDirection * this.currentSpeed,
      0,
      this.frontMoveDirection * this.currentSpeed,
    );
  }

  public setRotationY(rotationY: number) {
    this._mesh.rotation.y = rotationY % (2 * Math.PI);
  }

  public attackIfInRange(target: Character) {
    const distanceToTarget = this.getDistanceTo(target.position);

    if (distanceToTarget <= this.attackRange) {
      this._attack(target, distanceToTarget);
    }
  }

  protected _lookAtY(position: BABYLON.Vector3) {
    this._mesh.lookAt(
      new BABYLON.Vector3(position.x, this.position.y, position.z),
      Math.PI,
    );
  }

  protected _attack(target: Character, distanceToTarget: number) {
    this._lookAtY(target.position);
    this.frontMoveDirection = FrontMoveDirection.None;
    this.sideMoveDirection = SideMoveDirection.None;
    this.isAttacking = true;
    this._currentAttacks.push(
      new Attack(this, target, {
        damageAmount: this.attackDamageAmount,
        timeToCast: this.attackTimeToCast,
        timeToHit: this.attackLinearSpeed ? distanceToTarget / this.attackLinearSpeed : 0,
      }),
    );
  }

  public receiveAttack(attack: Attack) {
    this.life.remove(attack.damageAmount);

    if (this._isAlive && this.life.value <= 0) {
      this.dieAsync();
    }
  }

  public dieAsync() {
    this._isAlive = false;
    this._currentAttacks = [];

    setTimeout(() => this._die(), 2000);
  }

  protected _die() {
    console.warn('No _die implementation', this.kind);
  }

  public destroy() {
    super.destroy();

    this._isAlive = false;
    this._isDeleting = true;
    delete charactersByIds[this.id];
  }
}
