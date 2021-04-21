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
  private readonly _schedulers: Record<AttackState, ActionScheduler>;
  private readonly _damageCoefScheduler: ActionScheduler | undefined;

  private _damageCoef = 1;
  private _damageAmount: number;
  private _state: AttackState;
  private _isDestroyed = false;

  public constructor(parent: Character, target: Character, attackConfig: AttackConfig) {
    super();

    this.parent = parent;
    this.parent.isAttacking = true;
    this.timeToHit = attackConfig.timeToHit;
    this.timeToCast = attackConfig.timeToCast;
    this.maxLoadingTime = attackConfig.maxLoadingTime ?? 0;
    this.maxDamageCoef = attackConfig.maxDamageCoef ?? 1;
    this._target = target;
    this._state = this.maxLoadingTime ? AttackState.Loading : AttackState.Casting;
    this._damageAmount = attackConfig.damageAmount;
    this._schedulers = {
      [AttackState.Loading]: new ActionScheduler(() => {
        this._state = AttackState.Casting;
      }, this.maxLoadingTime),
      [AttackState.Casting]: new ActionScheduler(() => {
        this._state = AttackState.Hitting;
        this.parent.isAttacking = false;
      }, this.timeToCast),
      [AttackState.Hitting]: new ActionScheduler(() => {
        this._target.receiveAttack(this);
        this._isDestroyed = true;
      }, this.timeToHit),
    };

    if (this.maxLoadingTime > 0) {
      this._damageCoefScheduler = new ActionScheduler(() => {
        this._damageCoef += 0.2;

        if (this._damageCoef > this.maxDamageCoef) {
          this._damageCoef = 1;
        }

        console.log(this._damageCoef);
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

  public get targetPosition(): BABYLON.Vector3 {
    return this._target.position;
  }

  public get targetKind(): CharacterKind {
    return this._target.kind;
  }

  public get isTargetAlive(): boolean {
    return this._target.isAlive;
  }

  public get isDestroyed(): boolean {
    return this._isDestroyed;
  }

  public update(): void {
    this._schedulers[this._state].update();

    if (this.state === AttackState.Loading) {
      this._damageCoefScheduler?.update();
    }
  }

  public stopLoading(): void {
    this._schedulers[AttackState.Loading].forceAction();
  }
}
