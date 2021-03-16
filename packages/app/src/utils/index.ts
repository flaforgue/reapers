import { IDisposable } from '@babylonjs/core';

export function disposeArray(arr: IDisposable[]) {
  arr.map((item) => item.dispose());
}
