<script>
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import {
    activePlayerId,
    AttackDTO,
    AttackState,
    CharacterDTO,
  } from '@reapers/game-client';
  import { createEventDispatcher } from 'svelte';
  import { playerInfos, targetInfos } from '../../../stores';
  import { createAttackLabel } from './character.utils';

  type CharacterAnimationKey = 'attack' | 'death' | 'idle' | 'walk';
  type NullableCharacterAnimationKey = 'loadAttack';
  type CharacterEvents = {
    attack: AttackDTO;
    loadAttack: AttackDTO;
    castAttack: undefined;
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

  function createCurrentAttackLabel() {
    if (character.currentAttack) {
      const isPlayerAttackParent = character.id === $activePlayerId;
      const isPlayerAttackTarget = character.currentAttack.targetId === $activePlayerId;

      if ((isPlayerAttackParent || isPlayerAttackTarget) && rootMesh && gui) {
        const color = isPlayerAttackParent ? '#fff' : '#f63';
        const attackLabel = createAttackLabel(
          character.currentAttack,
          color,
          rootMesh.getScene(),
        );

        gui.addControl(attackLabel);

        setTimeout(() => {
          attackLabel?.dispose();
        }, 500);
      }
    }
  }

  function handleAttackLoading() {
    if (character.currentAttack) {
      if (characterAnimationKeys.loadAttack !== undefined) {
        switchAnimation(characterAnimationKeys.loadAttack);
      }

      dispatch('loadAttack', character.currentAttack);
    }
  }

  function handleAttackCasting() {
    switchAnimation(characterAnimationKeys.attack);
    dispatch('castAttack');
  }

  function handleAttackHitting() {
    if (character.isAlive && character.currentAttack?.isTargetAlive) {
      dispatch('attack', character.currentAttack);
      setTimeout(createCurrentAttackLabel, character.currentAttack.timeToHit * 1000);
    }
  }

  $: isRootMeshReady = Boolean(rootMesh);
  $: {
    if (isRootMeshReady) {
      registerRootMeshActions();
      registerAnimationsEvents();
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

  $: currentAttackId = character?.currentAttack?.id;
  $: currentAttackState = character?.currentAttack?.state;
  $: {
    if (currentAttackId && currentAttackState) {
      switch (currentAttackState) {
        case AttackState.Loading:
          handleAttackLoading();
          break;
        case AttackState.Casting:
          handleAttackCasting();
          break;
        case AttackState.Hitting:
          handleAttackHitting();
          break;
      }
    }
  }
</script>
