import * as BABYLON from 'babylonjs';
import ActionScheduler from './action-scheduler';
import Identifiable from '../identifiable';
import Character from '../character';
import { AttackState, CharacterKind } from '@reapers/game-shared';

type AttackConfig = {
  damageAmount: number;
  maxLoadingTime?: number; // if 0, the Loading State is skipped
  timeToCast: number; // time to cast the attack
  timeToHit: number; // time to reach the target
};
export default class Attack extends Identifiable {
  public readonly damageAmount: number;
  public readonly timeToHit: number;
  public readonly timeToCast: number;
  public readonly parent: Character;

  private readonly _target: Character;
  private readonly _schedulers: Record<AttackState, ActionScheduler>;

  private _isDestroyed = false;
  private _state: AttackState;

  public constructor(parent: Character, target: Character, attackConfig: AttackConfig) {
    super();

    this.parent = parent;
    this.parent.isAttacking = true;
    this._target = target;
    this._state = attackConfig.maxLoadingTime ? AttackState.Loading : AttackState.Casting;
    this.damageAmount = attackConfig.damageAmount;
    this.timeToHit = attackConfig.timeToHit;
    this.timeToCast = attackConfig.timeToCast;
    this._schedulers = {
      [AttackState.Loading]: new ActionScheduler(() => {
        this._state = AttackState.Casting;
      }, attackConfig.maxLoadingTime ?? 0),
      [AttackState.Casting]: new ActionScheduler(() => {
        this._state = AttackState.Hitting;
        this.parent.isAttacking = false;
      }, this.timeToCast),
      [AttackState.Hitting]: new ActionScheduler(() => {
        this._target.receiveAttack(this);
        this._isDestroyed = true;
      }, this.timeToHit),
    };
  }

  public get state(): AttackState {
    return this._state;
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
  }

  public stopLoading(): void {
    this._schedulers[AttackState.Loading].forceAction();
  }
}
