<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import { WorldDTO } from '@reapers/game-client';
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { createGround, createLight, createSkyBox, createSound } from './world.utils';

  type WorldEvents = {
    lightChanged: BABYLON.DirectionalLight;
  };

  export let scene: BABYLON.Scene | undefined;
  export let world: WorldDTO = new WorldDTO();

  let ground: BABYLON.Mesh | undefined;
  let light: BABYLON.DirectionalLight | undefined;
  let sound: BABYLON.Sound | undefined;
  let skyBox: BABYLON.Mesh | undefined;
  const dispatch = createEventDispatcher<WorldEvents>();

  $: ({ width, depth } = world);
  $: {
    if (scene && width && depth) {
      ground?.dispose();
      ground = createGround(width, depth, scene);

      sound?.dispose();
      sound = createSound(scene);

      skyBox?.dispose();
      skyBox = createSkyBox(scene, width, depth);

      light?.dispose();
      light = createLight(scene);

      dispatch('lightChanged', light);
    }
  }

  onDestroy(() => {
    light?.dispose();
    sound?.dispose();
    skyBox?.dispose();
    ground?.dispose();
  });
</script>
