import React, { useEffect, useRef } from 'react';
import styles from './game.module.scss';
import { Player, World } from '../../../models';

const Game: React.FC = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, [document]);

  useEffect(() => {
    if (canvasEl.current) {
      const canvas = canvasEl.current;
      const world = new World(canvas);
      const player = new Player(world.scene);

      const handleWindowResize = (): void => world.engine.resize();
      const handleFocus = (): void => {
        console.log('handleBodyFocus');
        canvasEl.current?.focus();
      };
      window.addEventListener('resize', handleWindowResize);
      document.addEventListener('focus', handleFocus);

      world.engine.runRenderLoop(function () {
        world.scene.render();
      });

      return (): void => {
        window.removeEventListener('resize', handleWindowResize);
        document.removeEventListener('focus', handleFocus);
      };
    }
  }, [canvasEl.current]);

  return <canvas className={styles.game} ref={canvasEl} />;
};

export default Game;
