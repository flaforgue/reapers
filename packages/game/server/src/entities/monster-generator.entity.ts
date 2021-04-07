import * as BABYLON from 'babylonjs';
import { EnvironmentKind } from '@reapers/game-shared';
import PositionableEntity from './shared/positionable.entity';
import MonsterEntity from './monsters/monster.entity';
import ActionScheduler from './shared/action-scheduler';
import { getRandomPosition, getRandomRotation } from './shared/utils';
import CharacterEntity from './shared/character.entity';

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
  position: number[],
  rotation: number[],
) => T;

type MonsterGeneratedCallback = (c: CharacterEntity) => void;
export default class MonsterGeneratorEntity extends PositionableEntity {
  private readonly _createMonsterScheduler: ActionScheduler;
  private readonly _config: MonsterGeneratorConfig;
  private _monsters: MonsterEntity[] = [];
  private _onMonsterGenerated: MonsterGeneratedCallback;

  public constructor(
    scene: BABYLON.Scene,
    config: MonsterGeneratorConfig,
    onMonsterGenerated: MonsterGeneratedCallback,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
  ) {
    super(new BABYLON.Mesh(EnvironmentKind.MonsterGenerator, scene), position, rotation);
    this._config = config;
    this._onMonsterGenerated = onMonsterGenerated;
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
      this._monsters[i].update();
    }
  }

  public createMonster() {
    const levelRange = this._config.level.max - this._config.level.min;
    const monster = new this._config.instanceClass(
      this._mesh._scene,
      Math.round(Math.random() * levelRange) + this._config.level.min,
      getRandomPosition(this._mesh.position, this._config.radius).asArray(),
      getRandomRotation(this._mesh.position, this._config.radius).asArray(),
    );

    this._monsters.push(monster);
    this._onMonsterGenerated(monster);
  }
}
