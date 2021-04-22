import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { CharacterKind } from '@reapers/game-client';
import charactersConfig from '../../../configs/characters.config';
import { setParticleSystemColor, worldToGUI } from '../../../utils';

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
): BABYLON.ParticleSystem {
  const ps = new BABYLON.ParticleSystem('particles', 1000, scene);

  ps.createPointEmitter(BABYLON.Vector3.Forward(), BABYLON.Vector3.Forward());
  ps.particleTexture = particleTexture;
  ps.minEmitPower = attackLinearSpeed;
  ps.maxEmitPower = attackLinearSpeed;
  ps.updateSpeed = 0.01;
  setParticleSystemColor(ps, particleColor);
  ps.minSize = 0.4;
  ps.maxSize = 0.4;
  ps.manualEmitCount = 0;

  return ps;
}

function createBaseSubParticleSystem(
  scene: BABYLON.Scene,
  particleTexture: BABYLON.Texture,
  particleColor: BABYLON.Color4,
): BABYLON.ParticleSystem {
  const ps = new BABYLON.ParticleSystem('particles', 1000, scene);

  setParticleSystemColor(ps, particleColor);
  ps.addSizeGradient(0, 0.3);
  ps.addSizeGradient(1, 0);
  ps.particleTexture = particleTexture;
  ps.disposeOnStop = true;
  ps.emitRate = 500;

  return ps;
}

function createImpactParticleSystem(
  scene: BABYLON.Scene,
  particleTexture: BABYLON.Texture,
  particleColor: BABYLON.Color4,
): BABYLON.ParticleSystem {
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
): BABYLON.ParticleSystem {
  const ps = createBaseSubParticleSystem(scene, particleTexture, particleColor);

  ps.createSphereEmitter(0.1);
  ps.minEmitPower = 5;
  ps.maxEmitPower = 5;
  ps.updateSpeed = 0.001;
  ps.minLifeTime = 0.01;
  ps.maxLifeTime = 0.03;

  return ps;
}

export function createAttackParticleSystem(
  scene: BABYLON.Scene,
  attackLinearSpeed: number,
): BABYLON.ParticleSystem {
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

export function createLoadingAttackParticleSystem(
  scene: BABYLON.Scene,
): BABYLON.ParticleSystem {
  const particleTexture = new BABYLON.Texture('/textures/flare.png', scene);
  const particleColor = new BABYLON.Color4(0.2, 0.2, 0.85, 1);
  const ps = new BABYLON.ParticleSystem('particles', 1000, scene);

  ps.createSphereEmitter(0.5, 1);
  ps.particleTexture = particleTexture;
  ps.color1 = particleColor;
  ps.color2 = particleColor;
  ps.colorDead = particleColor;
  ps.emitRate = 200;
  ps.minEmitPower = 1;
  ps.maxEmitPower = 2;
  ps.minLifeTime = 0.05;
  ps.maxLifeTime = 0.1;
  ps.addSizeGradient(0, 0.4);
  ps.addSizeGradient(1, 0.1);
  ps.addDragGradient(0, 0);
  ps.addDragGradient(1, 1);
  ps.start();

  return ps;
}

export function createLinkedLabel(
  value: string,
  kind: CharacterKind,
  parent: BABYLON.Mesh,
): GUI.TextBlock {
  const scene = parent.getScene();
  const height = charactersConfig[kind].labelHeight;
  const label = new GUI.TextBlock('label', value);

  label.color = '#ccc';
  label.fontSize = 16;

  function updateLabelPosition(): void {
    const guiPosition = worldToGUI(
      parent.position.add(new BABYLON.Vector3(0, height, 0)),
      scene,
    );

    label.left = guiPosition.x;
    label.top = guiPosition.y;
  }

  updateLabelPosition();
  scene.registerAfterRender(updateLabelPosition);
  label.onDisposeObservable.add(function () {
    scene.unregisterAfterRender(updateLabelPosition);
  });

  return label;
}

export function getColorFromDamageCoef(coef: number, maxCoef: number): BABYLON.Color4 {
  return new BABYLON.Color4(
    Math.max(0, coef / maxCoef),
    0.2,
    Math.max(0.1, 1 - coef / maxCoef),
  );
}
