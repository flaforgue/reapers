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

  scene.registerAfterRender(() => {
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
  });

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

export { animationKeys, createLabel, createTargetInfos, createActiveMesh };
