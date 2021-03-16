<script>
  import * as BABYLON from '@babylonjs/core';
  import { MoveDirection, CharacterDTO } from '@reapers/game-client';
  import { disposeArray } from '../../utils';
  import { onDestroy } from 'svelte';
  import { animationKeys } from './character.utils';

  export let assetContainer: BABYLON.AssetContainer | undefined;
  export let camera: BABYLON.FollowCamera | undefined = undefined;
  export let character: CharacterDTO = new CharacterDTO();

  let rootNodes: BABYLON.TransformNode[] = [];
  let animationGroups: BABYLON.AnimationGroup[] = [];
  let skeletons: BABYLON.Skeleton[] = [];
  let currentAnimation: BABYLON.AnimationGroup | undefined;

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

  function updateMoveDirection(direction: MoveDirection) {
    if (rootNodes[0] && direction) {
      switchAnimation(animationKeys[character.kind].Walk);
    } else {
      switchAnimation(animationKeys[character.kind].Idle);
    }
  }

  function loadAssetContainer() {
    const entries = assetContainer?.instantiateModelsToScene();

    skeletons = entries?.skeletons ?? [];
    rootNodes = entries?.rootNodes ?? [];
    animationGroups = entries?.animationGroups ?? [];
    animationGroups[animationKeys[character.kind].Walk].speedRatio = 2;
  }

  $: rootNodeId = rootNodes[0]?.id;

  $: {
    if (assetContainer) {
      loadAssetContainer();
    }
  }

  $: {
    if (camera && rootNodes[0]) {
      camera.lockedTarget = rootNodes[0] as BABYLON.AbstractMesh;
    }
  }

  $: position = character.position;
  $: [posX, posY, posZ] = position;
  $: {
    updatePosition(posX, posY, posZ);
  }

  $: rotation = character.rotation;
  $: [rotX, rotY, rotZ] = rotation;
  $: {
    updateRotation(rotX, rotY, rotZ);
  }

  $: moveDirection = character.moveDirection;
  $: {
    updateMoveDirection(moveDirection);
  }

  onDestroy(() => {
    disposeArray(animationGroups);
    disposeArray(rootNodes);
    disposeArray(skeletons);
  });
</script>

<style>
</style>
