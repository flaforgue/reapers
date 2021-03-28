import * as BABYLON from 'babylonjs';
import BaseEntity from './base.entity';

export default class PositionableEntity extends BaseEntity {
  protected readonly _mesh: BABYLON.Mesh;
  public readonly halfHeight: number;

  public constructor(mesh: BABYLON.Mesh, position = [0, 0, 0], rotation = [0, 0, 0]) {
    super();
    this._mesh = mesh;
    this.halfHeight = this._mesh.getBoundingInfo().boundingBox.extendSize.y;
    this._mesh.position = new BABYLON.Vector3(
      position[0],
      position[1] + this.halfHeight,
      position[2],
    );

    this._mesh.rotation = new BABYLON.Vector3(...rotation);
  }

  public get position() {
    return this._mesh.position.add(new BABYLON.Vector3(0, -this.halfHeight, 0)).asArray();
  }

  public get rotation() {
    return this._mesh.rotation.asArray();
  }
}
