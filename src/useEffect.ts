import {
  useMemo,
  useRef,
  useEffect as raw_useEffect,
  useDebugValue,
} from 'react';
import { createEffect } from './createEffect';
import { destroy } from './destroy';
import type { EffectCallback, DependencyList } from 'react';

export const useEffect = (
  callback: EffectCallback,
  deps?: DependencyList | null,
) => {
  const bit = useRef(0);
  const effect = useMemo(() => createEffect(callback), []);
  const firstDep = effect.isDirty
    ? (bit.current = (bit.current + 1) % 3)
    : bit.current;

  useDebugValue(callback);

  raw_useEffect(
    () => destroy(effect.run(callback)),
    deps === null ? undefined : deps ? [firstDep, ...deps] : [firstDep],
  );
};
