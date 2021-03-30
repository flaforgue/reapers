import * as BABYLON from 'babylonjs';
import { EnvironmentKind } from '@reapers/game-shared';
import PositionableEntity from './shared/positionable.entity';
import MonsterEntity from './monsters/monster.entity';
import ActionScheduler from './shared/action-scheduler';
import { getRandomPosition, getRandomRotation } from './shared/utils';

type Constructor<T extends MonsterEntity> = new (
  scene: BABYLON.Scene,
  position: number[],
  rotation: number[],
) => T;
export default class NestEntity<T extends MonsterEntity> extends PositionableEntity {
  private readonly _createMonsterScheduler: ActionScheduler;
  private readonly _nbMaxInstances: number;
  private readonly _radius: number;
  private readonly _instanceClass: Constructor<T>;
  private _monsters: MonsterEntity[] = [];

  public constructor(
    scene: BABYLON.Scene,
    instanceClass: Constructor<T>,
    radius: number,
    interval: number,
    nbMaxInstances: number,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
  ) {
    super(
      BABYLON.MeshBuilder.CreateBox(
        EnvironmentKind.Nest,
        {
          height: 0,
          width: 0,
          depth: 0,
        },
        scene,
      ),
      position,
      rotation,
    );
    this._radius = radius;
    this._instanceClass = instanceClass;
    this._nbMaxInstances = nbMaxInstances;
    this._createMonsterScheduler = new ActionScheduler(
      () => this.createMonster(),
      interval,
    );
  }

  public get monsters() {
    return this._monsters;
  }

  public update() {
    if (this._monsters.length < this._nbMaxInstances) {
      this._createMonsterScheduler.update();
    }

    for (let i = 0; i < this._monsters.length; i++) {
      this._monsters[i].update();
    }
  }

  public createMonster() {
    this._monsters.push(
      new this._instanceClass(
        this._mesh._scene,
        getRandomPosition(this._mesh.position, this._radius).asArray(),
        getRandomRotation(this._mesh.position, this._radius).asArray(),
      ),
    );
  }
}
