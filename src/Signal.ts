import { Subscription } from './Subscription';
import { track } from './track';
import { untrackRef } from './untrack';
import type { ISignal } from './type';

export class Signal<S = undefined>
  extends Subscription<S[]>
  implements ISignal<S>
{
  // properties
  private _value: S;
  private _snapshot: S;
  private _isSignal: boolean;
  // constructor
  constructor(initialValue: S | (() => S)) {
    super();
    this._value = this._snapshot =
      typeof initialValue === 'function'
        ? (initialValue as () => S)()
        : initialValue;
    this._isSignal = true;
  }
  // getter
  get value() {
    if (!untrackRef.current) {
      track(this);
    }
    return this._value;
  }
  get snapshot() {
    if (!untrackRef.current) {
      track(this);
    }
    return this._snapshot;
  }
  get isSignal() {
    return this._isSignal;
  }
  // setter
  set value(newValue: S) {
    this.listeners.forEach((listener) => listener(newValue));
    this._value = newValue;
  }
  set snapshot(newSnapshot: S) {
    this._snapshot = newSnapshot;
  }
}
