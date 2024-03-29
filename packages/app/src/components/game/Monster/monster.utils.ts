import * as BABYLON from '@babylonjs/core';
import { CharacterKind, MonsterKind } from '@reapers/game-client';
import { setParticleSystemColor } from '../../../utils';

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

export function createParticleSystem(scene: BABYLON.Scene): BABYLON.ParticleSystem {
  const ps = new BABYLON.ParticleSystem('particles', 1000, scene);
  const particleColor = new BABYLON.Color4(0.85, 0.2, 0.2, 1);

  setParticleSystemColor(ps, particleColor);
  ps.particleTexture = new BABYLON.Texture('/textures/circle_flare.png', scene);
  ps.addSizeGradient(0, 0);
  ps.addSizeGradient(1, 2);
  ps.createSphereEmitter(0.4, 1);
  ps.maxEmitPower = 0;
  ps.minLifeTime = 0.1;
  ps.maxLifeTime = 0.1;
  ps.manualEmitCount = 0;
  ps.start();

  return ps;
}
