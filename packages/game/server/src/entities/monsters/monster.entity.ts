import * as BABYLON from 'babylonjs';
import CharacterEntity from '../shared/character.entity';
import ActionScheduler from '../shared/action-scheduler';
import { getRandomPosition } from '../shared/utils';
import { FrontMoveDirection, RotationDirection } from '@reapers/game-shared';
import AttackEntity from '../shared/attack.entity';

const walkingArea = 5;
export default class MonsterEntity extends CharacterEntity {
  public readonly attackRange = 1;

  protected readonly _shouldMoveWithCollisions = false;

  private readonly _initialPosition: BABYLON.Vector3;
  private readonly _moveActionScheduler: ActionScheduler;
  private readonly _updateDestinationFromTargetScheduler: ActionScheduler;
  private _destination: BABYLON.Vector3;
  private _target: CharacterEntity | null = null;
  private _isGoingBackToInitialPosition = false;

  public constructor(
    name: string,
    level: number,
    mesh: BABYLON.Mesh,
    position: BABYLON.Vector3,
    rotation: BABYLON.Vector3,
    speedFactor = new BABYLON.Vector3(1.2, 1.2, 1.2),
  ) {
    super(name, level, mesh, position, rotation, speedFactor);

    this._initialPosition = this._mesh.position.clone();
    this._destination = this._initialPosition.clone();
    this._moveActionScheduler = new ActionScheduler(() => {
      this.destination = getRandomPosition(this._initialPosition, walkingArea);
    }, 5);
    this._updateDestinationFromTargetScheduler = new ActionScheduler(() => {
      if (this._target?.isActive) {
        this.destination = this._target.meshPosition;
      } else {
        this._goBackToInitialPosition();
      }
    }, 0.5);
  }

  public get destination() {
    return this._destination;
  }

  public set destination(dest: BABYLON.Vector3) {
    this._destination = new BABYLON.Vector3(dest.x, this._initialPosition.y, dest.z);
  }

  public update() {
    if (this._target) {
      this._updateDestinationFromTargetScheduler.update();

      if (this._isAtDestination() && !this.isAttacking) {
        this._attack(this._target, this.attackRange);
      }
    } else if (this._isAtDestination()) {
      if (this._isGoingBackToInitialPosition) {
        this._isGoingBackToInitialPosition = false;
        this.life.setToMax();
      }
      this.frontMoveDirection = FrontMoveDirection.None;
      this.rotationDirection = RotationDirection.None;
      this._moveActionScheduler.update();
    }

    if (!this._isAtDestination() && !this.isAttacking) {
      this.setRotation(this._getRotationToDestination());
      this.frontMoveDirection = FrontMoveDirection.Forward;
    }

    super.update();
  }

  private _isAtDestination() {
    const distance = BABYLON.Vector3.Distance(this._mesh.position, this.destination);

    return distance <= this.attackRange;
  }

  private _getRotationToDestination() {
    const axis1 = this._mesh.position.subtract(this.destination);
    const axis2 = BABYLON.Vector3.Cross(axis1, new BABYLON.Vector3(0, 1, 0));
    const axis3 = BABYLON.Vector3.Cross(axis1, axis2);

    return BABYLON.Vector3.RotationFromAxis(axis1, axis2, axis3).y + Math.PI / 2;
  }

  public receiveAttack(attack: AttackEntity) {
    super.receiveAttack(attack);

    if (!this._isGoingBackToInitialPosition) {
      this._target = attack.parent;
      this.destination = this._target.meshPosition;
    }
  }

  private _goBackToInitialPosition() {
    this._target = null;
    this._destination = this._initialPosition;
    this._isGoingBackToInitialPosition = true;
  }
}
