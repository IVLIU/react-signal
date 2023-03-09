import {
  useState,
  useMemo as raw_useMemo,
  useCallback,
  useDebugValue,
} from "react";
import { createSignal } from "./createSignal";
import { runWithDep } from "./runWithDep";
import { Dep } from "./Dep";
import { destroyRef } from "./destroy";
import type { DependencyList } from "react";

export const useMemo = <T>(factory: () => T, deps?: DependencyList) => {
  const signal = useState(() => createSignal<T>())[0];
  const dep = useState(() => new Dep(deps))[0];

  const get = useCallback(
    () => (destroyRef.current === true ? signal.snapshot : signal.value) as T,
    []
  );

  const memoValue = raw_useMemo(() => {
    return runWithDep(dep, () => {
      const newValue = factory();
      signal.snapshot = signal.value;
      signal.value = newValue;
      return get;
    });
  }, [...(dep.deps || [])]);

  useDebugValue(signal.value);

  return memoValue;
};
