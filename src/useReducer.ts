import { useReducer as raw_useReducer, useCallback } from "react";
import { createSignal } from "./createSignal";
import { destroyRef } from "./destroy";
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
  initializerArg: I,
  initializer: (arg: I) => ReducerStateWithoutAction<R>
): [() => ReducerStateWithoutAction<R>, DispatchWithoutAction];
export function useReducer<R extends ReducerWithoutAction<any>>(
  reducer: R,
  initializerArg: ReducerStateWithoutAction<R>,
  initializer?: undefined
): [() => ReducerStateWithoutAction<R>, DispatchWithoutAction];
export function useReducer<R extends Reducer<any, any>, I>(
  reducer: R,
  initializerArg: I & ReducerState<R>,
  initializer: (arg: I & ReducerState<R>) => ReducerState<R>
): [() => ReducerState<R>, Dispatch<ReducerAction<R>>];
export function useReducer<R extends Reducer<any, any>, I>(
  reducer: R,
  initializerArg: I,
  initializer: (arg: I) => ReducerState<R>
): [() => ReducerState<R>, Dispatch<ReducerAction<R>>];
export function useReducer<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
  initializer?: undefined
): [() => ReducerState<R>, Dispatch<ReducerAction<R>>];
export function useReducer<
  R extends
    | ReducerWithoutAction<{ _signal: ISignal<any> }>
    | Reducer<{ _signal: ISignal<any> }, any>
>(reducer: R, initializerArgOrInitialState: any, initializer?: any) {
  const [signal, dispatch] = raw_useReducer(
    (signal: { _signal: ISignal<any> }, action: ReducerAction<R>) =>
      reducer(signal._signal.value, action),
    Object.freeze({
      _signal: createSignal(initializerArgOrInitialState),
    }),
    () =>
      initializer &&
      Object.freeze({
        _signal: createSignal(initializer(initializerArgOrInitialState)),
      })
  );
  const get = useCallback(
    () =>
      destroyRef.current === true
        ? signal._signal.snapshot
        : signal._signal.value,
    []
  );
  return [get, dispatch];
}
