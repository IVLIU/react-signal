import { depRef } from "./Dep";
import type { IDep } from "./type";

export const runWithDep = <T>(dep: IDep, callback: () => T) => {
  try {
    depRef.current = dep;
    return callback();
  } finally {
    depRef.current = null;
  }
};
