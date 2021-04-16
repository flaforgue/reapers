import * as BABYLON from 'babylonjs';
import Identifiable from './identifiable';

export default class Positionable extends Identifiable {
  protected readonly _mesh: BABYLON.AbstractMesh;

  public readonly name: string;

  public constructor(
    mesh: BABYLON.AbstractMesh,
    name: string,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
  ) {
    super();

    this._mesh = mesh;
    this.name = name;
    this._mesh.position = position;
    this._mesh.rotation = rotation;
    this._mesh.isPickable = false;
    this._mesh.alwaysSelectAsActiveMesh = true;
    this._mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
  }

  public get position() {
    return this._mesh.position;
  }

  public get rotation() {
    return this._mesh.rotation;
  }

  public setRotationY(rotationY: number) {
    this._mesh.rotation.y = rotationY % (2 * Math.PI);
  }

  protected _lookAtY(position: BABYLON.Vector3) {
    this._mesh.lookAt(
      new BABYLON.Vector3(position.x, this.position.y, position.z),
      Math.PI,
    );
  }

  public getDistanceTo(position: BABYLON.Vector3) {
    return BABYLON.Vector3.Distance(this.position, position);
  }

  public destroy() {
    this._mesh.dispose();
  }
}
