import SocketIO from 'socket.io';
import * as BABYLON from 'babylonjs';
import { CharacterKind, GameDTO, GameEvents } from '@reapers/game-shared';
import CharacterEntity from './shared/character.entity';
import BoundedValue from './shared/bounded-value';

export default class PlayerEntity extends CharacterEntity {
  public readonly attackRange = 10;
  public readonly attackDamageAmount: number = 10;
  public readonly attackLinearSpeed: number = 30;
  private readonly _socket: SocketIO.Socket;
  protected readonly _kind: CharacterKind = CharacterKind.Player;

  public constructor(
    socket: SocketIO.Socket,
    scene: BABYLON.Scene,
    name: string,
    position?: number[],
    rotation?: number[],
  ) {
    super(
      name,
      1,
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
    this._mesh.ellipsoid = new BABYLON.Vector3(0.25, 0.45, 0.25);
    this._mesh.checkCollisions = true;
  }

  protected _createLifeBoudedValue(): BoundedValue {
    return new BoundedValue(0, 100 + 10 * this.level);
  }

  public updateAndEmitGameState(gameDto: GameDTO) {
    this._socket.volatile.emit(GameEvents.Game.Updated, gameDto);
    this.update();
  }
}
