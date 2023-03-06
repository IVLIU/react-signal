import React, { useState, useEffect, useDebugValue } from 'react';
import { Dep, depRef } from './Dep';
import { destroy } from './destroy';
import type { EffectCallback, DependencyList } from 'react';

let _useInsertionEffect: typeof useEffect | null = null;

if (typeof React.useInsertionEffect === 'function') {
  _useInsertionEffect = (
    effect: EffectCallback,
    deps?: DependencyList | null,
  ) => {
    const dep = useState(() => new Dep(deps))[0];
    const isNullDeps = dep.deps === null;
    useDebugValue(effect);
    React.useInsertionEffect(
      () => {
        if (isNullDeps) {
          return destroy(effect());
        } else {
          try {
            depRef.current = dep;
            return destroy(effect());
          } finally {
            depRef.current = null;
          }
        }
      },
      isNullDeps ? undefined : [...(dep.deps as DependencyList)],
    );
  };
}

export const useInsertionEffect = _useInsertionEffect;
