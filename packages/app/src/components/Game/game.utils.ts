import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

export function createEngine(canvas: HTMLCanvasElement) {
  return new BABYLON.Engine(canvas, false, {
    useHighPrecisionFloats: false,
    doNotHandleContextLost: true,
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
  const camera = new BABYLON.FollowCamera(
    'playerCamera',
    new BABYLON.Vector3(0, 2, -2),
    scene,
  );

  camera.rotationOffset = 0;
  camera.cameraAcceleration = 0.5;

  camera.lowerRadiusLimit = 3;
  camera.radius = 6;
  camera.upperRadiusLimit = 8;

  camera.lowerHeightOffsetLimit = 0.8;
  camera.heightOffset = 4;
  camera.upperHeightOffsetLimit = 5;

  camera.attachControl(true);

  return camera;
}

export function createGUI() {
  const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  gui.useInvalidateRectOptimization = true;

  return gui;
}
