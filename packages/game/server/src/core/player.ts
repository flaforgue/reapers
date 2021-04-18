import SocketIO from 'socket.io';
import * as BABYLON from 'babylonjs';
import {
  CharacterKind,
  FrontMoveDirection,
  GameDTO,
  GameEvents,
  SideMoveDirection,
} from '@reapers/game-shared';
import Character from './character';
import BoundedValue from './shared/bounded-value';
import config from '../config';

export default class Player extends Character {
  public readonly attackRange = 10;
  public readonly attackDamageAmount: number = 10;
  public readonly attackLinearSpeed: number = 30;
  public readonly attackTimeToCast: number = 0.45;

  protected readonly _kind: CharacterKind = CharacterKind.Player;
  protected readonly _shouldMoveWithCollisions: boolean = true;

  private readonly _socket: SocketIO.Socket;

  public constructor(
    socket: SocketIO.Socket,
    baseMesh: BABYLON.Mesh,
    name: string,
    position?: BABYLON.Vector3,
    rotation?: BABYLON.Vector3,
    scaling?: BABYLON.Vector3,
  ) {
    super(name, 1, baseMesh.createInstance(''), position, rotation, scaling);

    this._mesh.checkCollisions = true;
    this._mesh.ellipsoid = new BABYLON.Vector3(0.25, 1, 0.25);
    this._mesh.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);
    this.speedFactor.current = 1;
    this._socket = socket;
  }

  protected _createLifeBoudedValue(): BoundedValue {
    return new BoundedValue(0, 100 + 10 * this.level);
  }

  public update(): void {
    if (this.isAlive) {
      super.update();
    }
  }

  public emitGameState(gameDto: GameDTO): void {
    this._socket.volatile.emit(GameEvents.Game.Updated, gameDto);
  }

  protected _die(): void {
    this.speedFactor.reset();
    this.isAttacking = false;
    this.frontMoveDirection = FrontMoveDirection.None;
    this.sideMoveDirection = SideMoveDirection.None;
    this.life.setToMax();
    this._isAlive = true;
    this.setRotationY(0);
    this._mesh.position = config.game.playerInitialPosition.clone();
  }
}
