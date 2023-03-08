import { useState, useCallback, useDebugValue } from 'react';
import { objectIs } from './objectIs';
import { createSignal } from './createSignal';
import { destroyRef } from './destroy';
import type { Dispatch, SetStateAction } from 'react';
import type { ISignal } from './type';

export function useSignal<S = undefined>(): [
  () => S | undefined,
  Dispatch<SetStateAction<S | undefined>>,
];
export function useSignal<S>(
  initialValue: S | ISignal<S> | (() => S),
): [() => S, Dispatch<SetStateAction<S>>];
export function useSignal<S>(
  initialValue?: S | ISignal<S> | (() => S),
): [() => S | undefined, Dispatch<SetStateAction<S | undefined>>] {
  const [signal, setSignal] = useState(() =>
    Object.freeze({
      _signal: createSignal(initialValue),
    }),
  );
  const get = useCallback(
    () =>
      destroyRef.current === true
        ? signal._signal.snapshot
        : signal._signal.value,
    [],
  );
  const set = useCallback<Dispatch<SetStateAction<S | undefined>>>(
    (nextValue) =>
      setSignal((prevSignal) => {
        const prevValue = prevSignal._signal.value;
        if (typeof nextValue === 'function') {
          nextValue = (nextValue as (prevValue: S | undefined) => S | undefined)(prevValue);
        }
        if (objectIs(prevValue, nextValue)) {
          return prevSignal;
        }
        signal._signal.value = nextValue;
        signal._signal.snapshot = prevValue;
        return Object.freeze({
          _signal: signal._signal,
        });
      }),
    [],
  );
  useDebugValue(signal._signal.value);
  return [get, set];
}
