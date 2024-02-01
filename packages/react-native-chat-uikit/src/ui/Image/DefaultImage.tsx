import * as React from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  ImageURISource,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { Image, ImageProps } from './Image';

export type DefaultImageProps = Omit<ImageProps, 'source' | 'defaultSource'> & {
  defaultSource: ImageSourcePropType;
  source: ImageURISource;
  defaultStyle?: StyleProp<ImageStyle>;
  defaultContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * It mainly adds the function of native component `Image` and preloading the default image.
 */
export function DefaultImage(props: DefaultImageProps) {
  const {
    style,
    defaultStyle = style,
    defaultContainerStyle,
    containerStyle,
    defaultSource,
    onLoad,
    source,
    ...others
  } = props;
  const [visible, setVisible] = React.useState(
    source.uri !== undefined && source.uri !== null ? false : true
  );
  return (
    <View style={[containerStyle]}>
      <View style={[defaultContainerStyle]}>
        <Image
          style={[
            defaultStyle,
            {
              // display: visible ? 'flex' : 'none',
              opacity: visible === true ? 1 : 0,
            },
          ]}
          source={defaultSource}
          {...others}
        />
      </View>

      {source.uri !== undefined &&
      source.uri !== null &&
      source.uri.length > 0 ? (
        <Image
          style={[style, { position: 'absolute' }]}
          onLoad={(e) => {
            onLoad?.(e);
            setVisible(false);
          }}
          source={{ ...source, cache: source.cache ?? 'default' }}
          {...others}
        />
      ) : null}
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
