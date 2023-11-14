import * as React from 'react';
import {
  ScrollView,
  StyleProp,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

import { getCurTs } from '../../utils';
import { gJitterValue } from './SlideListItem.const';

/**
 * @description The props of SlideListItem.
 */
export type SlideListItemProps<DataT> = React.PropsWithChildren<{
  /**
   * The data of the component.
   */
  data: DataT;
  /**
   * The height of the component.
   */
  height: number;
  /**
   * The width of the slidable area on the left. If not set, it cannot be slid to the left.
   */
  leftExtraWidth?: number;
  /**
   * The width of the slidable area on the right. If not set, it cannot be slid to the right.
   */
  rightExtraWidth?: number;
  /**
   * The width of the component. If not set, the screen width is used.
   */
  width?: number;
  /**
   * The style of the container.
   */
  containerStyle?: StyleProp<ViewStyle>;

  onPress?: (data: DataT) => void;
  onLongPress?: (data: DataT) => void;
}>;
/**
 * @description The component of SlideListItem.
 * @param props {@link SlideListItemProps}
 */
export function SlideListItem<DataT = any>(props: SlideListItemProps<DataT>) {
  const {
    children,
    width: propsWidth,
    leftExtraWidth,
    rightExtraWidth,
    onPress,
    onLongPress,
    data,
    height,
    containerStyle,
  } = props;
  const horizontal = true;
  const bounces = false;
  const showsHorizontalScrollIndicator = false;
  const { width: winWidth } = useWindowDimensions();
  const width = propsWidth ?? winWidth;
  const scrollViewRef = React.useRef<ScrollView>(null);
  const isEditableRef = React.useRef(false);
  const currentX = React.useRef(0);
  const currentY = React.useRef(0);
  const startTime = React.useRef(0);
  const endTime = React.useRef(0);
  const _autoAlign = (moveX: number, left?: number, right?: number) => {
    if (left === undefined && right !== undefined) {
      const w = right / 2;
      if (moveX >= 0 && moveX < w) {
        isEditableRef.current = false;
        scrollViewRef.current?.scrollTo({ x: 0, animated: true });
      } else {
        isEditableRef.current = true;
        scrollViewRef.current?.scrollTo({ x: right, animated: true });
      }
    } else if (left !== undefined && right === undefined) {
      const w = left / 2;
      if (moveX >= 0 && moveX < w) {
        isEditableRef.current = true;
        scrollViewRef.current?.scrollTo({ x: 0, animated: true });
      } else {
        isEditableRef.current = false;
        scrollViewRef.current?.scrollTo({ x: left, animated: true });
      }
    } else if (left !== undefined && right !== undefined) {
      if (moveX < left) {
        const w = left / 2;
        if (moveX >= 0 && moveX < w) {
          isEditableRef.current = true;
          scrollViewRef.current?.scrollTo({ x: 0, animated: true });
        } else {
          isEditableRef.current = false;
          scrollViewRef.current?.scrollTo({ x: left, animated: true });
        }
      } else if (moveX > left) {
        const w = left + right / 2;
        if (moveX >= 0 && moveX < w) {
          isEditableRef.current = false;
          scrollViewRef.current?.scrollTo({ x: left, animated: true });
        } else {
          isEditableRef.current = true;
          scrollViewRef.current?.scrollTo({ x: left + right, animated: true });
        }
      }
    } else {
    }
  };
  const _onClicked = () => {
    if (isEditableRef.current === true) {
      return;
    }
    endTime.current = getCurTs();
    if (endTime.current - startTime.current < 1000) {
      onPress?.(data);
    } else {
      onLongPress?.(data);
    }
  };
  return (
    <View style={[containerStyle, { width: width, height: height }]}>
      <ScrollView
        ref={scrollViewRef}
        onScrollEndDrag={(event) => {
          const x = event.nativeEvent.contentOffset.x;
          _autoAlign(x, leftExtraWidth, rightExtraWidth);
        }}
        onTouchStart={(event) => {
          currentX.current = event.nativeEvent.locationX;
          currentY.current = event.nativeEvent.locationY;
          startTime.current = getCurTs();
        }}
        onTouchEnd={(event) => {
          if (
            event.nativeEvent.locationX < currentX.current + gJitterValue &&
            event.nativeEvent.locationX > currentX.current - gJitterValue &&
            event.nativeEvent.locationY < currentY.current + gJitterValue &&
            event.nativeEvent.locationY > currentY.current - gJitterValue
          ) {
            _onClicked();
          }
        }}
        bounces={bounces}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        contentOffset={{ x: leftExtraWidth ?? 0, y: 0 }}
      >
        {children}
      </ScrollView>
    </View>
  );
}
