<script>
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import { onDestroy } from 'svelte';
  import { activePlayerId, AttackDTO, CharacterDTO } from '@reapers/game-client';
  import { targetInfos } from '../../../stores';
  import { createAttackLabel, animateAttackLabel } from './character.utils';

  type CharacterAnimationKey = 'attack' | 'death' | 'idle' | 'walk';

  export let character: CharacterDTO = new CharacterDTO();
  export let gui: GUI.AdvancedDynamicTexture | undefined;
  export let rootMesh: BABYLON.Mesh | undefined;
  export let animationGroups: BABYLON.AnimationGroup[] = [];
  export let characterAnimationKeys: Record<CharacterAnimationKey, number>;
  export let attack: (attack: AttackDTO) => void = () => {
    console.warn('props attack uses default empty value');
  };

  let highlightMesh: BABYLON.Mesh | undefined;
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
            updateGUITargetInfos();
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

  function createCurrentAttackLabelAsync(currentAttackClone: AttackDTO) {
    const isPlayerAttackParent = character.id === $activePlayerId;
    const isPlayerAttackTarget = currentAttackClone.targetId === $activePlayerId;

    if ((isPlayerAttackParent || isPlayerAttackTarget) && rootMesh && gui) {
      const color = isPlayerAttackParent ? '#fff' : '#f63';
      const attackLabel = createAttackLabel(
        currentAttackClone,
        color,
        rootMesh.getScene(),
      );

      setTimeout(() => {
        if (character.isAlive && currentAttackClone.isTargetAlive && gui && rootMesh) {
          gui.addControl(attackLabel);
          animateAttackLabel(attackLabel, rootMesh.getScene());
        }

        setTimeout(() => {
          attackLabel?.dispose();
        }, 500);
        // :todo + 0.2 is arbitrary (maybe the particle maxLife is not sync with real time)
      }, (currentAttackClone.timeToCast + currentAttackClone.timeToHit + 0.2) * 1000);
    }
  }

  function attackAsync() {
    if (character.currentAttack) {
      const currentAttackClone = Object.assign({}, character.currentAttack);

      createCurrentAttackLabelAsync(currentAttackClone);

      setTimeout(() => {
        if (character.isAlive && currentAttackClone.isTargetAlive) {
          attack(currentAttackClone);
        }
      }, character.currentAttack.timeToCast * 1000);
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
    } else if (highlightMesh) {
      highlightMesh.dispose();
      highlightMesh = undefined;
    }
  }

  $: {
    if (!isAlive) {
      switchAnimation(characterAnimationKeys.death);
    } else {
      switchAnimation(characterAnimationKeys.idle);
    }
  }

  $: currentAttackId = character?.currentAttack?.id;
  $: {
    if (currentAttackId) {
      switchAnimation(characterAnimationKeys.attack);
      attackAsync();
    }
  }

  onDestroy(() => {
    highlightMesh?.dispose();
  });
</script>
