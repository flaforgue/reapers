import React, { useEffect, useRef } from 'react';
import styles from './game.module.scss';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

const Game: React.FC = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, [document]);

  useEffect(() => {
    if (canvasEl.current) {
      const handleWindowResize = (): void => engine.resize();
      window.addEventListener('resize', handleWindowResize);

      const canvas = canvasEl.current;
      const engine = new BABYLON.Engine(canvas, true);
      const scene = new BABYLON.Scene(engine);
      const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

      // Camera
      const camera = new BABYLON.ArcRotateCamera(
        'camera',
        -Math.PI / 2,
        Math.PI / 2.5,
        3,
        new BABYLON.Vector3(0, 0, 0),
        scene,
      );
      camera.attachControl(canvas, true);

      // Music
      // const music = new BABYLON.Sound('cello', '/sounds/battle.wav', scene, null, {
      //   loop: true,
      //   autoplay: true,
      // });

      // Ground
      const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 });
      const groundMat = new BABYLON.StandardMaterial('roofMat', scene);
      groundMat.diffuseTexture = new BABYLON.Texture('/textures/ground.png', scene);
      ground.material = groundMat;

      // Model
      BABYLON.SceneLoader.ImportMeshAsync('', '/models/', 'spider.glb');

      // Rendering
      engine.runRenderLoop(function () {
        scene.render();
      });

      return (): void => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }
  }, [canvasEl.current]);

  return <canvas className={styles.game} ref={canvasEl} />;
};

export default Game;
