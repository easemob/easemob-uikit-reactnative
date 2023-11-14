import * as React from 'react';
import type { ColorValue } from 'react-native';

import { ErrorCode, UIKitError } from '../error';
import { ThemeType, useThemeContext } from '../theme';
import type { KV } from '../types';

export type StyleColorParams = KV<
  string,
  KV<ThemeType, ColorValue | ColorValue[] | undefined>
>;

/**
 * Simplify the use of theme colors.
 *
 * @example
 *
 * ```tsx
 * const { colors } = usePaletteContext();
 * const { getColor } = useColors({
 *   bg: {
 *     light: colors.neutral[98],
 *     dark: colors.neutral[1],
 *   },
 * });
 * // ...
 * <View
 *   style={{
 *     backgroundColor: getColor('bg'),
 *   }}
 * />
 * ```
 */
export function useColors(pairs?: StyleColorParams) {
  const { style } = useThemeContext();
  const list = React.useRef(
    new Map<string, KV<ThemeType, ColorValue | ColorValue[] | undefined>>()
  );
  const func = () => {
    return {
      initColor: (pairs: StyleColorParams) => {
        list.current.clear();
        const keys = Object.getOwnPropertyNames(pairs);
        for (const key of keys) {
          list.current.set(key, pairs[key]!);
        }
      },
      getColor: (key: string) => {
        const item = list.current.get(key);
        if (item?.[style]) {
          if (Array.isArray(item[style]) === true) {
            throw new UIKitError({ code: ErrorCode.params });
          }
          return item?.[style] as ColorValue | undefined;
        }
        return undefined;
      },
      getColors: (key: string) => {
        const item = list.current.get(key);
        if (item?.[style]) {
          if (Array.isArray(item[style]) === false) {
            throw new UIKitError({ code: ErrorCode.params });
          }
          return item?.[style] as ColorValue[] | undefined;
        }
        return undefined;
      },
    };
  };

  if (pairs) {
    func().initColor(pairs);
  }

  return func();
}
