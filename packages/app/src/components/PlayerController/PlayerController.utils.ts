import * as BABYLON from '@babylonjs/core';
import { Key } from '../../configs/keycodes.config';

export function isRotationDirection(value: string) {
  return ([Key.d, Key.q] as string[]).indexOf(value) != -1;
}

export function isFrontMoveDirection(value: string) {
  return ([Key.z, Key.s] as string[]).indexOf(value) != -1;
}

export function isSideMoveDirection(value: string) {
  return ([Key.a, Key.e] as string[]).indexOf(value) != -1;
}

export function resetCamera(camera: BABYLON.ArcRotateCamera) {
  const animation = new BABYLON.Animation(
    'cameraAnimation',
    'alpha',
    100,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  );
  animation.setKeys([
    {
      frame: 0,
      value: camera.alpha,
    },
    {
      frame: 100,
      value: -Math.PI / 2,
    },
  ]);

  camera.animations = [animation];

  camera.getScene().beginAnimation(camera, 0, 100, false, 8, () => {
    camera.animations = [];
  });
}
