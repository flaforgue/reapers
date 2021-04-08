<script>
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import { CharacterDTO } from '@reapers/game-client';
  import { disposeArray } from '../../utils';
  import { onDestroy } from 'svelte';
  import { AnimationKey } from './player.utils';
  import Character from '../Character/Character.svelte';
  import { AbstractMesh } from '@babylonjs/core';

  export let assetContainer: BABYLON.AssetContainer | undefined;
  export let baseHighlightMesh: BABYLON.Mesh | undefined;
  export let camera: BABYLON.ArcRotateCamera | undefined = undefined;
  export let player: CharacterDTO = new CharacterDTO();
  export let gui: GUI.AdvancedDynamicTexture | undefined;
  export let shadowGenerator: BABYLON.CascadedShadowGenerator | undefined;

  let rootMeshes: BABYLON.Mesh[] = [];
  let skeletons: BABYLON.Skeleton[] = [];
  let animationGroups: BABYLON.AnimationGroup[] = [];
  let currentAnimation: BABYLON.AnimationGroup | undefined;
  let currentAnimationKey = AnimationKey.Idle;
  let particleSystem: BABYLON.ParticleSystem | undefined;

  function instantiateModels() {
    const entries = assetContainer?.instantiateModelsToScene((sourceName) => {
      return `Clone of ${sourceName}`;
    }, true);

    skeletons = entries?.skeletons ?? [];
    rootMeshes = (entries?.rootNodes ?? []) as BABYLON.Mesh[];
    animationGroups = entries?.animationGroups ?? [];
    animationGroups[AnimationKey.Walk].speedRatio = 2;
    shadowGenerator?.addShadowCaster(rootMeshes[0] as AbstractMesh);
  }

  // function castSpell() {
  //   const scene = rootMeshes[0]?.getScene();

  //   if ($targetInfos?.position && scene && player?.position) {
  //     if (!particleSystem) {
  //       particleSystem = createParticleSystem(scene);
  //     }

  //     const vectorToTarget = $targetInfos.position.subtract(
  //       new BABYLON.Vector3(...player.position),
  //     );
  //     const distanceToTarget = vectorToTarget.length();
  //     const directionToTarget = vectorToTarget.normalize();
  //     const lifeTime = distanceToTarget / particleSystem.minEmitPower;

  //     particleSystem.direction1 = directionToTarget;
  //     particleSystem.direction2 = directionToTarget;
  //     particleSystem.minLifeTime = lifeTime;
  //     particleSystem.maxLifeTime = lifeTime;
  //     particleSystem.emitter = new BABYLON.Vector3(...player.position).add(
  //       new BABYLON.Vector3(0, 0.5, 0),
  //     );
  //     particleSystem.manualEmitCount = 1;

  //     // show animations to other players
  //     // animation player
  //     // cooldown
  //     // on attack ended, client send attack message to backend
  //     // backend check if attack is possible and attack
  //   }
  // }

  $: isAssetContainerReady = Boolean(assetContainer);
  $: isShadowGeneratorReady = Boolean(shadowGenerator);
  $: {
    if (isAssetContainerReady && isShadowGeneratorReady) {
      instantiateModels();
    }
  }

  $: {
    if (camera && rootMeshes[0] && !camera.parent) {
      camera.parent = rootMeshes[0];
    }
  }

  $: isRootMeshReady = Boolean(rootMeshes[0]);
  $: frontMoveDirection = player.frontMoveDirection;
  $: sideMoveDirection = player.sideMoveDirection;
  $: {
    if (isRootMeshReady && (frontMoveDirection || sideMoveDirection)) {
      currentAnimationKey = AnimationKey.Walk;
    } else {
      currentAnimationKey = AnimationKey.Idle;
    }
  }

  // $: action = character.action;
  // $: {
  //   if (action === CharacterAction.Attacking) {
  //     switchAnimation(animationKeys[character.kind].Punch, false);
  //   }
  // }

  onDestroy(() => {
    const particleSystems = (particleSystem?.subEmitters ?? []).map(
      (s) => (s as BABYLON.SubEmitter).particleSystem,
    );
    disposeArray(particleSystems);
    particleSystem?.dispose();
    disposeArray(animationGroups);
    disposeArray(rootMeshes);
    disposeArray(skeletons);
  });
</script>

<Character
  rootMesh={rootMeshes[0]}
  character={player}
  {animationGroups}
  {currentAnimationKey}
  {baseHighlightMesh}
  {gui}
/>

<style>
</style>
