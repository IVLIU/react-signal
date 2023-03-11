export abstract class Subscription<T extends any[]> {
  // properties
  private _listeners: Set<(...args: T) => void>;
  // constructor
  constructor() {
    this._listeners = new Set();
  }
  // getter
  protected get listeners() {
    return this._listeners;
  }
  // methods
  subscribe = (listener: (...args: T) => void) => {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  };
}
