import type { EffectCallback } from 'react';

export const destroyRef = { current: false } as { current: boolean };

export const destroy = (destructor: ReturnType<EffectCallback>) => {
  return () => {
    if (typeof destructor === 'function') {
      try {
        destroyRef.current = true;
        destructor();
      } finally {
        destroyRef.current = false;
      }
    }
  };
};
