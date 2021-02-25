import * as BABYLON from 'babylonjs';

export default class World {
  public readonly engine: BABYLON.Engine;
  public readonly scene: BABYLON.Scene;

  public constructor(canvas: HTMLCanvasElement) {
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this._createLight();
    this._createSound();
    this._createGround();
  }

  private _createLight(): void {
    new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
  }

  private _createSound(): BABYLON.Sound {
    return new BABYLON.Sound('cello', '/sounds/battle.wav', this.scene, null, {
      loop: true,
      autoplay: false,
    });
  }

  private _createGround(): BABYLON.Mesh {
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 });
    const texture = new BABYLON.Texture('/textures/ground.png', this.scene);
    texture.uScale = 10;
    texture.vScale = 10;
    const groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
    groundMat.diffuseTexture = texture;
    ground.material = groundMat;

    return ground;
  }
}
