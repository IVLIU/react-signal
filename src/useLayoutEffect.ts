import {
  useState,
  useLayoutEffect as raw_useLayoutEffect,
  useDebugValue,
} from 'react';
import { Dep, depRef } from './Dep';
import { destroy } from './destroy';
import type { EffectCallback, DependencyList } from 'react';

export const useLayoutEffect = (
  effect: EffectCallback,
  deps?: DependencyList | null,
) => {
  const dep = useState(() => new Dep(deps))[0];
  const isNullDeps = dep.deps === null;
  useDebugValue(effect);
  raw_useLayoutEffect(
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
