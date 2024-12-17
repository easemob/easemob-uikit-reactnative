import * as React from 'react';

import { useLifecycle } from '../hook';
import { useRoomContext } from './room';
import type { RoomServiceListener } from './types';

/**
 * The life cycle of a listener should be as long as the component declaration and should not be added or deleted frequently. Therefore, it is recommended to use `useMemo` or `useRef` to wrap the listener and reduce dependencies.
 * @param listener The IM service object.
 */
export function useRoomListener(listener: RoomServiceListener) {
  const im = useRoomContext();
  useLifecycle(
    React.useCallback(
      (state: 'load' | 'unload') => {
        if (state === 'load') {
          im.addListener(listener);
        } else if (state === 'unload') {
          im.removeListener(listener);
        }
      },
      [im, listener]
    ),
    useRoomListener.name
  );
}
