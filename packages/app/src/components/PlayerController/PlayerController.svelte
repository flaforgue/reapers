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
    createParticleSystem,
  } from './PlayerController.utils';

  export let updateFrontMoveDirection: (direction: FrontMoveDirection) => void;
  export let updateSideMoveDirection: (direction: SideMoveDirection) => void;
  export let updateRotationDirection: (direction: RotationDirection) => void;
  export let player: CharacterDTO | undefined;
  export let scene: BABYLON.Scene | undefined;
  export let camera: BABYLON.FollowCamera | undefined;

  let ps: BABYLON.ParticleSystem | undefined;
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

  function localAttack() {
    if ($targetInfos?.position && scene && player?.position) {
      if (!ps) {
        ps = createParticleSystem(scene);
      }

      // send attack socket message with target id
      // backend checks if attack is possible based on distance and maxRange
      // if possible, instant rotate the player to the target and send success response
      // callback on success :
      // ps.emitter = new BABYLON.Vector3(...player.position);
      // ps.manualEmitCount = 1;

      // the particle must disappear when reaching target
      // the target must lose life when hit by particle
      // the particle must be beautiful
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
    ps?.dispose();
  });
</script>
