import * as React from 'react';
import type { ViewStyle } from 'react-native';
import type { StyleProp } from 'react-native';
import { Animated } from 'react-native';
import {
  HandlerStateChangeEvent,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  State,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

export type ScalableProps = React.PropsWithChildren<{
  containerStyle?: StyleProp<ViewStyle>;
  onDoubleClicked?: () => void;
  onOneClicked?: () => void;
}>;
export function Scalable(props: ScalableProps) {
  const { children, containerStyle, onDoubleClicked } = props;
  const baseScale = React.useRef(new Animated.Value(1)).current;
  const pinchScale = React.useRef(new Animated.Value(1)).current;
  const scale = React.useRef(Animated.multiply(baseScale, pinchScale));
  const lastScale = React.useRef(1);
  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    { useNativeDriver: false }
  );

  const onPinchHandlerStateChange = (
    event: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale.current *= event.nativeEvent.scale;
      baseScale.setValue(lastScale.current);
      pinchScale.setValue(1);
    }
  };

  const onDoubleTap = (
    event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // scale.setValue(1);
      // baseScale.setValue(1);
      // pinchScale.setValue(1);
      scale.current = Animated.multiply(baseScale, pinchScale);
      Animated.parallel([
        Animated.spring(baseScale, {
          toValue: 1,
          useNativeDriver: false,
        }),
        Animated.spring(pinchScale, {
          toValue: 1,
          useNativeDriver: false,
        }),
      ]).start();
      lastScale.current = 1;
      onDoubleClicked?.();
    }
  };

  // const onOneTap = (
  //   event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>
  // ) => {
  //   if (event.nativeEvent.state === State.ACTIVE) {
  //     onOneClicked?.();
  //   }
  // };

  return (
    <PinchGestureHandler
      // ref={pinchRef}
      // simultaneousHandlers={rotationRef}
      onGestureEvent={onPinchGestureEvent}
      onHandlerStateChange={onPinchHandlerStateChange}
    >
      <TapGestureHandler
        // ref={doubleTapRef}
        numberOfTaps={2}
        onHandlerStateChange={onDoubleTap}
      >
        {/* <TapGestureHandler
          // ref={doubleTapRef}
          numberOfTaps={1}
          onHandlerStateChange={onOneTap}
        > */}
        <Animated.View
          style={[
            {
              transform: [{ scale: scale.current }],
            },
            containerStyle,
          ]}
          collapsable={false}
        >
          {children}
        </Animated.View>
        {/* </TapGestureHandler> */}
      </TapGestureHandler>
    </PinchGestureHandler>
  );
}
