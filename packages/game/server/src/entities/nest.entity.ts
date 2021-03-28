import * as BABYLON from 'babylonjs';
import { EntityKind } from '@reapers/game-shared';
import PositionableEntity from './shared/positionable.entity';
import MonsterEntity from './monsters/monster.entity';
import config from '../config';

function getRandomVector3(origin: number[], distances: number[]) {
  return [
    Math.floor(Math.random() * distances[0] * 2 - distances[0]) + origin[0],
    Math.floor(Math.random() * distances[1] * 2 - distances[1]) + origin[1],
    Math.floor(Math.random() * distances[2] * 2 - distances[2]) + origin[2],
  ];
}

function getRandomPosition(origin: number[], distance: number) {
  return getRandomVector3(origin, [distance, 0, distance]);
}

function getRandomRotation(origin: number[], distance: number) {
  return getRandomVector3(origin, [0, distance, 0]);
}

type NestConfiguration<T> = {
  nestRadius: number;
  instanceClass: new (scene: BABYLON.Scene, position: number[], rotation: number[]) => T;
  maxNbInstances: number;
  instantiationInterval: number; // in seconds
};

export default class NestEntity<T extends MonsterEntity> extends PositionableEntity {
  private _monsters: MonsterEntity[] = [];
  private readonly _configs: NestConfiguration<T>;
  private _instantiationProgress = 0;

  public constructor(
    scene: BABYLON.Scene,
    configs: NestConfiguration<T>,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
  ) {
    super(
      BABYLON.MeshBuilder.CreateBox(
        EntityKind.Nest,
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
    this._kind = EntityKind.Nest;
    this._configs = configs;
  }

  public get monsters() {
    return this._monsters;
  }

  public update() {
    if (this._monsters.length < this._configs.maxNbInstances) {
      this._instantiationProgress += 1 / config.fps;

      if (this._instantiationProgress >= this._configs.instantiationInterval) {
        this.monsters.push(
          new this._configs.instanceClass(
            this._mesh._scene,
            getRandomPosition(this.position, this._configs.nestRadius),
            getRandomRotation(this.position, this._configs.nestRadius),
          ),
        );
        this._instantiationProgress = 0;
      }
    }

    for (let i = 0; i < this._monsters.length; i++) {
      this._monsters[i].update();
    }
  }
}
