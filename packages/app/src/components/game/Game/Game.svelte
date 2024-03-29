<script lang="ts">
  import * as BABYLON from '@babylonjs/core';
  import * as GUI from '@babylonjs/gui';
  import { onMount } from 'svelte';
  import {
    useGame,
    game,
    world,
    activePlayerId,
    CharacterKind,
    PawnKind,
    FrontMoveDirection,
    SideMoveDirection,
  } from '@reapers/game-client';
  import { FocusElement, focusElement, playerName, targetInfos } from '../../../stores';
  import serversConfig from '../../../configs/servers.config';
  import { Key } from '../../../configs/keycodes.config';
  import World from '../World/World.svelte';
  import Player from '../Player/Player.svelte';
  import Monster from '../Monster/Monster.svelte';
  import PlayerController from '../PlayerController/PlayerController.svelte';
  import {
    createCamera,
    createEngine,
    createGUI,
    createScene,
    createShadowGenerator,
    showAxis,
  } from './game.utils';

  let engine: BABYLON.Engine | undefined;
  let gameCamera: BABYLON.ArcRotateCamera | undefined;
  let gameCanvas: HTMLCanvasElement | undefined;
  let gameScene: BABYLON.Scene | undefined;
  let assetContainers: Record<CharacterKind, BABYLON.AssetContainer | undefined> = {
    [CharacterKind.Player]: undefined,
    [CharacterKind.Spider]: undefined,
    [CharacterKind.Frog]: undefined,
  };
  let basePawnMeshes: Record<PawnKind, BABYLON.Mesh | undefined> = {
    // [PawnKind.SpiderNest]: undefined,
    [PawnKind.PineTree]: undefined,
    // [PawnKind.Wall]: undefined,
  };
  let gui: GUI.AdvancedDynamicTexture | undefined;
  let shadowGenerator: BABYLON.CascadedShadowGenerator | undefined;
  let groundMesh: BABYLON.GroundMesh | undefined;

  function loadAssets(gameScene: BABYLON.Scene) {
    for (let kind of Object.values(CharacterKind)) {
      BABYLON.SceneLoader.LoadAssetContainer(
        '/models/characters/',
        `${kind}.glb`,
        gameScene,
        (result) => {
          for (let i = 0; i < result.animationGroups.length; i++) {
            result.animationGroups[i].reset().stop();
          }

          assetContainers[kind] = result;
        },
      );
    }

    for (let kind of Object.values(PawnKind)) {
      BABYLON.SceneLoader.LoadAssetContainer(
        'models/pawns/',
        `${kind}.glb`,
        gameScene,
        (result) => {
          basePawnMeshes[kind] = BABYLON.Mesh.MergeMeshes(
            result.meshes.filter((m) => m.getTotalVertices() > 0) as BABYLON.Mesh[],
            true,
            false,
            undefined,
            true,
            true,
          ) as BABYLON.Mesh;
          (basePawnMeshes[kind] as BABYLON.Mesh).alwaysSelectAsActiveMesh = true;
          (basePawnMeshes[kind] as BABYLON.Mesh).isPickable = false;
          (basePawnMeshes[kind] as BABYLON.Mesh).doNotSyncBoundingInfo = true;
          basePawnMeshes[kind]?.freezeWorldMatrix();
          basePawnMeshes[kind]?.freezeNormals();
          basePawnMeshes[kind]?.material?.freeze();
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
    loadAttack,
    performAttack,
    cancelAttack,
  } = useGame(serversConfig.game.url);

  onMount(() => {
    joinGame($playerName);
    engine = createEngine(gameCanvas as HTMLCanvasElement);
    gameScene = createScene(engine);
    gameCamera = createCamera(gameScene);
    gui = createGUI();
    loadAssets(gameScene);

    // showAxis(1, gameScene);
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

      for (let kind in assetContainers) {
        assetContainers[kind as CharacterKind]?.removeAllFromScene();
      }

      for (let kind in basePawnMeshes) {
        basePawnMeshes[kind as PawnKind]?.dispose();
      }

      shadowGenerator?.dispose();
      gameCamera?.dispose();
      gameScene?.dispose();
      engine?.dispose();
      window.removeEventListener('resize', handleResize);
    };
  });

  function handleLightChanged(details: CustomEvent<BABYLON.DirectionalLight>) {
    shadowGenerator?.dispose();
    shadowGenerator = createShadowGenerator(details.detail);
    shadowGenerator.addShadowCaster(basePawnMeshes[PawnKind.PineTree] as BABYLON.Mesh);
  }

  function handleGroundChanged(details: CustomEvent<BABYLON.GroundMesh>) {
    groundMesh = details.detail;
  }

  function handleFrontMoveDirectionChange(details: CustomEvent<FrontMoveDirection>) {
    return updateFrontMoveDirection(details.detail);
  }

  function handleSideMoveDirectionChange(details: CustomEvent<SideMoveDirection>) {
    return updateSideMoveDirection(details.detail);
  }

  function handleRotationChange(details: CustomEvent<number>) {
    return updateRotation(details.detail);
  }

  function handleLoadAttack(details: CustomEvent<string>) {
    return loadAttack(details.detail);
  }

  function handlePerformAttack() {
    return performAttack();
  }

  function handleCancelAttack() {
    return cancelAttack();
  }

  $: {
    if ($focusElement === FocusElement.Game) {
      gameCanvas?.focus();
    } else {
      gameCanvas?.blur();
    }
  }
</script>

<div class="Game">
  <canvas bind:this={gameCanvas} />
  <World
    world={$world}
    scene={gameScene}
    {basePawnMeshes}
    on:lightChanged={handleLightChanged}
    on:groundChanged={handleGroundChanged}
  />

  {#each $game.characters as character (character.id)}
    {#if character.kind === CharacterKind.Player}
      <Player
        player={character}
        {gui}
        {shadowGenerator}
        assetContainer={assetContainers[character.kind]}
        camera={character.id === $activePlayerId ? gameCamera : undefined}
      />
      {#if character.id === $activePlayerId}
        <PlayerController
          scene={gameScene}
          player={character}
          camera={gameCamera}
          {groundMesh}
          on:frontMoveDirectionChange={handleFrontMoveDirectionChange}
          on:sideMoveDirectionChange={handleSideMoveDirectionChange}
          on:rotationChange={handleRotationChange}
          on:loadAttack={handleLoadAttack}
          on:performAttack={handlePerformAttack}
          on:cancelAttack={handleCancelAttack}
        />
      {/if}
    {:else}
      <Monster
        monster={character}
        {gui}
        {shadowGenerator}
        assetContainer={assetContainers[character.kind]}
      />
    {/if}
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
