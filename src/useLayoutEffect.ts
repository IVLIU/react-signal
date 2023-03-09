import {
  useState,
  useLayoutEffect as raw_useLayoutEffect,
  useDebugValue,
} from "react";
import { runWithDep } from "./runWithDep";
import { Dep } from "./Dep";
import { destroy } from "./destroy";
import type { EffectCallback, DependencyList } from "react";

export const useLayoutEffect = (
  effect: EffectCallback,
  deps?: DependencyList | null
) => {
  const dep = useState(() => new Dep(deps))[0];
  const isNullDeps = dep.deps === null;

  useDebugValue(effect);

  raw_useLayoutEffect(
    () => {
      if (isNullDeps) {
        return destroy(effect());
      } else {
        return runWithDep(dep, () => destroy(effect()));
      }
    },
    isNullDeps ? undefined : [...(dep.deps as DependencyList)]
  );
};
