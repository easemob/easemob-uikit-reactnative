import * as React from 'react';
import {
  Dimensions,
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { useCheckType, useGetStyleProps } from '../../hook';
import { Image } from '../../ui/Image';
import { ImageZoom } from './__private__/image-zoom.component';
import { Draggable2 } from './Draggable';
import { Scalable } from './Scalable';

export type ImagePreviewProps = {
  source: ImageSourcePropType;
  containerStyle?: ViewStyle;
  onClicked?: () => void;
  onDupClicked?: () => void;
  onLongPress?: () => void;
  imageStyle?: StyleProp<ImageStyle>;
  onChange?: (params: { x: number; y: number; scale: number }) => void;
};

/**
 * Image preview component.
 *
 * ** Under the android platform, scaling is not possible. **
 */
export function ImagePreview(props: ImagePreviewProps) {
  const {
    source,
    containerStyle,
    onLongPress,
    onClicked,
    onDupClicked,
    imageStyle,
    onChange,
  } = props;
  const ref = React.useRef<View>(null);
  const scaleRef = React.useRef<number>(1);
  const onChangeMoved = React.useCallback(() => {
    ref.current?.measure((_x, _y, _width, _height, pageX, pageY) => {
      onChange?.({ x: pageX, y: pageY, scale: scaleRef.current });
    });
  }, [onChange]);
  const onChangeSized = React.useCallback(
    (scale: number) => {
      scaleRef.current = scale;
      ref.current?.measure((_x, _y, _width, _height, pageX, pageY) => {
        onChange?.({ x: pageX, y: pageY, scale: scaleRef.current });
      });
    },
    [onChange]
  );

  return (
    <Pressable
      style={containerStyle}
      onPress={() => {
        onClicked?.();
      }}
      onLongPress={() => {
        onLongPress?.();
      }}
    >
      <Draggable2 onChangeMoved={onChangeMoved}>
        <Scalable onDoubleClicked={onDupClicked} onChangeSized={onChangeSized}>
          <View ref={ref}>
            <Image
              source={source}
              style={imageStyle}
              onError={(error) => {
                console.log('ImagePreview Image onError', error.nativeEvent);
              }}
              onLoadEnd={() => {
                console.log('ImagePreview Image onLoadEnd');
              }}
            />
          </View>
        </Scalable>
      </Draggable2>
    </Pressable>
  );
}

/**
 * Image preview component.
 */
export function ImagePreview2(props: ImagePreviewProps) {
  const {
    source,
    containerStyle,
    onLongPress,
    onClicked,
    onDupClicked,
    imageStyle,
  } = props;

  const { getStyleSize } = useGetStyleProps();
  const { height, width } = getStyleSize(containerStyle);

  if (height === undefined || width === undefined) {
    throw new Error('ImagePreview2: height or width is undefined');
  }
  const { checkType } = useCheckType();
  checkType(height, 'number');
  checkType(width, 'number');

  return (
    <View style={{}}>
      <ImageZoom
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height}
        imageWidth={width as number}
        imageHeight={height as number}
        onDoubleClick={onDupClicked}
        onLongPress={onLongPress}
        onClick={onClicked}
      >
        <Image
          source={source}
          style={imageStyle}
          onError={(error) => {
            console.log('ImagePreview Image onError', error.nativeEvent);
          }}
          onLoadEnd={() => {
            console.log('ImagePreview Image onLoadEnd');
          }}
        />
      </ImageZoom>
    </View>
  );
}
