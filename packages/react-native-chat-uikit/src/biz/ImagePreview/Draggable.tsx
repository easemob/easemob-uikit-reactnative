import * as React from 'react';
import { Animated, PanResponder, StyleProp, ViewStyle } from 'react-native';
import {
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';

export type DraggableProps = React.PropsWithChildren<{
  containerStyle?: StyleProp<ViewStyle>;
}>;
export function Draggable(props: DraggableProps) {
  const { children, containerStyle } = props;
  const pan = React.useRef(new Animated.ValueXY()).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_event, gestureState) => {
        // @ts-ignore
        const { dx, dy } = gestureState;
        pan.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          // @ts-ignore
          x: pan.x._value,
          // @ts-ignore
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
        containerStyle,
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}

export function Draggable2(props: DraggableProps) {
  const { children, containerStyle } = props;
  const translateXY = React.useRef(new Animated.ValueXY({ x: 0, y: 0 }));

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateXY.current.x,
          translationY: translateXY.current.y,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onPanHandlerStateChange = (
    event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      translateXY.current.setValue({
        x: event.nativeEvent.translationX,
        y: event.nativeEvent.translationY,
      });
      translateXY.current.flattenOffset();
    } else if (event.nativeEvent.oldState === State.UNDETERMINED) {
      translateXY.current.setOffset({
        // @ts-ignore
        x: translateXY.current.x._value,
        // @ts-ignore
        y: translateXY.current.y._value,
      });
      translateXY.current.setValue({ x: 0, y: 0 });
    }
  };

  return (
    <PanGestureHandler
      maxPointers={1}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onPanHandlerStateChange}
    >
      <Animated.View
        style={[
          {
            transform: [
              {
                translateX: translateXY.current.x,
              },
              {
                translateY: translateXY.current.y,
              },
            ],
          },
          containerStyle,
        ]}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
}
