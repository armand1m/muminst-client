import { useState } from 'react';

/**
 * TODO: Get this from the server either by pooling or by web sockets.
 */
const LOCK_COOLDOWN = 3000;

export const useLock = () => {
  const [state, setState] = useState(false);

  const lock = () => {
    setState(true);
    setTimeout(() => setState(false), LOCK_COOLDOWN);
  };

  type LockHook = [typeof state, typeof lock];

  return [state, lock] as LockHook;
};
