import * as React from 'react';
import type { ImageStyle, StyleProp } from 'react-native';

import { ICON_ASSETS } from '../../assets';
import { DefaultImage } from './DefaultImage';

export type DefaultIconImageProps = {
  url?: string | undefined;
  localIcon?: number;
  size: number;
  borderRadius?: number;
  style?: StyleProp<ImageStyle>;
  defaultStyle?: StyleProp<ImageStyle>;
};

export function DefaultIconImage(props: DefaultIconImageProps) {
  const { url, size, borderRadius, style, defaultStyle, localIcon } = props;
  return (
    <DefaultImage
      defaultSource={localIcon ?? ICON_ASSETS.person_single_outline('3x')}
      source={{
        uri: url,
      }}
      style={[
        {
          width: size,
          height: size,
          borderRadius: borderRadius,
        },
        style,
      ]}
      defaultStyle={defaultStyle}
    />
  );
}
