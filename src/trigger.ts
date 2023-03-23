import type { ISignal } from "./type";

export const trigger = (signal: ISignal) => {
  const deps = signal.deps;
  if (deps) {
    deps.forEach((dep) => dep.mark());
  }
};
