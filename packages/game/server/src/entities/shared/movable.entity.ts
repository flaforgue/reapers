import * as BABYLON from 'babylonjs';
import { MoveDirection, RotationDirection } from '@reapers/game-shared';
import config from '../../config';
import PositionableEntity from './positionable.entity';

export default class MovableEntity extends PositionableEntity {
  public readonly name: string;
  public moveDirection: MoveDirection = MoveDirection.None;
  public rotationDirection: RotationDirection = RotationDirection.None;

  public constructor(
    scene: BABYLON.Scene,
    name: string,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
  ) {
    super(scene, position, rotation);
    this.name = name;
  }

  public update() {
    this._updatePosition();
    this._updateRotation();
  }

  private _updatePosition() {
    switch (this.moveDirection) {
      case MoveDirection.Forward:
        this._mesh.movePOV(0, 0, config.moveStep);
        break;
      case MoveDirection.Backward:
        this._mesh?.movePOV(0, 0, config.moveStep * -1);
        break;
      case MoveDirection.Left:
        this._mesh?.movePOV(config.moveStep * -1, 0, 0);
        break;
      case MoveDirection.Right:
        this._mesh?.movePOV(config.moveStep, 0, 0);
        break;
      default:
        break;
    }
  }

  private _updateRotation() {
    let rotationAmount = 0;

    if (this.rotationDirection === RotationDirection.Left) {
      rotationAmount = config.rotationStep * -1;
    } else if (this.rotationDirection === RotationDirection.Right) {
      rotationAmount = config.rotationStep;
    }

    this._mesh?.rotatePOV(0, BABYLON.Tools.ToRadians(rotationAmount), 0);
  }
}
