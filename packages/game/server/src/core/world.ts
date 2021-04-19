import * as BABYLON from 'babylonjs';
import { PawnKind } from '@reapers/game-shared';
import { createGroundFromHeightMap, optimizeMotionlessMesh } from '../utils';
import Identifiable from './identifiable';
import Pawn from './pawn';

type WorldBaseMeshes = Record<PawnKind, BABYLON.Mesh>;
export default class World extends Identifiable {
  public readonly width: number;
  public readonly depth: number;
  public readonly heightMapName: string;
  public readonly pawns: Pawn[] = [];

  private readonly _mesh: BABYLON.GroundMesh;
  private readonly _baseMeshes: WorldBaseMeshes;

  private _isReady = false;

  public constructor(
    scene: BABYLON.Scene,
    heightMapName: string,
    width: number,
    depth: number,
    onReadyFromConstructor?: () => void,
  ) {
    super();

    this.depth = depth;
    this.width = width;
    this.heightMapName = heightMapName;
    this._baseMeshes = this._createBaseMeshes(scene);
    this._mesh = createGroundFromHeightMap(
      'ground',
      `http://localhost:4001/public/${heightMapName}`,
      {
        width,
        height: depth,
        subdivisions: 100,
        minHeight: 0,
        maxHeight: 10,
        updatable: false,
        onReady: (): void => {
          optimizeMotionlessMesh(this._mesh);
          this._mesh.optimize(100);
          this._mesh.isPickable = false;
          this._mesh.alwaysSelectAsActiveMesh = true;
          this._mesh.checkCollisions = true;
          this._isReady = true;
          this._createTrees();

          if (onReadyFromConstructor) {
            onReadyFromConstructor();
          }
        },
      },
      scene,
    );
  }

  public get isReady(): boolean {
    return this._isReady;
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
          this.createGroundVectorFrom(
            new BABYLON.Vector3(
              BABYLON.Scalar.RandomRange((-1 * this.width) / 2, this.width / 2),
              0,
              BABYLON.Scalar.RandomRange((-1 * this.depth) / 2, this.depth / 2),
            ),
          ),
          new BABYLON.Vector3(0, BABYLON.Scalar.RandomRange(0, Math.PI), 0),
          new BABYLON.Vector3().setAll(BABYLON.Scalar.RandomRange(1, 3)),
        ),
      );
    }
  }

  public getHeightAtCoordinates(vector: BABYLON.Vector3): number {
    return this._mesh.getHeightAtCoordinates(vector.x, vector.z);
  }

  public createGroundVectorFrom(vector: BABYLON.Vector3): BABYLON.Vector3 {
    return new BABYLON.Vector3(vector.x, this.getHeightAtCoordinates(vector), vector.z);
  }

  public destroy(): void {
    this._mesh.dispose();
    Object.values(this._baseMeshes).map((m) => m.dispose());
  }
}
