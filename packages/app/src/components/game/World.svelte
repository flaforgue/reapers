<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import { WorldDTO } from '@reapers/game-client';

  export let scene: BABYLON.Scene | undefined;
  export let world: WorldDTO = new WorldDTO();

  let ground: BABYLON.Mesh | undefined;
  let light: BABYLON.HemisphericLight | undefined;
  let sound: BABYLON.Sound | undefined;

  function createLight(scene: BABYLON.Scene): BABYLON.HemisphericLight {
    return new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
  }

  function createSound(scene: BABYLON.Scene): BABYLON.Sound {
    return new BABYLON.Sound('cello', '/sounds/battle.wav', scene, null, {
      loop: true,
      autoplay: false,
    });
  }

  function createGround(
    width: number,
    depth: number,
    scene: BABYLON.Scene,
  ): BABYLON.Mesh {
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width, height: depth });
    const texture = new BABYLON.Texture('/textures/ground.png', scene);
    texture.uScale = 10;
    texture.vScale = 10;
    const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
    groundMat.diffuseTexture = texture;
    ground.material = groundMat;

    return ground;
  }

  $: {
    if (scene) {
      console.log('create light and sound');
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
