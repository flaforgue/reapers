import * as BABYLON from 'babylonjs';

export default class World {
  private readonly _scene: BABYLON.Scene;

  public constructor(scene: BABYLON.Scene, width: number, depth: number) {
    this._scene = scene;
    this._createLight();
    this._createGround(width, depth);
    // this._createSound();
  }

  private _createLight(): void {
    new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this._scene);
  }

  private _createSound(): BABYLON.Sound {
    return new BABYLON.Sound('cello', '/sounds/battle.wav', this._scene, null, {
      loop: true,
      autoplay: false,
    });
  }

  private _createGround(width: number, depth: number): BABYLON.Mesh {
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width, height: depth });
    const texture = new BABYLON.Texture('/textures/ground.png', this._scene);
    texture.uScale = 10;
    texture.vScale = 10;
    const groundMat = new BABYLON.StandardMaterial('groundMat', this._scene);
    groundMat.diffuseTexture = texture;
    ground.material = groundMat;

    return ground;
  }
}
