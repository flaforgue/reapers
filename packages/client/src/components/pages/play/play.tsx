import React from 'react';
import { Redirect } from 'react-router-dom';
import { routes } from '../../../configs/routes';
import { usePlayerState } from '../../../store/player';
import Chat from '../../chat/chat';
import styles from './play.module.scss';
import { Game } from '../../game';

const Play: React.FC = () => {
  const player = usePlayerState((state) => state.player);

  if (!String(player.name).length) {
    return <Redirect to={routes.home.path} />;
  }

  return (
    <div className={styles.play}>
      <Chat playerName={player.name} />
      <Game />
    </div>
  );
};

export default Play;
