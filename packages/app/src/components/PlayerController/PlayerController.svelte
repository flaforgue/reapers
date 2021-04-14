<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import {
    SideMoveDirection,
    FrontMoveDirection,
    CharacterDTO,
  } from '@reapers/game-client';
  import { onDestroy } from 'svelte';
  import { targetInfos } from '../../stores';
  import { Key } from '../../configs/keycodes.config';
  import { isFrontMoveDirection, isSideMoveDirection } from './PlayerController.utils';

  export let updateFrontMoveDirection: (direction: FrontMoveDirection) => void;
  export let updateSideMoveDirection: (direction: SideMoveDirection) => void;
  export let updateRotation: (rotY: number) => void;
  export let castSpell: (targetId: string) => void;
  export let player: CharacterDTO | undefined;
  export let camera: BABYLON.ArcRotateCamera | undefined;
  export let scene: BABYLON.Scene | undefined;

  let keyboardEventObserver:
    | BABYLON.Nullable<BABYLON.Observer<BABYLON.KeyboardInfo>>
    | undefined;

  function localUpdateRotation(rotY: number) {
    if (player?.canMove) {
      updateRotation(rotY);
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
      }
    }
  }

  function attachCameraObservables() {
    if (camera) {
      (camera.inputs.attached
        .keyboard as BABYLON.ArcRotateCameraKeyboardMoveInput).angularSpeed = 0.005;
      camera.attachControl(true);
      camera.keysLeft = [68];
      camera.keysRight = [81];
      camera.onViewMatrixChangedObservable.add(function (eventData) {
        const newAlpha = (eventData as BABYLON.ArcRotateCamera).alpha;
        const newRotation = Math.PI / 2 - newAlpha;

        if (Math.abs(newRotation - (player?.rotation?.y ?? 0)) >= 0.07) {
          localUpdateRotation(newRotation);
        }
      });
    }
  }

  $: {
    keyboardEventObserver = scene?.onKeyboardObservable?.add(keyboardEventHandler);
  }

  $: cameraId = camera?.id;
  $: {
    if (cameraId) {
      attachCameraObservables();
    }
  }

  onDestroy(() => {
    scene?.onKeyboardObservable?.remove(keyboardEventObserver ?? null);
  });
</script>
