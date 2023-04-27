import type { IEffect } from './type';

export function isEffect<T>(effect: IEffect | unknown): effect is IEffect;
export function isEffect(effect: any): effect is IEffect {
  return !!(effect && effect.isEffect === true);
}
