import * as BABYLON from 'babylonjs';
import BaseEntity from './base.entity';

export default class PositionableEntity extends BaseEntity {
  public readonly halfHeight: number;
  protected readonly _mesh: BABYLON.Mesh;

  public constructor(
    mesh: BABYLON.Mesh,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
  ) {
    super();

    this._mesh = mesh;
    this.halfHeight = this._mesh.getBoundingInfo().boundingBox.extendSize.y;
    this._mesh.position = position.add(new BABYLON.Vector3(0, this.halfHeight, 0));
    this._mesh.rotation = rotation;
  }

  public get position() {
    return this._mesh.position.add(new BABYLON.Vector3(0, -this.halfHeight, 0));
  }

  public get meshPosition() {
    return this._mesh.position;
  }

  public get rotation() {
    return this._mesh.rotation;
  }

  public getDistanceTo(position: BABYLON.Vector3) {
    return BABYLON.Vector3.Distance(this._mesh.position, position);
  }

  public dispose() {
    this._mesh.dispose();
  }
}
