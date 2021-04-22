<script>
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import { onDestroy } from 'svelte';
  import { activePlayerId, AttackDTO, CharacterDTO } from '@reapers/game-client';
  import { createVector3, disposeArray, setParticleSystemColor } from '../../../utils';
  import {
    AnimationKey,
    createLinkedLabel,
    createAttackParticleSystem,
    createLoadingAttackParticleSystem,
    getColorFromDamageCoef,
  } from './player.utils';
  import Character from '../Character/Character.svelte';
  import { playerInfos, targetInfos } from '../../../stores';

  export let assetContainer: BABYLON.AssetContainer | undefined;
  export let camera: BABYLON.ArcRotateCamera | undefined = undefined;
  export let player: CharacterDTO = new CharacterDTO();
  export let gui: GUI.AdvancedDynamicTexture | undefined;
  export let shadowGenerator: BABYLON.CascadedShadowGenerator | undefined;

  const characterAnimationKeys = {
    attack: AnimationKey.Punch,
    idle: AnimationKey.Idle,
    walk: AnimationKey.Walk,
    death: AnimationKey.Defeat,
    loadAttack: AnimationKey.Shoot,
  };

  let rootMeshes: BABYLON.Mesh[] = [];
  let skeletons: BABYLON.Skeleton[] = [];
  let animationGroups: BABYLON.AnimationGroup[] = [];
  let attackParticleSystem: BABYLON.ParticleSystem | undefined;
  let loadingAttackParticleSystem: BABYLON.ParticleSystem | undefined;
  let label: GUI.TextBlock | undefined;

  function instantiateModels() {
    const entries = assetContainer?.instantiateModelsToScene((sourceName) => {
      return `Clone of ${sourceName}`;
    }, true);

    skeletons = entries?.skeletons ?? [];
    rootMeshes = (entries?.rootNodes ?? []) as BABYLON.Mesh[];
    rootMeshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, -0.3);
    animationGroups = entries?.animationGroups ?? [];
    animationGroups[AnimationKey.Walk].speedRatio = 2;
    shadowGenerator?.addShadowCaster(rootMeshes[0] as BABYLON.AbstractMesh);
  }

  function getAttackOriginPosition() {
    return createVector3(player.position).add(rootMeshes[0].calcMovePOV(0, 0.5, 0.5));
  }

  function handleCastAttack() {
    loadingAttackParticleSystem?.stop();
  }

  function handleAttack(details: CustomEvent<AttackDTO>) {
    const scene = rootMeshes[0]?.getScene();
    const attack = details.detail;

    if (attack && scene && player?.position) {
      if (!attackParticleSystem) {
        attackParticleSystem = createAttackParticleSystem(
          scene,
          player.attackLinearSpeed,
        );
      }

      attackParticleSystem.emitter = getAttackOriginPosition();

      const directionToTarget = new BABYLON.Vector3(
        attack.targetPosition.x,
        attack.targetPosition.y + 0.25,
        attack.targetPosition.z,
      )
        .subtract(attackParticleSystem.emitter)
        .normalize();

      attackParticleSystem.direction1 = directionToTarget;
      attackParticleSystem.direction2 = directionToTarget;
      attackParticleSystem.minLifeTime = attack.timeToHit;
      attackParticleSystem.maxLifeTime = attack.timeToHit;
      attackParticleSystem.manualEmitCount = 3;

      const newEmitRate = (5000 * attack.damageCoef) / attack.maxDamageCoef;
      const newColor = getColorFromDamageCoef(attack.damageCoef, attack.maxDamageCoef);
      setParticleSystemColor(attackParticleSystem, newColor);
      for (let i = 0; i < attackParticleSystem.subEmitters.length; i++) {
        setParticleSystemColor(
          (attackParticleSystem.subEmitters[i] as BABYLON.SubEmitter).particleSystem,
          newColor,
        );
        (attackParticleSystem.subEmitters[
          i
        ] as BABYLON.SubEmitter).particleSystem.emitRate = newEmitRate;
      }
    }
  }

  function handleLoadAttack(details: CustomEvent<AttackDTO>) {
    const scene = rootMeshes[0]?.getScene();
    const attack = details.detail;

    if (attack && scene && player?.position) {
      if (!loadingAttackParticleSystem) {
        loadingAttackParticleSystem = createLoadingAttackParticleSystem(scene);
      }

      updateLoadingAttackColor(attack.damageCoef, attack.maxDamageCoef);
      loadingAttackParticleSystem.emitter = getAttackOriginPosition();
      loadingAttackParticleSystem.start();
    }
  }

  function handleDeath() {
    loadingAttackParticleSystem?.stop();
  }

  function createPlayerLabel() {
    if (rootMeshes[0] && gui) {
      label?.dispose();
      label = createLinkedLabel(`${name} • ${level}`, kind, rootMeshes[0]);
      gui.addControl(label);
    }
  }

  function updateLoadingAttackColor(coef: number, maxCoef: number) {
    if (loadingAttackParticleSystem) {
      setParticleSystemColor(
        loadingAttackParticleSystem,
        getColorFromDamageCoef(coef, maxCoef),
      );
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

  $: isAlive = player.isAlive;
  $: {
    if (!isAlive) {
      $targetInfos = null;
    }
  }

  $: name = player.name;
  $: level = player.level;
  $: kind = player.kind;
  $: isRootMeshReady = Boolean(rootMeshes[0]);
  $: {
    if (isRootMeshReady && gui && name && level && kind) {
      createPlayerLabel();
    }
  }

  $: currentAttackDamageCoef = player.currentAttack?.damageCoef;
  $: maxAttackDamageCoef = player.currentAttack?.maxDamageCoef;
  $: {
    if (currentAttackDamageCoef && maxAttackDamageCoef) {
      updateLoadingAttackColor(currentAttackDamageCoef, maxAttackDamageCoef);
    }
  }

  onDestroy(() => {
    const particleSystems = (attackParticleSystem?.subEmitters ?? []).map(
      (s) => (s as BABYLON.SubEmitter).particleSystem,
    );
    disposeArray(particleSystems);
    attackParticleSystem?.dispose();
    loadingAttackParticleSystem?.dispose();
    disposeArray(animationGroups);
    disposeArray(rootMeshes);
    disposeArray(skeletons);
    label?.dispose();
  });
</script>

<Character
  rootMesh={rootMeshes[0]}
  character={player}
  {animationGroups}
  on:attack={handleAttack}
  on:loadAttack={handleLoadAttack}
  on:castAttack={handleCastAttack}
  on:death={handleDeath}
  {characterAnimationKeys}
  {gui}
/>
