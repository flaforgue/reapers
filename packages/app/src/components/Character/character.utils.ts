import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { CharacterDTO, CharacterKind } from '@reapers/game-client';
import type { CharacterInfos } from '../../stores';

enum PlayerAnimationKey {
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

enum SpiderAnimationKey {
  Attack = 0,
  Idle = 1,
  Jump = 2,
  Walk = 3,
}

enum FrogAnimationKey {
  Idle = 0,
  Walk = 1,
}

type CharacterAnimationKey =
  | typeof PlayerAnimationKey
  | typeof SpiderAnimationKey
  | typeof FrogAnimationKey;

const animationKeys: Record<CharacterKind, CharacterAnimationKey> = {
  [CharacterKind.Player]: PlayerAnimationKey,
  [CharacterKind.Spider]: SpiderAnimationKey,
  [CharacterKind.Frog]: FrogAnimationKey,
};

function worldToScreen(
  worldPosition: BABYLON.Vector3,
  scene: BABYLON.Scene,
  screenWidth: number,
  screenHeight: number,
) {
  const camera = scene.activeCamera as BABYLON.FollowCamera;

  return BABYLON.Vector3.Project(
    worldPosition,
    BABYLON.Matrix.Identity(),
    scene.getTransformMatrix(),
    camera.viewport.toGlobal(screenWidth, screenHeight),
  );
}

const labelPositions: Record<CharacterKind, number> = {
  [CharacterKind.Player]: 1.4,
  [CharacterKind.Frog]: 1,
  [CharacterKind.Spider]: 1,
};

const activeMeshRadius: Record<CharacterKind, number> = {
  [CharacterKind.Player]: 1.5,
  [CharacterKind.Frog]: 2.5,
  [CharacterKind.Spider]: 3.5,
};

function createLabel(
  value: string,
  kind: CharacterKind,
  parent: BABYLON.Mesh,
  gui: GUI.AdvancedDynamicTexture,
) {
  const scene = parent.getScene();
  const engine = scene.getEngine();
  const height = labelPositions[kind];
  const label = new GUI.TextBlock('label', value);

  label.color = '#ccc';
  label.fontSize = 16;

  gui.addControl(label);

  function updateLabelPosition() {
    const screenWidth = engine.getRenderWidth();
    const screenHeight = engine.getRenderHeight();
    const screenPosition = worldToScreen(
      parent.position.add(new BABYLON.Vector3(0, height, 0)),
      scene,
      screenWidth,
      screenHeight,
    );
    label.left = (screenPosition.x - screenWidth / 2).toFixed(1);
    label.top = (screenPosition.y - screenHeight / 2).toFixed(1);
  }

  updateLabelPosition();
  scene.registerAfterRender(updateLabelPosition);

  return label;
}

function createTargetInfos(character: CharacterDTO | CharacterInfos): CharacterInfos {
  const position = Array.isArray(character.position)
    ? new BABYLON.Vector3(...character.position)
    : character.position;

  return {
    id: character.id,
    kind: character.kind,
    level: character.level,
    name: character.name,
    life: character.life,
    position,
  };
}

function createActiveMesh(
  baseMesh: BABYLON.Mesh,
  parent: BABYLON.Mesh,
  kind: CharacterKind,
  isActive: boolean,
) {
  const activeMesh = baseMesh.clone('Clone of activeMesh', parent);

  activeMesh.setEnabled(true);
  activeMesh.material = (baseMesh.material as BABYLON.StandardMaterial).clone(
    'Clone of activeMeshMat',
  );
  activeMesh.material.alpha = isActive ? 0.5 : 0.1;
  activeMesh.animations = [...baseMesh.animations];
  activeMesh.animations[0].setKeys([
    {
      frame: 0,
      value: new BABYLON.Vector3().setAll(0),
    },
    {
      frame: 10,
      value: new BABYLON.Vector3().setAll(activeMeshRadius[kind]),
    },
    {
      frame: 20,
      value: new BABYLON.Vector3().setAll(activeMeshRadius[kind] * 0.7),
    },
    {
      frame: 30,
      value: new BABYLON.Vector3().setAll(activeMeshRadius[kind]),
    },
  ]);
  activeMesh.getScene().beginAnimation(activeMesh, 0, 100);

  return activeMesh;
}

function createMainParticleSystem(
  scene: BABYLON.Scene,
  particleTexture: BABYLON.Texture,
  particleColor: BABYLON.Color4,
) {
  const ps = new BABYLON.ParticleSystem('particles', 1000, scene);

  ps.createPointEmitter(BABYLON.Vector3.Forward(), BABYLON.Vector3.Forward());
  ps.particleTexture = particleTexture;
  ps.minEmitPower = 30;
  ps.maxEmitPower = 30;
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

function createParticleSystem(scene: BABYLON.Scene) {
  const particleTexture = new BABYLON.Texture('/textures/flare.png', scene);
  const particleColor = new BABYLON.Color4(0.2, 0.2, 0.85, 1);

  const mainParticleSystem = createMainParticleSystem(
    scene,
    particleTexture,
    particleColor,
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

export {
  animationKeys,
  createLabel,
  createTargetInfos,
  createActiveMesh,
  createParticleSystem,
};
