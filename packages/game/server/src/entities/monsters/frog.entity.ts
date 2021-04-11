import { CharacterKind } from '@reapers/game-shared';
import * as BABYLON from 'babylonjs';
import BoundedValue from '../shared/bounded-value';
import MonsterEntity from './monster.entity';

export default class FrogEntity extends MonsterEntity {
  protected readonly _kind: CharacterKind = CharacterKind.Frog;

  public constructor(
    scene: BABYLON.Scene,
    level: number,
    position: BABYLON.Vector3,
    rotation: BABYLON.Vector3,
  ) {
    super(
      CharacterKind.Frog,
      level,
      BABYLON.MeshBuilder.CreateBox(
        CharacterKind.Frog,
        {
          height: 0.5,
          width: 0.5,
          depth: 0.5,
        },
        scene,
      ),
      position,
      rotation,
      new BABYLON.Vector3(1.5, 1.5, 1.5),
    );
    this._mesh.checkCollisions = true;
    this._mesh.ellipsoid = new BABYLON.Vector3(0.5, 0.25, 0.5);
  }

  protected _createLifeBoudedValue(): BoundedValue {
    return new BoundedValue(0, 100 + 5 * this.level);
  }
}
