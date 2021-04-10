<script>
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import { AbstractMesh } from '@babylonjs/core';
  import { onDestroy } from 'svelte';
  import { AttackDTO, CharacterDTO } from '@reapers/game-client';
  import { disposeArray } from '../../utils';
  import { AnimationKey, createParticleSystem } from './player.utils';
  import Character from '../Character/Character.svelte';

  export let assetContainer: BABYLON.AssetContainer | undefined;
  export let baseHighlightMesh: BABYLON.Mesh | undefined;
  export let camera: BABYLON.ArcRotateCamera | undefined = undefined;
  export let player: CharacterDTO = new CharacterDTO();
  export let gui: GUI.AdvancedDynamicTexture | undefined;
  export let shadowGenerator: BABYLON.CascadedShadowGenerator | undefined;

  let rootMeshes: BABYLON.Mesh[] = [];
  let skeletons: BABYLON.Skeleton[] = [];
  let particleSystem: BABYLON.ParticleSystem | undefined;
  let animationGroups: BABYLON.AnimationGroup[] = [];
  let currentAnimationKey = AnimationKey.Idle;

  const attackAnimationKey = AnimationKey.Punch;

  function instantiateModels() {
    const entries = assetContainer?.instantiateModelsToScene((sourceName) => {
      return `Clone of ${sourceName}`;
    }, true);

    skeletons = entries?.skeletons ?? [];
    rootMeshes = (entries?.rootNodes ?? []) as BABYLON.Mesh[];
    animationGroups = entries?.animationGroups ?? [];
    animationGroups[AnimationKey.Walk].speedRatio = 2;
    animationGroups[attackAnimationKey].targetedAnimations[0].animation.addEvent(
      new BABYLON.AnimationEvent(player.attackTimeToCast, function () {
        currentAnimationKey = AnimationKey.Idle;
      }),
    );

    shadowGenerator?.addShadowCaster(rootMeshes[0] as AbstractMesh);
  }

  function castSpell(currentAttack: AttackDTO) {
    const scene = rootMeshes[0]?.getScene();

    if (currentAttack && scene && player?.position) {
      const targetPosition = currentAttack.targetPosition;

      if (!particleSystem) {
        particleSystem = createParticleSystem(scene, player.attackLinearSpeed);
      }

      particleSystem.emitter = new BABYLON.Vector3(...player.position).add(
        new BABYLON.Vector3(0, 0.25, 0),
      );

      const vectorToTarget = new BABYLON.Vector3(...targetPosition).subtract(
        particleSystem.emitter,
      );
      const distanceToTarget = vectorToTarget.length();
      const directionToTarget = vectorToTarget.normalize();
      const lifeTime = distanceToTarget / player.attackLinearSpeed;

      particleSystem.direction1 = directionToTarget;
      particleSystem.direction2 = directionToTarget;
      particleSystem.minLifeTime = lifeTime;
      particleSystem.maxLifeTime = lifeTime;
      particleSystem.manualEmitCount = 3;
    }
  }

  function castSpellAsync() {
    if (player.currentAttack) {
      const currentAttackClone = Object.assign({}, player.currentAttack);
      setTimeout(
        () => castSpell(currentAttackClone),
        player.currentAttack.timeToCast * 1000,
      );
    }
  }

  function updateCameraAlpha(rotZ: number) {
    // !player.isAttacking because we don't want to rotate because of the lookAt caused by attack
    if (camera && !player.isAttacking) {
      camera.alpha = (rotZ - Math.PI / 2) * -1;
    }
  }

  $: isAssetContainerReady = Boolean(assetContainer);
  $: isShadowGeneratorReady = Boolean(shadowGenerator);
  $: {
    if (isAssetContainerReady && isShadowGeneratorReady) {
      instantiateModels();
    }
  }

  $: {
    if (camera && rootMeshes[0] && !camera.parent) {
      camera.lockedTarget = rootMeshes[0];
    }
  }

  $: rotZ = player.rotation[1];
  $: {
    updateCameraAlpha(rotZ);
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

  $: currentAttackId = player?.currentAttack?.id;
  $: {
    if (currentAttackId) {
      currentAnimationKey = attackAnimationKey;
    }
  }

  $: {
    if (currentAttackId) {
      castSpellAsync();
    }
  }

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
  {attackAnimationKey}
  {baseHighlightMesh}
  {gui}
/>

<style>
</style>
