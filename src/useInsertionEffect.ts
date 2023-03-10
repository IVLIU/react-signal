import React, { useState, useEffect, useDebugValue } from "react";
import { runWithDep } from "./runWithDep";
import { Dep } from "./Dep";
import { destroy } from "./destroy";
import type { EffectCallback, DependencyList } from "react";

let _useInsertionEffect: typeof useEffect | null = null;

if (typeof React.useInsertionEffect === "function") {
  _useInsertionEffect = (
    effect: EffectCallback,
    deps?: DependencyList | null
  ) => {
    const firstDep = useState(() => new Dep())[0];
    const isNullDeps = deps === null;

    useDebugValue(effect);

    React.useInsertionEffect(
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
}

export const useInsertionEffect = _useInsertionEffect;
