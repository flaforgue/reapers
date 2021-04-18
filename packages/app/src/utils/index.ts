import * as BABYLON from '@babylonjs/core';

export function disposeArray(arr: BABYLON.IDisposable[]): void {
  arr.map((item) => item.dispose());
}

type ScreenPosition = {
  x: number;
  y: number;
};

type ScreenPositionData = ScreenPosition & {
  screenWidth: number;
  screenHeight: number;
};

function worldToScreen(
  worldPosition: BABYLON.Vector3,
  scene: BABYLON.Scene,
): ScreenPositionData {
  const engine = scene.getEngine();
  const camera = scene.activeCamera as BABYLON.ArcRotateCamera;
  const screenWidth = engine.getRenderWidth();
  const screenHeight = engine.getRenderHeight();
  const vector = BABYLON.Vector3.Project(
    worldPosition,
    BABYLON.Matrix.Identity(),
    scene.getTransformMatrix(),
    camera.viewport.toGlobal(screenWidth, screenHeight),
  );

  return {
    x: vector.x,
    y: vector.y,
    screenWidth,
    screenHeight,
  };
}

export function worldToGUI(
  worldPosition: BABYLON.Vector3,
  scene: BABYLON.Scene,
): ScreenPosition {
  const screenPosition = worldToScreen(worldPosition, scene);

  return {
    x: Number((screenPosition.x - screenPosition.screenWidth / 2).toFixed(1)),
    y: Number((screenPosition.y - screenPosition.screenHeight / 2).toFixed(1)),
  };
}
