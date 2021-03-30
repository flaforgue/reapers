<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import { onMount } from 'svelte';
  import { useGame, game, activePlayerId, CharacterKind } from '@reapers/game-client';
  import { FocusElement, focusElement, playerName } from '../../stores';
  import { servers } from '../../configs/servers.config';
  import World from '../World/World.svelte';
  import PlayerController from '../PlayerController/PlayerController.svelte';
  import { createCamera, createEngine, createGUI, createScene } from './game.utils';
  import Character from '../Character/Character.svelte';
  import { showAxis } from '../../utils';

  let engine: BABYLON.Engine | undefined;
  let gameCamera: BABYLON.FollowCamera | undefined;
  let gameCanvas: HTMLCanvasElement | undefined;
  let gameScene: BABYLON.Scene | undefined;
  let characterAssetContainers: Record<
    CharacterKind,
    BABYLON.AssetContainer | undefined
  > = {
    [CharacterKind.Player]: undefined,
    [CharacterKind.Spider]: undefined,
    [CharacterKind.Frog]: undefined,
  };
  let gui: GUI.AdvancedDynamicTexture | undefined;
  let shadowGenerator: BABYLON.ShadowGenerator | undefined;

  function loadAssets() {
    for (let kind of Object.values(CharacterKind)) {
      BABYLON.SceneLoader.LoadAssetContainer(
        '/models/',
        `characters/${kind}.glb`,
        gameScene,
        (result) => {
          result.meshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, -0.3);
          result.meshes[0].rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
          for (let i = 0; i < result.animationGroups.length; i++) {
            result.animationGroups[i].reset().stop();
          }

          characterAssetContainers[kind] = result;
        },
      );
    }
  }

  const {
    joinGame,
    leaveGame,
    updateSideMoveDirection,
    updateFrontMoveDirection,
    updateRotationDirection,
  } = useGame(servers.game.url);

  onMount(() => {
    joinGame($playerName);
    engine = createEngine(gameCanvas as HTMLCanvasElement);
    gameScene = createScene(engine);

    showAxis(10, gameScene);

    gameCamera = createCamera(gameScene);
    gui = createGUI();

    loadAssets();

    engine.runRenderLoop(function () {
      try {
        gameScene?.render();
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

      for (let kind in characterAssetContainers) {
        characterAssetContainers[kind as CharacterKind]?.removeAllFromScene();
      }

      shadowGenerator?.dispose();
      gameCamera?.dispose();
      gameScene?.dispose();
      engine?.dispose();
      window.removeEventListener('resize', handleResize);
    };
  });

  $: {
    if ($focusElement === FocusElement.Game) {
      gameCanvas?.focus();
    } else {
      gameCanvas?.blur();
    }
  }

  function handleLightChanged(details: CustomEvent<BABYLON.DirectionalLight>) {
    shadowGenerator?.dispose();
    shadowGenerator = new BABYLON.ShadowGenerator(1024, details.detail);
    shadowGenerator.usePercentageCloserFiltering = true;
    shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;
    shadowGenerator.setDarkness(0.6);
  }
</script>

<div class="Game">
  <div class="engineInfos">
    {engine?.getFps().toFixed()}
  </div>
  <canvas bind:this={gameCanvas} />
  <World world={$game.world} scene={gameScene} on:lightChanged={handleLightChanged} />
  <PlayerController
    camera={gameCamera}
    scene={gameScene}
    {updateFrontMoveDirection}
    {updateSideMoveDirection}
    {updateRotationDirection}
  />

  {#each $game.players as player}
    <Character
      {shadowGenerator}
      {gui}
      assetContainer={characterAssetContainers[player.kind]}
      character={player}
      camera={player.id === $activePlayerId ? gameCamera : undefined}
    />
  {/each}

  {#each $game.nests as nest}
    {#each nest.monsters as monster}
      <Character
        {shadowGenerator}
        {gui}
        assetContainer={characterAssetContainers[monster.kind]}
        character={monster}
      />
    {/each}
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
