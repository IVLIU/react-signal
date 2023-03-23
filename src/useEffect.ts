import { useMemo, useEffect as raw_useEffect, useDebugValue } from "react";
import { createEffect } from "./createEffect";
import { destroy } from "./destroy";
import type { EffectCallback, DependencyList } from "react";

export const useEffect = (
  callback: EffectCallback,
  deps?: DependencyList | null
) => {
  const effect = useMemo(() => createEffect(callback), []);
  const isNullDeps = deps === null;

  useDebugValue(effect.callback);

  console.log("effect", effect.b);

  raw_useEffect(
    () => {
      if (isNullDeps) {
        return destroy(effect.execute());
      } else {
        return destroy(effect.execute());
      }
    },
    isNullDeps ? undefined : deps ? [effect.b, ...deps] : [effect.b]
  );
};
