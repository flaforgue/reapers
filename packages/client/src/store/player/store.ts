import { action, createStore } from 'easy-peasy';
import { PlayerStore } from './type';

const playerStore = createStore<PlayerStore>({
  player: {
    name: 'disterflo',
  },
  setPlayerName: action<PlayerStore, string>((state, name): void => {
    state.player.name = name;
  }),
});

export default playerStore;
