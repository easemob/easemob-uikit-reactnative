import * as React from 'react';
import { DeviceEventEmitter, type EmitterSubscription } from 'react-native';

import type { Callback } from '../utils';

export const gEventEmitter = DeviceEventEmitter;

export function useEventEmitter() {
  const init = React.useCallback(() => {}, []);
  const unInit = React.useCallback(() => {
    // clearEventListener();
  }, []);

  React.useEffect(() => {
    init();
    return () => {
      unInit();
    };
  }, [init, unInit]);
  return {
    emitEvent,
    addEventListener,
    removeEventListener,
    removeEventListenerBySub,
  };
}

const list: Map<string, Set<EmitterSubscription>> = new Map();
export function addEventListener(keyword: string, listener: Callback) {
  if (list.has(keyword)) {
    const s = list.get(keyword)!;
    const sub = gEventEmitter.addListener(keyword, listener);
    s.add(sub);
    return sub;
  } else {
    const s = new Set<EmitterSubscription>();
    const sub = gEventEmitter.addListener(keyword, listener);
    s.add(sub);
    list.set(keyword, s);
    return sub;
  }
}
export function removeEventListener(keyword: string) {
  const s = list.get(keyword);
  s?.forEach((v) => {
    v.remove();
  });
  list.delete(keyword);
}
export function removeEventListenerBySub(
  keyword: string,
  sub: EmitterSubscription
) {
  for (const v of list) {
    if (v[0] === keyword) {
      for (const vv of v[1]) {
        if (vv === sub) {
          vv.remove();
          list.get(keyword)?.delete(vv);
          break;
        }
      }
      break;
    }
  }
}
export function clearEventListener() {
  list.forEach((v) => {
    v.forEach((v) => {
      v.remove();
    });
  });
  list.clear();
}
export function emitEvent(keyword: string, ...params: any[]) {
  gEventEmitter.emit(keyword, ...params);
}
