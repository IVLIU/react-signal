import type { DependencyList } from 'react';

export interface ISignal<T = any> {
  value: T;
  snapshot: T;
  deps?: Set<IEffect>;
  subscribe: (listener: (...args: T[]) => void) => () => boolean;
  isSignal: boolean;
}

export interface IEffect<T = any> {
  isDirty: boolean;
  mark(): void;
  run(callback: () => T): T;
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
