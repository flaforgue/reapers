import * as BABYLON from 'babylonjs';
import { EnvironmentKind } from '@reapers/game-shared';
import PositionableEntity from './shared/positionable.entity';
import MonsterEntity from './monsters/monster.entity';
import ActionScheduler from './shared/action-scheduler';
import { getRandomPosition, getRandomRotation } from './shared/utils';

type MonsterGeneratorConfig = {
  instanceClass: MonsterConstructor;
  radius: number;
  interval: number;
  nbMaxInstances: number;
  level: {
    min: number;
    max: number;
  };
};

type MonsterConstructor<T extends MonsterEntity = MonsterEntity> = new (
  scene: BABYLON.Scene,
  level: number,
  position: BABYLON.Vector3,
  rotation: BABYLON.Vector3,
) => T;

export default class MonsterGeneratorEntity extends PositionableEntity {
  private readonly _createMonsterScheduler: ActionScheduler;
  private readonly _config: MonsterGeneratorConfig;
  private _monsters: MonsterEntity[] = [];

  public constructor(
    scene: BABYLON.Scene,
    config: MonsterGeneratorConfig,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
  ) {
    super(new BABYLON.Mesh(EnvironmentKind.MonsterGenerator, scene), position, rotation);

    this._config = config;
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
    const monster = new this._config.instanceClass(
      this._mesh._scene,
      Math.round(Math.random() * levelRange) + this._config.level.min,
      getRandomPosition(this._mesh.position, this._config.radius),
      getRandomRotation(this._mesh.rotation, this._config.radius),
    );

    this._monsters.push(monster);
  }
}
