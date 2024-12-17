import * as React from 'react';
import {
  Image as RNImage,
  ImageProps as RNImageProps,
  ImageSourcePropType,
} from 'react-native';

export type ImageProps = Omit<RNImageProps, 'source'> & {
  source: ImageSourcePropType;
  failedSource?: ImageSourcePropType;
};

/**
 * It mainly adds the function of native component `RNImage` to use the default image after loading failure.
 */
export function Image(props: ImageProps) {
  const { style, source, failedSource, onError, ...others } = props;
  const [_source, setSource] = React.useState(source);
  const ref = React.useRef<RNImage>(undefined as any);
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
