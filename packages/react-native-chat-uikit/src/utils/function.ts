import type { Callback } from './types';

/* eslint-disable no-bitwise */
export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const asyncTask = (f: Callback, ...args: any[]) => {
  try {
    setImmediate(f, args);
  } catch (error) {
    console.warn('asyncTask:', error);
  }
};

export const timeoutTask = (timeout: number, f: Callback, ...args: any[]) => {
  try {
    setTimeout(() => f(args), timeout);
  } catch (error) {
    console.warn('queueTask:', error);
  }
};

export const queueTask = (f: Callback, ...args: any[]) => {
  try {
    queueMicrotask(() => f(args));
  } catch (error) {
    console.warn('queueTask:', error);
  }
};

export const arraySort = <T extends { key: string }>(list: T[]) => {
  list.sort((a, b) => {
    if (a.key > b.key) {
      return 1;
    } else if (a.key < b.key) {
      return -1;
    }
    return 0;
  });
};

// from: https://www.cnblogs.com/Wayou/p/typescript_infer.html
// type PromiseType<T> = (...args: any[]) => Promise<T>;
// type UnPromisify<T> = T extends PromiseType<infer U> ? U : never;
// const s = async function sss() {
//   return '';
// };
// export let sss: UnPromisify<typeof s>;

/**
 * Example:
 * ```typescript
 * callbackToAsync(
 *   alphabetListRef.current.measure,
 *   (
 *     x: number,
 *     y: number,
 *     width: number,
 *     height: number,
 *     pageX: number,
 *     pageY: number
 *   ) => {
 *     console.log('measure:', x, y, width, height, pageX, pageY);
 *     listYRef.current = pageY;
 *   }
 * );
 * ```
 * @param f any sync function.
 * @param args It can be any parameter, including callback parameters.
 * @returns callback result.
 */
export const callbackToAsync = (f: Callback, cb: Callback, ...args: any[]) => {
  const r = new Promise((success, fail) => {
    try {
      const r = f(cb, ...args);
      success(r);
    } catch (e: any) {
      fail(e);
    }
  });
  return r;
};

export const versionToArray = (version: string): number[] => {
  return version.split('.').map((v) => parseInt(v, 10));
};

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
export function once(fn: Callback, ...args: any[]) {
  let f: any = function () {
    if (f.called) return f.value;
    f.called = true;
    return (f.value = fn.apply(f, args));
  };
  f.called = false;
  return f;
}
export function once2(fn: Callback) {
  let f: any = function (...args: any[]) {
    if (f.called) return f.value;
    f.called = true;
    return (f.value = fn.apply(f, args));
  };
  f.called = false;
  return f;
}
export function onceT<Callback extends (...args: any[]) => any>(fn: Callback) {
  let f: any = function (...args: any[]) {
    if (f.called) return f.value;
    f.called = true;
    return (f.value = fn.apply(f, args));
  };
  f.called = false;
  return f as Callback;
}

/**
 * Returns the hash value of a string.
 *
 * @param str The string content.
 * @returns The hash value.
 */
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

/**
 * Get the current timestamp.
 * @param type Returns a timestamp in milliseconds or seconds. Returns a timestamp in milliseconds by default.
 * @returns The current timestamp.
 */
export function getCurTs(type?: 'ms' | 's'): number {
  return Math.round(
    type === 's' ? new Date().getTime() / 1000 : new Date().getTime()
  );
}
