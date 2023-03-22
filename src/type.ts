import type { EffectCallback, DependencyList } from "react";

export interface ISignal<T = any> {
  value: T;
  snapshot: T;
  subscribe: (listener: (...args: T[]) => void) => () => boolean;
  isSignal: boolean;
}

export interface IEffect {
  isDirty: boolean;
  execute: () => ReturnType<EffectCallback>;
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
