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
export default class Character extends Positionable {
  public readonly level: number;
  public readonly life: BoundedValue;
  public readonly attackRange: number = 1;
  public readonly attackDamageAmount: number;
  public readonly attackLinearSpeed: number = 1;
  public readonly attackTimeToCast: number = 0.1;
  public readonly speedFactor: VariableValue;

  public isAttacking = false;
  public frontMoveDirection: FrontMoveDirection = FrontMoveDirection.None;
  public sideMoveDirection: SideMoveDirection = SideMoveDirection.None;

  protected readonly _attackDuration: number = 0.75; // in seconds
  protected readonly _kind: CharacterKind = CharacterKind.Player;

  protected _isAlive = true;

  private _currentAttacks: Attack[] = [];
  private _isDestroyed = false;
  private _speed = config.game.moveStep;
  private _lowSpeed: number;

  public constructor(
    name: string,
    level: number,
    mesh: BABYLON.InstancedMesh,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    scaling: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
  ) {
    super(mesh, name, position, rotation, scaling);

    this.level = level;
    this.life = this._createLifeBoudedValue();
    this.attackDamageAmount = this._createAttackDamageAmount();
    this._lowSpeed = this._speed * Math.SQRT1_2;
    this.speedFactor = new VariableValue(1, (newCurrent: number) => {
      this._speed = config.game.moveStep * newCurrent;
      this._lowSpeed = this._speed * Math.SQRT1_2;
    });
  }

  public get isAlive(): boolean {
    return this._isAlive;
  }

  public get kind(): CharacterKind {
    return this._kind;
  }

  public get currentAttack(): Attack {
    return this._currentAttacks[this._currentAttacks.length - 1] ?? null;
  }

  public get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  public get canMove(): boolean {
    return this._isAlive && !this.isAttacking;
  }

  public get currentSpeed(): number {
    return this.sideMoveDirection === SideMoveDirection.None ||
      this.frontMoveDirection === FrontMoveDirection.None
      ? this._speed
      : this._lowSpeed;
  }

  protected _createLifeBoudedValue(): BoundedValue {
    return new BoundedValue();
  }

  protected _createAttackDamageAmount(): number {
    return 0;
  }

  public update(): void {
    this._moveWithCollisions();

    for (let i = 0; i < this._currentAttacks.length; i++) {
      if (this._currentAttacks[i].isDestroyed) {
        this._currentAttacks.splice(i, 1);
      } else {
        this._currentAttacks[i].update();
      }
    }
  }

  private _moveWithCollisions(): void {
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

  public attackIfInRange(target: Character): void {
    const distanceToTarget = this.getDistanceTo(target.position);

    if (distanceToTarget <= this.attackRange) {
      this._attack(target, distanceToTarget);
    }
  }

  protected _attack(target: Character, distanceToTarget: number): void {
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

  public receiveAttack(attack: Attack): void {
    this.life.remove(attack.damageAmount);

    if (this._isAlive && this.life.value <= 0) {
      this.dieAsync();
    }
  }

  public dieAsync(): void {
    this._isAlive = false;
    this._currentAttacks = [];

    setTimeout(() => this._die(), 2000);
  }

  protected _die(): void {
    console.warn('No _die implementation', this.kind);
  }

  public destroy(): void {
    super.destroy();

    this._isAlive = false;
    this._isDestroyed = true;
  }
}
