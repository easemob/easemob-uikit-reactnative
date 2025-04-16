import * as React from 'react';
import {
  ColorValue,
  // Image as RNImage,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { ICON_ASSETS } from '../../assets/icons';
import Image from './Image';

export enum IconSize {
  ICON_NORMAL,
  ICON_BIGGER,
  ICON_MAX,
}

export type IconName = keyof typeof ICON_ASSETS;
type SizeList = keyof typeof sizeStyles;

export const localLocalIcon = <T extends IconName>(
  name: T,
  size: IconSize = IconSize.ICON_NORMAL
) => {
  let params = '';
  switch (size) {
    case IconSize.ICON_BIGGER:
      params = '2x';
      break;
    case IconSize.ICON_MAX:
      params = '3x';
      break;
    default:
      break;
  }
  return ICON_ASSETS[name](params);
};

type LocalIconProps = {
  name: IconName;
  color?: ColorValue | undefined;
  size?: number | undefined;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export function LocalIcon({
  name,
  color,
  size = 24,
  style,
  containerStyle,
}: LocalIconProps): JSX.Element {
  const sizeStyle = sizeStyles[size as SizeList] ?? {
    width: size,
    height: size,
  };
  return (
    <View style={containerStyle ?? styles.container}>
      <Image
        resizeMode="contain"
        source={
          size < 24
            ? localLocalIcon(name)
            : size < 96
              ? localLocalIcon(name, IconSize.ICON_BIGGER)
              : localLocalIcon(name, IconSize.ICON_MAX)
        }
        style={[
          color ? { tintColor: color ?? 'white' } : undefined,
          sizeStyle,
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const sizeStyles = StyleSheet.create({
  16: {
    width: 16,
    height: 16,
  },
  20: {
    width: 20,
    height: 20,
  },
  24: {
    width: 24,
    height: 24,
  },
  28: {
    width: 28,
    height: 28,
  },
  32: {
    width: 32,
    height: 32,
  },
  64: {
    width: 64,
    height: 64,
  },
  72: {
    width: 72,
    height: 72,
  },
  96: {
    width: 96,
    height: 96,
  },
  128: {
    width: 128,
    height: 128,
  },
  256: {
    width: 256,
    height: 256,
  },
});

export const LocalIconMemo = React.memo(LocalIcon);
