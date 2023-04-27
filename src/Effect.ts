import type { IEffect, IEffectRef } from './type';

export const effectRef: IEffectRef = { current: null };

export class Effect<T> implements IEffect<T> {
  // properties
  private _isDirty: boolean;
  private _isEffect: boolean;
  // constructor
  constructor() {
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
  run(callback: () => T) {
    try {
      effectRef.current = this;
      return callback();
    } finally {
      this._isDirty = false;
      effectRef.current = null;
    }
  }
}
