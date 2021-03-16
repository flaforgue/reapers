<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import { onMount } from 'svelte';
  import { useGame, game, activePlayerId } from '@reapers/game-client';
  import { FocusElement, focusElement, playerName } from '../../stores';
  import { servers } from '../../configs/servers.config';
  import World from '../World/World.svelte';
  import PlayerController from '../PlayerController/PlayerController.svelte';
  import { createCamera, createEngine, createScene } from './game.utils';
  import Character from '../Character/Character.svelte';

  let canvas: HTMLCanvasElement | undefined;
  let engine: BABYLON.Engine | undefined;
  let scene: BABYLON.Scene | undefined;
  let camera: BABYLON.FollowCamera | undefined;
  let playerAssetContainer: BABYLON.AssetContainer | undefined;
  let monsterAssetContainer: BABYLON.AssetContainer | undefined;

  function loadAssets() {
    BABYLON.SceneLoader.LoadAssetContainer(
      '/models/',
      'characters/player.glb',
      scene,
      (result) => {
        result.meshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, -0.3);
        result.meshes[0].rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
        for (let i = 0; i < result.animationGroups.length; i++) {
          result.animationGroups[i].reset().stop();
        }

        playerAssetContainer = result;
      },
    );

    BABYLON.SceneLoader.LoadAssetContainer(
      '/models/',
      'monsters/spider.glb',
      scene,
      (result) => {
        result.meshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, -0.3);
        result.meshes[0].rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
        for (let i = 0; i < result.animationGroups.length; i++) {
          result.animationGroups[i].reset().stop();
        }

        monsterAssetContainer = result;
      },
    );
  }

  const { joinGame, leaveGame, updateMoveDirection, updateRotationDirection } = useGame(
    servers.game.url,
  );

  onMount(() => {
    joinGame($playerName);

    engine = createEngine(canvas as HTMLCanvasElement);
    scene = createScene(engine);
    camera = createCamera(scene);
    loadAssets();
    engine.runRenderLoop(function () {
      try {
        scene?.render();
      } catch (err) {
        console.error(err);
      }
    });

    function handleResize() {
      return engine?.resize();
    }

    window.addEventListener('resize', handleResize);

    return () => {
      leaveGame();
      playerAssetContainer?.removeAllFromScene();
      monsterAssetContainer?.removeAllFromScene();
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
  <PlayerController {scene} {updateMoveDirection} {updateRotationDirection} />

  {#each $game.players as player}
    <Character
      assetContainer={playerAssetContainer}
      character={player}
      camera={player.id === $activePlayerId ? camera : undefined}
    />
  {/each}

  {#each $game.monsters as monster}
    <Character assetContainer={monsterAssetContainer} character={monster} />
  {/each}
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
