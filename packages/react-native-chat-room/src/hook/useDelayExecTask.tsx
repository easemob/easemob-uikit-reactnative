import * as React from 'react';

import type { Callback } from '../utils';

/**
 * delayed call. If multiple identical calls are made in a short period of time, they will be merged into one call.
 *
 * @example
 *
 * ```tsx
 * const { delayExecTask: _deferSearch } = useDelayExecTask(
 *   1000,
 *   () => {
 *     // ...
 *   }
 * );
 * ```
 */
export function useDelayExecTask<F extends Callback>(delay: number, f: F) {
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>();
  const _delayExecF = React.useCallback(
    (...args: any) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => f(...args), delay);
    },
    [delay, f]
  ) as F;
  return {
    delayExecTask: _delayExecF,
  };
}
