import * as BABYLON from '@babylonjs/core';

export function createLight(scene: BABYLON.Scene) {
  const light = new BABYLON.DirectionalLight(
    'DirectionalLight',
    new BABYLON.Vector3(0, -1, 0),
    scene,
  );
  light.position = new BABYLON.Vector3(0, 100, 0);

  return light;
}

export function createSound(scene: BABYLON.Scene) {
  return new BABYLON.Sound('cello', '/sounds/battle.wav', scene, null, {
    loop: true,
    autoplay: false,
  });
}

export function createSkyBox(scene: BABYLON.Scene) {
  const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    '/textures/skybox/skybox',
    scene,
  );
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  return skybox;
}

export function createGround(width: number, depth: number, scene: BABYLON.Scene) {
  const ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    { width, height: depth },
    scene,
  );
  const texture = new BABYLON.Texture('/textures/grass.jpeg', scene);
  texture.uScale = 20;
  texture.vScale = 20;
  const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
  groundMat.backFaceCulling = false;
  groundMat.diffuseTexture = texture;
  ground.material = groundMat;
  ground.receiveShadows = true;

  return ground;
}
