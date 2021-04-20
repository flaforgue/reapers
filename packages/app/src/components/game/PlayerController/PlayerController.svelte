<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import { onDestroy } from 'svelte';
  import {
    SideMoveDirection,
    FrontMoveDirection,
    CharacterDTO,
  } from '@reapers/game-client';
  import { targetInfos } from '../../../stores';
  import { Key } from '../../../configs/keycodes.config';
  import {
    createHighlightMesh,
    createRangeParticleSytem,
    isFrontMoveDirection,
    isSideMoveDirection,
  } from './PlayerController.utils';
  import charactersConfig from '../../../configs/characters.config';

  export let updateFrontMoveDirection: (direction: FrontMoveDirection) => void;
  export let updateSideMoveDirection: (direction: SideMoveDirection) => void;
  export let updateRotation: (rotY: number) => void;
  export let castSpell: (targetId: string) => void;
  export let player: CharacterDTO | undefined;
  export let camera: BABYLON.ArcRotateCamera | undefined;
  export let scene: BABYLON.Scene | undefined;

  let rangeParticleSystem: BABYLON.ParticleSystem | undefined;
  let highlightMesh: BABYLON.Mesh | undefined;
  let keyboardEventObserver:
    | BABYLON.Nullable<BABYLON.Observer<BABYLON.KeyboardInfo>>
    | undefined;

  function localUpdateRotation(rotY: number) {
    if (player?.canMove) {
      updateRotation(rotY);
    }
  }

  function localCastSpell() {
    if (!player?.canMove || !player) {
      return;
    }

    const distanceToTarget = $targetInfos?.position
      ? BABYLON.Vector3.Distance(
          new BABYLON.Vector3(player.position.x, player.position.y, player.position.z),
          new BABYLON.Vector3(
            $targetInfos.position.x,
            $targetInfos.position.y,
            $targetInfos.position.z,
          ),
        )
      : player.attackRange + 1; // if no target, consider out of range

    if (distanceToTarget <= player.attackRange) {
      return castSpell($targetInfos?.id as string);
    } else if (rangeParticleSystem && !rangeParticleSystem.isAlive()) {
      rangeParticleSystem.emitter = new BABYLON.Vector3(
        player.position.x,
        player.position.y + 1,
        player.position.z,
      );
      rangeParticleSystem.manualEmitCount = 100;
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

  function initController() {
    if (scene && player) {
      keyboardEventObserver = scene?.onKeyboardObservable?.add(keyboardEventHandler);
      highlightMesh = createHighlightMesh(scene);
      rangeParticleSystem = createRangeParticleSytem(scene, player.attackRange);
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
    rangeParticleSystem?.dispose();
    highlightMesh?.dispose();
  });
</script>
