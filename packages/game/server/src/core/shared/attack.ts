import * as BABYLON from 'babylonjs';
import ActionScheduler from './action-scheduler';
import Identifiable from '../identifiable';
import Character from '../character';
import { CharacterKind } from '@reapers/game-shared';

export default class Attack extends Identifiable {
  public readonly damageAmount: number;
  public readonly timeToHit: number;
  public readonly timeToCast: number;
  public readonly parent: Character;

  private readonly _target: Character;
  private readonly _attackHitScheduler: ActionScheduler;
  private readonly _attackCastedScheduler: ActionScheduler;
  private _isDestroyed = false;

  public constructor(
    parent: Character,
    target: Character,
    attack: {
      damageAmount: number;
      timeToCast: number; // time to cast the attack
      timeToHit: number; // time to reach the target
    },
  ) {
    super();

    this.parent = parent;
    this._target = target;
    this.damageAmount = attack.damageAmount;

    this.timeToCast = attack.timeToCast;
    this._attackCastedScheduler = new ActionScheduler(() => {
      this.parent.isAttacking = false;
    }, this.timeToCast);

    this.timeToHit = attack.timeToHit;
    this._attackHitScheduler = new ActionScheduler(() => {
      this._target.receiveAttack(this);
      this._isDestroyed = true;
    }, this.timeToCast + this.timeToHit);
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
    this._attackCastedScheduler.update();
    this._attackHitScheduler.update();
  }
}
