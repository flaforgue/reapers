import * as BABYLON from '@babylonjs/core';
import { Key } from '../../configs/keycodes.config';

export function isRotationDirection(value: string) {
  return ([Key.d, Key.q] as string[]).indexOf(value) != -1;
}

export function isMoveDirection(value: string) {
  return ([Key.z, Key.s, Key.a, Key.e] as string[]).indexOf(value) != -1;
}

export function resetCamera(camera: BABYLON.FollowCamera) {
  const animation = new BABYLON.Animation(
    'cameraAnimation',
    'rotationOffset',
    100,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  );
  animation.setKeys([
    {
      frame: 0,
      value: camera.rotationOffset,
    },
    {
      frame: 100,
      value: 0,
    },
  ]);

  camera.animations = [animation];

  camera.getScene().beginAnimation(camera, 0, 100, false, 8, () => {
    camera.animations = [];
  });
}
