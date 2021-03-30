import * as BABYLON from 'babylonjs';
import CharacterEntity from '../shared/character.entity';
import ActionScheduler from '../shared/action-scheduler';
import { getRandomPosition } from '../shared/utils';
import { FrontMoveDirection, RotationDirection } from '@reapers/game-shared';
import config from '../../config';

const freeMoveAreaRadius = 5;
export default class MonsterEntity extends CharacterEntity {
  private readonly _initialPosition: BABYLON.Vector3;
  private readonly _scheduledMoveAction: ActionScheduler;
  private _destination: BABYLON.Vector3;

  public constructor(
    name: string,
    mesh: BABYLON.Mesh,
    position: number[],
    rotation: number[],
  ) {
    super(name, mesh, position, rotation);

    this._initialPosition = this._mesh.position;
    this._destination = this._mesh.position;
    this._scheduledMoveAction = new ActionScheduler(() => this._findNewDestination(), 3);
  }

  public update() {
    if (this._isAtDestination()) {
      this._scheduledMoveAction.update();
      this.frontMoveDirection = FrontMoveDirection.None;
      this.rotationDirection = RotationDirection.None;
    } else {
      this.setRotation(this._getRotationToDestination());
      this.frontMoveDirection = FrontMoveDirection.Forward;
    }

    super.update();
  }

  private _findNewDestination() {
    this._destination = getRandomPosition(this._initialPosition, freeMoveAreaRadius);

    console.log('_findNewDestination', this._destination.asArray());
  }

  private _isAtDestination() {
    const distance = BABYLON.Vector3.Distance(this._mesh.position, this._destination);

    return distance <= 2 * config.moveStep;
  }

  private _getRotationToDestination() {
    const axis1 = this._mesh.position.subtract(this._destination);
    const axis2 = BABYLON.Vector3.Cross(axis1, new BABYLON.Vector3(0, 1, 0));
    const axis3 = BABYLON.Vector3.Cross(axis1, axis2);

    return BABYLON.Vector3.RotationFromAxis(axis1, axis2, axis3).y;
  }
}
