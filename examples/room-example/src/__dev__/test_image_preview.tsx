import * as React from 'react';
import { Animated, Image, Modal, TouchableOpacity, View } from 'react-native';
import {
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';

export const ZoomableView = ({ imageUrl }: { imageUrl: string }) => {
  const scale = new Animated.Value(1);

  const onPinchEvent = Animated.event([{ nativeEvent: { scale: scale } }], {
    useNativeDriver: true,
  });

  const onPinchStateChange = (
    event: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <PinchGestureHandler
      onGestureEvent={onPinchEvent}
      onHandlerStateChange={onPinchStateChange}
    >
      <Animated.View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ scale: scale }],
        }}
      >
        <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} />
      </Animated.View>
    </PinchGestureHandler>
  );
};

export const Draggable = ({ imageUrl }: { imageUrl: string }) => {
  const translateX = new Animated.Value(0);
  const translateY = new Animated.Value(0);
  const lastOffset = { x: 0, y: 0 };

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (
    event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastOffset.x += event.nativeEvent.translationX;
      lastOffset.y += event.nativeEvent.translationY;
      translateX.setOffset(lastOffset.x);
      translateX.setValue(0);
      translateY.setOffset(lastOffset.y);
      translateY.setValue(0);
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={{
          transform: [{ translateX: translateX }, { translateY: translateY }],
        }}
      >
        <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} />
      </Animated.View>
    </PanGestureHandler>
  );
};

export const ImagePreview = ({ imageUrl }: { imageUrl: string }) => {
  const [visible, setVisible] = React.useState(false);

  const openPreview = () => {
    setVisible(true);
  };

  const closePreview = () => {
    setVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={openPreview}>
        <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} />
      </TouchableOpacity>

      <Modal visible={visible} transparent={true} onRequestClose={closePreview}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={closePreview}
        >
          <Image
            source={{ uri: imageUrl }}
            style={{ flex: 1 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function test_image_preview() {
  return (
    <View style={{ flex: 1 }}>
      {/* <ImagePreview imageUrl={'https://picsum.photos/200/300'} /> */}
      {/* <Draggable imageUrl={'https://picsum.photos/200/300'} /> */}
      <ZoomableView imageUrl={'https://picsum.photos/200/300'} />
    </View>
  );
}
