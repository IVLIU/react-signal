import { Effect } from './Effect';
import { isEffect } from './isEffect';
import type { IEffect } from './type';

export function createEffect<T>(arg: (() => T) | IEffect): IEffect<T> {
  if (isEffect<T>(arg)) {
    return arg;
  }
  return new Effect();
}
