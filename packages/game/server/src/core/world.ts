import * as BABYLON from 'babylonjs';
import Pawn from './pawn';
import Positionable from './positionable';

export default class World extends Positionable {
  public readonly width: number;
  public readonly depth: number;
  public readonly trees: Pawn[] = [];

  private readonly _treeBaseMesh: BABYLON.Mesh;

  public constructor(scene: BABYLON.Scene, width: number, depth: number) {
    super(
      BABYLON.MeshBuilder.CreateGround('World', { width, height: depth }, scene),
      'World',
    );

    this._mesh.checkCollisions = true;
    this._mesh.freezeWorldMatrix();
    (this._mesh as BABYLON.Mesh).freezeNormals();
    this._mesh.doNotSyncBoundingInfo = true;
    this.depth = depth;
    this.width = width;
    this._treeBaseMesh = this._createPawnBaseMesh(scene, 0.25, 5, 0.25);
    this._createTrees();
  }

  private _createPawnBaseMesh(
    scene: BABYLON.Scene,
    width: number,
    height: number,
    depth: number,
  ) {
    const baseMesh = BABYLON.MeshBuilder.CreateBox(
      '',
      {
        width,
        height,
        depth,
      },
      scene,
    );

    baseMesh.setEnabled(false);
    baseMesh.isPickable = false;
    baseMesh.alwaysSelectAsActiveMesh = false;
    baseMesh.freezeWorldMatrix();
    baseMesh.freezeNormals();
    baseMesh.doNotSyncBoundingInfo = true;
    baseMesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;

    return baseMesh;
  }

  private _createTrees() {
    const treesDatas: {
      position: BABYLON.Vector3;
      rotation: BABYLON.Vector3;
    }[] = [];

    for (let p = 0; p < 3000; p++) {
      treesDatas.push({
        position: new BABYLON.Vector3(
          BABYLON.Scalar.RandomRange((-1 * this.width) / 2, this.width / 2),
          0,
          BABYLON.Scalar.RandomRange((-1 * this.depth) / 2, this.depth / 2),
        ),
        rotation: new BABYLON.Vector3(0, BABYLON.Scalar.RandomRange(0, Math.PI), 0),
      });
    }

    for (let i = 0; i < treesDatas.length; i++) {
      this.trees.push(
        new Pawn(this._treeBaseMesh, treesDatas[i].position, treesDatas[i].rotation),
      );
    }
  }

  public destroy() {
    super.destroy();

    this._treeBaseMesh.dispose();
  }
}
