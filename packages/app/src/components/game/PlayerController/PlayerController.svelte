<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import { createEventDispatcher, onDestroy } from 'svelte';
  import {
    SideMoveDirection,
    FrontMoveDirection,
    CharacterDTO,
  } from '@reapers/game-client';
  import { targetInfos } from '../../../stores';
  import { Key } from '../../../configs/keycodes.config';
  import {
    createHighlightMesh,
    createRangeMesh,
    isFrontMoveDirection,
    isSideMoveDirection,
  } from './PlayerController.utils';
  import charactersConfig from '../../../configs/characters.config';
  import { createVector3 } from '../../../utils';

  type PlayerControllerEvents = {
    frontMoveDirectionChange: FrontMoveDirection;
    sideMoveDirectionChange: SideMoveDirection;
    rotationChange: number;
    loadAttack: string;
    performAttack: undefined;
    cancelAttack: undefined;
  };

  export let player: CharacterDTO | undefined;
  export let camera: BABYLON.ArcRotateCamera | undefined;
  export let scene: BABYLON.Scene | undefined;
  export let groundMesh: BABYLON.GroundMesh | undefined;

  const dispatch = createEventDispatcher<PlayerControllerEvents>();

  let rangeMesh: BABYLON.Mesh | undefined;
  let highlightMesh: BABYLON.Mesh | undefined;
  let keyboardEventObserver:
    | BABYLON.Nullable<BABYLON.Observer<BABYLON.KeyboardInfo>>
    | undefined;

  function localUpdateRotation(rotY: number) {
    if (player?.canMove) {
      dispatch('rotationChange', rotY);
    }
  }

  function localLoadAttack() {
    if (!player?.canMove) {
      return;
    }

    const distanceToTarget = $targetInfos?.position
      ? BABYLON.Vector3.Distance(
          createVector3(player.position),
          createVector3($targetInfos.position),
        )
      : player.attackRange + 1; // if no target, consider out of range

    if (distanceToTarget <= player.attackRange) {
      return dispatch('loadAttack', $targetInfos?.id as string);
    } else if (groundMesh) {
      rangeMesh?.dispose();
      rangeMesh = createRangeMesh(groundMesh, player.position, player.attackRange);
      setTimeout(() => rangeMesh?.dispose(), 500);
    }
  }

  function localPerformAttack() {
    if (player?.isAttacking) {
      dispatch('performAttack');
    }
  }

  function localCancelAttack() {
    if (player?.isAttacking) {
      dispatch('cancelAttack');
    }
  }

  function keyboardEventHandler({ type, event }: BABYLON.KeyboardInfo) {
    if (type === BABYLON.KeyboardEventTypes.KEYDOWN) {
      if (event.key === Key.Escape) {
        $targetInfos = null;
        localCancelAttack();
      } else if (player?.canMove) {
        switch (event.key) {
          case Key.z:
            dispatch('frontMoveDirectionChange', FrontMoveDirection.Forward);
            break;
          case Key.s:
            dispatch('frontMoveDirectionChange', FrontMoveDirection.Backward);
            break;
          case Key.a:
            dispatch('sideMoveDirectionChange', SideMoveDirection.Left);
            break;
          case Key.e:
            dispatch('sideMoveDirectionChange', SideMoveDirection.Right);
            break;
          case Key.Space:
            localLoadAttack();
            break;
          default:
            break;
        }
      }
    } else if (player) {
      if (isFrontMoveDirection(event.key)) {
        dispatch('frontMoveDirectionChange', FrontMoveDirection.None);
      } else if (isSideMoveDirection(event.key)) {
        dispatch('sideMoveDirectionChange', SideMoveDirection.None);
      } else if (event.key === Key.Space) {
        localPerformAttack();
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

  function initController() {
    if (scene && player) {
      keyboardEventObserver = scene?.onKeyboardObservable?.add(keyboardEventHandler);
      highlightMesh = createHighlightMesh(scene);
    }
  }

  function setHighlightMeshParent(id: string | undefined) {
    if (highlightMesh) {
      highlightMesh.setEnabled(Boolean($targetInfos?.id));
      highlightMesh.setParent($targetInfos?.transformNode ?? null);

      if ($targetInfos && id) {
        highlightMesh.position.x = 0;
        highlightMesh.position.y = charactersConfig[$targetInfos.kind].labelHeight + 3;
        highlightMesh.position.z = 0;
        scene?.beginAnimation(highlightMesh, 0, 100, true);
      }
    }
  }

  $: isPlayerReady = Boolean(player?.id);
  $: {
    if (scene && isPlayerReady) {
      initController();
    }
  }

  $: cameraId = camera?.id;
  $: {
    if (cameraId) {
      attachCameraObservables();
    }
  }

  $: targetInfosId = $targetInfos?.id;
  $: {
    setHighlightMeshParent(targetInfosId);
  }

  onDestroy(() => {
    scene?.onKeyboardObservable?.remove(keyboardEventObserver ?? null);
    rangeMesh?.dispose();
    highlightMesh?.dispose();
  });
</script>
