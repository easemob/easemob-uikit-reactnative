import * as React from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { Image } from '../../ui/Image';
// import { ImageViewer } from './__private__/image-viewer.component';
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
            <Image source={source} style={imageStyle} />
          </View>
        </Scalable>
      </Draggable2>
    </Pressable>
  );
}
