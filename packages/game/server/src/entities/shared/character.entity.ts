import * as BABYLON from 'babylonjs';
import {
  FrontMoveDirection,
  SideMoveDirection,
  RotationDirection,
  CharacterKind,
} from '@reapers/game-shared';
import config from '../../config';
import PositionableEntity from './positionable.entity';

const SPEED = new BABYLON.Vector3(config.moveStep, config.moveStep, config.moveStep);
const LOW_SPEED = SPEED.multiply(
  new BABYLON.Vector3(Math.SQRT1_2, Math.SQRT1_2, Math.SQRT1_2),
);
export default class CharacterEntity extends PositionableEntity {
  public readonly name: string;
  protected _kind: CharacterKind = CharacterKind.Player;
  public frontMoveDirection: FrontMoveDirection = FrontMoveDirection.None;
  public sideMoveDirection: SideMoveDirection = SideMoveDirection.None;
  public rotationDirection: RotationDirection = RotationDirection.None;

  public constructor(
    name: string,
    mesh: BABYLON.Mesh,
    position?: number[],
    rotation?: number[],
  ) {
    super(mesh, position, rotation);
    this.name = name;
  }

  public get kind(): CharacterKind {
    return this._kind;
  }

  public update() {
    this._updatePosition();
    this._updateRotation();
  }

  private _updatePosition() {
    const move = new BABYLON.Vector3(0, config.gravity, 0);
    let isMovingFront = true;

    if (this.frontMoveDirection === FrontMoveDirection.Forward) {
      move.x -= Math.sin(this._mesh.rotation.y);
      move.z -= Math.cos(this._mesh.rotation.y);
    } else if (this.frontMoveDirection === FrontMoveDirection.Backward) {
      move.x += Math.sin(this._mesh.rotation.y);
      move.z += Math.cos(this._mesh.rotation.y);
    } else {
      isMovingFront = false;
    }

    let isMovingSide = true;
    if (this.sideMoveDirection === SideMoveDirection.Right) {
      move.x -= Math.sin(this._mesh.rotation.y + Math.PI / 2);
      move.z -= Math.cos(this._mesh.rotation.y + Math.PI / 2);
    } else if (this.sideMoveDirection === SideMoveDirection.Left) {
      move.x += Math.sin(this._mesh.rotation.y + Math.PI / 2);
      move.z += Math.cos(this._mesh.rotation.y + Math.PI / 2);
    } else {
      isMovingSide = false;
    }

    this._mesh.moveWithCollisions(
      move.multiply(isMovingFront && isMovingSide ? LOW_SPEED : SPEED),
    );
  }

  private _updateRotation() {
    let rotationAmount = 0;

    if (this.rotationDirection === RotationDirection.Left) {
      rotationAmount = config.rotationStep * -1;
    } else if (this.rotationDirection === RotationDirection.Right) {
      rotationAmount = config.rotationStep;
    }

    this._mesh.rotatePOV(0, BABYLON.Tools.ToRadians(rotationAmount), 0);
  }
}
