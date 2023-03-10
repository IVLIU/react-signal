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
    const dep = useState(() => new Dep(deps))[0];
    const isNullDeps = dep.deps === null;

    if (deps) {
      dep.deps = deps;
    }

    useDebugValue(effect);

    React.useInsertionEffect(
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
}

export const useInsertionEffect = _useInsertionEffect;
