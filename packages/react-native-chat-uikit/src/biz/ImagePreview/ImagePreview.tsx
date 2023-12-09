import * as React from 'react';
import { ImageSourcePropType, Pressable, View, ViewStyle } from 'react-native';

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
};
export function ImagePreview(props: ImagePreviewProps) {
  const { source, containerStyle, onLongPress, onClicked, onDupClicked } =
    props;
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
            <Image source={source} />
          </View>
        </Scalable>
      </Draggable2>
    </Pressable>
  );
}
