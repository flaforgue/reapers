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
import Monster from './monsters/monster';
import Character from './character';

type GameBaseMeshes = {
  empty: BABYLON.Mesh;
};
export default class Game extends Identifiable {
  private readonly _namespace: SocketIO.Namespace;
  private readonly _world: World;
  private readonly _engine: BABYLON.Engine;
  private readonly _scene: BABYLON.Scene;
  private readonly _charactersByIds: Record<string, Player | Monster> = {};
  private readonly _baseMeshes: GameBaseMeshes;

  private _isRunning = false;
  private _nbPlayers = 0;
  private _monsterGenerators: MonsterGenerator[] = [];

  public constructor(namespace: SocketIO.Namespace) {
    super();

    this._namespace = namespace;
    this._engine = new BABYLON.NullEngine({
      deterministicLockstep: true,
      lockstepMaxSteps: 4,
      renderHeight: 1,
      renderWidth: 1,
      textureSize: 1,
    });
    this._scene = new BABYLON.Scene(this._engine);
    this._scene.collisionsEnabled = true;
    this._scene.freezeActiveMeshes(true);
    this._scene.autoClear = false;
    this._scene.autoClearDepthAndStencil = false;
    this._scene.blockMaterialDirtyMechanism = true;

    // Required even for BABYLON.NullEngine
    new BABYLON.ArcRotateCamera('Camera', 0, 0, 1, BABYLON.Vector3.Zero(), this._scene);

    this._baseMeshes = this._createBaseMeshes();
    this._world = new World(this._scene, 200, 200);
    this._monsterGenerators = [
      new MonsterGenerator(this._baseMeshes.empty, Spider, new BABYLON.Vector3(5, 0, 0), {
        radius: 10,
        interval: 0,
        nbMaxInstances: 10,
      }),
      new MonsterGenerator(this._baseMeshes.empty, Frog, new BABYLON.Vector3(0, 0, 5), {
        radius: 10,
        interval: 0,
        nbMaxInstances: 10,
      }),
    ];

    this._scene.executeWhenReady(() => {
      this._isRunning = true;

      this._engine.runRenderLoop(() => {
        try {
          if (this._isRunning) {
            console.log(this._engine.getFps().toFixed());
            this._update();
            this._scene.render(false, true);
          }
        } catch (err) {
          console.error(err);
        }
      });
    });
  }

  public get characters(): Character[] {
    return Object.values(this._charactersByIds);
  }

  public get world(): World {
    return this._world;
  }

  public get isFull(): boolean {
    return this._nbPlayers >= config.game.nbMaxPlayers;
  }

  private _update(): void {
    const gameDto = plainToClass(GameDTO, this, {
      excludeExtraneousValues: true,
      strategy: 'excludeAll',
    });

    for (const id in this._charactersByIds) {
      if (this._charactersByIds[id].isDestroyed) {
        delete this._charactersByIds[id];
        continue;
      }

      this._charactersByIds[id].update();

      if (this._charactersByIds[id] instanceof Player) {
        (this._charactersByIds[id] as Player).emitGameState(gameDto);
      }
    }

    for (let i = 0; i < this._monsterGenerators.length; i++) {
      const monsterCreated = this._monsterGenerators[i].update() as Monster;

      if (monsterCreated) {
        this._charactersByIds[monsterCreated.id] = monsterCreated;
      }
    }
  }

  private _createBaseMeshes(): GameBaseMeshes {
    return {
      empty: new BABYLON.Mesh('baseMesh.empty', this._scene),
    };
  }

  public stopGameLoop(): void {
    if (this._isRunning) {
      this._isRunning = false;
      this._namespace.emit(GameEvents.Game.Stopped);
    }
  }

  public getCharacterById(id: string): Player | Monster | undefined {
    return this._charactersByIds[id];
  }

  public addPlayer(socket: SocketIO.Socket, name: string): Player {
    if (this.isFull) {
      throw new Error('Game is full');
    }

    const player = new Player(
      socket,
      this._baseMeshes.empty,
      name,
      config.game.playerInitialPosition.clone(),
    );
    this._nbPlayers++;
    this._charactersByIds[player.id] = player;

    console.info(
      `Player ${name} - ${player.id} created (${this._nbPlayers}/${config.game.nbMaxPlayers})`,
    );

    return player;
  }

  public removePlayer(player: Player): void {
    player.destroy();
    this._nbPlayers--;

    console.info(
      `Player ${player.id} left (${this._nbPlayers}/${config.game.nbMaxPlayers})`,
    );
  }
}
