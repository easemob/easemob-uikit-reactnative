import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import {
  FontsPaletteType,
  FontStyles,
  FontsType,
  usePaletteContext,
} from '../../theme';
import type { Undefinable } from '../../types';

export type TextProps = RNTextProps & {
  textType?: FontsType;
  paletteType?: FontsPaletteType;
};

/**
 * Added theme support based on the native component `Text`.
 */
export function Text(props: TextProps) {
  const { textType, paletteType, children, style, ...others } = props;
  const presetTextStyle = useGetTextStyle({ textType, paletteType });

  return (
    <RNText style={[presetTextStyle, style]} {...others}>
      {children}
    </RNText>
  );
}

const useGetTextStyle = (props: TextProps): Undefinable<FontStyles> => {
  const { textType, paletteType } = props;
  const { fonts } = usePaletteContext();
  switch (textType) {
    case 'extraSmall':
      switch (paletteType) {
        case 'headline':
          return fonts.headline.extraSmall;
        case 'title':
          return fonts.title.extraSmall;
        case 'label':
          return fonts.label.extraSmall;
        case 'body':
          return fonts.body.extraSmall;
        default:
          break;
      }
      break;
    case 'small':
      switch (paletteType) {
        case 'headline':
          return fonts.headline.small;
        case 'title':
          return fonts.title.small;
        case 'label':
          return fonts.label.small;
        case 'body':
          return fonts.body.small;
        default:
          break;
      }
      break;
    case 'medium':
      switch (paletteType) {
        case 'headline':
          return fonts.headline.medium;
        case 'title':
          return fonts.title.medium;
        case 'label':
          return fonts.label.medium;
        case 'body':
          return fonts.body.medium;
        default:
          break;
      }
      break;
    case 'large':
      switch (paletteType) {
        case 'headline':
          return fonts.headline.large;
        case 'title':
          return fonts.title.large;
        case 'label':
          return fonts.label.large;
        case 'body':
          return fonts.body.large;
        default:
          break;
      }
      break;

    default:
      break;
  }
  return undefined;
};
