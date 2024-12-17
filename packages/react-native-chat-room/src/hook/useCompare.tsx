import * as React from 'react';

import { useGetObjectName } from './useGetObjectName';

/**
 * Compare whether the objects before and after rendering are the same.
 *
 * @example
 *
 * ```tsx
 * const cb = React.useCallback(() => {
 *   // ...
 * }, []);
 * useCompare(cb);
 * ```
 */
export function useCompare(
  object: any,
  others?: { callerName?: string; objectName?: string; enabled?: boolean }
) {
  const ref = React.useRef(object);
  const { getObjectName } = useGetObjectName();

  if (others?.enabled === false) {
    return;
  }

  const log = `{
    toolName: '${useCompare.name}',
    callerName: '${others?.callerName ?? useCompare?.caller?.name}',
    objectName: '${others?.objectName ?? getObjectName(object)}',
    equalResult: '${ref.current === object}',
  }`;
  if (ref.current !== object) {
    console.warn(log);
  } else {
    console.log(log);
  }
}
