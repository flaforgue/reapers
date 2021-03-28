import { EntityKind } from '@reapers/game-shared';
import * as BABYLON from 'babylonjs';
import MonsterEntity from './monster.entity';

export default class SpiderEntity extends MonsterEntity {
  public constructor(scene: BABYLON.Scene, position: number[], rotation: number[]) {
    super(
      EntityKind.Spider,
      BABYLON.MeshBuilder.CreateBox(
        EntityKind.Spider,
        {
          height: 0.5,
          width: 1,
          depth: 1,
        },
        scene,
      ),
      position,
      rotation,
    );
    this._mesh.checkCollisions = true;
    this._mesh.ellipsoid = new BABYLON.Vector3(0.5, 0.25, 0.5);
    this._kind = EntityKind.Spider;
  }
}
