import {
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
import type { ISignal, IWrapper } from "./type";

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
  R extends ReducerWithoutAction<IWrapper<any>> | Reducer<IWrapper<any>, any>
>(reducer: R, initializerArgOrInitialState: any, initializer?: any) {
  const [signal, dispatch] = raw_useReducer(
    (prevSignal: IWrapper<any>, action: ReducerAction<R>) => {
      const prevValue = prevSignal._signal.value;
      const nextValue = reducer(prevSignal._signal.value, action);
      if (objectIs(prevValue, nextValue)) {
        return prevSignal;
      }
      prevSignal._signal.value = nextValue;
      prevSignal._signal.snapshot = prevValue;
      return Object.freeze({
        _signal: prevSignal._signal,
      });
    },
    Object.freeze({
      _signal: createSignal(initializerArgOrInitialState),
    }),
    (initialSignal) =>
      initializer
        ? Object.freeze({
            _signal: createSignal(initializer(initializerArgOrInitialState)),
          })
        : initialSignal
  );

  const get = useCallback(
    () =>
      destroyRef.current === true
        ? signal._signal.snapshot
        : signal._signal.value,
    []
  );

  useDebugValue(signal._signal.value);

  return [get, dispatch];
}
