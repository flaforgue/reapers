import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

export function showAxis(size: number, scene: BABYLON.Scene) {
  const axisX = BABYLON.Mesh.CreateLines(
    'axisX',
    [
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(size, 0, 0),
      new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
      new BABYLON.Vector3(size, 0, 0),
      new BABYLON.Vector3(size * 0.95, -0.05 * size, 0),
    ],
    scene,
  );
  const axisY = BABYLON.Mesh.CreateLines(
    'axisY',
    [
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(0, size, 0),
      new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
      new BABYLON.Vector3(0, size, 0),
      new BABYLON.Vector3(0.05 * size, size * 0.95, 0),
    ],
    scene,
  );
  const axisZ = BABYLON.Mesh.CreateLines(
    'axisZ',
    [
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(0, 0, size),
      new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
      new BABYLON.Vector3(0, 0, size),
      new BABYLON.Vector3(0, 0.05 * size, size * 0.95),
    ],
    scene,
  );

  axisX.color = new BABYLON.Color3(1, 0, 0);
  axisY.color = new BABYLON.Color3(0, 1, 0);
  axisZ.color = new BABYLON.Color3(0, 0, 1);
}

export function createEngine(canvas: HTMLCanvasElement) {
  return new BABYLON.Engine(canvas, false, {
    doNotHandleContextLost: true,
    useHighPrecisionFloats: false,
    stencil: true,
  });
}

export function createScene(engine: BABYLON.Engine) {
  const scene = new BABYLON.Scene(engine, {
    useGeometryUniqueIdsMap: true,
    useMaterialMeshMap: true,
    useClonedMeshMap: true,
  });

  scene.autoClear = false;
  scene.autoClearDepthAndStencil = false;

  return scene;
}

export function createCamera(scene: BABYLON.Scene) {
  const camera = new BABYLON.ArcRotateCamera(
    'playerCamera',
    Math.PI / 2,
    Math.PI / 3.5,
    8,
    BABYLON.Vector3.Zero(),
    scene,
    true,
  );

  camera.lowerRadiusLimit = 4;
  camera.radius = 8;
  camera.upperRadiusLimit = 14;
  camera.upperBetaLimit = Math.PI / 2.5;
  camera.lowerBetaLimit = Math.PI / 5;
  camera.panningSensibility = 0;
  camera.allowUpsideDown = false;

  return camera;
}

export function createGUI() {
  const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  gui.useInvalidateRectOptimization = true;

  return gui;
}

export function createBaseActiveMesh(scene: BABYLON.Scene) {
  const activeMesh = BABYLON.MeshBuilder.CreateDisc('activeMesh', {
    radius: 1,
  });
  const material = new BABYLON.StandardMaterial('activeMeshMat', scene);

  activeMesh.setEnabled(false);
  activeMesh.rotate(BABYLON.Axis.X, Math.PI / 2);
  activeMesh.position = new BABYLON.Vector3(0, 0.001, 0);
  material.diffuseColor = new BABYLON.Color3(1, 0.3, 0.1);
  material.alpha = 0.5;
  activeMesh.material = material;

  const animation = new BABYLON.Animation(
    'activeMesh animation',
    'scaling',
    100,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  );
  activeMesh.animations.push(animation);

  return activeMesh;
}

export function createShadowGenerator(light: BABYLON.DirectionalLight) {
  const shadowGenerator = new BABYLON.CascadedShadowGenerator(1024, light);

  shadowGenerator.shadowMaxZ = 50;
  shadowGenerator.stabilizeCascades = true;
  shadowGenerator.cascadeBlendPercentage = 0;
  shadowGenerator.usePercentageCloserFiltering = true;
  shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;
  shadowGenerator.setDarkness(0.3);

  return shadowGenerator;
}
