import SocketIO from 'socket.io';
import * as BABYLON from 'babylonjs';
import { CharacterKind, GameDTO, GameEvents } from '@reapers/game-shared';
import CharacterEntity from './shared/character.entity';

export default class PlayerEntity extends CharacterEntity {
  private readonly _socket: SocketIO.Socket;

  public constructor(
    socket: SocketIO.Socket,
    scene: BABYLON.Scene,
    name: string,
    position?: number[],
    rotation?: number[],
  ) {
    super(
      name,
      BABYLON.MeshBuilder.CreateBox(
        CharacterKind.Player,
        {
          height: 1,
          width: 0.5,
          depth: 0.5,
        },
        scene,
      ),
      position,
      rotation,
    );
    this._socket = socket;
    this._mesh.ellipsoid = new BABYLON.Vector3(0.5, 0.45, 0.5);
    this._mesh.checkCollisions = true;
    this._kind = CharacterKind.Player;
  }

  public updateAndEmitGameState(gameDto: GameDTO) {
    this._socket.volatile.emit(GameEvents.Game.Updated, gameDto);
    this.update();
  }
}
