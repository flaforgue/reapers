import * as BABYLON from 'babylonjs';
import BaseEntity from './base.entity';

export default class PositionableEntity extends BaseEntity {
  public readonly halfHeight: number;
  protected readonly _mesh: BABYLON.Mesh;

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

  public get meshPosition() {
    return this._mesh.position;
  }

  public get rotation() {
    return this._mesh.rotation.asArray();
  }

  public getDistanceTo(position: BABYLON.Vector3) {
    return BABYLON.Vector3.Distance(this._mesh.position, position);
  }

  public dispose() {
    this._mesh.dispose();
  }
}
