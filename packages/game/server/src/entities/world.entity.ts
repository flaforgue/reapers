import * as BABYLON from 'babylonjs';
import { EnvironmentKind } from '@reapers/game-shared';
import PositionableEntity from './shared/positionable.entity';

export default class WorldEntity extends PositionableEntity {
  public readonly width: number;
  public readonly depth: number;

  public constructor(scene: BABYLON.Scene, width: number, depth: number) {
    super(
      BABYLON.MeshBuilder.CreateGround(
        EnvironmentKind.World,
        { width, height: depth },
        scene,
      ),
    );
    this.depth = depth;
    this.width = width;
    this._mesh.checkCollisions = true;
  }
}
