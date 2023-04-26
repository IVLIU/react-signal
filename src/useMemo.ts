import {
  useRef,
  useMemo as raw_useMemo,
  useCallback,
  useDebugValue,
} from 'react';
import { createSignal } from './createSignal';
import { createEffect } from './createEffect';
import { destroyRef } from './destroy';
import type { DependencyList } from 'react';

export const useMemo = <T>(factory: () => T, deps?: DependencyList) => {
  const bit = useRef(0);
  const signal = raw_useMemo(() => createSignal<T>(), []);
  const effect = raw_useMemo(() => createEffect(factory), []);
  const firstDep = effect.isDirty
    ? (bit.current = (bit.current + 1) % 3)
    : bit.current;

  const get = useCallback(
    () => (destroyRef.current === true ? signal.snapshot : signal.value) as T,
    [],
  );

  const memoValue = raw_useMemo(
    () => {
      const newValue = effect.run(factory);
      signal.snapshot = signal.value;
      signal.value = newValue;
      return get;
    },
    deps ? [firstDep, ...deps] : [firstDep],
  );

  useDebugValue(signal.value);

  return memoValue;
};
