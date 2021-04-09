import * as BABYLON from '@babylonjs/core';
import { Key } from '../../configs/keycodes.config';

export function isRotationDirection(value: string) {
  return ([Key.d, Key.q] as string[]).indexOf(value) != -1;
}

export function isFrontMoveDirection(value: string) {
  return ([Key.z, Key.s] as string[]).indexOf(value) != -1;
}

export function isSideMoveDirection(value: string) {
  return ([Key.a, Key.e] as string[]).indexOf(value) != -1;
}
