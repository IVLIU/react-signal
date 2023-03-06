import type { IDep } from './type';

export function isDep<T>(dep: IDep | unknown): dep is IDep;
export function isDep(dep: any): dep is IDep {
  return !!(dep && dep.isDep === true);
}
