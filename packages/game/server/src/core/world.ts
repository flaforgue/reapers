import { PawnKind } from '@reapers/game-shared';
import * as BABYLON from 'babylonjs';
import { optimizeMotionlessMesh } from '../utils';
import Pawn from './pawn';
import Positionable from './positionable';

type WorldBaseMeshes = Record<PawnKind, BABYLON.Mesh>;
export default class World extends Positionable {
  public readonly width: number;
  public readonly depth: number;
  public readonly pawns: Pawn[] = [];

  private readonly _baseMeshes: WorldBaseMeshes;

  public constructor(scene: BABYLON.Scene, width: number, depth: number) {
    super(
      BABYLON.MeshBuilder.CreateGround('World', { width, height: depth }, scene),
      'World',
    );

    optimizeMotionlessMesh(this._mesh);
    this._mesh.checkCollisions = true;

    this.depth = depth;
    this.width = width;
    this._baseMeshes = this._createBaseMeshes(scene);

    this._createTrees();
  }

  private _createBaseMeshes(scene: BABYLON.Scene): WorldBaseMeshes {
    const pineTreeBaseMesh = BABYLON.MeshBuilder.CreateBox(
      '',
      {
        width: 0.25,
        height: 5,
        depth: 0.25,
      },
      scene,
    );
    optimizeMotionlessMesh(pineTreeBaseMesh);
    pineTreeBaseMesh.setEnabled(false);

    return {
      [PawnKind.PineTree]: pineTreeBaseMesh,
    };
  }

  private _createTrees(): void {
    for (let i = 0; i < 500; i++) {
      this.pawns.push(
        new Pawn(
          this._baseMeshes[PawnKind.PineTree],
          new BABYLON.Vector3(
            BABYLON.Scalar.RandomRange((-1 * this.width) / 2, this.width / 2),
            0,
            BABYLON.Scalar.RandomRange((-1 * this.depth) / 2, this.depth / 2),
          ),
          new BABYLON.Vector3(0, BABYLON.Scalar.RandomRange(0, Math.PI), 0),
          new BABYLON.Vector3().setAll(BABYLON.Scalar.RandomRange(1, 3)),
        ),
      );
    }
  }

  public destroy(): void {
    super.destroy();

    Object.values(this._baseMeshes).map((m) => m.dispose());
  }
}
