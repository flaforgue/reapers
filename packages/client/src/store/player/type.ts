import { Player } from '@reapers/game-client';
import { Action } from 'easy-peasy';

export type PlayerState = Player;

export type PlayerStore = {
  player: PlayerState;
  setPlayerName: Action<PlayerStore, string>;
};
