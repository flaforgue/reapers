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
    resetCamera,
  } from './PlayerController.utils';

  export let updateFrontMoveDirection: (direction: FrontMoveDirection) => void;
  export let updateSideMoveDirection: (direction: SideMoveDirection) => void;
  export let updateRotationDirection: (direction: RotationDirection) => void;
  export let attack: (targetId: string) => void;
  export let player: CharacterDTO | undefined;
  export let scene: BABYLON.Scene | undefined;
  export let camera: BABYLON.ArcRotateCamera | undefined;

  let keyboardEventObserver:
    | BABYLON.Nullable<BABYLON.Observer<BABYLON.KeyboardInfo>>
    | undefined;

  function localUpdateRotationDirection(direction: RotationDirection) {
    const isAlreadyResetting = camera?.animations?.length;

    if (camera && camera.alpha !== -Math.PI / 2 && !isAlreadyResetting) {
      resetCamera(camera);
    }

    updateRotationDirection(direction);
  }

  function localAttack() {
    if ($targetInfos?.position && player) {
      const vectorToTarget = $targetInfos.position.subtract(
        new BABYLON.Vector3(...player.position),
      );
      const distanceToTarget = vectorToTarget.length();

      if (distanceToTarget <= player.attackRange) {
        attack($targetInfos.id);
      }
    }
  }

  function keyboardEventHandler({ type, event }: BABYLON.KeyboardInfo) {
    if (type === BABYLON.KeyboardEventTypes.KEYDOWN) {
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
          localAttack();
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
