import * as BABYLON from '@babylonjs/core';
import { BoundedValueDTO, CharacterDTO, CharacterKind } from '@reapers/game-client';
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
  position: BABYLON.Vector3;
};

export const focusElement = writable(FocusElement.Game);
export const playerName = writable('disterflo');
export const targetInfos = writable<CharacterDTO | null>(null);
export const playerInfos = writable<CharacterDTO>(new CharacterDTO());
