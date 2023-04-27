import React, { useRef, useMemo, useEffect, useDebugValue } from 'react';
import { createEffect } from './createEffect';
import { destroy } from './destroy';
import type { EffectCallback, DependencyList } from 'react';

let _useInsertionEffect: typeof useEffect | null = null;

if (typeof React.useInsertionEffect === 'function') {
  _useInsertionEffect = (
    callback: EffectCallback,
    deps?: DependencyList | null,
  ) => {
    const bit = useRef(0);
    const effect = useMemo(() => createEffect(callback), []);
    const firstDep = effect.isDirty
      ? (bit.current = (bit.current + 1) % 3)
      : bit.current;

    useDebugValue(callback);

    React.useInsertionEffect(
      () => destroy(effect.run(callback)),
      deps === null ? undefined : deps ? [firstDep, ...deps] : [firstDep],
    );
  };
}

export const useInsertionEffect = _useInsertionEffect;
