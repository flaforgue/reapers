import * as BABYLON from 'babylonjs';
import { PawnKind } from '@reapers/game-shared';
import { optimizeMotionlessMesh } from '../utils';
import Positionable from './positionable';

export default class Pawn extends Positionable {
  protected readonly _kind: PawnKind = PawnKind.PineTree;

  public constructor(
    baseMesh: BABYLON.Mesh,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    scaling: BABYLON.Vector3 = new BABYLON.Vector3(1, 1, 1),
  ) {
    super(baseMesh.createInstance(''), 'Pawn', position, rotation, scaling);

    this._mesh.checkCollisions = true;
    optimizeMotionlessMesh(this._mesh);
  }

  public get kind(): PawnKind {
    return this._kind;
  }
}
