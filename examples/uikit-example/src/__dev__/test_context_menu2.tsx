import React, { useState } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SlideModal, SlideModalRef } from 'react-native-chat-uikit';

const ContextMenu = (props: {
  modalRef: React.MutableRefObject<SlideModalRef>;
  options: {
    label: string;
    onPress: () => void;
  }[];
  position: {
    x: number;
    y: number;
  };
}) => {
  const { modalRef, options, position } = props;
  const screenWidth = React.useRef(Dimensions.get('window').width).current;
  const screenHeight = React.useRef(Dimensions.get('window').height).current;
  const [componentHeight, setComponentHeight] = useState<number | undefined>(
    undefined
  );
  const [componentWidth, setComponentWidth] = useState<number | undefined>(
    undefined
  );
  console.log('test:ContextMenu:', screenWidth, screenHeight);

  // 计算组件在屏幕中的位置，返回组件屏幕上下左右的位置
  // 如果组件超出屏幕范围，则调整组件位置
  // 如果组件左边距离右边屏幕小于组件宽度，则将左边值设置为undefined，右边值为鼠标点击位置
  // 如果组件右边距离左边屏幕小于组件宽度，则将右边值设置为undefined, 左边值为鼠标点击位置
  // 如果组件上边距离下边屏幕小于组件高度，则将上边值设置为undefined，下边值为鼠标点击位置
  // 如果组件下边距离上边屏幕小于组件高度，则将下边值设置为undefined，上边值为鼠标点击位置
  const calculate = React.useCallback(
    (params: {
      pressedX: number;
      pressedY: number;
      screenWidth: number;
      screenHeight: number;
      componentWidth: number;
      componentHeight: number;
    }) => {
      const {
        pressedX,
        pressedY,
        screenWidth,
        screenHeight,
        componentWidth,
        componentHeight,
      } = params;
      let left: number | undefined = pressedX;
      let top: number | undefined = pressedY;
      let right: number | undefined;
      let bottom: number | undefined;
      if (pressedX + componentWidth > screenWidth) {
        left = undefined;
        right = screenWidth - pressedX;
      }
      if (pressedY + componentHeight > screenHeight) {
        top = undefined;
        bottom = screenHeight - pressedY;
      }
      console.log(
        'test:ContextMenu:calculateResult:',
        left,
        top,
        right,
        bottom
      );
      return { left, top, right, bottom };
    },
    []
  );

  const calculateResult = React.useMemo(
    () =>
      calculate({
        pressedX: position.x,
        pressedY: position.y,
        screenWidth: screenWidth,
        screenHeight: screenHeight,
        componentWidth: componentWidth ?? 0,
        componentHeight: componentHeight ?? 0,
      }),
    [
      calculate,
      componentHeight,
      componentWidth,
      position.x,
      position.y,
      screenHeight,
      screenWidth,
    ]
  );

  const _onLayout = React.useCallback((event: LayoutChangeEvent) => {
    console.log('test:ContextMenu:_onLayout:', event.nativeEvent.layout);
    setComponentHeight(event.nativeEvent.layout.height);
    setComponentWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <SlideModal
      propsRef={modalRef}
      modalAnimationType="fade"
      backgroundColor={'rgba(1,1,1, 0.2)'}
      backgroundTransparent={false}
      onRequestModalClose={() => {
        modalRef.current.startHide();
      }}
      enableSlideComponent={false}
    >
      <View
        style={[
          styles.menuContainer,
          {
            position: 'absolute',
            top: position.y,
            left: position.x,
            bottom: undefined,
            right: undefined,
            height: componentHeight,
            width: componentWidth,
            ...calculateResult,
          },
        ]}
        onLayout={_onLayout}
      >
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
    </SlideModal>
  );
};

export default function YourComponent() {
  const modalRef = React.useRef<SlideModalRef>({} as any);
  const touchRef = React.useRef<TouchableOpacity>(null);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const screenWidth = React.useRef(Dimensions.get('window').width).current;
  const screenHeight = React.useRef(Dimensions.get('window').height).current;

  const options = [
    { label: 'Option 1', onPress: () => console.log('Option 1 selected') },
    { label: 'Option 2', onPress: () => console.log('Option 2 selected') },
  ];

  // 通过计算选择组件的上下左右的坐标点
  // 组件内部分为4个象限，分别为左上，右上，左下，右下，如果按下坐标在其中一个象限，则选择该象限的坐标
  const calculate = (params: {
    pressedX: number;
    pressedY: number;
    componentX: number;
    componentY: number;
    componentWidth: number;
    componentHeight: number;
  }): { x: number; y: number } => {
    const {
      pressedX,
      pressedY,
      componentX,
      componentY,
      componentWidth,
      componentHeight,
    } = params;
    const leftTop = { x: componentX, y: componentY };
    const rightTop = { x: componentX + componentWidth, y: componentY };
    const leftBottom = { x: componentX, y: componentY + componentHeight };
    const rightBottom = {
      x: componentX + componentWidth,
      y: componentY + componentHeight,
    };
    const center = {
      x: componentX + componentWidth / 2,
      y: componentY + componentHeight / 2,
    };

    const inLeftTop =
      pressedX >= leftTop.x &&
      pressedX <= center.x &&
      pressedY >= leftTop.y &&
      pressedY <= center.y;
    const inRightTop =
      pressedX >= center.x &&
      pressedX <= rightTop.x &&
      pressedY >= rightTop.y &&
      pressedY <= center.y;
    const inLeftBottom =
      pressedX >= leftBottom.x &&
      pressedX <= center.x &&
      pressedY >= center.y &&
      pressedY <= leftBottom.y;
    const inRightBottom =
      pressedX >= center.x &&
      pressedX <= rightBottom.x &&
      pressedY >= center.y &&
      pressedY <= rightBottom.y;
    console.log(
      'test:ContextMenu:calculate:',
      leftTop,
      rightTop,
      leftBottom,
      rightBottom,
      pressedX,
      pressedY,
      inLeftTop,
      inRightTop,
      inLeftBottom,
      inRightBottom
    );
    if (inLeftTop) {
      return leftTop;
    } else if (inRightTop) {
      return rightTop;
    } else if (inLeftBottom) {
      return leftBottom;
    } else if (inRightBottom) {
      return rightBottom;
    } else {
      return { x: 0, y: 0 }; // 按下坐标不在任何象限中，返回原点坐标
    }
  };

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

      // setTouchPosition({ x: pageX, y: pageY }); // 设置当前组件位置坐标
      setTouchPosition(
        calculate({
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
    <View style={{ top: 100, justifyContent: 'center', alignItems: 'center' }}>
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
        modalRef={modalRef}
        options={options}
        position={touchPosition}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
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
