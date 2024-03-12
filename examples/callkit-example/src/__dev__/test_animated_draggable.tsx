// from: https://www.reactnative.cn/docs/next/animatedvaluexy
import React, { useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
} from 'react-native';

const DraggableView = () => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const dxRef = React.useRef(0);
  const dyRef = React.useRef(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderStart(_, gestureState) {
      const dx = dxRef.current;
      const dy = dyRef.current;
      console.log('onPanResponderStart:', gestureState, dx, dy);
    },
    onPanResponderMove: Animated.event([
      null,
      {
        dx: pan.x, // x,y are Animated.Value
        dy: pan.y,
      },
    ]),
    onPanResponderRelease: (
      _: GestureResponderEvent,
      gestureState: PanResponderGestureState
    ) => {
      const { dx, dy } = gestureState;
      dxRef.current += dx;
      dyRef.current += dy;
      console.log(
        'onPanResponderRelease:',
        gestureState,
        dxRef.current,
        dyRef.current
      );
      pan.setOffset({ x: dxRef.current, y: dyRef.current }); // ok
      // pan.setOffset({ x: dx, y: dy }); // error
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[pan.getLayout(), styles.box]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#61dafb',
    width: 80,
    height: 80,
    borderRadius: 4,
  },
});

export default DraggableView;
