import { Key } from '../../configs/keycodes.config';

export function isRotationDirection(value: string) {
  return ([Key.d, Key.q] as string[]).indexOf(value) != -1;
}

export function isMoveDirection(value: string) {
  return ([Key.z, Key.s, Key.a, Key.e] as string[]).indexOf(value) != -1;
}
