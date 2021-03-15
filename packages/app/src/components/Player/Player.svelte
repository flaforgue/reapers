<script>
  import * as BABYLON from '@babylonjs/core';
  import { MoveDirection, PlayerDTO } from '@reapers/game-client';
  import { onDestroy } from 'svelte';
  import { AnimationKey } from './player.utils';

  export let player: PlayerDTO = new PlayerDTO();
  export let scene: BABYLON.Scene | undefined;
  export let camera: BABYLON.FollowCamera | undefined = undefined;

  let assets: BABYLON.AssetContainer | undefined;
  let mainMesh: BABYLON.AbstractMesh | undefined;
  let currentAnimation: BABYLON.AnimationGroup | undefined;

  function loadAssets() {
    BABYLON.SceneLoader.LoadAssetContainerAsync('/models/', 'characters/player.glb').then(
      (result) => {
        assets = result;
        mainMesh = assets.meshes[0];
        mainMesh.scaling = new BABYLON.Vector3(0.3, 0.3, -0.3);
        mainMesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
        assets.animationGroups[AnimationKey.Walk].speedRatio = 2;

        for (let i = 0; i < assets.animationGroups.length; i++) {
          assets.animationGroups[i].reset().stop();
        }

        assets.addAllToScene();
      },
    );
  }

  function switchAnimation(animationKey: AnimationKey) {
    console.log('animationKey', animationKey);
    const newAnimation = assets?.animationGroups[animationKey];

    if (newAnimation && newAnimation !== currentAnimation) {
      currentAnimation?.stop();
      currentAnimation = newAnimation;
      currentAnimation.play(true);
    }
  }

  function updatePlayerPosition(x = 0, y = 0, z = 0) {
    console.log('updatePlayerPosition');
    if (mainMesh) {
      mainMesh.position = new BABYLON.Vector3(x, y, z);
    }
  }

  function updatePlayerRotation(x = 0, y = 0, z = 0) {
    console.log('updatePlayerRotation');
    if (mainMesh) {
      mainMesh.rotation = new BABYLON.Vector3(x, y, z);
    }
  }

  function updatePlayerMoveDirection(direction: MoveDirection) {
    console.log('updatePlayerMoveDirection');
    if (mainMesh && direction) {
      switchAnimation(AnimationKey.Walk);
    } else {
      switchAnimation(AnimationKey.Idle);
    }
  }

  $: {
    if (scene) {
      loadAssets();
    }
  }

  $: mainMeshId = mainMesh?.id;

  $: {
    if (camera && mainMesh) {
      camera.lockedTarget = mainMesh;
    }
  }

  $: position = player.position;
  $: [posX, posY, posZ] = position;
  $: {
    if (mainMeshId) {
      updatePlayerPosition(posX, posY, posZ);
    }
  }

  $: rotation = player.rotation;
  $: [rotX, rotY, rotZ] = rotation;
  $: {
    if (mainMeshId) {
      updatePlayerRotation(rotX, rotY, rotZ);
    }
  }

  $: moveDirection = player.moveDirection;
  $: {
    if (mainMeshId) {
      updatePlayerMoveDirection(moveDirection);
    }
  }

  onDestroy(() => {
    console.log('disposing assets');
    assets?.dispose();
  });
</script>

<style>
</style>
