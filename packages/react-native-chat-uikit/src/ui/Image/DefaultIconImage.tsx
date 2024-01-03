import * as React from 'react';
import type { ImageStyle, StyleProp } from 'react-native';

import { ICON_ASSETS } from '../../assets';
import { g_not_existed_url } from '../../const';
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
  const isInvalid = (url?: string) => {
    return (
      url === undefined ||
      url === null ||
      url.trim().length === 0 ||
      (url.startsWith('http') === false && url.startsWith('file://') === false)
    );
  };
  const getUrl = (url?: string): string => {
    return isInvalid(url) ? g_not_existed_url : url!;
  };
  return (
    <DefaultImage
      defaultSource={localIcon ?? ICON_ASSETS.person_single_outline('3x')}
      source={{
        uri: getUrl(url),
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
