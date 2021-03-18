import * as BABYLON from 'babylonjs';
import BaseEntity from './base.entity';

export default class PositionableEntity extends BaseEntity {
  protected readonly _mesh: BABYLON.Mesh;

  public constructor(scene: BABYLON.Scene, position = [0, 0, 0], rotation = [0, 0, 0]) {
    super();
    this._mesh = BABYLON.MeshBuilder.CreateSphere(
      this.id,
      {
        diameter: 0.1,
      },
      scene,
    );
    this._mesh.position = new BABYLON.Vector3(...position);
    this._mesh.rotation = new BABYLON.Vector3(...rotation);
  }

  public get position() {
    return this._mesh.position.asArray();
  }

  public get rotation() {
    return this._mesh.rotation.asArray();
  }
}
