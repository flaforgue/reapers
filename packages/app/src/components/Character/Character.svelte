<script>
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import {
    SideMoveDirection,
    FrontMoveDirection,
    CharacterDTO,
  } from '@reapers/game-client';
  import { disposeArray } from '../../utils';
  import { onDestroy } from 'svelte';
  import { animationKeys, createLabel } from './character.utils';
  import { AbstractMesh } from '@babylonjs/core';

  export let assetContainer: BABYLON.AssetContainer | undefined;
  export let camera: BABYLON.FollowCamera | undefined = undefined;
  export let character: CharacterDTO = new CharacterDTO();
  export let gui: GUI.AdvancedDynamicTexture | undefined;
  export let shadowGenerator: BABYLON.ShadowGenerator | undefined;

  let rootNodes: BABYLON.TransformNode[] = [];
  let animationGroups: BABYLON.AnimationGroup[] = [];
  let skeletons: BABYLON.Skeleton[] = [];
  let currentAnimation: BABYLON.AnimationGroup | undefined;
  let label: GUI.TextBlock | undefined;

  function switchAnimation(animationKey: number) {
    const newAnimation = animationGroups[animationKey];

    if (newAnimation && newAnimation !== currentAnimation) {
      currentAnimation?.stop();
      currentAnimation = newAnimation;
      currentAnimation.play(true);
    }
  }

  function updatePosition(x = 0, y = 0, z = 0) {
    if (rootNodes[0]) {
      rootNodes[0].position = new BABYLON.Vector3(x, y, z);
    }
  }

  function updateRotation(x = 0, y = 0, z = 0) {
    if (rootNodes[0]) {
      rootNodes[0].rotation = new BABYLON.Vector3(x, y, z);
    }
  }

  function updateAnimation(direction: FrontMoveDirection | SideMoveDirection) {
    if (rootNodes[0] && direction) {
      switchAnimation(animationKeys[character.kind].Walk);
    } else {
      switchAnimation(animationKeys[character.kind].Idle);
    }
  }

  function instantiateModels() {
    const entries = assetContainer?.instantiateModelsToScene();

    skeletons = entries?.skeletons ?? [];
    rootNodes = entries?.rootNodes ?? [];
    animationGroups = entries?.animationGroups ?? [];
    animationGroups[animationKeys[character.kind].Walk].speedRatio = 2;
    shadowGenerator?.addShadowCaster(rootNodes[0] as AbstractMesh);
  }

  $: isAssetContainerReady = Boolean(assetContainer);
  $: {
    if (isAssetContainerReady) {
      instantiateModels();
    }
  }

  $: {
    if (camera && rootNodes[0] && !camera.lockedTarget) {
      camera.lockedTarget = rootNodes[0] as AbstractMesh;
    }
  }

  $: name = character.name;
  $: kind = character.kind;
  $: {
    if (rootNodes[0] && gui && name) {
      label = createLabel(name, kind, rootNodes[0], gui);
    }
  }

  $: position = character.position;
  $: [posX, posY, posZ] = position;
  $: {
    // assetContainer must be part of reactivity deps
    if (assetContainer) {
      updatePosition(posX, posY, posZ);
    }
  }

  $: rotation = character.rotation;
  $: [rotX, rotY, rotZ] = rotation;
  $: {
    // assetContainer must be part of reactivity deps
    if (assetContainer) {
      updateRotation(rotX, rotY, rotZ);
    }
  }

  $: frontMoveDirection = character.frontMoveDirection;
  $: sideMoveDirection = character.sideMoveDirection;
  $: {
    if (assetContainer) {
      updateAnimation(frontMoveDirection || sideMoveDirection);
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
    disposeArray(rootNodes);
    disposeArray(skeletons);
    label?.dispose();
  });
</script>

<style>
</style>
