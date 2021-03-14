import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { routes } from '../../../configs/routes.config';
import { FocusStore, PlayerStore } from '../../../stores';
import { Chat } from '../../chat';
import styles from './Play.module.scss';
import { Game } from '../../game';
import { Key } from '../../../configs/keycodes.config';
import { FocusElement } from '../../../types';

const Play: React.FC = () => {
  const player = PlayerStore.useStoreState((state) => state);
  const focusElement = FocusStore.useStoreState((state) => state.focusElement);
  const setFocusElement = FocusStore.useStoreActions((actions) => actions.setFocusElement);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, [document]);

  useEffect(() => {
    const focusChatOnEnter = (e: KeyboardEvent): void => {
      if (e.key === Key.Enter && focusElement !== FocusElement.Chat) {
        setFocusElement(FocusElement.Chat);
      }
    };

    window.addEventListener('keyup', focusChatOnEnter);

    return (): void => {
      window.removeEventListener('keyup', focusChatOnEnter);
    };
  }, [window, focusElement, setFocusElement]);

  if (!String(player.name).length) {
    return <Redirect to={routes.home.path} />;
  }

  return (
    <div className={styles.play}>
      <Chat playerName={player.name} />
      <Game playerName={player.name} />
    </div>
  );
};

export default Play;