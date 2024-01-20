import * as React from 'react';

import { useLifecycle } from '../hook';
import type { Callback } from '../utils';
import { useDispatchContext } from './dispatch';

/**
 * Use dispatch listener.
 */
export function useDispatchListener(key: string, cb: Callback) {
  const { addListener, removeListener } = useDispatchContext();
  useLifecycle(
    React.useCallback(
      (state: 'load' | 'unload') => {
        if (state === 'load') {
          addListener(key, cb);
        } else if (state === 'unload') {
          removeListener(key, cb);
        }
      },
      [addListener, cb, key, removeListener]
    ),
    useDispatchListener.name,
    false
  );
}
