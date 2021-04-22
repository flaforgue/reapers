<script>
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import { activePlayerId, AttackDTO, AttackState } from '@reapers/game-client';
  import { createEventDispatcher, onMount } from 'svelte';
  import { createLabel } from './attack.utils';

  type AttackEvents = {
    loadAttack: AttackDTO;
    changeLoadingAttackCoef: AttackDTO;
    castAttack: AttackDTO;
    hitAttack: AttackDTO;
    cancelAttack: AttackDTO;
  };

  export let attack: AttackDTO;
  export let scene: BABYLON.Scene | undefined;
  export let gui: GUI.AdvancedDynamicTexture | undefined;

  const dispatch = createEventDispatcher<AttackEvents>();

  let isMounted = false;

  function createAttackLabel() {
    const isPlayerAttackParent = attack.parentId === $activePlayerId;
    const isPlayerAttackTarget = attack.targetId === $activePlayerId;

    if ((isPlayerAttackParent || isPlayerAttackTarget) && scene && gui) {
      const color = isPlayerAttackParent ? '#fff' : '#f63';
      const label = createLabel(attack, color, scene);

      gui.addControl(label);

      setTimeout(() => {
        label?.dispose();
      }, 500);
    }
  }

  function handleLoadAttack() {
    dispatch('loadAttack', attack);
  }

  function handleChangeLoadingAttackCoef() {
    dispatch('changeLoadingAttackCoef', attack);
  }

  function handleCastAttack() {
    dispatch('castAttack', attack);
  }

  function handleHitAttack() {
    if (attack.isParentAlive && attack.isTargetAlive) {
      dispatch('hitAttack', attack);
      setTimeout(createAttackLabel, attack.timeToHit * 1000);
    }
  }

  function handleCancelAttack() {
    dispatch('cancelAttack', attack);
  }

  onMount(function () {
    isMounted = true;
  });

  $: attackId = attack.id;
  $: attackState = attack.state;
  $: {
    if (isMounted && attackId && attackState) {
      switch (attackState) {
        case AttackState.Loading:
          handleLoadAttack();
          break;
        case AttackState.Casting:
          handleCastAttack();
          break;
        case AttackState.Hitting:
          handleHitAttack();
          break;
        case AttackState.Cancelled:
          handleCancelAttack();
          break;
      }
    }
  }

  $: damageCoef = attack.damageCoef;
  $: maxDamageCoef = attack.maxDamageCoef;
  $: {
    if (isMounted && damageCoef && maxDamageCoef) {
      handleChangeLoadingAttackCoef();
    }
  }
</script>
