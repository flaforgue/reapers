import SocketIO from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import * as BABYLON from 'babylonjs';
import {
  GameDTO,
  GameEvents,
  MoveDirection,
  RotationDirection,
} from '@reapers/game-shared';
import { Identifiable } from '../types';
import config from '../config';

export default class PlayerEntity implements Identifiable {
  public readonly id = uuidv4();
  public readonly name: string;
  public moveDirection: MoveDirection = MoveDirection.None;
  public rotationDirection: RotationDirection = RotationDirection.None;

  private readonly _socket: SocketIO.Socket;
  private readonly _mesh: BABYLON.Mesh;

  public constructor(socket: SocketIO.Socket, scene: BABYLON.Scene, name: string) {
    this._socket = socket;
    this.name = name;
    this._mesh = BABYLON.MeshBuilder.CreateSphere(
      'player',
      {
        diameter: 0.1,
      },
      scene,
    );
  }

  public get position(): number[] {
    return this._mesh.position.asArray();
  }

  public get rotation(): number[] {
    return this._mesh.rotation.asArray();
  }

  public updateAndEmitGameState(gameDto: GameDTO): void {
    this._socket.volatile.emit(GameEvents.Game.Updated, gameDto);
    this._updatePosition();
    this._updateRotation();
  }

  private _updatePosition(): void {
    switch (this.moveDirection) {
      case MoveDirection.Forward:
        this._mesh.movePOV(0, 0, config.player.moveStep);
        break;
      case MoveDirection.Backward:
        this._mesh?.movePOV(0, 0, config.player.moveStep * -1);
        break;
      case MoveDirection.Left:
        this._mesh?.movePOV(config.player.moveStep * -1, 0, 0);
        break;
      case MoveDirection.Right:
        this._mesh?.movePOV(config.player.moveStep, 0, 0);
        break;
      default:
        break;
    }
  }

  private _updateRotation(): void {
    let rotationAmount = 0;

    if (this.rotationDirection === RotationDirection.Left) {
      rotationAmount = config.player.rotationStep * -1;
    } else if (this.rotationDirection === RotationDirection.Right) {
      rotationAmount = config.player.rotationStep;
    }

    this._mesh?.rotatePOV(0, BABYLON.Tools.ToRadians(rotationAmount), 0);
  }
}
