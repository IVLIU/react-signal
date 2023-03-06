export const untrackRef = { current: false } as { current: boolean };

export const untrack = <T>(callback: () => T) => {
  try {
    untrackRef.current = true;
    return callback();
  } finally {
    untrackRef.current = false;
  }
};
