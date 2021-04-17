import * as BABYLON from 'babylonjs';
import { PawnKind } from '@reapers/game-shared';
import Identifiable from './identifiable';

export default class Pawn extends Identifiable {
  protected readonly _kind: PawnKind = PawnKind.PineTree;

  private readonly _instance: BABYLON.InstancedMesh;

  public constructor(
    baseMesh: BABYLON.Mesh,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    scaling: BABYLON.Vector3 = new BABYLON.Vector3(1, 1, 1),
  ) {
    super();

    this._instance = baseMesh.createInstance('');
    this._instance.checkCollisions = true;
    this._instance.position = position;
    this._instance.rotation = rotation;
    this._instance.scaling = scaling;

    this._instance.isPickable = false;
    this._instance.alwaysSelectAsActiveMesh = true;
    this._instance.freezeWorldMatrix();
    this._instance.doNotSyncBoundingInfo = true;
  }

  public get kind() {
    return this._kind;
  }

  public get position() {
    return this._instance.position;
  }

  public get rotation() {
    return this._instance.rotation;
  }

  public get scaling() {
    return this._instance.scaling;
  }

  destroy() {
    this._instance.dispose();
  }
}
