import SocketIO from 'socket.io';
import * as BABYLON from 'babylonjs';
import { GameDTO, GameEvents, plainToClass } from '@reapers/game-shared';
import config from '../config';
import Player from './player';
import World from './world';
import Spider from './monsters/spider';
import Frog from './monsters/frog';
import Identifiable from './identifiable';
import MonsterGenerator from './monster-generator';

export default class Game extends Identifiable {
  private readonly _namespace: SocketIO.Namespace;
  private readonly _world: World;
  private readonly _engine: BABYLON.Engine;
  private readonly _scene: BABYLON.Scene;

  private _isRunning = false;
  private _players: Player[] = [];
  private _monsterGenerators: MonsterGenerator[] = [];

  public constructor(namespace: SocketIO.Namespace) {
    super();

    this._namespace = namespace;
    this._engine = new BABYLON.NullEngine({
      deterministicLockstep: true,
      lockstepMaxSteps: 4,
      renderHeight: 512,
      renderWidth: 512,
      textureSize: 512,
    });
    this._scene = new BABYLON.Scene(this._engine);
    this._scene.collisionsEnabled = true;

    // Required even for BABYLON.NullEngine
    new BABYLON.ArcRotateCamera(
      'Camera',
      0,
      0.8,
      100,
      BABYLON.Vector3.Zero(),
      this._scene,
    );

    this._world = new World(this._scene, 100, 100);
    this._monsterGenerators = [
      new MonsterGenerator(this._scene, Spider, new BABYLON.Vector3(5, 0, 0)),
      // new MonsterGenerator(this._scene, Frog, new BABYLON.Vector3(0, 0, 5)),
    ];

    this._scene.executeWhenReady(() => {
      this._isRunning = true;

      this._engine.runRenderLoop(() => {
        try {
          if (this._isRunning) {
            this._update();
            this._scene.render();
          }
        } catch (err) {
          console.error(err);
        }
      });
    });
  }

  public get players() {
    return this._players;
  }

  public get monsterGenerators() {
    return this._monsterGenerators;
  }

  public get world() {
    return this._world;
  }

  public get isFull() {
    return this._players.length >= config.game.nbMaxPlayers;
  }

  private _update() {
    const gameDto = plainToClass(GameDTO, this, {
      excludeExtraneousValues: true,
      strategy: 'excludeAll',
    });

    for (let i = 0; i < this._players.length; i++) {
      if (this._players[i].isDeleting) {
        this._players.splice(i, 1);
      } else {
        this._players[i].updateAndEmitGameState(gameDto);
      }
    }

    for (let i = 0; i < this._monsterGenerators.length; i++) {
      this._monsterGenerators[i].update();
    }
  }

  public stopGameLoop() {
    if (this._isRunning) {
      this._isRunning = false;
      this._namespace.emit(GameEvents.Game.Stopped);
    }
  }

  public addPlayer(socket: SocketIO.Socket, name: string) {
    if (this.isFull) {
      throw new Error('Game is full');
    }

    const player = new Player(
      socket,
      this._scene,
      name,
      config.game.playerInitialPosition.clone(),
    );
    this._players.push(player);

    console.info(
      `Player ${name} - ${player.id} created (${this._players.length}/${config.game.nbMaxPlayers})`,
    );

    return player;
  }

  public removePlayer(player: Player) {
    console.info(
      `Player ${player.id} left (${this._players.length}/${config.game.nbMaxPlayers})`,
    );

    player.destroy();
  }
}
