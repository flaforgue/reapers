import * as BABYLON from '@babylonjs/core';

export function createLight(scene: BABYLON.Scene) {
  return new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
}

export function createSound(scene: BABYLON.Scene) {
  return new BABYLON.Sound('cello', '/sounds/battle.wav', scene, null, {
    loop: true,
    autoplay: false,
  });
}

export function createGround(width: number, depth: number, scene: BABYLON.Scene) {
  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width, height: depth });
  const texture = new BABYLON.Texture('/textures/ground.png', scene);
  texture.uScale = 10;
  texture.vScale = 10;
  const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
  groundMat.diffuseTexture = texture;
  ground.material = groundMat;

  return ground;
}
