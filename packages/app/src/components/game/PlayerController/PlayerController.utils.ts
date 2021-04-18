import { Key } from '../../../configs/keycodes.config';

export function isFrontMoveDirection(value: string): boolean {
  return ([Key.z, Key.s] as string[]).indexOf(value) != -1;
}

export function isSideMoveDirection(value: string): boolean {
  return ([Key.a, Key.e] as string[]).indexOf(value) != -1;
}
