import { objectIs } from '@ai-indeed/shared';

export const areTrackedDepsEqual = (nextDeps: any[], prevDeps: any[]) => {
  const len = nextDeps.length;
  if (len !== prevDeps.length) {
    return false;
  }
  let i = 0;
  for (; i < len; i++) {
    if (objectIs(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
};
