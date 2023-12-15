import * as React from 'react';

import type { IconNameType } from '../../assets';
import { Image, type ImageProps } from './Image';
import { getIconSource } from './Image.hooks';
import type { IconResolutionType } from './types';

export type IconProps = Omit<ImageProps, 'source' | 'failedSource'> & {
  name: IconNameType | number;
  resolution?: IconResolutionType;
};

export function Icon(props: IconProps) {
  const { name, resolution, style, ...others } = props;

  return (
    <Image
      source={getIconSource(name, resolution) ?? 0}
      style={[style]}
      {...others}
    />
  );
}
