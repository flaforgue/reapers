import * as BABYLON from 'babylonjs';
import { EntityKind } from '@reapers/game-shared';
import PositionableEntity from './shared/positionable.entity';

export default class WorldEntity extends PositionableEntity {
  public readonly width: number;
  public readonly depth: number;

  public constructor(scene: BABYLON.Scene, width: number, depth: number) {
    super(
      BABYLON.MeshBuilder.CreateGround(EntityKind.World, { width, height: depth }, scene),
    );
    this.depth = depth;
    this.width = width;
    this._mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      this._mesh,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.0, restitution: 0.7 },
      scene,
    );
    this._kind = EntityKind.World;
  }
}
