import { areTrackedDepsEqual } from "./areTrackedDepsEqual";
import type { DependencyList } from "react";
import type { ISignal, IDep, IDepRef } from "./type";

export const depRef: IDepRef = { current: null };

export class Dep implements IDep {
  // properties
  private _signals: Set<ISignal>;
  private _deps: DependencyList;
  private _isDep: boolean;
  // constructor
  constructor() {
    this._signals = new Set();
    this._deps = [];
    this._isDep = true;
  }
  // getter
  get signals() {
    return this._signals;
  }
  get deps() {
    const current = this._deps as unknown[];
    const wip = [] as unknown[];
    this._signals.forEach((signal) => wip.push(signal.value));
    if (!areTrackedDepsEqual(wip, current)) {
      this._deps = wip;
    }
    return this._deps;
  }
  get isDep() {
    return this._isDep;
  }
}
