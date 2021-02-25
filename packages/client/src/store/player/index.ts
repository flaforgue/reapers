import { createTypedHooks } from 'easy-peasy';
import { PlayerStore } from './type';
import playerStore from './store';

const hooks = createTypedHooks<PlayerStore>();

const usePlayerStore = hooks.useStore;
const usePlayerDispatch = hooks.useStoreDispatch;
const usePlayerState = hooks.useStoreState;
const usePlayerActions = hooks.useStoreActions;

export { playerStore, usePlayerStore, usePlayerDispatch, usePlayerState, usePlayerActions };
