import * as React from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  // TextInput as RNTextInput,
  View,
} from 'react-native';
import {
  GlobalContainer,
  // ImagePreview,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import {
  HandlerStateChangeEvent,
  // PanGestureHandler,
  // PanGestureHandler,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';
// import AnimatedThird from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export function TestMyDraggable() {
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            // height: 100,
            // width: 100,
            backgroundColor: 'green',
            flexGrow: 1,
            // overflow: 'hidden',
          }}
        >
          <Draggable />
        </View>
      </SafeAreaView>
    </View>
  );
}

export function TestMyScale() {
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            // height: 100,
            // width: 100,
            backgroundColor: 'green',
            flexGrow: 1,
            // overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Scalable />
        </View>
      </SafeAreaView>
    </View>
  );
}

export function Draggable() {
  const pan = React.useRef(new Animated.ValueXY()).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // onPanResponderMove: Animated.event([{ dx: pan.x, dy: pan.y }], {
      //   useNativeDriver: true,
      // }),
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
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        height: 100,
        width: 100,
        backgroundColor: 'blue',
      }}
      {...panResponder.panHandlers}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    height: 100,
    width: 100,
    backgroundColor: 'blue',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    overflow: 'hidden',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  pinchableImage: {
    width: 250,
    height: 250,
  },
  wrapper: {
    flex: 1,
  },
  // box: {
  //   height: 70,
  //   width: 70,
  //   backgroundColor: 'blue',
  // },
});

export function Scalable() {
  console.log('test:zuoyu:Scalable');
  const baseScale = React.useRef(new Animated.Value(1)).current;
  const pinchScale = React.useRef(new Animated.Value(1)).current;
  const scale = React.useRef(Animated.multiply(baseScale, pinchScale)).current;
  const lastScale = React.useRef(1);
  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    { useNativeDriver: true }
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

  return (
    <PinchGestureHandler
      // ref={pinchRef}
      // simultaneousHandlers={rotationRef}
      onGestureEvent={onPinchGestureEvent}
      onHandlerStateChange={onPinchHandlerStateChange}
    >
      <Animated.View style={styles.container} collapsable={false}>
        <Animated.Image
          style={[
            styles.pinchableImage,
            {
              transform: [
                // { perspective: 200 },
                { scale: scale },
                // { rotate: rotateStr },
                // { rotateX: tiltStr },
              ],
            },
          ]}
          source={{ uri: 'https://picsum.photos/200/300' }}
        />
      </Animated.View>
    </PinchGestureHandler>
  );
}

// const { set, cond, add, eq, event } = AnimatedThird;

// export function Draggable2() {
//   const dragX = new AnimatedThird.Value(0);
//   const dragY = new AnimatedThird.Value(0);
//   const offsetX = new AnimatedThird.Value(0);
//   const offsetY = new AnimatedThird.Value(0);
//   const gestureState = new AnimatedThird.Value(-1);

//   const onGestureEvent = event([
//     {
//       nativeEvent: {
//         translationX: dragX,
//         translationY: dragY,
//         state: gestureState,
//       },
//     },
//   ]);

//   const transX = cond(
//     eq(gestureState, State.ACTIVE),
//     add(offsetX, dragX),
//     set(offsetX, add(offsetX, dragX))
//   );

//   const transY = cond(
//     eq(gestureState, State.ACTIVE),
//     add(offsetY, dragY),
//     set(offsetY, add(offsetY, dragY))
//   );

//   return (
//     <PanGestureHandler
//       maxPointers={1}
//       onGestureEvent={onGestureEvent}
//       onHandlerStateChange={onGestureEvent}
//     >
//       <AnimatedThird.View
//         style={[
//           styles.box,
//           // @ts-ignore
//           {
//             transform: [
//               {
//                 translateX: transX,
//               },
//               {
//                 translateY: transY,
//               },
//             ],
//           },
//         ]}
//       />
//     </PanGestureHandler>
//   );
// }

export default function TestDraggable() {
  const p = usePresetPalette();
  const t = useLightTheme(p, 'global');
  return (
    <GlobalContainer appKey={''} palette={p} theme={t}>
      <TestMyDraggable />
    </GlobalContainer>
  );
}
