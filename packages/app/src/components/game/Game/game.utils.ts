import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

export function showAxis(size: number, scene: BABYLON.Scene): void {
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

export function createEngine(canvas: HTMLCanvasElement): BABYLON.Engine {
  return new BABYLON.Engine(canvas, false, {
    doNotHandleContextLost: true,
    useHighPrecisionFloats: false,
    stencil: true,
  });
}

export function createScene(engine: BABYLON.Engine): BABYLON.Scene {
  const scene = new BABYLON.Scene(engine, {
    useGeometryUniqueIdsMap: true,
    useMaterialMeshMap: true,
    useClonedMeshMap: true,
  });

  scene.autoClear = false;
  scene.autoClearDepthAndStencil = false;

  return scene;
}

export function createCamera(scene: BABYLON.Scene): BABYLON.ArcRotateCamera {
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
  camera.upperRadiusLimit = 140;
  camera.upperBetaLimit = Math.PI / 2.5;
  camera.lowerBetaLimit = Math.PI / 5;
  camera.panningSensibility = 0;
  camera.allowUpsideDown = false;

  return camera;
}

export function createGUI(): GUI.AdvancedDynamicTexture {
  const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  gui.useInvalidateRectOptimization = true;

  return gui;
}

export function createShadowGenerator(
  light: BABYLON.DirectionalLight,
): BABYLON.CascadedShadowGenerator {
  const shadowGenerator = new BABYLON.CascadedShadowGenerator(1024, light);

  shadowGenerator.shadowMaxZ = 50;
  shadowGenerator.stabilizeCascades = true;
  shadowGenerator.cascadeBlendPercentage = 0;
  shadowGenerator.usePercentageCloserFiltering = true;
  shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;
  shadowGenerator.setDarkness(0.3);

  return shadowGenerator;
}
