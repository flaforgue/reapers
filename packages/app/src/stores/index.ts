import { BoundedValueDTO, CharacterKind } from '@reapers/game-client';
import { writable } from 'svelte/store';

export enum FocusElement {
  Chat,
  Game,
}

export type CharacterInfos = {
  id: string;
  kind: CharacterKind;
  name: string;
  level: number;
  life: BoundedValueDTO;
};

export const focusElement = writable(FocusElement.Game);
export const playerName = writable('disterflo');
export const targetInfos = writable<CharacterInfos | null>(null);
