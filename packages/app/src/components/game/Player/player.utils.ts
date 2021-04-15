import * as BABYLON from '@babylonjs/core';

export enum AnimationKey {
  Defeat = 0,
  Idle = 1,
  Pickup = 2,
  Punch = 3,
  ReceiveHit = 4,
  Shoot = 5,
  SitDown = 6,
  StandUp = 7,
  Victory = 8,
  Walk = 9,
  WalkCarry = 10,
}

function createMainParticleSystem(
  scene: BABYLON.Scene,
  particleTexture: BABYLON.Texture,
  particleColor: BABYLON.Color4,
  attackLinearSpeed: number,
) {
  const ps = new BABYLON.ParticleSystem('particles', 1000, scene);

  ps.createPointEmitter(BABYLON.Vector3.Forward(), BABYLON.Vector3.Forward());
  ps.particleTexture = particleTexture;
  ps.minEmitPower = attackLinearSpeed;
  ps.maxEmitPower = attackLinearSpeed;
  ps.updateSpeed = 0.01;
  ps.color1 = particleColor;
  ps.color2 = particleColor;
  ps.colorDead = particleColor;
  ps.minSize = 0.4;
  ps.maxSize = 0.4;
  ps.manualEmitCount = 0;

  return ps;
}

function createBaseSubParticleSystem(
  scene: BABYLON.Scene,
  particleTexture: BABYLON.Texture,
  particleColor: BABYLON.Color4,
) {
  const ps = new BABYLON.ParticleSystem('particles', 1000, scene);

  ps.particleTexture = particleTexture;
  ps.disposeOnStop = true;
  ps.color1 = particleColor;
  ps.color2 = particleColor;
  ps.colorDead = particleColor;
  ps.emitRate = 500;
  ps.addSizeGradient(0, 0.3);
  ps.addSizeGradient(1, 0);

  return ps;
}

function createImpactParticleSystem(
  scene: BABYLON.Scene,
  particleTexture: BABYLON.Texture,
  particleColor: BABYLON.Color4,
) {
  const ps = createBaseSubParticleSystem(scene, particleTexture, particleColor);

  ps.targetStopDuration = 0.03;
  ps.createSphereEmitter(0.5, 0);
  ps.minEmitPower = 25;
  ps.maxEmitPower = 30;
  ps.updateSpeed = 0.005;
  ps.minLifeTime = 0.03;
  ps.maxLifeTime = 0.06;
  ps.addDragGradient(0, 0);
  ps.addDragGradient(1, 1);

  return ps;
}

function createTrailParticleSystem(
  scene: BABYLON.Scene,
  particleTexture: BABYLON.Texture,
  particleColor: BABYLON.Color4,
) {
  const ps = createBaseSubParticleSystem(scene, particleTexture, particleColor);

  ps.createSphereEmitter(0.1);
  ps.minEmitPower = 5;
  ps.maxEmitPower = 5;
  ps.updateSpeed = 0.001;
  ps.minLifeTime = 0.01;
  ps.maxLifeTime = 0.03;

  return ps;
}

export function createParticleSystem(scene: BABYLON.Scene, attackLinearSpeed: number) {
  const particleTexture = new BABYLON.Texture('/textures/flare.png', scene);
  const particleColor = new BABYLON.Color4(0.2, 0.2, 0.85, 1);

  const mainParticleSystem = createMainParticleSystem(
    scene,
    particleTexture,
    particleColor,
    attackLinearSpeed,
  );

  const trailParticleSystem = createTrailParticleSystem(
    scene,
    particleTexture,
    particleColor,
  );
  const trailSubEmitter = new BABYLON.SubEmitter(trailParticleSystem);
  trailSubEmitter.type = BABYLON.SubEmitterType.ATTACHED;

  const impactParticleSystem = createImpactParticleSystem(
    scene,
    particleTexture,
    particleColor,
  );
  const impactSubEmitter = new BABYLON.SubEmitter(impactParticleSystem);
  impactSubEmitter.inheritedVelocityAmount = 0.5;
  impactSubEmitter.type = BABYLON.SubEmitterType.END;

  mainParticleSystem.subEmitters = [trailSubEmitter, impactSubEmitter];
  mainParticleSystem.start();

  return mainParticleSystem;
}