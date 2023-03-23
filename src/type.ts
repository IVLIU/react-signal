import type { DependencyList } from "react";

export interface ISignal<T = any> {
  value: T;
  snapshot: T;
  deps?: Set<IEffect>;
  subscribe: (listener: (...args: T[]) => void) => () => boolean;
  isSignal: boolean;
}

export interface IEffect<T = any> {
  b: 0 | 1;
  callback: () => T;
  mark(): void;
  execute(): T;
}

export interface IEffectRef {
  current: IEffect | null;
}

export interface IDep {
  signals: Set<ISignal>;
  deps: DependencyList;
  isDep: boolean;
}

export interface IDepRef {
  current: IDep | null;
}
