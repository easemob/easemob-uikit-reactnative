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
  } = props;

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
      <Draggable2>
        <Scalable onDoubleClicked={onDupClicked}>
          <View>
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
