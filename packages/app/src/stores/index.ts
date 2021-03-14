import { writable } from 'svelte/store';

export enum FocusElement {
  Chat,
  Game,
}

export const focusElement = writable(FocusElement.Game);
export const playerName = writable('disterflo');
