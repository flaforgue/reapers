import { Key } from '../../../configs/keycodes.config';

export function isFrontMoveDirection(value: string) {
  return ([Key.z, Key.s] as string[]).indexOf(value) != -1;
}

export function isSideMoveDirection(value: string) {
  return ([Key.a, Key.e] as string[]).indexOf(value) != -1;
}
