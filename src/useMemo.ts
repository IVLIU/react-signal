import { useState, useMemo as raw_useMemo, useDebugValue } from 'react';
import { Dep, depRef } from './Dep';
import type { DependencyList } from 'react';

export const useMemo = <T>(factory: () => T, deps?: DependencyList) => {
  const dep = useState(() => new Dep(deps))[0];
  useDebugValue(factory());
  return raw_useMemo(() => {
    try {
      depRef.current = dep;
      return factory();
    } finally {
      depRef.current = null;
    }
  }, [...(dep.deps || [])]);
};
