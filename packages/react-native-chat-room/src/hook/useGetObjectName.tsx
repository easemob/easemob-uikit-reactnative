import * as React from 'react';

/**
 * Try to get the name of the component. If it is of other types, it will be parsed accordingly.
 */
export function useGetObjectName() {
  const getObjectName = React.useCallback((object: any) => {
    const objectType = typeof object;
    if (
      objectType === 'bigint' ||
      objectType === 'boolean' ||
      objectType === 'number' ||
      objectType === 'string'
    ) {
      return object;
    } else if (objectType === 'function') {
      return object?.name;
    } else if (objectType === 'object') {
      try {
        const r = JSON.stringify(object);
        return r;
      } catch (error) {
        return object;
      }
    } else if (objectType === 'symbol') {
      const s = object as Symbol;
      return s.toString();
    } else {
      return object;
    }
  }, []);

  return {
    getObjectName,
  };
}
