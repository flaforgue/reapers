<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import { onDestroy } from 'svelte';
  import {
    SideMoveDirection,
    FrontMoveDirection,
    CharacterDTO,
    CharacterKind,
  } from '@reapers/game-client';
  import { targetInfos } from '../../../stores';
  import { Key } from '../../../configs/keycodes.config';
  import {
    createHighlightMesh,
    createRangeParticleSytem,
    isFrontMoveDirection,
    isSideMoveDirection,
  } from './PlayerController.utils';

  export let updateFrontMoveDirection: (direction: FrontMoveDirection) => void;
  export let updateSideMoveDirection: (direction: SideMoveDirection) => void;
  export let updateRotation: (rotY: number) => void;
  export let castSpell: (targetId: string) => void;
  export let player: CharacterDTO | undefined;
  export let camera: BABYLON.ArcRotateCamera | undefined;
  export let scene: BABYLON.Scene | undefined;

  const activeMeshRadius: Record<CharacterKind, number> = {
    [CharacterKind.Player]: 1.5,
    [CharacterKind.Frog]: 2.5,
    [CharacterKind.Spider]: 3.5,
  };

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
      } else if (rangeParticleSystem && !rangeParticleSystem.isAlive()) {
        rangeParticleSystem.emitter = new BABYLON.Vector3(
          player.position.x,
          0.5,
          player.position.z,
        );
        rangeParticleSystem.manualEmitCount = 100;
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

      if ($targetInfos) {
        highlightMesh.position.x = 0;
        highlightMesh.position.y = 0.001;
        highlightMesh.position.z = 0;
        highlightMesh.animations[0].setKeys([
          {
            frame: 0,
            value: new BABYLON.Vector3().setAll(0),
          },
          {
            frame: 10,
            value: new BABYLON.Vector3().setAll(activeMeshRadius[$targetInfos.kind]),
          },
          {
            frame: 20,
            value: new BABYLON.Vector3().setAll(
              activeMeshRadius[$targetInfos.kind] * 0.7,
            ),
          },
          {
            frame: 30,
            value: new BABYLON.Vector3().setAll(activeMeshRadius[$targetInfos.kind]),
          },
        ]);
        scene?.beginAnimation(highlightMesh, 0, 100);
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
