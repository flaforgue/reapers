import { Key } from '../configs/keycodes';

export const isRotationDirection = (value: string): boolean => {
  return ([Key.d, Key.q] as string[]).indexOf(value) != -1;
};

export const isMoveDirection = (value: string): boolean => {
  return ([Key.z, Key.s, Key.a, Key.e] as string[]).indexOf(value) != -1;
};
