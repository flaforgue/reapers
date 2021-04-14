import * as BABYLON from 'babylonjs';
import { EnvironmentKind } from '@reapers/game-shared';
import Positionable from './positionable';

export default class World extends Positionable {
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
    this._mesh.collisionMask = 1;
  }
}
