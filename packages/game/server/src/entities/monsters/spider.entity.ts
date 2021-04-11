import { CharacterKind } from '@reapers/game-shared';
import * as BABYLON from 'babylonjs';
import BoundedValue from '../shared/bounded-value';
import MonsterEntity from './monster.entity';

export default class SpiderEntity extends MonsterEntity {
  protected readonly _kind: CharacterKind = CharacterKind.Spider;

  public constructor(
    scene: BABYLON.Scene,
    level: number,
    position: BABYLON.Vector3,
    rotation: BABYLON.Vector3,
  ) {
    super(
      CharacterKind.Spider,
      level,
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
      new BABYLON.Vector3(2, 2, 2),
    );
    this._mesh.checkCollisions = true;
    this._mesh.ellipsoid = new BABYLON.Vector3(0.5, 0.1, 0.5);
  }

  protected _createLifeBoudedValue(): BoundedValue {
    return new BoundedValue(0, 100 + 9 * this.level);
  }
}
