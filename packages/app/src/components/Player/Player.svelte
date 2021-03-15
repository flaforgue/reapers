<script>
  import * as BABYLON from '@babylonjs/core';
  import { PlayerDTO } from '@reapers/game-client';
  import { onDestroy } from 'svelte';
  import { AnimationKey } from './player.utils';

  export let player: PlayerDTO | undefined;
  export let camera: BABYLON.FollowCamera | undefined;
  export let scene: BABYLON.Scene | undefined;

  let assets: BABYLON.AssetContainer | undefined;
  let currentAnimation: BABYLON.AnimationGroup | undefined;

  function loadAssets() {
    console.log('loading assets');
    BABYLON.SceneLoader.LoadAssetContainerAsync('/models/', 'characters/player.glb').then(
      (result) => {
        assets = result;
        assets.meshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, -0.3);
        assets.meshes[0].rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
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

  function updatePlayer(player: PlayerDTO, mesh: BABYLON.AbstractMesh) {
    console.log('updatePlayer');
    mesh.position = new BABYLON.Vector3(...player.position);
    mesh.rotation = new BABYLON.Vector3(...player.rotation);

    if (player.moveDirection) {
      switchAnimation(AnimationKey.Walk);
    } else {
      switchAnimation(AnimationKey.Idle);
    }
  }

  $: {
    console.log('try to load assets');
    if (scene) {
      await loadAssets();
    }
  }

  $: {
    if (player && assets?.meshes[0]) {
      updatePlayer(player, assets.meshes[0]);
    }
  }

  onDestroy(() => {
    console.log('disposing assets');
    assets?.dispose();
  });
</script>

<style>
</style>
