import {
  useState,
  useReducer as raw_useReducer,
  useCallback,
  useDebugValue,
} from "react";
import { createSignal } from "./createSignal";
import { destroyRef } from "./destroy";
import { objectIs } from "./objectIs";
import type {
  ReducerWithoutAction,
  ReducerStateWithoutAction,
  DispatchWithoutAction,
  Reducer,
  ReducerState,
  Dispatch,
  ReducerAction,
} from "react";
import type { ISignal } from "./type";

export function useReducer<R extends ReducerWithoutAction<any>, I>(
  reducer: R,
  initializerArg: I | ISignal<I>,
  initializer: (arg: I) => ReducerStateWithoutAction<R>
): [() => ReducerStateWithoutAction<R>, DispatchWithoutAction];
export function useReducer<R extends ReducerWithoutAction<any>>(
  reducer: R,
  initializerArg: ReducerStateWithoutAction<R>,
  initializer?: undefined
): [() => ReducerStateWithoutAction<R>, DispatchWithoutAction];
export function useReducer<R extends Reducer<any, any>, I>(
  reducer: R,
  initializerArg: (I & ReducerState<R>) | ISignal<I & ReducerState<R>>,
  initializer: (arg: I & ReducerState<R>) => ReducerState<R>
): [() => ReducerState<R>, Dispatch<ReducerAction<R>>];
export function useReducer<R extends Reducer<any, any>, I>(
  reducer: R,
  initializerArg: I | ISignal<I>,
  initializer: (arg: I) => ReducerState<R>
): [() => ReducerState<R>, Dispatch<ReducerAction<R>>];
export function useReducer<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
  initializer?: undefined
): [() => ReducerState<R>, Dispatch<ReducerAction<R>>];
export function useReducer<
  R extends ReducerWithoutAction<any> | Reducer<any, any>
>(reducer: R, initializerArgOrInitialState: any, initializer?: any) {
  const signal = useState(() =>
    createSignal(
      initializer
        ? initializer(initializerArgOrInitialState)
        : initializerArgOrInitialState
    )
  )[0];
  const dispatch = raw_useReducer(
    (prevValue: ReducerState<R>, action: ReducerAction<R>) => {
      const nextValue = reducer(prevValue, action);
      if (objectIs(prevValue, nextValue)) {
        return prevValue;
      }
      signal.snapshot = signal.value;
      signal.value = nextValue;
      return nextValue;
    },
    signal.value
  )[1];

  const get = useCallback(
    () => (destroyRef.current === true ? signal.snapshot : signal.value),
    []
  );

  useDebugValue(signal.value);

  return [get, dispatch];
}
