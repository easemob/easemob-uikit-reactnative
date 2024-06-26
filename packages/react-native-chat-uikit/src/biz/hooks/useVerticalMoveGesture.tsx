import * as React from 'react';
import { Animated, PanResponder } from 'react-native';

export type useVerticalMoveGestureProps = {
  translateY: Animated.Value;
};
export function useVerticalMoveGesture(props: useVerticalMoveGestureProps) {
  const { translateY } = props;
  const r = React.useRef(
    PanResponder.create({
      // onMoveShouldSetPanResponderCapture: () => {
      //   return true;
      // },
      // onStartShouldSetPanResponderCapture: () => {
      //   return true;
      // },
      onStartShouldSetPanResponder: (_, __) => {
        return true;
      },
      // onMoveShouldSetPanResponder: (_, __) => {
      //   return true;
      // },
      onPanResponderGrant: (_, __) => {
        // @ts-ignore
        translateY.setOffset(translateY.__getValue());
      },
      onPanResponderMove: (_, { dy }) => {
        return translateY.setValue(dy);
      },
      // onPanResponderRelease: (_) => {
      //   // e.stopPropagation();
      //   translateY.setOffset(0);
      // },
    })
  ).current;
  return {
    panHandlers: r.panHandlers,
  };
}
