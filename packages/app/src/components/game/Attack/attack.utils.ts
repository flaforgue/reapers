import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { CharacterKind, AttackDTO } from '@reapers/game-client';
import { worldToGUI, createVector3 } from '../../../utils';
import charactersConfig from '../../../configs/characters.config';

function createFreeLabel(
  labelOptions: {
    value: string;
    color?: string;
  },
  kind: CharacterKind,
  position: BABYLON.Vector3,
  scene: BABYLON.Scene,
): GUI.TextBlock {
  const height = charactersConfig[kind].labelHeight;
  const label = new GUI.TextBlock('label', labelOptions.value);

  label.color = labelOptions?.color ?? '#fff';
  label.fontSize = 32;
  label.shadowOffsetX = 3;
  label.shadowOffsetY = 3;
  label.shadowBlur = 5;
  label.metadata = {
    offsetY: 0,
  };

  function updateLabelPosition(): void {
    const guiPosition = worldToGUI(
      position.add(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        new BABYLON.Vector3(0, height + (label.metadata.offsetY as number), 0),
      ),
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

export function createLabel(
  attack: AttackDTO,
  color: string,
  scene: BABYLON.Scene,
): GUI.TextBlock {
  const label = createFreeLabel(
    {
      value: attack.damageAmount.toString(),
      color,
    },
    attack.targetKind,
    createVector3(attack.targetPosition),
    scene,
  );

  // Enforced types are required to animate a GUI Element
  ((label as unknown) as BABYLON.Node).getScene = (): BABYLON.Scene => scene;
  BABYLON.Animation.CreateAndStartAnimation(
    'attackLabel',
    (label as unknown) as BABYLON.Node,
    'fontSize',
    10,
    1,
    0,
    50,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  );
  BABYLON.Animation.CreateAndStartAnimation(
    'attackLabel',
    (label as unknown) as BABYLON.Node,
    'alpha',
    3,
    1,
    1,
    0,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  );
  BABYLON.Animation.CreateAndStartAnimation(
    'attackLabel',
    (label as unknown) as BABYLON.Node,
    'metadata.offsetY',
    2,
    1,
    0,
    1,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  );

  return label;
}
