import * as React from 'react';
import type {
  ImageStyle,
  RecursiveArray,
  StyleProp,
  ViewStyle,
} from 'react-native';

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
      getStyleProp: (prop: string, style?: StyleProp<ViewStyle>) => {
        return getPropValueFromStyleT(style, prop);
      },
      getStyleSize: (style?: StyleProp<ViewStyle>) => {
        const height = getPropValueFromStyleT(style, 'height');
        const width = getPropValueFromStyleT(style, 'width');
        return {
          height: height,
          width: width,
        } as SizeType;
      },
      getBorderRadius: (params: {
        height: number;
        crt: CornerRadiusPaletteType;
        cr: CornerRadiusPalette;
        style?: StyleProp<ViewStyle | ImageStyle>;
      }) => {
        const { height, crt, cr, style } = params;
        const borderRadius = getPropValueFromStyleT(
          style,
          'borderRadius'
        )?.borderRadius;
        // const borderRadius = (style as any)?.borderRadius;
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

function _getPropValueFromStyleT<Style = ViewStyle>(
  style: RecursiveArray<Style>,
  propKey: string
): any | undefined {
  let ret;

  style.forEach((item) => {
    if (Array.isArray(item)) {
      const prop = _getPropValueFromStyleT<Style>(item, propKey);
      if (prop !== undefined) {
        ret = prop;
      }
    } else if (item && (item as any)[propKey] !== undefined) {
      ret = (item as any)[propKey];
    }
  });

  return ret;
}
export function getPropValueFromStyleT<Style = ViewStyle>(
  style: StyleProp<Style>,
  propKey: string
): any | undefined {
  let ret;

  if (Array.isArray(style)) {
    ret = _getPropValueFromStyleT<Style>(
      style as RecursiveArray<Style>,
      propKey
    );
  } else if (style && (style as any)[propKey] !== undefined) {
    ret = (style as any)[propKey];
  }

  return ret;
}
