import * as BABYLON from 'babylonjs';
import World from './world';
import Player from './player';

export default class Game {
  private readonly _scene: BABYLON.Scene;
  private readonly _engine: BABYLON.Engine;
  private _camera: BABYLON.FollowCamera;
  private _world?: World;
  private _player?: Player;

  public constructor(canvas: HTMLCanvasElement) {
    this._engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(this._engine);

    this._scene = scene;
    this._camera = this._createCamera();

    this._engine.runRenderLoop(function () {
      scene.render();
    });
  }

  public get world(): World | undefined {
    return this._world;
  }

  public get player(): Player | undefined {
    return this._player;
  }

  public resize(): void {
    this._engine.resize();
  }

  private _createCamera(): BABYLON.FollowCamera {
    const camera = new BABYLON.FollowCamera(
      'playerCamera',
      new BABYLON.Vector3(0, 2, -2),
      this._scene,
    );

    camera.cameraAcceleration = 0.04;
    camera.radius = 3;
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 3;

    camera.heightOffset = 3;
    camera.lowerHeightOffsetLimit = 1;
    camera.upperHeightOffsetLimit = 3;

    camera.rotationOffset = 0;

    camera.inputs.add;
    camera.attachControl(true);

    return camera;
  }

  public createWorld(width: number, depth: number): void {
    this._world = new World(this._scene, width, depth);
  }

  public createPlayer(): void {
    this._player = new Player(this._scene, this._camera);
  }
}
