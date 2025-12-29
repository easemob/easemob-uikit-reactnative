import { default as _FastImage } from '@d11/react-native-fast-image';
import * as React from 'react';

import type { ImageProps } from '../../rename.uikit';

/**
 * It mainly adds the function of native component `RNImage` to use the default image after loading failure.
 *
 * !!! If your image source (source attribute) is null or invalid, onError may not be called. You should ensure that your image source is a valid URL or a local image obtained through the require function.
 */
export function FastImage(props: ImageProps) {
  const { style, source, failedSource, onError, ...others } = props;
  const [_source, setSource] = React.useState(source);
  if (source !== _source) {
    setSource(source);
  }
  return (
    <_FastImage
      style={style}
      source={_source as any}
      onError={(event) => {
        if (onError) {
          onError(event as any);
        }
        if (failedSource) {
          setSource(failedSource);
        }
      }}
      {...(others as any)}
    />
  );
}

const ImageCompare = () => {
  return true;
};

export const FastImageMemo = React.memo(FastImage, ImageCompare);
