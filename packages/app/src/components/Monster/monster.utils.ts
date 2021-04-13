import * as BABYLON from '@babylonjs/core';
import { CharacterKind, MonsterKind } from '@reapers/game-client';

enum SpiderAnimationKey {
  Attack = 0,
  Death = 1,
  Idle = 2,
  Walk = 4,
}

enum FrogAnimationKey {
  Attack = 0,
  Death = 1,
  Idle = 2,
  Walk = 3,
}

type AnimationKeyType = typeof SpiderAnimationKey | typeof FrogAnimationKey;

export const monsterAnimationKeys: Record<MonsterKind, AnimationKeyType> = {
  [CharacterKind.Spider]: SpiderAnimationKey,
  [CharacterKind.Frog]: FrogAnimationKey,
};

export function createParticleSystem(scene: BABYLON.Scene) {
  const ps = new BABYLON.ParticleSystem('particles', 1000, scene);
  const particleColor = new BABYLON.Color4(0.85, 0.2, 0.2, 1);

  ps.particleTexture = new BABYLON.Texture('/textures/circle_flare.png', scene);
  ps.color1 = particleColor;
  ps.color2 = particleColor;
  ps.colorDead = particleColor;
  ps.addSizeGradient(0, 0);
  ps.addSizeGradient(1, 2);
  ps.createSphereEmitter(0.4, 1);
  ps.maxEmitPower = 0;
  // ps.updateSpeed = 0.005;
  ps.minLifeTime = 0.1;
  ps.maxLifeTime = 0.1;

  // ps.addDragGradient(0, 0);
  // ps.addDragGradient(1, 1);
  ps.manualEmitCount = 0;
  ps.start();

  return ps;
}
