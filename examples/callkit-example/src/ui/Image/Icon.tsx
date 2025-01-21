import * as React from 'react';
import { Image as RNImage, ImageProps as RNImageProps } from 'react-native';

export type IconProps = Omit<RNImageProps, 'source'> & {
  name: number;
  resolution?: string;
};

export function Icon(props: IconProps) {
  const { name, resolution, style, ...others } = props;
  resolution;

  return <RNImage source={name} style={[style]} {...others} />;
}
