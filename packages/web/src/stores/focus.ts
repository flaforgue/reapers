import { Action } from 'easy-peasy';
import { action, createContextStore } from 'easy-peasy';
import { FocusElement } from '../types';

type FocusStore = {
  focusElement: FocusElement;
  setFocusElement: Action<FocusStore, FocusElement>;
};

const GlobalStore = createContextStore<FocusStore>({
  focusElement: FocusElement.Game,
  setFocusElement: action<FocusStore, FocusElement>((state, focusElement): void => {
    if (state.focusElement !== focusElement) {
      state.focusElement = focusElement;
    }
  }),
});
export default GlobalStore;
