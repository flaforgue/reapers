import SocketIO from 'socket.io';
import * as BABYLON from 'babylonjs';
import { CharacterKind, GameDTO, GameEvents } from '@reapers/game-shared';
import CharacterEntity from './character.entity';

export default class PlayerEntity extends CharacterEntity {
  public readonly name: string;

  private readonly _socket: SocketIO.Socket;

  public constructor(socket: SocketIO.Socket, scene: BABYLON.Scene, name: string) {
    super(scene, CharacterKind.Player);
    this._socket = socket;
    this.name = name;
  }

  public updateAndEmitGameState(gameDto: GameDTO) {
    this._socket.volatile.emit(GameEvents.Game.Updated, gameDto);
    this.update();
  }
}
