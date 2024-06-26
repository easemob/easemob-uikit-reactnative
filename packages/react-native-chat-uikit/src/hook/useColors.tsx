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
  const uc = React.useRef(new UseColors()).current;
  const func = () => {
    return {
      initColor: (pairs: StyleColorParams) => {
        uc.initColor(pairs);
      },
      getColor: (key: string) => {
        return uc.getColor(style, key);
      },
      getColors: (key: string) => {
        return uc.getColors(style, key);
      },
    };
  };

  if (pairs) {
    func().initColor(pairs);
  }

  return func();
}

export class UseColors {
  private list: Map<
    string,
    KV<ThemeType, ColorValue | ColorValue[] | undefined>
  >;
  constructor() {
    this.list = new Map();
  }
  public initColor(pairs: StyleColorParams): void {
    this.list.clear();
    const keys = Object.getOwnPropertyNames(pairs);
    for (const key of keys) {
      this.list.set(key, pairs[key]!);
    }
  }
  public getColor(style: ThemeType, key: string) {
    const item = this.list.get(key);
    if (item?.[style]) {
      if (Array.isArray(item[style]) === true) {
        throw new UIKitError({ code: ErrorCode.params });
      }
      return item?.[style] as ColorValue | undefined;
    }
    return undefined;
  }
  public getColors(style: ThemeType, key: string) {
    const item = this.list.get(key);
    if (item?.[style]) {
      if (Array.isArray(item[style]) === false) {
        throw new UIKitError({ code: ErrorCode.params });
      }
      return item?.[style] as ColorValue[] | undefined;
    }
    return undefined;
  }
}
