import { useCallback as raw_useCallback, useDebugValue } from 'react';
import type { DependencyList } from 'react';

export const useCallback = <T extends Function>(
  callback: T,
  deps?: DependencyList,
) => {
  useDebugValue(callback);
  return raw_useCallback(callback, deps || []);
};
