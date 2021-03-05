import { PlayerDTO } from '@reapers/game-client';
import { Action } from 'easy-peasy';
import { action, createContextStore } from 'easy-peasy';

type StoreType = Pick<PlayerDTO, 'name'> & {
  setPlayerName: Action<StoreType, string>;
};

const PlayerStore = createContextStore<StoreType>({
  name: 'disterflo',
  setPlayerName: action<StoreType, string>((state, name): void => {
    state.name = name;
  }),
});

export default PlayerStore;
