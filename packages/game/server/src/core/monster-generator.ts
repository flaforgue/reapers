import * as BABYLON from 'babylonjs';
import Monster from './monsters/monster';
import ActionScheduler from './shared/action-scheduler';
import { getRandomPosition, getRandomRotation } from '../utils';
import Positionable from './positionable';

type MonsterGeneratorConfig = {
  radius: number;
  interval: number;
  nbMaxInstances: number;
  levelMin: number;
  levelMax: number;
};

type MonsterConstructor<T extends Monster = Monster> = new (
  scene: BABYLON.Scene,
  level: number,
  generator: MonsterGenerator,
  position: BABYLON.Vector3,
  rotation: BABYLON.Vector3,
) => T;

const defaultConfig = {
  radius: 10,
  interval: 5,
  nbMaxInstances: 10,
  levelMin: 1,
  levelMax: 5,
};
export default class MonsterGenerator extends Positionable {
  private readonly _createMonsterScheduler: ActionScheduler;
  private readonly _config: MonsterGeneratorConfig;
  private readonly _instanceClass: MonsterConstructor;

  public nbMonsters = 0;

  public constructor(
    scene: BABYLON.Scene,
    instanceClass: MonsterConstructor,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    config: Partial<MonsterGeneratorConfig> = {},
  ) {
    super(new BABYLON.Mesh('', scene), 'MonsterGenerator', position);

    this._mesh.freezeWorldMatrix();
    this._mesh.doNotSyncBoundingInfo = true;
    this._config = {
      ...defaultConfig,
      ...config,
    };
    this._instanceClass = instanceClass;
    this._createMonsterScheduler = new ActionScheduler(
      () => this.createMonster(),
      this._config.interval,
    );
  }

  public update() {
    if (this.nbMonsters < this._config.nbMaxInstances) {
      return this._createMonsterScheduler.update();
    }
  }

  public createMonster() {
    const levelRange = this._config.levelMax - this._config.levelMin;
    this.nbMonsters++;

    return new this._instanceClass(
      this._mesh._scene,
      Math.round(Math.random() * levelRange) + this._config.levelMin,
      this,
      getRandomPosition(this.position, this._config.radius),
      getRandomRotation(this.rotation, this._config.radius),
    );
  }
}
