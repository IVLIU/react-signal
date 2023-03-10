import { useState, useEffect as raw_useEffect, useDebugValue } from "react";
import { runWithDep } from "./runWithDep";
import { Dep } from "./Dep";
import { destroy } from "./destroy";
import type { EffectCallback, DependencyList } from "react";

export const useEffect = (
  effect: EffectCallback,
  deps?: DependencyList | null
) => {
  const firstDep = useState(() => new Dep())[0];
  const isNullDeps = deps === null;

  useDebugValue(effect);

  raw_useEffect(
    () => {
      if (isNullDeps) {
        return destroy(effect());
      } else {
        return runWithDep(firstDep, () => destroy(effect()));
      }
    },
    isNullDeps ? undefined : deps ? [firstDep.deps, ...deps] : [firstDep.deps]
  );
};
