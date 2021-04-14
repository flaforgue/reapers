import * as BABYLON from 'babylonjs';
import { EnvironmentKind } from '@reapers/game-shared';
import Positionable from './positionable';
import Monster from './monsters/monster';
import ActionScheduler from './shared/action-scheduler';
import { getRandomPosition, getRandomRotation } from '../utils';

type MonsterGeneratorConfig = {
  radius: number;
  interval: number;
  nbMaxInstances: number;
  level: {
    min: number;
    max: number;
  };
};

type MonsterConstructor<T extends Monster = Monster> = new (
  scene: BABYLON.Scene,
  level: number,
  position: BABYLON.Vector3,
  rotation: BABYLON.Vector3,
) => T;

export default class MonsterGenerator extends Positionable {
  private readonly _createMonsterScheduler: ActionScheduler;
  private readonly _config: MonsterGeneratorConfig;
  private readonly _instanceClass: MonsterConstructor;
  private _monsters: Monster[] = [];

  public constructor(
    scene: BABYLON.Scene,
    instanceClass: MonsterConstructor,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    config: MonsterGeneratorConfig = {
      radius: 10,
      interval: 5,
      nbMaxInstances: 10,
      level: {
        min: 1,
        max: 5,
      },
    },
  ) {
    super(new BABYLON.Mesh(EnvironmentKind.MonsterGenerator, scene), position);

    this._config = config;
    this._instanceClass = instanceClass;
    this._createMonsterScheduler = new ActionScheduler(
      () => this.createMonster(),
      config.interval,
    );
  }

  public get monsters() {
    return this._monsters;
  }

  public update() {
    if (this._monsters.length < this._config.nbMaxInstances) {
      this._createMonsterScheduler.update();
    }

    for (let i = 0; i < this._monsters.length; i++) {
      if (this._monsters[i].isDeleting) {
        this._monsters.splice(i, 1);
      } else if (this._monsters[i].isAlive) {
        this._monsters[i].update();
      }
    }
  }

  public createMonster() {
    const levelRange = this._config.level.max - this._config.level.min;
    const monster = new this._instanceClass(
      this._mesh._scene,
      Math.round(Math.random() * levelRange) + this._config.level.min,
      getRandomPosition(this.position, this._config.radius),
      getRandomRotation(this.rotation, this._config.radius),
    );

    this._monsters.push(monster);
  }
}
