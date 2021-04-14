<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import { onMount } from 'svelte';
  import { useGame, game, activePlayerId, CharacterKind } from '@reapers/game-client';
  import {
    FocusElement,
    focusElement,
    playerInfos,
    playerName,
    targetInfos,
  } from '../../stores';
  import { servers } from '../../configs/servers.config';
  import { Key } from '../../configs/keycodes.config';
  import World from '../World/World.svelte';
  import Player from '../Player/Player.svelte';
  import Monster from '../Monster/Monster.svelte';
  import PlayerController from '../PlayerController/PlayerController.svelte';
  import {
    createBaseActiveMesh,
    createCamera,
    createEngine,
    createGUI,
    createScene,
    showAxis,
  } from './game.utils';
  import { Scene } from '@babylonjs/core';

  let engine: BABYLON.Engine | undefined;
  let gameCamera: BABYLON.ArcRotateCamera | undefined;
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
  let baseHighlightMesh: BABYLON.Mesh | undefined;
  let gui: GUI.AdvancedDynamicTexture | undefined;
  let shadowGenerator: BABYLON.CascadedShadowGenerator | undefined;

  function keyboardEventHandler({ type, event }: BABYLON.KeyboardInfo) {
    if (type === BABYLON.KeyboardEventTypes.KEYDOWN && event.key === Key.Escape) {
      $targetInfos = null;
    }
  }

  function loadAssets() {
    for (let kind of Object.values(CharacterKind)) {
      BABYLON.SceneLoader.LoadAssetContainer(
        '/models/',
        `characters/${kind}.glb`,
        gameScene,
        (result) => {
          result.meshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, -0.3);

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
    updateRotation,
    castSpell,
  } = useGame(servers.game.url);

  onMount(() => {
    joinGame($playerName);
    engine = createEngine(gameCanvas as HTMLCanvasElement);
    gameScene = createScene(engine);
    gameScene.onKeyboardObservable?.add(keyboardEventHandler);
    gameCamera = createCamera(gameScene);
    gui = createGUI();
    loadAssets();
    baseHighlightMesh = createBaseActiveMesh(gameScene);

    // showAxis(10, gameScene);
    // gameScene.debugLayer.show({
    //   embedMode: true,
    // });

    engine.displayLoadingUI();
    gameScene.executeWhenReady(function () {
      engine?.hideLoadingUI();
      engine?.runRenderLoop(function () {
        try {
          gameScene?.render();
        } catch (err) {
          console.error(err);
        }
      });
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
    const maxZ = Math.max($game.world.width, $game.world.depth) * 2;

    shadowGenerator?.dispose();

    if (gameCamera && maxZ > 0) {
      gameCamera.maxZ = maxZ;
    }

    shadowGenerator = new BABYLON.CascadedShadowGenerator(1024, details.detail);
    shadowGenerator.shadowMaxZ = maxZ;
    shadowGenerator.stabilizeCascades = true;
    shadowGenerator.cascadeBlendPercentage = 0;
    shadowGenerator.usePercentageCloserFiltering = true;
    shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;
    shadowGenerator.setDarkness(0.4);
  }
</script>

<div class="Game">
  <canvas bind:this={gameCanvas} />
  <World world={$game.world} scene={gameScene} on:lightChanged={handleLightChanged} />

  {#each $game.players as player}
    <Player
      {player}
      {gui}
      {baseHighlightMesh}
      {shadowGenerator}
      assetContainer={characterAssetContainers[player.kind]}
      camera={player.id === $activePlayerId ? gameCamera : undefined}
    />
    {#if player.id === $activePlayerId}
      <PlayerController
        scene={gameScene}
        {player}
        camera={gameCamera}
        {updateFrontMoveDirection}
        {updateSideMoveDirection}
        {updateRotation}
        {castSpell}
      />
    {/if}
  {/each}

  {#each $game.monsterGenerators as monsterGenerator}
    {#each monsterGenerator.monsters as monster}
      <Monster
        {monster}
        {gui}
        {baseHighlightMesh}
        {shadowGenerator}
        assetContainer={characterAssetContainers[monster.kind]}
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
</style>
