import type { ISignal } from './type';

export function isSignal<T>(signal: ISignal<T> | unknown): signal is ISignal<T>;
export function isSignal(signal: any): signal is ISignal {
  return !!(signal && signal.isSignal === true);
}
