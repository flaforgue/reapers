<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import {
    SideMoveDirection,
    FrontMoveDirection,
    RotationDirection,
    CharacterDTO,
  } from '@reapers/game-client';
  import { onDestroy } from 'svelte';
  import { targetInfos } from '../../stores';
  import { Key } from '../../configs/keycodes.config';
  import {
    isFrontMoveDirection,
    isSideMoveDirection,
    isRotationDirection,
  } from './PlayerController.utils';

  export let updateFrontMoveDirection: (direction: FrontMoveDirection) => void;
  export let updateSideMoveDirection: (direction: SideMoveDirection) => void;
  export let updateRotationDirection: (direction: RotationDirection) => void;
  export let castSpell: (targetId: string) => void;
  export let player: CharacterDTO | undefined;
  export let scene: BABYLON.Scene | undefined;

  let keyboardEventObserver:
    | BABYLON.Nullable<BABYLON.Observer<BABYLON.KeyboardInfo>>
    | undefined;

  function localUpdateRotationDirection(direction: RotationDirection) {
    if (player?.canMove) {
      updateRotationDirection(direction);
    }
  }

  function localCastSpell() {
    if (player?.canMove && $targetInfos?.position && player) {
      const distanceToTarget = BABYLON.Vector3.Distance(
        new BABYLON.Vector3(player.position.x, player.position.y, player.position.z),
        new BABYLON.Vector3(
          $targetInfos.position.x,
          $targetInfos.position.y,
          $targetInfos.position.z,
        ),
      );

      if (distanceToTarget <= player.attackRange) {
        castSpell($targetInfos.id);
      } else {
        console.info('Out of attack range');
      }
    }
  }

  function keyboardEventHandler({ type, event }: BABYLON.KeyboardInfo) {
    if (player?.canMove && type === BABYLON.KeyboardEventTypes.KEYDOWN) {
      switch (event.key) {
        case Key.z:
          updateFrontMoveDirection(FrontMoveDirection.Forward);
          break;
        case Key.s:
          updateFrontMoveDirection(FrontMoveDirection.Backward);
          break;
        case Key.a:
          updateSideMoveDirection(SideMoveDirection.Left);
          break;
        case Key.e:
          updateSideMoveDirection(SideMoveDirection.Right);
          break;
        case Key.d:
          localUpdateRotationDirection(RotationDirection.Right);
          break;
        case Key.q:
          localUpdateRotationDirection(RotationDirection.Left);
          break;
        case Key.Space:
          localCastSpell();
          break;
        default:
          break;
      }
    } else {
      if (isFrontMoveDirection(event.key)) {
        updateFrontMoveDirection(FrontMoveDirection.None);
      } else if (isSideMoveDirection(event.key)) {
        updateSideMoveDirection(SideMoveDirection.None);
      } else if (isRotationDirection(event.key)) {
        updateRotationDirection(RotationDirection.None);
      }
    }
  }

  $: {
    keyboardEventObserver = scene?.onKeyboardObservable?.add(keyboardEventHandler);
  }

  onDestroy(() => {
    scene?.onKeyboardObservable?.remove(keyboardEventObserver ?? null);
  });
</script>
