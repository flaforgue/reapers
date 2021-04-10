import * as BABYLON from 'babylonjs';
import ActionScheduler from './action-scheduler';
import BaseEntity from './base.entity';
import CharacterEntity from './character.entity';

export default class AttackEntity extends BaseEntity {
  public readonly damageAmount: number;
  public readonly timeToHit: number;
  public readonly timeToCast: number;

  protected readonly _parent: CharacterEntity;
  protected readonly _target: CharacterEntity;
  protected readonly _attackHitScheduler: ActionScheduler;
  protected readonly _attackCastedScheduler: ActionScheduler;

  public constructor(
    parent: CharacterEntity,
    target: CharacterEntity,
    attack: {
      damageAmount: number;
      timeToCast: number; // time to cast the attack
      timeToHit: number; // time to reach the target
    },
  ) {
    super();
    this._parent = parent;
    this._target = target;
    this.damageAmount = attack.damageAmount;

    this.timeToCast = attack.timeToCast;
    this._attackCastedScheduler = new ActionScheduler(() => {
      this._parent.isAttacking = false;
    }, this.timeToCast);

    this.timeToHit = attack.timeToHit;
    this._attackHitScheduler = new ActionScheduler(() => {
      this._target.life.remove(this.damageAmount);
      this._parent.removeCurrentAttack(this.id);
    }, this.timeToCast + this.timeToHit);
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
