import { depRef } from './Dep';
import type { ISignal } from './type';

export const track = (signal: ISignal) => {
  if (depRef.current === null) {
    return;
  }
  const signals = depRef.current.signals;
  if (!signals.has(signal)) {
    signals.add(signal);
  }
  return () => signals.delete(signal);
};
