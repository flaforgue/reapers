import * as BABYLON from 'babylonjs';
import Monster from './monsters/monster';
import ActionScheduler from './shared/action-scheduler';
import { getRandomPosition, optimizeMotionlessMesh } from '../utils';
import Positionable from './positionable';
import World from './world';

type MonsterGeneratorConfig = {
  radius: number;
  interval: number;
  nbMaxInstances: number;
  levelMin: number;
  levelMax: number;
};

type MonsterConstructor<T extends Monster = Monster> = new (
  baseMesh: BABYLON.Mesh,
  level: number,
  generator: MonsterGenerator,
  position: BABYLON.Vector3,
  rotation: BABYLON.Vector3,
  scaling: BABYLON.Vector3,
) => T;

const defaultConfig = {
  radius: 10,
  interval: 5,
  nbMaxInstances: 10,
  levelMin: 1,
  levelMax: 5,
};
export default class MonsterGenerator extends Positionable {
  private readonly _world: World;
  private readonly _createMonsterScheduler: ActionScheduler;
  private readonly _config: MonsterGeneratorConfig;
  private readonly _instanceClass: MonsterConstructor;

  public nbMonsters = 0;

  public constructor(
    world: World,
    baseMesh: BABYLON.Mesh,
    instanceClass: MonsterConstructor,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    config: Partial<MonsterGeneratorConfig> = {},
  ) {
    super(baseMesh.createInstance(''), 'MonsterGenerator', position);

    this._world = world;

    optimizeMotionlessMesh(this._mesh);

    this._config = {
      ...defaultConfig,
      ...config,
    };
    this._instanceClass = instanceClass;
    this._createMonsterScheduler = new ActionScheduler<Monster>(
      () => this.createMonster(baseMesh),
      this._config.interval,
    );
  }

  public update(): Monster | void {
    if (this.nbMonsters < this._config.nbMaxInstances && this._world.isReady) {
      return this._createMonsterScheduler.update();
    }
  }

  public createMonster(baseMesh: BABYLON.Mesh): Monster {
    this.nbMonsters++;

    const level = Math.round(
      BABYLON.Scalar.RandomRange(this._config.levelMin, this._config.levelMax),
    );
    const position = getRandomPosition(this.position, this._config.radius);
    const rotation = new BABYLON.Vector3(0, BABYLON.Scalar.RandomRange(0, Math.PI), 0);
    const scaling = new BABYLON.Vector3().setAll(
      1 + 0.1 * ((1.5 * level) / this._config.levelMin),
    );

    return new this._instanceClass(
      baseMesh,
      level,
      this,
      this._world.createGroundVectorFrom(position),
      rotation,
      scaling,
    );
  }
}
