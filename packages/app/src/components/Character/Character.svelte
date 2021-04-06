<script>
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import {
    SideMoveDirection,
    FrontMoveDirection,
    CharacterDTO,
  } from '@reapers/game-client';
  import { disposeArray } from '../../utils';
  import type { CharacterInfos } from '../../stores';
  import { targetInfos } from '../../stores';
  import { onDestroy } from 'svelte';
  import {
    animationKeys,
    createActiveMesh,
    createLabel,
    createTargetInfos,
  } from './character.utils';
  import { AbstractMesh } from '@babylonjs/core';

  export let assetContainer: BABYLON.AssetContainer | undefined;
  export let baseActiveMesh: BABYLON.Mesh | undefined;
  export let camera: BABYLON.FollowCamera | undefined = undefined;
  export let character: CharacterDTO = new CharacterDTO();
  export let gui: GUI.AdvancedDynamicTexture | undefined;
  export let shadowGenerator: BABYLON.ShadowGenerator | undefined;

  let rootMesh: BABYLON.Mesh | undefined;
  let rootMeshes: BABYLON.Mesh[] = [];

  let animationGroups: BABYLON.AnimationGroup[] = [];
  let skeletons: BABYLON.Skeleton[] = [];
  let currentAnimation: BABYLON.AnimationGroup | undefined;
  let isTarget = false;
  let label: GUI.TextBlock | undefined;
  let activeMesh: BABYLON.Mesh | undefined;

  function switchAnimation(animationKey: number) {
    const newAnimation = animationGroups[animationKey];

    if (newAnimation && newAnimation !== currentAnimation) {
      currentAnimation?.stop();
      currentAnimation = newAnimation;
      currentAnimation.play(true);
    }
  }

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

  function updateAnimation(direction: FrontMoveDirection | SideMoveDirection) {
    if (rootMesh && direction) {
      switchAnimation(animationKeys[character.kind].Walk);
    } else {
      switchAnimation(animationKeys[character.kind].Idle);
    }
  }

  function setRootMeshMaterialAlpha(value: number) {
    const material = rootMesh?.getChildMeshes()[0].material;
    if (material) {
      material.alpha = value;
    }
  }

  function instantiateModels() {
    const entries = assetContainer?.instantiateModelsToScene((sourceName) => {
      return `Clone of ${sourceName}`;
    }, true);

    skeletons = entries?.skeletons ?? [];
    rootMeshes = (entries?.rootNodes ?? []) as BABYLON.Mesh[];
    rootMesh = rootMeshes[0];

    rootMesh.actionManager = new BABYLON.ActionManager(
      assetContainer?.scene as BABYLON.Scene,
    );
    rootMesh.actionManager.isRecursive = true;
    rootMesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        { trigger: BABYLON.ActionManager.OnPickTrigger },
        function () {
          setGUITargetInfos(character);

          if (!activeMesh && baseActiveMesh && rootMesh) {
            activeMesh = createActiveMesh(baseActiveMesh, rootMesh, kind, true);
          }

          activeMesh?.getScene().beginAnimation(activeMesh, 0, 100);
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

    animationGroups = entries?.animationGroups ?? [];
    animationGroups[animationKeys[character.kind].Walk].speedRatio = 2;
    shadowGenerator?.addShadowCaster(rootMesh as AbstractMesh);
  }

  function setGUITargetInfos(character: CharacterDTO | CharacterInfos) {
    $targetInfos = createTargetInfos(character);
  }

  function createCharacterLabel() {
    if (rootMesh && gui) {
      label = createLabel(`${name} • ${level}`, kind, rootMesh, gui);
    }
  }

  $: isAssetContainerReady = Boolean(assetContainer);
  $: {
    if (isAssetContainerReady) {
      instantiateModels();
    }
  }

  $: {
    if (camera && rootMesh && !camera.lockedTarget) {
      camera.lockedTarget = rootMesh as AbstractMesh;
    }
  }

  $: rootMeshId = rootMesh?.id;
  $: name = character.name;
  $: level = character.level;
  $: kind = character.kind;
  $: {
    if (rootMeshId && gui && name && level) {
      createCharacterLabel();
    }
  }

  $: position = character.position;
  $: [posX, posY, posZ] = position;
  $: {
    // isAssetContainerReady must be part of reactivity deps
    if (isAssetContainerReady) {
      updatePosition(posX, posY, posZ);
    }
  }

  $: rotation = character.rotation;
  $: [rotX, rotY, rotZ] = rotation;
  $: {
    // isAssetContainerReady must be part of reactivity deps
    if (isAssetContainerReady) {
      updateRotation(rotX, rotY, rotZ);
    }
  }

  $: frontMoveDirection = character.frontMoveDirection;
  $: sideMoveDirection = character.sideMoveDirection;
  $: {
    // isAssetContainerReady must be part of reactivity deps
    if (isAssetContainerReady) {
      updateAnimation(frontMoveDirection || sideMoveDirection);
    }
  }

  $: isTarget = $targetInfos?.id === character.id;
  $: id = character.id;
  $: minLife = character.life.min;
  $: maxLife = character.life.max;
  $: valueLife = character.life.value;
  $: {
    if (isTarget) {
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
    } else if (activeMesh) {
      activeMesh.dispose();
      activeMesh = undefined;
    }
  }

  // $: destination = (character as MonsterDTO).destination;
  // $: [destX, destY, destZ] = destination ?? [0, 0, 0];
  // $: {
  //   if (destX || destY || destZ) {
  //     const mesh = BABYLON.MeshBuilder.CreateBox('destination', {
  //       size: 0.3,
  //     });
  //     mesh.position = new BABYLON.Vector3(destX, destY, destZ);
  //   }
  // }

  onDestroy(() => {
    disposeArray(animationGroups);
    disposeArray(rootMeshes);
    disposeArray(skeletons);
    label?.dispose();
  });
</script>

<style>
</style>
