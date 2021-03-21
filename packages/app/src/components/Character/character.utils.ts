import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { EntityKind } from '@reapers/game-client';

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
  [EntityKind.Nest]: NestAnimationKey,
  [EntityKind.Player]: PlayerAnimationKey,
  [EntityKind.Spider]: SpiderAnimationKey,
};

function createLabel(parent: BABYLON.TransformNode, name: string) {
  const yOffset = -90;
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  // const rect = new GUI.Rectangle();
  const label = new GUI.TextBlock('', name);

  advancedTexture.useInvalidateRectOptimization = true;

  label.useBitmapCache = true;
  label.paddingTop = '2px';
  label.width = '120px';
  label.height = '40px';
  label.color = 'black';
  label.fontSize = 25;
  // label.thickness = 0;
  // label.addControl(label);
  advancedTexture.addControl(label);

  label.linkOffsetY = yOffset;
  label.linkWithMesh(parent);

  // label.text = name;

  parent.getScene().onAfterRenderObservable.add(() => {
    const distance = parent.getDistanceToCamera();
    label.linkOffsetY = -400 / Math.sqrt(distance);
    // label.alpha = Math.max(0, (30 - distance) / 30);
  });
}

export { animationKeys, createLabel };
