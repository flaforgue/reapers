import * as BABYLON from 'babylonjs';
import Identifiable from './identifiable';

export default class Positionable extends Identifiable {
  protected readonly _mesh: BABYLON.Mesh;

  public constructor(
    mesh: BABYLON.Mesh,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
  ) {
    super();

    this._mesh = mesh;
    this._mesh.position = position;
    this._mesh.rotation = rotation;
  }

  public get position() {
    return this._mesh.position;
  }

  public get rotation() {
    return this._mesh.rotation;
  }

  public getDistanceTo(position: BABYLON.Vector3) {
    return BABYLON.Vector3.Distance(this.position, position);
  }

  public destroy() {
    this._mesh.dispose();
  }
}
