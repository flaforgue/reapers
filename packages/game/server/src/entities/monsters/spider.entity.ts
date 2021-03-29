import { CharacterKind } from '@reapers/game-shared';
import * as BABYLON from 'babylonjs';
import MonsterEntity from './monster.entity';

export default class SpiderEntity extends MonsterEntity {
  public constructor(scene: BABYLON.Scene, position: number[], rotation: number[]) {
    super(
      CharacterKind.Spider,
      BABYLON.MeshBuilder.CreateBox(
        CharacterKind.Spider,
        {
          height: 0.25,
          width: 0.5,
          depth: 0.5,
        },
        scene,
      ),
      position,
      rotation,
    );
    this._mesh.checkCollisions = true;
    this._mesh.ellipsoid = new BABYLON.Vector3(0.5, 0.1, 0.5);
    this._kind = CharacterKind.Spider;
  }
}
