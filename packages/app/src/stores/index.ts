import { CharacterDTO } from '@reapers/game-client';
import { writable } from 'svelte/store';

export enum FocusElement {
  Chat,
  Game,
}

export const focusElement = writable(FocusElement.Game);
export const playerName = writable('disterflo');
export const targetInfos = writable<CharacterDTO | null>(null);
export const playerInfos = writable<CharacterDTO>(new CharacterDTO());
