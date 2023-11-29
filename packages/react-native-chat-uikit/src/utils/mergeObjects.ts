import type { PartialDeep } from '../types';

export function mergeObjects<T extends Object>(
  part: PartialDeep<T>,
  full: T
): any {
  const mergedObj = { ...full };

  for (const key in part) {
    if (part?.hasOwnProperty?.(key)) {
      const k = key as Extract<keyof T, string>;
      if (
        typeof part[key] === 'object' &&
        full.hasOwnProperty(key) &&
        typeof full[k] === 'object'
      ) {
        // If the property value is an object, merge recursively
        mergedObj[k] = mergeObjects(part[key] as any, full[k]);
      } else {
        // Otherwise, use the attributes in part directly.
        mergedObj[k] = part[key] as any;
      }
    }
  }

  return mergedObj;
}
