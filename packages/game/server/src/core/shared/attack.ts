import * as BABYLON from 'babylonjs';
import ActionScheduler from './action-scheduler';
import Identifiable from '../identifiable';
import Character from '../character';
import { AttackState, CharacterKind } from '@reapers/game-shared';

type AttackConfig = {
  damageAmount: number;
  maxDamageCoef?: number;
  maxLoadingTime?: number; // if 0, the Loading State is skipped
  timeToCast: number; // time to cast the attack
  timeToHit: number; // time to reach the target
};

const loadingRate = 0.05;
export default class Attack extends Identifiable {
  public readonly timeToHit: number;
  public readonly timeToCast: number;
  public readonly maxLoadingTime: number;
  public readonly parent: Character;
  public readonly maxDamageCoef;

  private readonly _target: Character;
  private readonly _schedulers: Record<AttackState, ActionScheduler | undefined>;
  private readonly _damageCoefScheduler: ActionScheduler | undefined;

  private _damageCoef: number;
  private _damageAmount: number;
  private _state: AttackState;

  public constructor(parent: Character, target: Character, attackConfig: AttackConfig) {
    super();

    this.parent = parent;
    this.timeToHit = attackConfig.timeToHit;
    this.timeToCast = attackConfig.timeToCast;
    this.maxDamageCoef = attackConfig.maxDamageCoef ?? 1;
    this.maxLoadingTime = attackConfig.maxLoadingTime ?? 0;
    this._damageCoef = attackConfig.maxLoadingTime
      ? Math.round(BABYLON.Scalar.RandomRange(1, this.maxDamageCoef / 2))
      : 1;
    this._target = target;
    this._state = this.maxLoadingTime ? AttackState.Loading : AttackState.Casting;
    this._damageAmount = attackConfig.damageAmount;
    this._schedulers = {
      [AttackState.Loading]: new ActionScheduler(() => {
        this._state = AttackState.Casting;
      }, this.maxLoadingTime),
      [AttackState.Casting]: new ActionScheduler(() => {
        this._state = AttackState.Hitting;
      }, this.timeToCast),
      [AttackState.Hitting]: new ActionScheduler(() => {
        this._target.receiveAttack(this);
        this._state = AttackState.Destroyed;
      }, this.timeToHit),
      [AttackState.Cancelled]: new ActionScheduler(() => {
        this._state = AttackState.Destroyed;
      }, 3),
      [AttackState.Destroyed]: undefined,
    };

    if (this.maxLoadingTime > 0) {
      this._damageCoefScheduler = new ActionScheduler(() => {
        this._damageCoef += 0.2;

        if (this._damageCoef > this.maxDamageCoef) {
          this._damageCoef = 1;
        }
      }, loadingRate);
    }
  }

  public get state(): AttackState {
    return this._state;
  }

  public get damageAmount(): number {
    const damageMultiplier =
      (0.75 * this._damageCoef - 0.75) * (0.75 * this._damageCoef - 0.75) + 1;

    return Math.round(this._damageAmount * damageMultiplier);
  }

  public get damageCoef(): number {
    return this._damageCoef;
  }

  public get targetId(): string {
    return this._target.id;
  }

  public get parentId(): string {
    return this.parent.id;
  }

  public get targetPosition(): BABYLON.Vector3 {
    return this._target.position;
  }

  public get targetKind(): CharacterKind {
    return this._target.kind;
  }

  public get isTargetAlive(): boolean {
    return this._target.isAlive;
  }

  public get isParentAlive(): boolean {
    return this.parent.isAlive;
  }

  public get isDestroyed(): boolean {
    return this._state === AttackState.Destroyed;
  }

  public update(): void {
    this._schedulers[this._state]?.update();

    if (this.state === AttackState.Loading) {
      this._damageCoefScheduler?.update();
    }
  }

  public perform(): void {
    this._schedulers[AttackState.Loading]?.forceAction();
  }

  public cancel(): void {
    this._state = AttackState.Cancelled;
  }
}
