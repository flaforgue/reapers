import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { EntityKind } from '@reapers/game-client';
import { labelPositions } from '../../configs/characters';

enum UnknownAnimationKey {
  Idle = 0,
  Walk = 1,
}

enum NestAnimationKey {
  Idle = 0,
  Walk = 1,
}

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

type AnyAnimationKey =
  | typeof PlayerAnimationKey
  | typeof SpiderAnimationKey
  | typeof UnknownAnimationKey
  | typeof NestAnimationKey;

const animationKeys: Record<EntityKind, AnyAnimationKey> = {
  [EntityKind.Unknown]: UnknownAnimationKey,
  [EntityKind.World]: UnknownAnimationKey,
  [EntityKind.Nest]: NestAnimationKey,
  [EntityKind.Player]: PlayerAnimationKey,
  [EntityKind.Spider]: SpiderAnimationKey,
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

function createLabel(
  name: string,
  kind: EntityKind,
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
