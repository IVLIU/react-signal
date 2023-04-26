import {
  useRef,
  useMemo,
  useLayoutEffect as raw_useLayoutEffect,
  useDebugValue,
} from 'react';
import { createEffect } from './createEffect';
import { destroy } from './destroy';
import type { EffectCallback, DependencyList } from 'react';

export const useLayoutEffect = (
  callback: EffectCallback,
  deps?: DependencyList | null,
) => {
  const bit = useRef(0);
  const effect = useMemo(() => createEffect(callback), []);
  const firstDep = effect.isDirty
    ? (bit.current = (bit.current + 1) % 3)
    : bit.current;

  useDebugValue(callback);

  raw_useLayoutEffect(
    () => destroy(effect.run(callback)),
    deps === null ? undefined : deps ? [firstDep, ...deps] : [firstDep],
  );
};
