import * as React from 'react';
import { Image as RNImage } from 'react-native';

import type { ImageProps } from './types';

/**
 * It mainly adds the function of native component `RNImage` to use the default image after loading failure.
 *
 * !!! If your image source (source attribute) is null or invalid, onError may not be called. You should ensure that your image source is a valid URL or a local image obtained through the require function.
 */
export function Image(props: ImageProps) {
  const { style, source, failedSource, onError, ...others } = props;
  const [_source, setSource] = React.useState(source);
  const ref = React.useRef<React.ComponentRef<typeof RNImage>>(null);
  if (source !== _source) {
    setSource(source);
  }
  return (
    <RNImage
      ref={ref}
      style={[style]}
      source={_source}
      onError={(event) => {
        if (onError) {
          onError(event);
        }
        if (failedSource) {
          setSource(failedSource);
        }
      }}
      {...others}
    />
  );
}

const ImageCompare = () => {
  return true;
};

export const ImageMemo = React.memo(Image, ImageCompare);
