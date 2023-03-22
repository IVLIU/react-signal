import type { IEffect, IEffectRef } from "./type";

export const effectRef: IEffectRef = { current: null };

export class Effect<T> implements IEffect {
  // properties
  private _callback: () => T;
  private _isDirty: boolean;
  private _isEffect: boolean;
  // constructor
  constructor(callback: () => T) {
    this._callback = callback;
    this._isDirty = false;
    this._isEffect = true;
  }
  // getter
  get isDirty() {
    return this._isDirty;
  }
  get isEffect() {
    return this._isEffect;
  }
  // methods
  mark() {
    this._isDirty = true;
  }
  execute() {
    try {
      effectRef.current = this;
    } finally {
      effectRef.current = null;
      this._isDirty = false;
    }
  }
}
