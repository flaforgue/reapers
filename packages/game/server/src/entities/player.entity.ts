import SocketIO from 'socket.io';
import * as BABYLON from 'babylonjs';
import { EntityKind, GameDTO, GameEvents } from '@reapers/game-shared';
import MovableEntity from './shared/movable.entity';

export default class PlayerEntity extends MovableEntity {
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
        EntityKind.Player,
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
    this._kind = EntityKind.Player;
    this._socket = socket;
  }

  public updateAndEmitGameState(gameDto: GameDTO) {
    this._socket.volatile.emit(GameEvents.Game.Updated, gameDto);
    this.update();
  }
}
