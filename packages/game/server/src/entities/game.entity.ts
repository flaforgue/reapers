import SocketIO from 'socket.io';
import * as BABYLON from 'babylonjs';
import { GameDTO, GameEvents, plainToClass } from '@reapers/game-shared';
import config from '../config';
import PlayerEntity from './player.entity';
import WorldEntity from './world.entity';
import SpiderEntity from './monsters/spider.entity';
import BaseEntity from './shared/base.entity';
import MonsterGeneratorEntity from './monster-generator.entity';
import FrogEntity from './monsters/frog.entity';
import CharacterEntity from './shared/character.entity';

enum GameState {
  Started,
  Stopped,
}

function removeFromArrayById(arr: BaseEntity[], id: string) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return arr.splice(i, 1)[0];
    }
  }
}

export default class GameEntity extends BaseEntity {
  private _namespace: SocketIO.Namespace;
  private _state = GameState.Stopped;
  private _world: WorldEntity;
  private _players: PlayerEntity[] = [];
  private _monsterGenerators: MonsterGeneratorEntity[] = [];
  private _frameIndex = 0;
  private readonly _engine: BABYLON.Engine;
  private readonly _scene: BABYLON.Scene;

  // for performance reasons
  private _charactersById: Record<string, CharacterEntity> = {};

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
    new BABYLON.ArcRotateCamera(
      'Camera',
      0,
      0.8,
      100,
      BABYLON.Vector3.Zero(),
      this._scene,
    );

    this._world = new WorldEntity(this._scene, 50, 50);

    const addToCharactersById = (character: CharacterEntity) => {
      this._charactersById[character.id] = character;
    };

    this._monsterGenerators = [
      new MonsterGeneratorEntity(
        this._scene,
        {
          instanceClass: SpiderEntity,
          radius: 25,
          interval: 3,
          nbMaxInstances: 20,
          level: {
            min: 1,
            max: 5,
          },
        },
        addToCharactersById,
      ),
      new MonsterGeneratorEntity(
        this._scene,
        {
          instanceClass: FrogEntity,
          radius: 25,
          interval: 4,
          nbMaxInstances: 20,
          level: {
            min: 1,
            max: 5,
          },
        },
        addToCharactersById,
      ),
    ];

    this._scene.executeWhenReady(() => {
      this._engine.runRenderLoop(() => {
        try {
          if (this._state === GameState.Started) {
            this._update();
            this._scene.render();
          }
        } catch (err) {
          console.error(err);
        }
      });

      this._state = GameState.Started;
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
    const gameDto = plainToClass(GameDTO, this, {
      exposeDefaultValues: true,
      excludeExtraneousValues: true,
      strategy: 'excludeAll',
    });

    for (let i = 0; i < this._players.length; i++) {
      this._players[i].updateAndEmitGameState(gameDto);
    }

    for (let i = 0; i < this._monsterGenerators.length; i++) {
      this._monsterGenerators[i].update();
    }
  }

  public stopGameLoop() {
    if (this._state === GameState.Started) {
      this._state = GameState.Stopped;
      this._namespace.emit(GameEvents.Game.Stopped);
    }
  }

  public addPlayer(socket: SocketIO.Socket, name: string) {
    if (this.isFull) {
      throw new Error('Game is full');
    }

    const player = new PlayerEntity(socket, this._scene, name, [0, 0, 0]);
    this._players.push(player);
    this._charactersById[player.id] = player;
    console.info(
      `Player ${name} - ${player.id} created (${this._players.length}/${config.nbMaxPlayers})`,
    );

    return player;
  }

  public removePlayer(player: PlayerEntity) {
    console.info(
      `Player ${player.id} left (${this._players.length}/${config.nbMaxPlayers})`,
    );
    player.dispose();
    removeFromArrayById(this._players, player.id);
  }

  public findCharacterById(id: string): CharacterEntity | null {
    return this._charactersById[id] ?? null;
  }
}
