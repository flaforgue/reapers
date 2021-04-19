import * as BABYLON from 'babylonjs';
import Identifiable from './identifiable';

export default class Positionable extends Identifiable {
  public readonly name: string;

  protected readonly _mesh: BABYLON.Mesh | BABYLON.InstancedMesh;

  public constructor(
    mesh: BABYLON.Mesh | BABYLON.InstancedMesh,
    name: string,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    scaling: BABYLON.Vector3 = new BABYLON.Vector3(1, 1, 1),
  ) {
    super();

    this._mesh = mesh;
    this.name = name;
    this._mesh.position = position;
    this._mesh.rotation = rotation;
    this._mesh.scaling = scaling;
    this._mesh.isPickable = false;
    this._mesh.alwaysSelectAsActiveMesh = true;
  }

  public get position(): BABYLON.Vector3 {
    return this._mesh.position;
  }

  public get rotation(): BABYLON.Vector3 {
    return this._mesh.rotation;
  }

  public get scaling(): BABYLON.Vector3 {
    return this._mesh.scaling;
  }

  public setRotationY(rotationY: number): void {
    this._mesh.rotation.y = rotationY % (2 * Math.PI);
  }

  protected _lookAtY(position: BABYLON.Vector3): void {
    this._mesh.lookAt(
      new BABYLON.Vector3(position.x, this.position.y, position.z),
      Math.PI,
    );
  }

  public getDistanceTo(position: BABYLON.Vector3): number {
    return BABYLON.Vector3.Distance(this.position, position);
  }

  public destroy(): void {
    this._mesh.dispose();
  }
}
