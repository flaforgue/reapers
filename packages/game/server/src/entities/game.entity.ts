import SocketIO from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import * as BABYLON from 'babylonjs';
import { GameDTO, GameEvents, plainToClass } from '@reapers/game-shared';
import config from '../config';
import { Identifiable } from '../types';
import PlayerEntity from './player.entity';
import WorldEntity from './world.entity';
import MonsterEntity from './monster.entity';
import SpiderEntity from './spider.entity';

enum GameState {
  Started,
  Stopped,
}

function removeFromArrayById(arr: Identifiable[], id: string) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return arr.splice(i, 1)[0];
    }
  }
}

function hrtimeMs() {
  const time = process.hrtime();
  return time[0] * 1000 + time[1] / 1000000;
}

function getRandomVector3(origin = [0, 0, 0], distances = [0, 0, 0]) {
  return [
    Math.floor(Math.random() * distances[0] * 2 - distances[0]) + origin[0],
    Math.floor(Math.random() * distances[1] * 2 - distances[1]) + origin[1],
    Math.floor(Math.random() * distances[2] * 2 - distances[2]) + origin[2],
  ];
}

export default class GameEntity implements Identifiable {
  private _namespace: SocketIO.Namespace;
  private _state = GameState.Stopped;
  private _world: WorldEntity;
  private _players: PlayerEntity[] = [];
  private _monsters: MonsterEntity[] = [];
  private readonly _tickInterval = 1000 / config.fps;
  private _frameIndex = 0;
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

    // todo remove
    const nbMonsters = 10;
    for (let i = 0; i < nbMonsters; i++) {
      this._monsters.push(
        new SpiderEntity(
          this._scene,
          getRandomVector3([0, 0, 0], [5, 0, 5]),
          getRandomVector3([0, 0, 0], [0, 5, 0]),
        ),
      );
    }
  }

  public get players() {
    return this._players;
  }

  public get monsters() {
    return this._monsters;
  }

  public get world() {
    return this._world;
  }

  public get state() {
    return this._state;
  }

  public get frameIndex() {
    return this._frameIndex;
  }

  public get isFull() {
    return this._players.length >= config.nbMaxPlayers;
  }

  private _update() {
    this._frameIndex = (this._frameIndex + 1) % config.fps;
    const gameDto = plainToClass(GameDTO, this);

    for (let i = 0; i < this._players.length; i++) {
      this._players[i].updateAndEmitGameState(gameDto);
    }
  }

  public _startGameLoop() {
    if (this._state === GameState.Stopped) {
      this._state = GameState.Started;
      this._loop();
      console.info('Game loop started');
    }
  }

  private _loop() {
    const start = hrtimeMs();
    this._update();
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

  public stopGameLoop() {
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

  public addPlayer(socket: SocketIO.Socket, name: string) {
    if (this.isFull) {
      throw new Error('Game is full');
    }

    const player = new PlayerEntity(socket, this._scene, name);
    this._players.push(player);
    console.info(
      `Player ${name} - ${player.id} created (${this._players.length}/${config.nbMaxPlayers})`,
    );

    return player;
  }

  public removePlayer(playerId: string) {
    console.info(
      `Player ${playerId} left (${this._players.length}/${config.nbMaxPlayers})`,
    );
    removeFromArrayById(this._players, playerId);
  }
}
