import React, { useEffect, useRef, useState } from 'react';
import styles from './game.module.scss';
import { Game as GameModel } from '../../../models';
import { FocusStore } from '../../../stores';
import { FocusElement } from '../../../types';
import { useGame } from '@reapers/game-client';
import { servers } from '../../../configs/servers';

type GameProps = {
  playerName: string;
};

const Game: React.FC<GameProps> = (props) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { joinGame, player, world } = useGame(servers.game.url);
  const [gameModel, setGameModel] = useState<GameModel>();
  const focusElement = FocusStore.useStoreState((state) => state.focusElement);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, [document]);

  useEffect((): void => {
    joinGame(props.playerName);
  }, [joinGame, props.playerName]);

  useEffect(() => {
    if (canvasEl.current) {
      const gameModel = new GameModel(canvasEl.current);
      setGameModel(gameModel);

      const handleResize = (): void => gameModel.resize();
      window.addEventListener('resize', handleResize);

      return (): void => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    gameModel?.createWorld(world.width, world.depth);
  }, [world]);

  useEffect(() => {
    gameModel?.createPlayer();
  }, [player]);

  useEffect(() => {
    if (focusElement === FocusElement.Game) {
      canvasEl.current?.focus();
    } else {
      canvasEl.current?.blur();
    }
  }, [focusElement]);

  return <canvas className={styles.game} ref={canvasEl} />;
};

export default Game;
