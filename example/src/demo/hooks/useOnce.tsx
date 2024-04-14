import * as React from 'react';
import type { Callback } from 'react-native-chat-uikit';

export function useOnce() {
  const onceRef = React.useRef(false);
  const start = React.useCallback((f: Callback, ...args: any[]) => {
    onceRef.current = true;
    // f(...args);
    f(args);
  }, []);
  const stop = React.useCallback((f: Callback, ...args: any[]) => {
    if (onceRef.current === false) {
      return;
    }
    onceRef.current = false;
    // f(...args);
    f(args);
  }, []);
  return { start, stop };
}
