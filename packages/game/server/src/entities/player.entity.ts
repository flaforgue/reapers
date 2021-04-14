import SocketIO from 'socket.io';
import * as BABYLON from 'babylonjs';
import { CharacterKind, GameDTO, GameEvents } from '@reapers/game-shared';
import CharacterEntity from './shared/character.entity';
import BoundedValue from './shared/bounded-value';
import config from '../config';

export default class PlayerEntity extends CharacterEntity {
  public readonly attackRange = 10;
  public readonly attackDamageAmount: number = 10;
  public readonly attackLinearSpeed: number = 30;
  public readonly attackTimeToCast: number = 0.45;

  private readonly _socket: SocketIO.Socket;

  protected readonly _kind: CharacterKind = CharacterKind.Player;

  public constructor(
    socket: SocketIO.Socket,
    scene: BABYLON.Scene,
    name: string,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
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

    this.speedFactor.current = 1;
    this._socket = socket;
    this._mesh.ellipsoid = new BABYLON.Vector3(0.25, 0.45, 0.25);
    this._mesh.checkCollisions = true;
  }

  protected _createLifeBoudedValue(): BoundedValue {
    return new BoundedValue(0, 100 + 10 * this.level);
  }

  public updateAndEmitGameState(gameDto: GameDTO) {
    this._socket.volatile.emit(GameEvents.Game.Updated, gameDto);

    if (this.isAlive) {
      this.update();
    }
  }

  protected _die() {
    this.life.setToMax();
    this._isAlive = true;
    console.log('_isAlive', true);
    this._mesh.position = config.playerInitialPosition.add(
      new BABYLON.Vector3(0, this.halfHeight, 0),
    );
    this.setRotationY(0);
  }
}
