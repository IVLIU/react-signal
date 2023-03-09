import { useState, useMemo as raw_useMemo, useDebugValue } from "react";
import { createSignal } from "./createSignal";
import { Dep, depRef } from "./Dep";
import { destroyRef } from "./destroy";
import { useCallback } from "./useCallback";
import type { DependencyList } from "react";

export const useMemo = <T>(factory: () => T, deps?: DependencyList) => {
  const signal = useState(() => createSignal<T>())[0];
  const dep = useState(() => new Dep(deps))[0];
  const get = useCallback(
    () => (destroyRef.current === true ? signal.snapshot : signal.value) as T
  );
  const memoValue = raw_useMemo(() => {
    try {
      depRef.current = dep;
      const newValue = factory();
      if (typeof signal.snapshot === "undefined") {
        signal.value = signal.snapshot = newValue;
      } else {
        signal.snapshot = signal.value;
        signal.value = newValue;
      }
      return get;
    } finally {
      depRef.current = null;
    }
  }, [...(dep.deps || [])]);
  useDebugValue(signal.value);
  return memoValue;
};
