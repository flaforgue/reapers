<script>
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import { onDestroy } from 'svelte';
  import { activePlayerId, AttackDTO, CharacterDTO } from '@reapers/game-client';
  import { disposeArray } from '../../utils';
  import { AnimationKey, createParticleSystem, resetCamera } from './player.utils';
  import Character from '../Character/Character.svelte';
  import { playerInfos } from '../../stores';

  export let assetContainer: BABYLON.AssetContainer | undefined;
  export let baseHighlightMesh: BABYLON.Mesh | undefined;
  export let camera: BABYLON.ArcRotateCamera | undefined = undefined;
  export let player: CharacterDTO = new CharacterDTO();
  export let gui: GUI.AdvancedDynamicTexture | undefined;
  export let shadowGenerator: BABYLON.CascadedShadowGenerator | undefined;

  const characterAnimationKeys = {
    attack: AnimationKey.Punch,
    idle: AnimationKey.Idle,
    walk: AnimationKey.Walk,
    death: AnimationKey.Defeat,
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
    animationGroups = entries?.animationGroups ?? [];
    animationGroups[AnimationKey.Walk].speedRatio = 2;
    shadowGenerator?.addShadowCaster(rootMeshes[0] as BABYLON.AbstractMesh);
  }

  function attack(currentAttack: AttackDTO) {
    const scene = rootMeshes[0]?.getScene();

    if (currentAttack && scene && player?.position) {
      const targetPosition = currentAttack.targetPosition;

      if (!particleSystem) {
        particleSystem = createParticleSystem(scene, player.attackLinearSpeed);
      }

      particleSystem.emitter = new BABYLON.Vector3(
        player.position.x,
        player.position.y,
        player.position.z,
      ).add(new BABYLON.Vector3(0, 0.25, 0));

      const directionToTarget = new BABYLON.Vector3(
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
      )
        .subtract(particleSystem.emitter)
        .normalize();

      particleSystem.direction1 = directionToTarget;
      particleSystem.direction2 = directionToTarget;
      particleSystem.minLifeTime = currentAttack.timeToHit;
      particleSystem.maxLifeTime = currentAttack.timeToHit;
      particleSystem.manualEmitCount = 3;
    }
  }

  function updateCameraAlpha(rotZ: number) {
    const isAlreadyResetting = camera?.animations?.length;
    /*
     * When attacking, the game server calls lookAt on player to look at the target
     * in that case player.isAttacking = true and we don't want the camera to rotate
     */
    if (camera?.metadata?.isDirty && !isAlreadyResetting && !player.isAttacking) {
      resetCamera(camera, rotZ);
    }
  }

  function updatePlayerInfos() {
    $playerInfos = player;
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

  $: rotY = player.rotation.y;
  $: {
    updateCameraAlpha(rotY);
  }

  $: isActivePlayer = player.id === $activePlayerId;
  $: playerName = player.name;
  $: playerLevel = player.level;
  $: lifeMin = player.life.min;
  $: lifeMax = player.life.max;
  $: lifeValue = player.life.value;
  $: {
    // this variable is used to trigger svelte reactivity
    const reactivityDeps = lifeMin || lifeMax || lifeValue || playerName || playerLevel;

    if (isActivePlayer && reactivityDeps) {
      updatePlayerInfos();
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
  {attack}
  {characterAnimationKeys}
  {baseHighlightMesh}
  {gui}
/>

<style>
</style>
