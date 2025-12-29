import * as React from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  ImageURISource,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { LocalPath } from '../../utils/platform';
import { Image } from './Image';
import type { ImageProps } from './types';

export type DefaultImageProps = Omit<ImageProps, 'source' | 'defaultSource'> & {
  defaultSource: ImageSourcePropType;
  source: ImageURISource;
  defaultStyle?: StyleProp<ImageStyle>;
  defaultContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  FastImageComponent?: React.ComponentType<ImageProps>;
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
    onError,
    FastImageComponent,
    ...others
  } = props;

  // 1. Fix local path issue on iOS
  const finalSource = React.useMemo(() => {
    if (
      source?.uri &&
      source.uri.length > 0 &&
      !source.uri.startsWith('http') &&
      !source.uri.startsWith('asset') &&
      !source.uri.startsWith('file') &&
      !source.uri.startsWith('content')
    ) {
      return {
        ...source,
        uri: LocalPath.showImage(source.uri),
      };
    }
    return source;
  }, [source]);

  // 2. Manage state: showDefault vs showMain
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    // When source changes, reset to loading state
    setIsLoaded(false);
    setIsError(false);
  }, [finalSource?.uri]);

  const handleLoad = (e: any) => {
    console.log('DefaultImage onLoad:', finalSource?.uri);
    setIsLoaded(true);
    setIsError(false);
    onLoad?.(e);
  };

  const handleError = (e: any) => {
    console.log('DefaultImage onError:', finalSource?.uri, e.nativeEvent.error);
    setIsLoaded(false);
    setIsError(true);
    onError?.(e);
  };

  const hasSource =
    finalSource?.uri !== undefined &&
    finalSource?.uri !== null &&
    finalSource?.uri.length > 0;

  // Show default if: No source OR Not loaded yet OR Error occurred
  const showDefault = !hasSource || !isLoaded || isError;

  return (
    <View style={[containerStyle]}>
      <View style={[defaultContainerStyle]}>
        {/* Placeholder / Default Image */}
        <Image
          style={[
            defaultStyle,
            {
              opacity: showDefault ? 1 : 0,
            },
          ]}
          source={defaultSource}
          {...others}
        />

        {/* Main Image - Absolute positioned to overlap */}
        {hasSource ? (
          FastImageComponent ? (
            <FastImageComponent
              style={[
                style,
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: isLoaded ? 1 : 0, // Hide until loaded
                },
              ]}
              onLoad={handleLoad}
              onError={handleError}
              source={{ uri: finalSource?.uri }}
              {...others}
            />
          ) : (
            <Image
              style={[
                style,
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: isLoaded ? 1 : 0, // Hide until loaded
                },
              ]}
              onLoad={handleLoad}
              onError={handleError}
              source={{ ...finalSource, cache: finalSource.cache ?? 'default' }}
              {...others}
            />
          )
        ) : null}
      </View>
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
