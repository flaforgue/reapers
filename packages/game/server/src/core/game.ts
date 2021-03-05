import SocketIO from 'socket.io';
import Player from './player';
import { hrtimeMs, removeFromArrayById } from '../utils';
import { GameDTO, GameEvent, plainToClass } from '@reapers/game-shared';
import config from '../config';
import Identifiable from './shared/identifiable';
import World from './world';

enum GameState {
  Started,
  Stopped,
}

export default class Game extends Identifiable {
  private _namespace: SocketIO.Namespace;
  private _state = GameState.Stopped;
  private _world: World;
  private _players: Player[] = [];
  private readonly _tickInterval = 1000 / config.fps;
  private _timeoutReference: NodeJS.Timeout | null = null;
  private _immediateReference: NodeJS.Immediate | null = null;

  public constructor(namespace: SocketIO.Namespace) {
    super();
    this._namespace = namespace;
    this._world = new World(50, 50);
    this._startGameLoop();
  }

  public get players(): Player[] {
    return this._players;
  }

  public get world(): World {
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
      this._namespace.volatile.emit(GameEvent.Updated, plainToClass(GameDTO, this));
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
      this._timeoutReference = setTimeout(() => this._loop(), this._tickInterval - duration);
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
      this._namespace.emit(GameEvent.Stopped);
      console.info('Game loop stopped');
    }
  }

  public addPlayer(socketId: string, name: string): Player {
    if (this.isFull) {
      throw new Error('Game is full');
    }

    const player = new Player(socketId, name);
    this._players.push(player);
    console.info(
      `Player ${name} - ${player.id} created (${this._players.length}/${config.nbMaxPlayers})`,
    );

    return player;
  }

  public removePlayer(playerId: string): void {
    console.info(`Player ${playerId} left (${this._players.length}/${config.nbMaxPlayers})`);
    removeFromArrayById(this._players, playerId);
  }
}
