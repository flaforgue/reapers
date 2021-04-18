import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { AttackDTO, CharacterKind } from '@reapers/game-client';
import charactersConfig from '../../../configs/characters.config';
import { worldToGUI } from '../../../utils';

const activeMeshRadius: Record<CharacterKind, number> = {
  [CharacterKind.Player]: 1.5,
  [CharacterKind.Frog]: 2.5,
  [CharacterKind.Spider]: 3.5,
};

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

export function createAttackLabel(
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
    new BABYLON.Vector3(
      attack.targetPosition.x,
      attack.targetPosition.y,
      attack.targetPosition.z,
    ),
    scene,
  );

  return label;
}

export function createHighlightMesh(
  baseMesh: BABYLON.Mesh,
  parent: BABYLON.Mesh,
  kind: CharacterKind,
): BABYLON.Mesh {
  const activeMesh = baseMesh.clone('Clone of activeMesh', parent);

  activeMesh.setEnabled(true);
  activeMesh.material = (baseMesh.material as BABYLON.StandardMaterial).clone(
    'Clone of activeMeshMat',
  );
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

// Enforced types are required to animate a GUI Element
export function animateAttackLabel(label: GUI.TextBlock, scene: BABYLON.Scene): void {
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
}
