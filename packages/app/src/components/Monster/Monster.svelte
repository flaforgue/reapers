<script>
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import { CharacterDTO, MonsterKind } from '@reapers/game-client';
  import { disposeArray } from '../../utils';
  import { onDestroy } from 'svelte';
  import { monsterAnimationKeys } from './monster.utils';
  import Character from '../Character/Character.svelte';
  import { AbstractMesh } from '@babylonjs/core';

  export let monster: CharacterDTO;
  export let assetContainer: BABYLON.AssetContainer | undefined;
  export let baseHighlightMesh: BABYLON.Mesh | undefined;
  export let gui: GUI.AdvancedDynamicTexture | undefined;
  export let shadowGenerator: BABYLON.CascadedShadowGenerator | undefined;

  const animationKeys = monsterAnimationKeys[(monster.kind as unknown) as MonsterKind];

  let rootMeshes: BABYLON.Mesh[] = [];
  let skeletons: BABYLON.Skeleton[] = [];
  let animationGroups: BABYLON.AnimationGroup[] = [];
  let currentAnimationKey = animationKeys.Idle;

  function instantiateModels() {
    const entries = assetContainer?.instantiateModelsToScene((sourceName) => {
      return `Clone of ${sourceName}`;
    }, true);

    skeletons = entries?.skeletons ?? [];
    rootMeshes = (entries?.rootNodes ?? []) as BABYLON.Mesh[];
    animationGroups = entries?.animationGroups ?? [];
    animationGroups[animationKeys.Walk].speedRatio = 2;
    shadowGenerator?.addShadowCaster(rootMeshes[0] as AbstractMesh);
  }

  $: isAssetContainerReady = Boolean(assetContainer);
  $: isShadowGeneratorReady = Boolean(shadowGenerator);
  $: {
    if (isAssetContainerReady && isShadowGeneratorReady) {
      instantiateModels();
    }
  }

  $: isRootMeshReady = Boolean(rootMeshes[0]);
  $: frontMoveDirection = monster.frontMoveDirection;
  $: sideMoveDirection = monster.sideMoveDirection;
  $: {
    if (isRootMeshReady && (frontMoveDirection || sideMoveDirection)) {
      currentAnimationKey = animationKeys.Walk;
    } else {
      currentAnimationKey = animationKeys.Idle;
    }
  }

  onDestroy(() => {
    disposeArray(animationGroups);
    disposeArray(rootMeshes);
    disposeArray(skeletons);
  });
</script>

<Character
  rootMesh={rootMeshes[0]}
  character={monster}
  {animationGroups}
  {currentAnimationKey}
  {baseHighlightMesh}
  {gui}
/>

<style>
</style>
