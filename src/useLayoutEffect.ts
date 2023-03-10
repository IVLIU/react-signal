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
  const firstDep = useState(() => new Dep())[0];
  const isNullDeps = deps === null;

  useDebugValue(effect);

  raw_useLayoutEffect(
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
