import * as React from 'react';
import { ImageSourcePropType, ImageURISource, View } from 'react-native';

import { Image, ImageProps } from './Image';

export type DefaultImageProps = Omit<ImageProps, 'source' | 'defaultSource'> & {
  defaultSource: ImageSourcePropType;
  source: ImageURISource;
};

/**
 * It mainly adds the function of native component `Image` and preloading the default image.
 */
export function DefaultImage(props: DefaultImageProps) {
  const { style, defaultSource, onLoad, source, ...others } = props;
  const [visible, setVisible] = React.useState(true);
  return (
    <View>
      <Image
        style={[
          style,
          {
            // display: visible ? 'flex' : 'none',
            opacity: visible === true ? 1 : 0,
          },
        ]}
        source={defaultSource}
      />
      <Image
        style={[style, { position: 'absolute' }]}
        onLoad={(e) => {
          onLoad?.(e);
          setVisible(false);
        }}
        source={{ ...source, cache: source.cache ?? 'default' }}
        {...others}
      />
    </View>
  );
}

export type DefaultImageProps2 = Omit<ImageProps, 'source'> & {
  source: ImageURISource;
};

/**
 * The Android platform cannot display default images properly.
 */
export function DefaultImage2(props: DefaultImageProps2) {
  const { style, defaultSource, onLoad, source, ...others } = props;
  return (
    <React.Fragment>
      <Image
        style={style}
        onLoad={onLoad}
        source={{ ...source, cache: source.cache ?? 'default' }}
        defaultSource={defaultSource}
        {...others}
      />
    </React.Fragment>
  );
}
