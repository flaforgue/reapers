import * as BABYLON from 'babylonjs';
import ActionScheduler from './action-scheduler';
import BaseEntity from './base.entity';
import CharacterEntity from './character.entity';

export default class AttackEntity extends BaseEntity {
  protected readonly _parent: CharacterEntity;
  protected readonly _target: CharacterEntity;
  protected readonly _damageAmount: number;
  protected readonly _timeToHit: number;
  protected readonly _attackHitScheduler: ActionScheduler;
  protected readonly _timeToCast: number;
  protected readonly _attackCastedScheduler: ActionScheduler;

  public constructor(
    parent: CharacterEntity,
    target: CharacterEntity,
    attack: {
      damageAmount: number;
      timeToCast: number; // time to cast the attack
      timeToHit: number; // time to hit, after timeToCast
    },
  ) {
    super();
    this._parent = parent;
    this._target = target;
    this._damageAmount = attack.damageAmount;

    this._timeToCast = attack.timeToCast;
    this._attackCastedScheduler = new ActionScheduler(() => {
      this._parent.isAttacking = false;
    }, this._timeToCast);

    this._timeToHit = attack.timeToHit;
    this._attackHitScheduler = new ActionScheduler(() => {
      this._target.life.remove(this._damageAmount);
      this._parent.currentAttack = null;
    }, this._timeToCast + this._timeToHit);
  }

  public get targetId() {
    return this._target.id;
  }

  public get targetPosition() {
    return this._target.meshPosition.asArray();
  }

  public update() {
    this._attackCastedScheduler.update();
    this._attackHitScheduler.update();
  }
}
