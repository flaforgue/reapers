<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import { onMount } from 'svelte';
  import { useGame, game } from '@reapers/game-client';
  import { FocusElement, focusElement, playerName } from '../../stores';
  import { servers } from '../../configs/servers.config';
  import World from './World.svelte';

  let canvas: HTMLCanvasElement | undefined;
  let engine: BABYLON.Engine | undefined;
  let scene: BABYLON.Scene | undefined;
  let camera: BABYLON.FollowCamera | undefined;

  function createCamera(scene: BABYLON.Scene): BABYLON.FollowCamera {
    const camera = new BABYLON.FollowCamera(
      'playerCamera',
      new BABYLON.Vector3(0, 2, -2),
      scene,
    );

    camera.cameraAcceleration = 0.5;
    camera.lowerRadiusLimit = 2;
    camera.radius = 5;
    camera.upperRadiusLimit = 5;

    camera.lowerHeightOffsetLimit = 1;
    camera.heightOffset = 3;
    camera.upperHeightOffsetLimit = 4;

    camera.rotationOffset = 0;

    camera.attachControl(true);

    return camera;
  }

  const { joinGame, leaveGame, updateMoveDirection, updateRotationDirection } = useGame(
    servers.game.url,
  );

  onMount(() => {
    joinGame($playerName);

    engine = new BABYLON.Engine(canvas as HTMLCanvasElement, false, {
      useHighPrecisionFloats: false,
      doNotHandleContextLost: true,
    });
    scene = new BABYLON.Scene(engine, {
      useGeometryUniqueIdsMap: true,
      useMaterialMeshMap: true,
      useClonedMeshMap: true,
    });
    scene.autoClear = false;
    scene.autoClearDepthAndStencil = false;
    camera = createCamera(scene);
    engine.runRenderLoop(function () {
      scene?.render();
    });

    const handleResize = (): void => engine?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      leaveGame();
      window.removeEventListener('resize', handleResize);
    };
  });

  $: {
    if ($focusElement === FocusElement.Game) {
      canvas?.focus();
    } else {
      canvas?.blur();
    }
  }
</script>

<div class="Game">
  <div class="engineInfos">
    {engine?.getFps().toFixed()}
  </div>
  <canvas bind:this={canvas} />
  <World world={$game.world} {scene} />
  <!-- {players.map((player) =>
    player.id === activePlayerId ? (
      <ActivePlayer
        frameIndex={frameIndex}
        key={player.id}
        scene={scene}
        player={player}
        updateMoveDirection={updateMoveDirection}
        updateRotationDirection={updateRotationDirection}
        camera={camera}
      />
    ) : (
      <Player frameIndex={frameIndex} key={player.id} scene={scene} player={player} />
    ),
  )} -->
</div>

<style>
  .Game {
    position: absolute;
    z-index: var(--game-z-index);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .Game,
  .Game canvas {
    width: 100%;
    height: 100%;
  }

  .engineInfos {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1rem;
    background-color: rgba(var(--color-black-rgb), 0.3);
    color: var(--color-white);
  }
</style>
