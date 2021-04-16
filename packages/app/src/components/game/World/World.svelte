<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { PawnKind, WorldDTO } from '@reapers/game-client';
  import { createGround, createLight, createSkyBox, createSound } from './world.utils';

  type WorldEvents = {
    lightChanged: BABYLON.DirectionalLight;
  };

  export let scene: BABYLON.Scene | undefined;
  export let world: WorldDTO = new WorldDTO();
  export let basePawnMeshes: Record<PawnKind, BABYLON.Mesh | undefined>;

  const dispatch = createEventDispatcher<WorldEvents>();

  let ground: BABYLON.Mesh | undefined;
  let light: BABYLON.DirectionalLight | undefined;
  let sound: BABYLON.Sound | undefined;
  let skyBox: BABYLON.Mesh | undefined;

  function createTrees() {
    if (scene) {
      const instanceCount = world.trees.length;
      const matricesData = new Float32Array(16 * instanceCount);

      if (scene) {
        for (let i = 0; i < world.trees.length; i++) {
          BABYLON.Matrix.Compose(
            new BABYLON.Vector3(1.5, 1.5, 1.5),
            new BABYLON.Vector3(
              world.trees[i].rotation.x,
              world.trees[i].rotation.y,
              world.trees[i].rotation.z,
            ).toQuaternion(),
            new BABYLON.Vector3(
              world.trees[i].position.x,
              world.trees[i].position.y,
              world.trees[i].position.z,
            ),
          ).copyToArray(matricesData, i * 16);
        }

        (basePawnMeshes[PawnKind.PineTree] as BABYLON.Mesh).thinInstanceSetBuffer(
          'matrix',
          matricesData,
          16,
          true,
        );
      }
    }
  }

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

  $: isPineTreeBaseMeshReady = Boolean(basePawnMeshes[PawnKind.PineTree]);
  $: nbTrees = world.trees.length;
  $: {
    if (isPineTreeBaseMeshReady && nbTrees) {
      createTrees();
    }
  }

  onDestroy(() => {
    light?.dispose();
    sound?.dispose();
    skyBox?.dispose();
    ground?.dispose();
  });
</script>

<!-- {#each world.pawns as pawn (pawn.id)}
  <Pawn {pawn} baseMesh={basePawnMeshes[pawn.kind]} />
{/each} -->
