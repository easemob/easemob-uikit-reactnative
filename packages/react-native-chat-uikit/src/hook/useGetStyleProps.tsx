import * as React from 'react';
import type { ImageStyle, StyleProp, ViewStyle } from 'react-native';

import { ErrorCode, UIKitError } from '../error';
import type { CornerRadiusPalette, CornerRadiusPaletteType } from '../theme';

type SizeType = {
  height?: number | string | undefined;
  width?: number | string | undefined;
};
/**
 * Parse the size in the component properties.
 * @example
 *
 * ```tsx
 * const { getStyleSize } = useGetStyleProps();
 * const { width: propsWidth } = getStyleSize(containerStyle);
 * const { checkType } = useCheckType();
 * if (propsWidth) {
 *   checkType(propsWidth, 'number');
 * }
 * const getUnitSize = () => {
 *   if (propsWidth) {
 *     return (propsWidth as number) / countPerRow - 1;
 *   }
 *   return winWidth / countPerRow - 1;
 * };
 * ```
 */
export function useGetStyleProps() {
  const ret = React.useMemo(() => {
    return {
      getStyleSize: (style?: StyleProp<ViewStyle>) => {
        const s = style as any;
        return {
          height: s?.height,
          width: s?.width,
        } as SizeType;
      },
      getBorderRadius: (params: {
        height: number;
        crt: CornerRadiusPaletteType;
        cr: CornerRadiusPalette;
        style?: StyleProp<ViewStyle | ImageStyle>;
      }) => {
        const { height, crt, cr, style } = params;
        const borderRadius = (style as any)?.borderRadius;
        if (borderRadius === undefined) {
          switch (crt) {
            case 'extraSmall':
              return cr.extraSmall;
            case 'small':
              return cr.small;
            case 'medium':
              return cr.medium;
            case 'large':
              return cr.large;
            case 'extraLarge':
              return height / 2;
            default:
              throw new UIKitError({ code: ErrorCode.params });
          }
        }
        return borderRadius;
      },
    };
  }, []);
  return ret;
}
