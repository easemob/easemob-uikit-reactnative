import * as React from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import { getCurTs } from 'react-native-chat-uikit';
import { ScrollView } from 'react-native-gesture-handler';

type TabViewProps = {
  onLongPress?: (data?: any) => void;
  onPress?: (data?: any) => void;
};
export function TabView(props: TabViewProps): JSX.Element {
  const { height, width } = useWindowDimensions();
  // console.log('test:', width, height);
  const horizontal = true;
  const bounces = false;
  const showsHorizontalScrollIndicator = false;
  const scrollViewRef = React.useRef<ScrollView>(null);
  const currentX = React.useRef(0);
  const currentY = React.useRef(0);
  const startTime = React.useRef(0);
  const endTime = React.useRef(0);
  const [isEditable, setIsEditable] = React.useState(false);
  const pageCount = 3;
  const left = React.useRef(new Animated.Value(0)).current;

  const moveIndicator = (x: number) => {
    return Animated.timing(left, {
      toValue: x,
      duration: 250,
      useNativeDriver: false,
    });
  };

  const _autoAlign = (moveX: number) => {
    const index = Math.ceil(moveX / width) - 1;
    const d =
      moveX === width * (pageCount - 1) ? width : Math.round(moveX % width);
    const w = width / 2;
    // console.log('test:_autoAlign:', moveX, index, d, w);
    if (moveX >= 0 && d < w) {
      setIsEditable(false);
      scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
      moveIndicator((index * width) / pageCount).start();
    } else {
      setIsEditable(true);
      scrollViewRef.current?.scrollTo({
        x: (index + 1) * width,
        animated: true,
      });
      moveIndicator(((index + 1) * width) / pageCount).start();
    }
  };

  const _onClicked = () => {
    if (isEditable === true) {
      return;
    }
    endTime.current = getCurTs();
    if (endTime.current - startTime.current < 1000) {
      props?.onPress?.();
    } else {
      props?.onLongPress?.();
    }
  };

  return (
    <View style={{ flex: 1, height, width, backgroundColor: 'red' }}>
      <ScrollView
        ref={scrollViewRef}
        style={{
          flex: 1,
          height: 0.8 * height,
          width: 1 * width,
          backgroundColor: 'green',
        }}
        horizontal={horizontal}
        bounces={bounces}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        onScrollEndDrag={(event) => {
          const x = event.nativeEvent.contentOffset.x;
          // console.log('test:nativeEvent', event.nativeEvent);
          _autoAlign(x);
        }}
        onTouchStart={(event) => {
          currentX.current = event.nativeEvent.locationX;
          currentY.current = event.nativeEvent.locationY;
          startTime.current = getCurTs();
        }}
        onTouchEnd={(event) => {
          if (
            event.nativeEvent.locationX === currentX.current &&
            event.nativeEvent.locationY === currentY.current
          ) {
            _onClicked();
          }
        }}
      >
        <View
          style={{
            height: 1 * height,
            width: 1 * width,
            backgroundColor: 'blue',
          }}
        />
        <View
          style={{
            height: 1 * height,
            width: 1 * width,
            backgroundColor: 'orange',
          }}
        />
        <View
          style={{
            height: 1 * height,
            width,
            backgroundColor: 'yellow',
          }}
        />
      </ScrollView>
      <View
        style={{
          height: 15,
          backgroundColor: 'yellow',
        }}
      >
        <Animated.View
          style={{
            height: 10,
            width: width / pageCount,
            backgroundColor: 'white',
            left: left, // Animated value
          }}
        />
      </View>
    </View>
  );
}

export default TabView;
