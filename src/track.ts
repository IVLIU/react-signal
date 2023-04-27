import { effectRef } from './Effect';
import type { ISignal } from './type';

export const track = (signal: ISignal) => {
  if (effectRef.current === null) {
    return;
  }
  const deps = signal.deps || (signal.deps = new Set());
  deps.add(effectRef.current);
};
