import { CharacterKind } from '@reapers/game-shared';
import * as BABYLON from 'babylonjs';
import MonsterEntity from './monster.entity';

export default class FrogEntity extends MonsterEntity {
  public constructor(scene: BABYLON.Scene, position: number[], rotation: number[]) {
    super(
      CharacterKind.Frog,
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
    );
    this._mesh.checkCollisions = true;
    this._mesh.ellipsoid = new BABYLON.Vector3(0.5, 0.25, 0.5);
    this._kind = CharacterKind.Frog;
  }
}
