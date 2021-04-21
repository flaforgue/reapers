<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { PawnKind, WorldDTO } from '@reapers/game-client';
  import { createGround, createLight, createSkyBox, createSound } from './world.utils';
  import { createVector3 } from '../../../utils';

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

  function createPawns() {
    const instanceCount = world.pawns.length;
    const matricesDatas: Record<PawnKind, Float32Array> = {
      [PawnKind.PineTree]: new Float32Array(16 * instanceCount),
    };

    for (let i = 0; i < world.pawns.length; i++) {
      BABYLON.Matrix.Compose(
        createVector3(world.pawns[i].scaling),
        createVector3(world.pawns[i].rotation).toQuaternion(),
        createVector3(world.pawns[i].position),
      ).copyToArray(matricesDatas[world.pawns[i].kind], i * 16);
    }

    for (const pawnKind in PawnKind) {
      (basePawnMeshes[pawnKind as PawnKind] as BABYLON.Mesh).thinInstanceSetBuffer(
        'matrix',
        matricesDatas[pawnKind as PawnKind],
        16,
        true,
      );
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

  $: arePawnBaseMeshReady = !Object.values(basePawnMeshes).some((v) => !v);
  $: nbPawns = world.pawns.length;
  $: {
    if (arePawnBaseMeshReady && nbPawns) {
      createPawns();
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
