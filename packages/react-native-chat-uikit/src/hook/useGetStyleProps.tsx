import * as React from 'react';
import type {
  ImageStyle,
  RecursiveArray,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { MessageBubbleType, MessageLayoutType } from '../biz/types';
import { useConfigContext } from '../config';
import { ErrorCode, UIKitError } from '../error';
import {
  type CornerRadiusPalette,
  type CornerRadiusPaletteType,
  usePaletteContext,
  useThemeContext,
} from '../theme';

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
  const { cornerRadius: cornerRadiusValue } = usePaletteContext();
  const { cornerRadius: cornerRadiusStyle } = useThemeContext();
  const { releaseArea } = useConfigContext();
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

  const getMessageBubbleBorderRadius = React.useCallback(
    (params: {
      height: number;
      layoutType: MessageLayoutType;
      messageBubbleType: MessageBubbleType;
      hasTopNeighbor: boolean;
      hasBottomNeighbor: boolean;
    }) => {
      const {
        height,
        layoutType,
        hasTopNeighbor,
        hasBottomNeighbor,
        messageBubbleType,
      } = params;
      const crt: {
        TopStart: CornerRadiusPaletteType;
        TopEnd: CornerRadiusPaletteType;
        BottomStart: CornerRadiusPaletteType;
        BottomEnd: CornerRadiusPaletteType;
      } = {
        TopStart:
          layoutType === 'left'
            ? hasTopNeighbor === true
              ? cornerRadiusStyle.bubble[0]!
              : cornerRadiusStyle.bubble[1]!
            : cornerRadiusStyle.bubble[2]!,
        TopEnd:
          layoutType === 'left'
            ? cornerRadiusStyle.bubble[2]!
            : hasTopNeighbor === true
            ? cornerRadiusStyle.bubble[0]!
            : cornerRadiusStyle.bubble[1]!,
        BottomStart:
          layoutType === 'left'
            ? hasBottomNeighbor === false && messageBubbleType !== 'content'
              ? cornerRadiusStyle.bubble[1]!
              : cornerRadiusStyle.bubble[0]!
            : cornerRadiusStyle.bubble[2]!,
        BottomEnd:
          layoutType === 'left'
            ? cornerRadiusStyle.bubble[2]!
            : hasBottomNeighbor === false && messageBubbleType !== 'content'
            ? cornerRadiusStyle.bubble[1]!
            : cornerRadiusStyle.bubble[0]!,
      };
      if (releaseArea === 'china') {
        return {
          borderRadius: ret.getBorderRadius({
            height,
            crt: cornerRadiusStyle.bubble[0]!,
            cr: cornerRadiusValue,
          }),
        };
      } else {
        return {
          borderTopStartRadius: ret.getBorderRadius({
            height,
            crt: crt.TopStart,
            cr: cornerRadiusValue,
          }),
          borderTopEndRadius: ret.getBorderRadius({
            height,
            crt: crt.TopEnd,
            cr: cornerRadiusValue,
          }),
          borderBottomStartRadius: ret.getBorderRadius({
            height,
            crt: crt.BottomStart,
            cr: cornerRadiusValue,
          }),
          borderBottomEndRadius: ret.getBorderRadius({
            height,
            crt: crt.BottomEnd,
            cr: cornerRadiusValue,
          }),
        };
      }
    },
    [cornerRadiusStyle.bubble, cornerRadiusValue, releaseArea, ret]
  );
  return { ...ret, getMessageBubbleBorderRadius };
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
