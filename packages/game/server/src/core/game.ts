import SocketIO from 'socket.io';
import { Player } from '.';
import { hrtimeMs, removeFromArrayById } from '../utils';
import { plainToClass } from 'class-transformer';
import { GameSerializer } from '../serializers';
import config from '../config';
import Identifiable from './shared/identifiable';
import { GameEvent } from '../constants';

enum GameState {
  Started,
  Stopped,
}

export default class Game extends Identifiable {
  private _namespace: SocketIO.Namespace;
  private _state = GameState.Stopped;
  private _players: Player[] = [];
  private _start = 0;
  private readonly _tickInterval = 1000 / config.fps;
  private _tiemoutReference: NodeJS.Timeout | null = null;
  private _immediateReference: NodeJS.Immediate | null = null;

  public constructor(namespace: SocketIO.Namespace) {
    super();
    this._namespace = namespace;
  }

  public get isFull(): boolean {
    return this.players.length >= config.nbMaxPlayers;
  }

  public get players(): Player[] {
    return this._players;
  }

  public get start(): number {
    return this._start;
  }

  public get state(): GameState {
    return this._state;
  }

  public emitEvent(socketId: string, eventName: string, data: unknown): void {
    if (this._state === GameState.Started) {
      this._namespace.sockets.get(socketId)?.emit(eventName, data);
    }
  }

  private _update(): void {
    for (let i = 0; i < this._players.length; i++) {
      this._players[i].update();
    }
  }

  private _emitGameUpdated(): void {
    if (this._state === GameState.Started) {
      for (const socketId in this._namespace.sockets) {
        if (this._namespace.sockets.has(socketId)) {
          this._namespace.sockets
            .get(socketId)
            ?.volatile.emit(GameEvent.Updated, plainToClass(GameSerializer, this));
        }
      }
    }
  }

  private _loop(): void {
    const start = hrtimeMs();
    this._update();
    this._emitGameUpdated();
    const duration = hrtimeMs() - start;

    if (duration < this._tickInterval) {
      this._tiemoutReference = setTimeout(() => this._loop(), this._tickInterval - duration);
      this._immediateReference = null;
    } else {
      this._immediateReference = setImmediate(() => this._loop());
      this._tiemoutReference = null;
    }
  }

  public startGameLoop(): void {
    if (this._state === GameState.Stopped) {
      console.info('Game loop starting');
      this._state = GameState.Started;
      this._start = Date.now();
      this._loop();
      console.info('Game loop started');
    }
  }

  public stopGameLoop(): void {
    if (this._state !== GameState.Stopped) {
      console.info('Game loop stopping');

      if (this._immediateReference) {
        clearImmediate(this._immediateReference);
      }

      if (this._tiemoutReference) {
        clearTimeout(this._tiemoutReference);
      }

      this._namespace.emit(GameEvent.Stopped);
      this._state = GameState.Stopped;
      console.info('Game loop stopped');
    }
  }

  public addPlayer(socketId: string, name: string): Player {
    if (this.isFull) {
      throw new Error('Game is full');
    }

    const player = new Player(socketId, this, name);
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
