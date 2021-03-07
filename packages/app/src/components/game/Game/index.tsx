import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '@reapers/game-client';
import * as BABYLON from '@babylonjs/core';
import styles from './Game.module.scss';
import { FocusStore } from '../../../stores';
import { FocusElement } from '../../../types';
import { servers } from '../../../configs/servers.config';
import World from '../World';
import Player from '../Player';

type GameProps = {
  playerName: string;
};

const createCamera = (scene: BABYLON.Scene): BABYLON.FollowCamera => {
  const camera = new BABYLON.FollowCamera('playerCamera', new BABYLON.Vector3(0, 2, -2), scene);

  camera.lowerRadiusLimit = 2;
  camera.radius = 5;
  camera.upperRadiusLimit = 5;

  camera.lowerHeightOffsetLimit = 1;
  camera.heightOffset = 3;
  camera.upperHeightOffsetLimit = 4;

  camera.rotationOffset = 0;

  camera.inputs.add;
  camera.attachControl(true);

  return camera;
};

const Game: React.FC<GameProps> = (props) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<BABYLON.Engine>();
  const [scene, setScene] = useState<BABYLON.Scene>();
  const [camera, setCamera] = useState<BABYLON.FollowCamera>();
  const { joinGame, player, updateMoveDirection, updateRotationDirection, world } = useGame(
    servers.game.url,
  );
  const focusElement = FocusStore.useStoreState((state) => state.focusElement);

  useEffect((): void => {
    joinGame(props.playerName);
  }, [joinGame, props.playerName]);

  useEffect(() => {
    if (canvasEl.current) {
      const engine = new BABYLON.Engine(canvasEl.current, true);
      const scene = new BABYLON.Scene(engine);
      const camera = createCamera(scene);
      const handleResize = (): void => engine.resize();

      engine.runRenderLoop(function () {
        scene.render();
      });
      setEngine(engine);
      setScene(scene);
      setCamera(camera);

      window.addEventListener('resize', handleResize);

      return (): void => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (focusElement === FocusElement.Game) {
      canvasEl.current?.focus();
    } else {
      canvasEl.current?.blur();
    }
  }, [focusElement]);

  return (
    <div className={styles.game}>
      <canvas ref={canvasEl} />
      <World world={world} scene={scene} />
      <Player
        player={player}
        scene={scene}
        updateMoveDirection={updateMoveDirection}
        updateRotationDirection={updateRotationDirection}
        camera={camera}
      />
    </div>
  );
};

export default Game;
