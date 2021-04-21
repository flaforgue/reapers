<script>
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import { onDestroy } from 'svelte';
  import { AttackDTO, CharacterDTO, MonsterKind } from '@reapers/game-client';
  import { disposeArray } from '../../../utils';
  import { createParticleSystem, monsterAnimationKeys } from './monster.utils';
  import Character from '../Character/Character.svelte';

  export let assetContainer: BABYLON.AssetContainer | undefined;
  export let monster: CharacterDTO;
  export let gui: GUI.AdvancedDynamicTexture | undefined;
  export let shadowGenerator: BABYLON.CascadedShadowGenerator | undefined;

  const monsterScalingFactor = 0.3;

  const animationKeys = monsterAnimationKeys[(monster.kind as unknown) as MonsterKind];
  const characterAnimationKeys = {
    attack: animationKeys.Attack,
    idle: animationKeys.Idle,
    walk: animationKeys.Walk,
    death: animationKeys.Death,
    loadAttack: undefined,
  };

  let rootMeshes: BABYLON.Mesh[] = [];
  let skeletons: BABYLON.Skeleton[] = [];
  let animationGroups: BABYLON.AnimationGroup[] = [];
  let particleSystem: BABYLON.ParticleSystem | undefined;

  function instantiateModels() {
    const entries = assetContainer?.instantiateModelsToScene((sourceName) => {
      return `Clone of ${sourceName}`;
    }, true);

    skeletons = entries?.skeletons ?? [];
    rootMeshes = (entries?.rootNodes ?? []) as BABYLON.Mesh[];
    rootMeshes[0].scaling = new BABYLON.Vector3(
      monster.scaling.x * monsterScalingFactor,
      monster.scaling.y * monsterScalingFactor,
      monster.scaling.z * -1 * monsterScalingFactor,
    );
    animationGroups = entries?.animationGroups ?? [];
    animationGroups[animationKeys.Walk].speedRatio = 1.7;
    shadowGenerator?.addShadowCaster(rootMeshes[0] as BABYLON.AbstractMesh);
  }

  function handleAttack(details: CustomEvent<AttackDTO>) {
    const scene = rootMeshes[0]?.getScene();
    const attack = details.detail;

    if (attack && scene && monster?.position) {
      if (!particleSystem) {
        particleSystem = createParticleSystem(scene);
      }

      particleSystem.emitter = new BABYLON.Vector3(
        attack.targetPosition.x,
        attack.targetPosition.y + 0.25,
        attack.targetPosition.z,
      );

      particleSystem.manualEmitCount = 1;
    }
  }

  $: isAssetContainerReady = Boolean(assetContainer);
  $: isShadowGeneratorReady = Boolean(shadowGenerator);
  $: {
    if (isAssetContainerReady && isShadowGeneratorReady) {
      instantiateModels();
    }
  }

  // let destinationMesh: BABYLON.Mesh | undefined;
  // $: destination = monster.destination;
  // $: destX = destination?.x ?? 0;
  // $: destY = destination?.y ?? 0;
  // $: destZ = destination?.z ?? 0;
  // $: {
  //   if (destX || destY || destZ) {
  //     destinationMesh?.dispose();
  //     destinationMesh = BABYLON.MeshBuilder.CreateBox('destination', {
  //       size: 0.3,
  //     });
  //     destinationMesh.position = new BABYLON.Vector3(destX, destY, destZ);
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
  character={monster}
  {animationGroups}
  on:attack={handleAttack}
  {characterAnimationKeys}
  {gui}
/>
