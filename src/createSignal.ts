import { Signal } from "./Signal";
import { isSignal } from "./isSignal";
import type { ISignal } from "./type";

export function createSignal<T = undefined>(): ISignal<T | undefined>;
export function createSignal<T>(
  initialValue: T | ISignal<T> | (() => T)
): ISignal<T>;
export function createSignal<T>(
  arg?: T | ISignal<T> | (() => T)
): ISignal<T | undefined> {
  if (isSignal<T>(arg)) {
    return arg;
  }
  return new Signal(arg);
}
