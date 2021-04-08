import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

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
    -Math.PI / 2,
    Math.PI / 3.5,
    25,
    BABYLON.Vector3.Zero(),
    scene,
    true,
  );

  camera.ignoreParentScaling = true;
  camera.lowerRadiusLimit = 8;
  camera.radius = 25;
  camera.upperRadiusLimit = 40;
  camera.upperBetaLimit = Math.PI / 2.5;
  camera.lowerBetaLimit = Math.PI / 5;
  camera.attachControl(true);
  camera.panningSensibility = 0;

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
