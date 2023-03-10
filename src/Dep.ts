import { areTrackedDepsEqual } from "./areTrackedDepsEqual";
import type { DependencyList } from "react";
import type { ISignal, IDep, IDepRef } from "./type";

export const depRef: IDepRef = { current: null };

export class Dep implements IDep {
  // properties
  private _signals: Set<ISignal>;
  private _deps: DependencyList | null;
  private _isDep: boolean;
  // constructor
  constructor(deps?: DependencyList | null) {
    this._signals = new Set();
    this._deps = deps ? [[], ...deps] : deps === null ? null : [[]];
    this._isDep = true;
  }
  // getter
  get signals() {
    return this._signals;
  }
  get deps() {
    if (this._deps) {
      const current = this._deps[0] as unknown[];
      const wip = [] as unknown[];
      this._signals.forEach((signal) => wip.push(signal.value));
      if (!areTrackedDepsEqual(wip, current)) {
        // @ts-ignore
        this._deps[0] = wip;
      }
    }
    return this._deps;
  }
  get isDep() {
    return this._isDep;
  }
  // setter
  set deps(newDeps: DependencyList | null) {
    if (this._deps === null || newDeps === null) {
      return;
    }
    this._deps = [this._deps[0], ...newDeps];
  }
}
