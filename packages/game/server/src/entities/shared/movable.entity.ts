import * as BABYLON from 'babylonjs';
import {
  FrontMoveDirection,
  SideMoveDirection,
  RotationDirection,
} from '@reapers/game-shared';
import config from '../../config';
import PositionableEntity from './positionable.entity';

export default class MovableEntity extends PositionableEntity {
  public readonly name: string;
  public frontMoveDirection: FrontMoveDirection = FrontMoveDirection.None;
  public sideMoveDirection: SideMoveDirection = SideMoveDirection.None;
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
    let isMovingFront = true;
    let isMovingSide = true;
    let amountRight = 0;
    let amountUp = 0;
    let amountForward = 0;

    if (this.frontMoveDirection === FrontMoveDirection.Forward) {
      amountForward = config.moveStep;
    } else if (this.frontMoveDirection === FrontMoveDirection.Backward) {
      amountForward = config.moveStep * -1;
    } else {
      isMovingFront = false;
    }

    if (this.sideMoveDirection === SideMoveDirection.Right) {
      amountRight = config.moveStep;
    } else if (this.sideMoveDirection === SideMoveDirection.Left) {
      amountRight = config.moveStep * -1;
    } else {
      isMovingSide = false;
    }

    if (isMovingFront && isMovingSide) {
      amountRight *= Math.SQRT1_2;
      amountForward *= Math.SQRT1_2;
    }

    this._mesh.movePOV(amountRight, amountUp, amountForward);
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
