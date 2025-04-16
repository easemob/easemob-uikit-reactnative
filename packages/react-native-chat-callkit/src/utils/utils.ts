/* eslint-disable no-bitwise */
// import 'react-native-get-random-values';

import UUID from 'pure-uuid';

export function uuid(): string {
  return new UUID(4).format();
}

export function timestamp(
  type: 'second' | 'millisecond' = 'millisecond'
): number {
  if (type === 'second') {
    return Math.round(new Date().getTime() / 1000);
  } else if (type === 'millisecond') {
    return new Date().getTime();
  } else {
    throw new Error('type is error:', type);
  }
}

/**
 * Creates a throttled function that only invokes `fn` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `fn` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `fn`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `fn` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `fn` invocation.
 *
 * ref: [here](../../../../.yarn/releases/yarn-1.22.19.cjs)
 *
 * Examples: [here](../../../../example/src/__dev__/test_util.tsx)
 *
 * function once (fn) {
 *   var f = function () {
 *     if (f.called) return f.value
 *     f.called = true
 *     return f.value = fn.apply(this, arguments)
 *   }
 *   f.called = false
 *   return f
 * }
 *
 * @param fn any function
 * @param args any arguments
 * @returns Returns the result of the function call.
 */
export function once(fn: Function, ...args: any[]) {
  let f: any = function () {
    if (f.called) return f.value;
    f.called = true;
    return (f.value = fn.apply(f, args));
  };
  f.called = false;
  return f;
}
export function onceEx(fn: Function) {
  let f: any = function (...args: any[]) {
    if (f.called) return f.value;
    f.called = true;
    return (f.value = fn.apply(f, args));
  };
  f.called = false;
  return f;
}

export function hashCode(str?: string): number {
  let hash = 0,
    i,
    chr;
  if (str === undefined || str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function formatElapsed(elapsed: number): string {
  const placeholder = (params: { h?: number; m: number; s: number }) => {
    const ms = params.m.toString().length < 2 ? `0${params.m}` : params.m;
    const ss = params.s.toString().length < 2 ? `0${params.s}` : params.s;
    if (params.h) {
      const hs = params.h.toString().length < 2 ? `0${params.h}` : params.h;
      return `${hs}:${ms}:${ss}`;
    } else {
      return `${ms}:${ss}`;
    }
  };
  const seconds = Math.ceil(elapsed / 1000);
  const s = seconds % 60;
  const m = s === 0 ? Math.ceil(seconds / 60) : Math.ceil(seconds / 60) - 1;
  if (m > 60) {
    const h =
      s === 0 ? Math.ceil(seconds / 60 / 60) : Math.ceil(seconds / 60 / 60) - 1;
    const m2 = m % 60;
    return placeholder({ h, m: m2, s });
  } else {
    return placeholder({ m, s });
  }
}

export function getCallKitVersion(): string | undefined {
  try {
    const v = require('../version').VERSION;
    return v;
  } catch (error) {
    throw error;
  }
}
