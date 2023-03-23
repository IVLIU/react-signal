import { effectRef } from "./Effect";
import { createDep } from "./createDep";
import type { ISignal } from "./type";

export const track = (signal: ISignal) => {
  if (effectRef.current === null) {
    return;
  }
  const deps = signal.deps || (signal.deps = createDep());
  deps.add(effectRef.current);
};
