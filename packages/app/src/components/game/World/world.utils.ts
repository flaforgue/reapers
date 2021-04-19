import * as BABYLON from '@babylonjs/core';

export function createLight(scene: BABYLON.Scene): BABYLON.DirectionalLight {
  const light = new BABYLON.DirectionalLight(
    'directionalLight',
    new BABYLON.Vector3(0, -10, 0),
    scene,
  );
  light.position = new BABYLON.Vector3(0, 10, 0);

  return light;
}

export function createSound(scene: BABYLON.Scene): BABYLON.Sound {
  return new BABYLON.Sound('cello', '/sounds/battle.wav', scene, null, {
    loop: true,
    autoplay: false,
  });
}

export function createSkyBox(
  scene: BABYLON.Scene,
  width: number,
  depth: number,
): BABYLON.Mesh {
  const skybox = BABYLON.MeshBuilder.CreateBox(
    'skyBox',
    {
      width: width + 10,
      depth: depth + 10,
      height: 50,
    },
    scene,
  );
  skybox.infiniteDistance = true;

  const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
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

export function createGround(
  width: number,
  depth: number,
  scene: BABYLON.Scene,
): BABYLON.Mesh {
  const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    'ground',
    '/textures/heightMap.png',
    {
      width,
      height: depth,
      subdivisions: 100,
      minHeight: 0,
      maxHeight: 10,
      updatable: false,
      onReady: function (): void {
        ground.optimize(100);
        ground.freezeWorldMatrix();
        ground.freezeNormals();

        const texture = new BABYLON.Texture('/textures/grass.jpeg', scene);
        texture.uScale = 50;
        texture.vScale = 50;

        const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
        groundMat.diffuseTexture = texture;
        groundMat.specularColor = new BABYLON.Color3(0, 0, 0);
        ground.material = groundMat;
        ground.material.freeze();
        ground.receiveShadows = true;
      },
    },
    scene,
  );

  return ground;
}
