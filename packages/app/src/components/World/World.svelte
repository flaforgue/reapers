<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import { WorldDTO } from '@reapers/game-client';
  import { createGround, createLight, createSound } from './world.utils';

  export let scene: BABYLON.Scene | undefined;
  export let world: WorldDTO = new WorldDTO();

  let ground: BABYLON.Mesh | undefined;
  let light: BABYLON.HemisphericLight | undefined;
  let sound: BABYLON.Sound | undefined;

  $: {
    if (scene) {
      light?.dispose();
      light = createLight(scene);

      sound?.dispose();
      sound = createSound(scene);
    }
  }

  $: ({ width, depth } = world);
  $: {
    if (scene) {
      ground?.dispose();
      ground = createGround(width, depth, scene);
    }
  }
</script>
