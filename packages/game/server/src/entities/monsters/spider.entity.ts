import { EntityKind } from '@reapers/game-shared';
import * as BABYLON from 'babylonjs';
import MonsterEntity from './monster.entity';

export default class SpiderEntity extends MonsterEntity {
  public constructor(scene: BABYLON.Scene, position: number[], rotation: number[]) {
    super(scene, EntityKind.Spider, position, rotation);
    this._kind = EntityKind.Spider;
  }
}
