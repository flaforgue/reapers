import * as BABYLON from 'babylonjs';
import { PawnKind } from '@reapers/game-shared';
import Identifiable from './identifiable';

export default class Pawn extends Identifiable {
  public readonly position: BABYLON.Vector3;
  public readonly rotation: BABYLON.Vector3;

  protected readonly _kind: PawnKind = PawnKind.PineTree;

  private readonly _instance: BABYLON.InstancedMesh;

  public constructor(
    baseMesh: BABYLON.Mesh,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
  ) {
    super();

    this.position = position;
    this.rotation = rotation;
    this._instance = baseMesh.createInstance('');
    this._instance.checkCollisions = true;
    this._instance.position = position;
    this._instance.rotation = rotation;

    this._instance.isPickable = false;
    this._instance.alwaysSelectAsActiveMesh = true;
    this._instance.freezeWorldMatrix();
    this._instance.doNotSyncBoundingInfo = true;
    this._instance.cullingStrategy =
      BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
  }

  public get kind() {
    return this._kind;
  }

  destroy() {
    this._instance.dispose();
  }
}
