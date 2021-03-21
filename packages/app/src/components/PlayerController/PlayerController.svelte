<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import { MoveDirection, RotationDirection } from '@reapers/game-client';
  import { Key } from '../../configs/keycodes.config';
  import { onDestroy } from 'svelte';
  import {
    isMoveDirection,
    isRotationDirection,
    resetCamera,
  } from './PlayerController.utils';

  export let updateMoveDirection: (direction: MoveDirection) => void;
  export let updateRotationDirection: (direction: RotationDirection) => void;
  export let scene: BABYLON.Scene | undefined;
  export let camera: BABYLON.FollowCamera | undefined;

  let keyboardEventObserver:
    | BABYLON.Nullable<BABYLON.Observer<BABYLON.KeyboardInfo>>
    | undefined;

  function localUpdateRotationDirection(direction: RotationDirection) {
    const isAlreadyResetting = camera?.animations?.length;

    if (camera && camera.rotationOffset !== 0 && !isAlreadyResetting) {
      resetCamera(camera);
    }

    updateRotationDirection(direction);
  }

  function keyboardEventHandler({ type, event }: BABYLON.KeyboardInfo) {
    if (type === BABYLON.KeyboardEventTypes.KEYDOWN) {
      switch (event.key) {
        case Key.z:
          updateMoveDirection(MoveDirection.Forward);
          break;
        case Key.s:
          updateMoveDirection(MoveDirection.Backward);
          break;
        case Key.a:
          updateMoveDirection(MoveDirection.Left);
          break;
        case Key.e:
          updateMoveDirection(MoveDirection.Right);
          break;
        case Key.d:
          localUpdateRotationDirection(RotationDirection.Right);
          break;
        case Key.q:
          localUpdateRotationDirection(RotationDirection.Left);
          break;
        default:
          break;
      }
    } else {
      if (isMoveDirection(event.key)) {
        updateMoveDirection(MoveDirection.None);
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
