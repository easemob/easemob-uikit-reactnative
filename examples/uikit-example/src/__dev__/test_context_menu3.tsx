import React, { useState } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ContextMenu,
  SlideModalRef,
  useContextMenu,
} from 'react-native-chat-uikit';

export function TestContextMenu1() {
  const modalRef = React.useRef<SlideModalRef>({} as any);
  const touchRef = React.useRef<TouchableOpacity>(null);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const screenWidth = React.useRef(Dimensions.get('window').width).current;
  const screenHeight = React.useRef(Dimensions.get('window').height).current;
  const { getComponentVerticesCoordinate } = useContextMenu();

  const options = React.useMemo(
    () => [
      { label: 'Option 1', onPress: () => console.log('Option 1 selected') },
      { label: 'Option 2', onPress: () => console.log('Option 2 selected') },
    ],
    []
  );

  const handleLongPress = (event: GestureResponderEvent) => {
    const {
      pageX: pressedX,
      pageY: pressedY,
      locationX,
      locationY,
    } = event.nativeEvent;

    console.log('pressedX:', pressedX);
    console.log('pressedY:', pressedY);
    console.log('locationX:', locationX);
    console.log('locationY:', locationY);
    // 设置当前按下的坐标点
    // setTouchPosition({ x: pressedX, y: pressedY }); // 设置当前长按位置坐标

    // 获取当前组件的屏幕坐标
    touchRef.current?.measure((x, y, width, height, pageX, pageY) => {
      console.log('X:', x);
      console.log('Y:', y);
      console.log('Width:', width);
      console.log('Height:', height);
      console.log('PageX:', pageX);
      console.log('PageY:', pageY);
      console.log('ScreenWidth:', screenWidth);
      console.log('ScreenHeight:', screenHeight);

      // 设置当前组件的坐标点
      setTouchPosition(
        getComponentVerticesCoordinate({
          pressedX: pressedX,
          pressedY: pressedY,
          componentX: pageX,
          componentY: pageY,
          componentWidth: width,
          componentHeight: height,
        })
      ); // 设置当前组件位置坐标
    });

    modalRef.current.startShow();
  };

  return (
    <View
      style={{
        top: 100,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'blue',
      }}
    >
      <TouchableOpacity
        ref={touchRef}
        onLongPress={handleLongPress}
        style={{
          width: screenWidth - 40,
          height: screenHeight - 140,
          backgroundColor: 'green',
        }}
      >
        <Text>Long press me</Text>
      </TouchableOpacity>
      <ContextMenu
        propsRef={modalRef}
        position={touchPosition}
        // containerStyle={styles.menuContainer}
      >
        <View style={styles.menuContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={option.onPress}
            >
              <Text style={styles.menuItemText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ContextMenu>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  menuItem: {
    padding: 10,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default function TestMain() {
  return <TestContextMenu1 />;
}
