<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import { onMount } from 'svelte';
  import { useGame, game } from '@reapers/game-client';
  import { FocusElement, focusElement, playerName } from '../../stores';
  import { servers } from '../../configs/servers.config';
  import World from '../World/World.svelte';
  import { createCamera, createEngine, createScene } from './game.utils';

  let canvas: HTMLCanvasElement | undefined;
  let engine: BABYLON.Engine | undefined;
  let scene: BABYLON.Scene | undefined;
  let camera: BABYLON.FollowCamera | undefined;

  const { joinGame, leaveGame, updateMoveDirection, updateRotationDirection } = useGame(
    servers.game.url,
  );

  onMount(() => {
    joinGame($playerName);

    engine = createEngine(canvas as HTMLCanvasElement);
    scene = createScene(engine);
    camera = createCamera(scene);
    engine.runRenderLoop(function () {
      scene?.render();
    });

    const handleResize = () => engine?.resize();
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
