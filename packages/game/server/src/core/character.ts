import * as BABYLON from 'babylonjs';
import {
  FrontMoveDirection,
  SideMoveDirection,
  CharacterKind,
  AttackState,
} from '@reapers/game-shared';
import config from '../config';
import Positionable from './positionable';
import BoundedValue from './shared/bounded-value';
import Attack from './shared/attack';
import VariableValue from './shared/variable-value';
import World from './world';
export default class Character extends Positionable {
  public readonly level: number;
  public readonly life: BoundedValue;
  public readonly attackRange: number = 1;
  public readonly attackDamageAmount: number;
  public readonly attackLinearSpeed: number = 1;
  public readonly attackTimeToCast: number = 0.1;
  public readonly speedFactor: VariableValue;

  public frontMoveDirection: FrontMoveDirection = FrontMoveDirection.None;
  public sideMoveDirection: SideMoveDirection = SideMoveDirection.None;

  protected readonly _world: World;
  protected readonly _kind: CharacterKind = CharacterKind.Player;
  protected readonly _attackDuration: number = 0.75; // in seconds

  protected _target: Character | null = null;
  protected _isAlive = true;
  protected _currentAttacks: Attack[] = [];

  private _isDestroyed = false;
  private _speed = config.game.moveStep;
  private _lowSpeed: number;

  public constructor(
    world: World,
    name: string,
    level: number,
    mesh: BABYLON.InstancedMesh,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    scaling: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
  ) {
    super(mesh, name, position, rotation, scaling);

    this._world = world;
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

  public get currentAttacks(): Attack[] {
    return this._currentAttacks;
  }

  public get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  public get canMove(): boolean {
    return this._isAlive && !this.isAttacking;
  }

  public get isAttacking(): boolean {
    const isAttackingStates = [AttackState.Loading, AttackState.Casting];

    return this._currentAttacks.some((a) => isAttackingStates.indexOf(a.state) !== -1);
  }

  public get isLoadingAttack(): boolean {
    return this._currentAttacks.some((a) => a.state === AttackState.Loading);
  }

  public get isCastingAttack(): boolean {
    return this._currentAttacks.some((a) => a.state === AttackState.Casting);
  }

  public get currentSpeed(): number {
    return this.sideMoveDirection === SideMoveDirection.None ||
      this.frontMoveDirection === FrontMoveDirection.None
      ? this._speed
      : this._lowSpeed;
  }

  public get target(): Character | null {
    return this._target;
  }

  protected _createLifeBoudedValue(): BoundedValue {
    return new BoundedValue();
  }

  protected _createAttackDamageAmount(): number {
    return 0;
  }

  public update(): void {
    this._move();

    for (let i = 0; i < this._currentAttacks.length; i++) {
      if (this._currentAttacks[i].isDestroyed) {
        this._currentAttacks.splice(i, 1);
      } else {
        this._currentAttacks[i].update();

        if (this._currentAttacks[i].state === AttackState.Loading) {
          this._lookAtY(this._currentAttacks[i].targetPosition);
        }
      }
    }
  }

  protected _move(): void {
    // front move
    const move = new BABYLON.Vector3(
      this.frontMoveDirection * Math.sin(this.rotation.y) * -1,
      0,
      this.frontMoveDirection * Math.cos(this.rotation.y) * -1,
    );

    // side move
    move.x -= Math.sin(this.rotation.y + Math.PI / 2) * this.sideMoveDirection;
    move.z -= Math.cos(this.rotation.y + Math.PI / 2) * this.sideMoveDirection;

    this._mesh.moveWithCollisions(
      move.multiply(new BABYLON.Vector3().setAll(this.currentSpeed)),
    );
    this._stickToGround();
  }

  public attackIfInRange(target: Character): void {
    const distanceToTarget = this.getDistanceTo(target.position);

    if (distanceToTarget <= this.attackRange) {
      this._attack(target, distanceToTarget);
    }
  }

  // meant to be overridden
  protected _attack(attackTarget: Character, _distanceToTarget: number): void {
    this._lookAtY(attackTarget.position);
    this.frontMoveDirection = FrontMoveDirection.None;
    this.sideMoveDirection = SideMoveDirection.None;
  }

  public receiveAttack(attack: Attack): void {
    this.life.remove(attack.damageAmount);

    if (this._isAlive && this.life.value <= 0) {
      this.dieAsync();
    }
  }

  public isMonster(): boolean {
    return this.kind !== CharacterKind.Player;
  }

  public dieAsync(): void {
    this._isAlive = false;
    this._currentAttacks = [];

    setTimeout(() => this._die(), 2000);
  }

  protected _die(): void {
    console.warn('No _die implementation', this.kind);
  }

  protected _stickToGround(): void {
    this.position.y = this._world.getHeightAtCoordinates(this.position);
  }

  public destroy(): void {
    super.destroy();

    this._isAlive = false;
    this._isDestroyed = true;
  }
}
