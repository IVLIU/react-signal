import { useState, useEffect as raw_useEffect, useDebugValue } from "react";
import { runWithDep } from "./runWithDep";
import { Dep } from "./Dep";
import { destroy } from "./destroy";
import type { EffectCallback, DependencyList } from "react";

export const useEffect = (
  effect: EffectCallback,
  deps?: DependencyList | null
) => {
  const dep = useState(() => new Dep(deps))[0];
  const isNullDeps = dep.deps === null;

  if (deps) {
    dep.deps = deps;
  }

  useDebugValue(effect);

  raw_useEffect(
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
