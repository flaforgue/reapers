import SocketIO from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import * as BABYLON from 'babylonjs';
import { GameDTO, GameEvents, plainToClass } from '@reapers/game-shared';
import config from '../config';
import { Identifiable } from '../types';
import PlayerEntity from './player.entity';
import WorldEntity from './world.entity';

enum GameState {
  Started,
  Stopped,
}

const removeFromArrayById = (
  arr: Identifiable[],
  id: string,
): Identifiable | undefined => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return arr.splice(i, 1)[0];
    }
  }
};

const hrtimeMs = (): number => {
  const time = process.hrtime();
  return time[0] * 1000 + time[1] / 1000000;
};

export default class GameEntity implements Identifiable {
  private _namespace: SocketIO.Namespace;
  private _state = GameState.Stopped;
  private _world: WorldEntity;
  private _players: PlayerEntity[] = [];
  private readonly _tickInterval = 1000 / config.fps;
  private _timeoutReference: NodeJS.Timeout | null = null;
  private _immediateReference: NodeJS.Immediate | null = null;
  private readonly _engine: BABYLON.Engine;
  private readonly _scene: BABYLON.Scene;

  public readonly id = uuidv4();

  public constructor(namespace: SocketIO.Namespace) {
    this._engine = new BABYLON.NullEngine();
    this._scene = new BABYLON.Scene(this._engine);
    this._namespace = namespace;
    this._world = new WorldEntity(50, 50);
    this._startGameLoop();
  }

  public get players(): PlayerEntity[] {
    return this._players;
  }

  public get world(): WorldEntity {
    return this._world;
  }

  public get state(): GameState {
    return this._state;
  }

  public get isFull(): boolean {
    return this._players.length >= config.nbMaxPlayers;
  }

  private _update(): void {
    for (let i = 0; i < this._players.length; i++) {
      this._players[i].update();
    }
  }

  private _broadcastGameUpdated(): void {
    if (this._state === GameState.Started) {
      this._namespace.volatile.emit(GameEvents.Game.Updated, plainToClass(GameDTO, this));
    }
  }

  public _startGameLoop(): void {
    if (this._state === GameState.Stopped) {
      this._state = GameState.Started;
      this._loop();
      console.info('Game loop started');
    }
  }

  private _loop(): void {
    const start = hrtimeMs();
    this._update();
    this._broadcastGameUpdated();
    const duration = hrtimeMs() - start;

    if (duration < this._tickInterval) {
      this._timeoutReference = setTimeout(
        () => this._loop(),
        this._tickInterval - duration,
      );
      this._immediateReference = null;
    } else {
      this._immediateReference = setImmediate(() => this._loop());
      this._timeoutReference = null;
    }
  }

  public stopGameLoop(): void {
    if (this._state === GameState.Started) {
      if (this._immediateReference) {
        clearImmediate(this._immediateReference);
      }

      if (this._timeoutReference) {
        clearTimeout(this._timeoutReference);
      }

      this._state = GameState.Stopped;
      this._namespace.emit(GameEvents.Game.Stopped);
      console.info('Game loop stopped');
    }
  }

  public addPlayer(socketId: string, name: string): PlayerEntity {
    if (this.isFull) {
      throw new Error('Game is full');
    }

    const player = new PlayerEntity(socketId, this._scene, name);
    this._players.push(player);
    console.info(
      `Player ${name} - ${player.id} created (${this._players.length}/${config.nbMaxPlayers})`,
    );

    return player;
  }

  public removePlayer(playerId: string): void {
    console.info(
      `Player ${playerId} left (${this._players.length}/${config.nbMaxPlayers})`,
    );
    removeFromArrayById(this._players, playerId);
  }
}