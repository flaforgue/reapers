<script>
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import { AttackDTO, CharacterDTO } from '@reapers/game-client';
  import { createEventDispatcher } from 'svelte';
  import Attack from '../Attack/Attack.svelte';
  import { playerInfos, targetInfos } from '../../../stores';

  type CharacterAnimationKey = 'attack' | 'death' | 'idle' | 'walk';
  type NullableCharacterAnimationKey = 'loadAttack';
  type CharacterEvents = {
    loadAttack: AttackDTO;
    changeLoadingAttackCoef: AttackDTO;
    castAttack: AttackDTO;
    hitAttack: AttackDTO;
    death: undefined;
  };

  export let character: CharacterDTO = new CharacterDTO();
  export let gui: GUI.AdvancedDynamicTexture | undefined;
  export let rootMesh: BABYLON.Mesh | undefined;
  export let animationGroups: BABYLON.AnimationGroup[] = [];
  export let characterAnimationKeys: Record<CharacterAnimationKey, number> &
    Record<NullableCharacterAnimationKey, number | undefined>;

  const dispatch = createEventDispatcher<CharacterEvents>();

  let currentAnimation: BABYLON.AnimationGroup | undefined;
  let scene: BABYLON.Scene | undefined;

  function updatePosition(x = 0, y = 0, z = 0) {
    if (rootMesh) {
      rootMesh.position = new BABYLON.Vector3(x, y, z);
    }
  }

  function updateRotation(x = 0, y = 0, z = 0) {
    if (rootMesh) {
      rootMesh.rotation = new BABYLON.Vector3(x, y, z);
    }
  }

  function switchAnimation(animationKey: number) {
    currentAnimation?.reset()?.stop();

    const newAnimation = animationGroups[animationKey];
    const isAttack = animationKey === characterAnimationKeys.attack;
    const isDeath = animationKey === characterAnimationKeys.death;

    if (newAnimation) {
      const to = isAttack ? character.attackTimeToCast : newAnimation.to;
      const isLoop = !isAttack && !isDeath;

      currentAnimation = newAnimation.start(
        isLoop,
        newAnimation.speedRatio,
        newAnimation.from,
        to,
        false,
      );
    }
  }

  function setRootMeshMaterialAlpha(value: number) {
    const material = rootMesh?.getChildMeshes()[0].material;

    if (material) {
      material.alpha = value;
    }
  }

  function updateGUITargetInfos() {
    if (isAlive && rootMesh) {
      $targetInfos = {
        ...character,
        transformNode: rootMesh,
      };
    } else {
      $targetInfos = null;
    }
  }

  function registerRootMeshActions() {
    if (rootMesh) {
      rootMesh.actionManager = new BABYLON.ActionManager(rootMesh.getScene());
      rootMesh.actionManager.isRecursive = true;
      rootMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          { trigger: BABYLON.ActionManager.OnPickTrigger },
          function () {
            if ($playerInfos.canMove) {
              updateGUITargetInfos();
            }
          },
        ),
      );
      rootMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          { trigger: BABYLON.ActionManager.OnPointerOverTrigger },
          function () {
            document.body.style.cursor = 'pointer';
            setRootMeshMaterialAlpha(0.8);
          },
        ),
      );
      rootMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          { trigger: BABYLON.ActionManager.OnPointerOutTrigger },
          function () {
            document.body.style.cursor = 'default';
            setRootMeshMaterialAlpha(1);
          },
        ),
      );
    }
  }

  function registerAnimationsEvents() {
    animationGroups[
      characterAnimationKeys.attack
    ].targetedAnimations[0].animation.addEvent(
      new BABYLON.AnimationEvent(character.attackTimeToCast, function () {
        switchAnimation(characterAnimationKeys.idle);
      }),
    );
  }

  function copySceneReference() {
    if (rootMesh) {
      scene = rootMesh.getScene();
    }
  }

  function handleLoadAttack(details: CustomEvent<AttackDTO>) {
    if (characterAnimationKeys.loadAttack !== undefined) {
      switchAnimation(characterAnimationKeys.loadAttack);
    }

    dispatch('loadAttack', details.detail);
  }

  function handleCastAttack(details: CustomEvent<AttackDTO>) {
    switchAnimation(characterAnimationKeys.attack);
    dispatch('castAttack', details.detail);
  }

  $: isRootMeshReady = Boolean(rootMesh);
  $: {
    if (isRootMeshReady) {
      registerRootMeshActions();
      registerAnimationsEvents();
      copySceneReference();
    }
  }

  $: posX = character.position.x;
  $: posY = character.position.y;
  $: posZ = character.position.z;
  $: {
    if (isRootMeshReady) {
      updatePosition(posX, posY, posZ);
    }
  }

  $: rotX = character.rotation.x;
  $: rotY = character.rotation.y;
  $: rotZ = character.rotation.z;
  $: {
    if (isRootMeshReady) {
      updateRotation(rotX, rotY, rotZ);
    }
  }

  $: frontMoveDirection = character.frontMoveDirection;
  $: sideMoveDirection = character.sideMoveDirection;
  $: {
    if (isRootMeshReady && (frontMoveDirection || sideMoveDirection)) {
      switchAnimation(characterAnimationKeys.walk);
    } else {
      switchAnimation(characterAnimationKeys.idle);
    }
  }

  $: name = character.name;
  $: level = character.level;
  $: kind = character.kind;
  $: isTarget = $targetInfos?.id === character.id;
  $: isAlive = character.isAlive;
  $: lifeMin = character.life.min;
  $: lifeMax = character.life.max;
  $: lifeValue = character.life.value;
  $: {
    // this variable is used to trigger svelte reactivity
    const reactivityDeps =
      isAlive ||
      posX ||
      posY ||
      posZ ||
      kind ||
      name ||
      level ||
      lifeMin ||
      lifeMax ||
      lifeValue;

    if (isTarget && reactivityDeps) {
      updateGUITargetInfos();
    }
  }

  $: {
    if (!isAlive) {
      switchAnimation(characterAnimationKeys.death);
      dispatch('death');
    } else {
      switchAnimation(characterAnimationKeys.idle);
    }
  }
</script>

{#each character.currentAttacks as attack (attack.id)}
  <Attack
    {attack}
    {scene}
    {gui}
    on:loadAttack={handleLoadAttack}
    on:castAttack={handleCastAttack}
    on:changeLoadingAttackCoef
    on:hitAttack
  />
{/each}
