import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { CharacterKind } from '@reapers/game-client';

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
  engine: BABYLON.Engine,
) {
  const camera = scene.activeCamera as BABYLON.FollowCamera;

  return BABYLON.Vector3.Project(
    worldPosition,
    BABYLON.Matrix.Identity(),
    scene.getTransformMatrix(),
    camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()),
  );
}

const labelPositions: Record<CharacterKind, number> = {
  [CharacterKind.Player]: 1.4,
  [CharacterKind.Spider]: 1,
  [CharacterKind.Frog]: 1,
};

function createLabel(
  name: string,
  kind: CharacterKind,
  parent: BABYLON.TransformNode,
  gui: GUI.AdvancedDynamicTexture,
) {
  const scene = parent.getScene();
  const engine = scene.getEngine();
  const height = labelPositions[kind];
  const label = new GUI.TextBlock('label', name);

  label.color = '#ccc';
  label.fontSize = 20;

  gui.addControl(label);

  scene.registerAfterRender(() => {
    const screenWidth = engine.getRenderWidth();
    const screenHeight = engine.getRenderHeight();
    const screenPosition = worldToScreen(
      parent.position.add(new BABYLON.Vector3(0, height, 0)),
      scene,
      engine,
    );
    label.left = (screenPosition.x - screenWidth / 2).toFixed(1);
    label.top = (screenPosition.y - screenHeight / 2).toFixed(1);
  });

  return label;
}

export { animationKeys, createLabel };
