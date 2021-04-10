<script>
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import { CharacterDTO, CharacterKind } from '@reapers/game-client';
  import type { CharacterInfos } from '../../stores';
  import { targetInfos } from '../../stores';
  import { onDestroy } from 'svelte';
  import {
    createLabel,
    createTargetInfos,
    createHighlightMesh,
    createAttackLabelAsync,
  } from './character.utils';

  export let character: CharacterDTO = new CharacterDTO();
  export let gui: GUI.AdvancedDynamicTexture | undefined;
  export let baseHighlightMesh: BABYLON.Mesh | undefined;
  export let rootMesh: BABYLON.Mesh | undefined;
  export let animationGroups: BABYLON.AnimationGroup[] = [];
  export let currentAnimationKey: number;
  export let attackAnimationKey: number;

  let label: GUI.TextBlock | undefined;
  let highlightMesh: BABYLON.Mesh | undefined;
  let currentAnimation: BABYLON.AnimationGroup | undefined;

  function updatePosition(x = 0, y = 0, z = 0) {
    if (rootMesh) {
      rootMesh.position = new BABYLON.Vector3(x, y, z);
    }
  }

  function updateRotation(x = 0, y = 0, z = 0) {
    if (rootMesh) {
      rootMesh.rotation = new BABYLON.Vector3(x, y, z);
    }
  }

  function switchAnimation(animationKey: number) {
    if (character.kind === CharacterKind.Player) {
      console.log('switchAnimation', animationKey);
    }

    currentAnimation?.reset()?.stop();

    const newAnimation = animationGroups[animationKey];
    const isLoop = animationKey !== attackAnimationKey;

    if (newAnimation) {
      currentAnimation = newAnimation.start(
        isLoop,
        newAnimation.speedRatio,
        newAnimation.from,
        newAnimation.to,
        false,
      );
    }
  }

  function setRootMeshMaterialAlpha(value: number) {
    const material = rootMesh?.getChildMeshes()[0].material;

    if (material) {
      material.alpha = value;
    }
  }

  function setGUITargetInfos(character: CharacterDTO | CharacterInfos) {
    $targetInfos = createTargetInfos(character);
  }

  function createCharacterLabel() {
    if (rootMesh && gui) {
      label = createLabel(`${name} • ${level}`, kind, rootMesh, gui);
    }
  }

  function registerRootMeshActions() {
    if (rootMesh) {
      rootMesh.actionManager = new BABYLON.ActionManager(rootMesh.getScene());
      rootMesh.actionManager.isRecursive = true;
      rootMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          { trigger: BABYLON.ActionManager.OnPickTrigger },
          function () {
            setGUITargetInfos(character);

            if (!highlightMesh && baseHighlightMesh && rootMesh) {
              highlightMesh = createHighlightMesh(baseHighlightMesh, rootMesh, kind);
            }

            highlightMesh?.getScene().beginAnimation(highlightMesh, 0, 100);
          },
        ),
      );
      rootMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          { trigger: BABYLON.ActionManager.OnPointerOverTrigger },
          function () {
            document.body.style.cursor = 'pointer';
            setRootMeshMaterialAlpha(0.8);
          },
        ),
      );
      rootMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          { trigger: BABYLON.ActionManager.OnPointerOutTrigger },
          function () {
            document.body.style.cursor = 'default';
            setRootMeshMaterialAlpha(1);
          },
        ),
      );
    }
  }

  function createCurrentAttackLabelAsync() {
    if (rootMesh && character.currentAttack) {
      createAttackLabelAsync(character.currentAttack, rootMesh.getScene());
    }
  }

  $: isRootMeshReady = Boolean(rootMesh);
  $: {
    if (isRootMeshReady) {
      registerRootMeshActions();
    }
  }

  $: {
    if (isRootMeshReady) {
      switchAnimation(currentAnimationKey);
    }
  }

  $: position = character.position;
  $: [posX, posY, posZ] = position;
  $: {
    if (isRootMeshReady) {
      updatePosition(posX, posY, posZ);
    }
  }

  $: rotation = character.rotation;
  $: [rotX, rotY, rotZ] = rotation;
  $: {
    if (isRootMeshReady) {
      updateRotation(rotX, rotY, rotZ);
    }
  }

  $: name = character.name;
  $: level = character.level;
  $: kind = character.kind;
  $: {
    if (isRootMeshReady && gui && name && level && kind) {
      createCharacterLabel();
    }
  }

  $: isTarget = $targetInfos?.id === character.id;
  $: id = character.id;
  $: minLife = character.life.min;
  $: maxLife = character.life.max;
  $: valueLife = character.life.value;
  $: {
    if (isTarget) {
      // update GUI when target infos changes
      setGUITargetInfos({
        id,
        position: new BABYLON.Vector3(...[posX, posY, posZ]),
        kind,
        name,
        level,
        life: {
          min: minLife,
          max: maxLife,
          value: valueLife,
        },
      });
    } else if (highlightMesh) {
      highlightMesh.dispose();
      highlightMesh = undefined;
    }
  }

  $: currentAttackId = character?.currentAttack?.id;
  $: {
    if (currentAttackId) {
      currentAnimationKey = attackAnimationKey;
      createCurrentAttackLabelAsync();
    }
  }

  onDestroy(() => {
    label?.dispose();
    highlightMesh?.dispose();
  });
</script>

<style>
</style>
