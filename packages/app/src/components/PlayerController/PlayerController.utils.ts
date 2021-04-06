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

export function createParticleSystem(scene: BABYLON.Scene) {
  const ps = new BABYLON.ParticleSystem('particles', 1, scene);

  ps.createPointEmitter(BABYLON.Vector3.Forward(), BABYLON.Vector3.Forward());
  ps.worldOffset = new BABYLON.Vector3(0, 0.5, 0);
  ps.particleTexture = new BABYLON.Texture('/textures/flare.png', scene);
  ps.color1 = new BABYLON.Color4(200, 30, 30, 1);
  ps.color2 = new BABYLON.Color4(255, 230, 0, 1);
  ps.minSize = 0.3;
  ps.maxSize = 0.3;
  ps.minEmitPower = 70;
  ps.maxEmitPower = 70;
  ps.updateSpeed = 0.01;
  ps.manualEmitCount = 0;
  ps.start();

  return ps;
}
