import SocketIO from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import * as BABYLON from 'babylonjs';
import { CharacterKind, MoveDirection, RotationDirection } from '@reapers/game-shared';
import { Identifiable } from '../types';
import config from '../config';

export default abstract class CharacterEntity implements Identifiable {
  public readonly id = uuidv4();
  public readonly kind: CharacterKind;
  public moveDirection: MoveDirection = MoveDirection.None;
  public rotationDirection: RotationDirection = RotationDirection.None;

  private readonly _mesh: BABYLON.Mesh;

  public constructor(
    scene: BABYLON.Scene,
    kind: CharacterKind,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
  ) {
    this.kind = kind;
    this._mesh = BABYLON.MeshBuilder.CreateSphere(
      this.id,
      {
        diameter: 0.1,
      },
      scene,
    );
    this._mesh.position = new BABYLON.Vector3(...position);
    this._mesh.rotation = new BABYLON.Vector3(...rotation);
  }

  public get position() {
    return this._mesh.position.asArray();
  }

  public get rotation() {
    return this._mesh.rotation.asArray();
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
