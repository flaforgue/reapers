import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { AttackDTO, CharacterDTO, CharacterKind } from '@reapers/game-client';
import { worldToGUI } from '../../utils';
import type { CharacterInfos } from '../../stores';

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

export function createLabel(
  value: string,
  kind: CharacterKind,
  parent: BABYLON.Mesh,
  gui: GUI.AdvancedDynamicTexture,
) {
  const scene = parent.getScene();
  const height = labelPositions[kind];
  const label = new GUI.TextBlock('label', value);

  label.color = '#ccc';
  label.fontSize = 16;

  gui.addControl(label);

  function updateLabelPosition() {
    const guiPosition = worldToGUI(
      parent.position.add(new BABYLON.Vector3(0, height, 0)),
      scene,
    );

    label.left = guiPosition.x;
    label.top = guiPosition.y;
  }

  updateLabelPosition();
  scene.registerAfterRender(updateLabelPosition);

  return label;
}

export function createAttackLabelAsync(attack: AttackDTO, scene: BABYLON.Scene) {
  const lifeTime = 2000;
  const label = document.createElement('div');
  const labelPosition = worldToGUI(new BABYLON.Vector3(...attack.targetPosition), scene);

  label.id = attack.id;
  label.innerText = attack.damageAmount.toString();
  label.style.position = 'absolute';
  label.style.left = `${Number(labelPosition.x) - label.clientWidth / 2}px`;
  label.style.top = `${Number(labelPosition.y) - label.clientHeight / 2}px`;
  label.style.fontSize = `${36}px`;
  label.style.color = '#fff';
  label.style.textShadow = '3px 3px rgba(0, 0, 0, 0.6)';

  setTimeout(() => {
    document.body.appendChild(label);
    setTimeout(() => document.getElementById(attack.id)?.remove(), lifeTime);
  }, attack.timeToHit * 1000);
}

export function createTargetInfos(
  character: CharacterDTO | CharacterInfos,
): CharacterInfos {
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

export function createHighlightMesh(
  baseMesh: BABYLON.Mesh,
  parent: BABYLON.Mesh,
  kind: CharacterKind,
) {
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
