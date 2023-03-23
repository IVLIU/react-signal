import type { IEffect, IEffectRef } from "./type";

export const effectRef: IEffectRef = { current: null };

export const trackOpBit = 1;

export class Effect<T> implements IEffect<T> {
  // properties
  private _callback: () => T;
  private _b: 0 | 1;
  private _isEffect: boolean;
  // constructor
  constructor(callback: () => T) {
    this._callback = callback;
    this._b = 0;
    this._isEffect = true;
  }
  // getter
  get callback() {
    return this._callback;
  }
  get b() {
    return this._b;
  }
  get isEffect() {
    return this._isEffect;
  }
  // methods
  mark() {
    this._b |= trackOpBit;
  }
  execute() {
    try {
      effectRef.current = this;
      return this._callback();
    } finally {
      if ((this._b & trackOpBit) === trackOpBit) {
        this._b &= ~trackOpBit;
      }
      effectRef.current = null;
    }
  }
}
