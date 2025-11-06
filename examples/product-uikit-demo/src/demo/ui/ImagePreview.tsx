import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import type { ImagePreviewProps } from '../../rename.uikit';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  source,
  onClicked,
  onDupClicked,
  onLongPress,
}) => {
  const minZoom = 1;
  const maxZoom = 5;

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;

      scale.value = Math.min(Math.max(newScale, minZoom), maxZoom);
    })
    .onEnd(() => {
      savedScale.value = scale.value;

      if (scale.value < minZoom) {
        scale.value = withSpring(minZoom);
        savedScale.value = minZoom;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value > minZoom) {
        translateX.value = savedTranslateX.value + event.translationX;
        translateY.value = savedTranslateY.value + event.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > minZoom) {
        scale.value = withSpring(minZoom);
        savedScale.value = minZoom;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        scale.value = withSpring(2);
        savedScale.value = 2;
      }
      onDupClicked?.();
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    onClicked?.();
  });

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      onLongPress?.();
    });

  const exclusiveGestures = Gesture.Exclusive(doubleTapGesture, tapGesture);

  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    longPressGesture,
    exclusiveGestures
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.container]}>
        <Animated.Image
          source={source}
          style={[styles.image, animatedStyle]}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
