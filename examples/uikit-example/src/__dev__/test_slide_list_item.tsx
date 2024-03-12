/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { getCurTs, SlideListItem } from 'react-native-chat-uikit';

export function MySlideListItem() {
  const horizontal = true;
  const bounces = false;
  const showsHorizontalScrollIndicator = false;
  const { width: winWidth } = useWindowDimensions();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const isEditableRef = React.useRef(false);
  const extraWidth = 100;
  const currentX = React.useRef(0);
  const currentY = React.useRef(0);
  const startTime = React.useRef(0);
  const endTime = React.useRef(0);
  const _autoAlign = (moveX: number, width: number) => {
    const w = width / 2;
    if (moveX >= 0 && moveX < w) {
      isEditableRef.current = false;
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    } else {
      isEditableRef.current = true;
      scrollViewRef.current?.scrollTo({ x: width, animated: true });
    }
  };
  const _onClicked = () => {
    if (isEditableRef.current === true) {
      return;
    }
    endTime.current = getCurTs();
    if (endTime.current - startTime.current < 1000) {
      // props.data?.onPress?.(props.data);
    } else {
      // props.data?.onLongPress?.(props.data);
    }
  };
  return (
    <View style={{ width: winWidth, height: 100, backgroundColor: 'red' }}>
      <ScrollView
        ref={scrollViewRef}
        onScrollEndDrag={(event) => {
          console.log('test:zuoyu: onScrollEndDrag');
          const x = event.nativeEvent.contentOffset.x;
          _autoAlign(x, extraWidth);
        }}
        onTouchStart={(event) => {
          console.log('test:zuoyu: onTouchStart');
          currentX.current = event.nativeEvent.locationX;
          currentY.current = event.nativeEvent.locationY;
          startTime.current = getCurTs();
        }}
        onTouchEnd={(event) => {
          console.log('test:zuoyu: onTouchEnd');
          if (
            event.nativeEvent.locationX < currentX.current + 1 &&
            event.nativeEvent.locationX > currentX.current - 1 &&
            event.nativeEvent.locationY < currentY.current + 1 &&
            event.nativeEvent.locationY > currentY.current - 1
          ) {
            _onClicked();
          }
        }}
        bounces={bounces}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        // style={{ width: 300, backgroundColor: 'purple', height: 40 }}
      >
        <View
          style={{
            width: winWidth + extraWidth,
            backgroundColor: 'yellow',
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              width: winWidth,
              height: 100,
              backgroundColor: 'green',
            }}
          />
          <View
            style={{
              width: extraWidth,
              height: 100,
              backgroundColor: 'orange',
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export function MyBidirectionalSlideListItem() {
  const horizontal = true;
  const bounces = false;
  const showsHorizontalScrollIndicator = false;
  const { width: winWidth } = useWindowDimensions();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const isEditableRef = React.useRef(false);
  const rightExtraWidth = 100;
  const leftExtraWidth = 200;
  const currentX = React.useRef(0);
  const currentY = React.useRef(0);
  const startTime = React.useRef(0);
  const endTime = React.useRef(0);
  const jitterValue = 1;
  const _autoAlign = (moveX: number, left: number, right: number) => {
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
  };
  const _onClicked = () => {
    console.log('test:zuoyu: _onClicked');
    if (isEditableRef.current === true) {
      return;
    }
    endTime.current = getCurTs();
    if (endTime.current - startTime.current < 1000) {
      // props.data?.onPress?.(props.data);
    } else {
      // props.data?.onLongPress?.(props.data);
    }
  };
  return (
    <View style={{ width: winWidth, height: 100, backgroundColor: 'red' }}>
      <ScrollView
        ref={scrollViewRef}
        onScrollEndDrag={(event) => {
          const x = event.nativeEvent.contentOffset.x;
          console.log('test:zuoyu: onScrollEndDrag:2:', x);
          _autoAlign(x, leftExtraWidth, rightExtraWidth);
        }}
        onTouchStart={(event) => {
          console.log('test:zuoyu: onTouchStart:2:');
          currentX.current = event.nativeEvent.locationX;
          currentY.current = event.nativeEvent.locationY;
          startTime.current = getCurTs();
        }}
        onTouchEnd={(event) => {
          console.log('test:zuoyu: onTouchEnd:2:');
          if (
            event.nativeEvent.locationX < currentX.current + jitterValue &&
            event.nativeEvent.locationX > currentX.current - jitterValue &&
            event.nativeEvent.locationY < currentY.current + jitterValue &&
            event.nativeEvent.locationY > currentY.current - jitterValue
          ) {
            _onClicked();
          }
        }}
        bounces={bounces}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        contentOffset={{ x: leftExtraWidth, y: 0 }}
        // style={{ width: 300, backgroundColor: 'purple', height: 40 }}
      >
        <View
          style={{
            width: winWidth + rightExtraWidth + leftExtraWidth,
            backgroundColor: 'yellow',
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              width: leftExtraWidth,
              height: 100,
              backgroundColor: 'orange',
            }}
          />
          <View
            style={{
              width: winWidth,
              height: 100,
              backgroundColor: 'green',
            }}
          />
          <View
            style={{
              width: rightExtraWidth,
              height: 100,
              backgroundColor: 'orange',
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

type Props = {
  id: number;
  title: string;
};
export function TestListItem() {
  const data = React.useRef<Props[]>(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => {
      return {
        id: v,
        title: v.toString(),
      };
    })
  );
  return (
    <FlatList
      data={data.current}
      renderItem={(info: ListRenderItemInfo<Props>) => {
        return <MyBidirectionalSlideListItem key={info.item.id} />;
      }}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, backgroundColor: 'red' }} />
      )}
    />
  );
}
export function TestListItem2() {
  const data = React.useRef<Props[]>(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => {
      return {
        id: v,
        title: v.toString(),
      };
    })
  );
  return (
    <FlatList
      data={data.current}
      renderItem={(info: ListRenderItemInfo<Props>) => {
        return (
          <SlideListItem
            height={100}
            leftExtraWidth={100}
            // rightExtraWidth={100}
            data={info.item}
            key={info.item.id}
            containerStyle={{
              // flexDirection: 'row',
              backgroundColor: 'orange',
            }}
            onPress={() => {
              console.log('test:zuoyu: onPress');
            }}
            onLongPress={() => {
              console.log('test:zuoyu: onLongPress');
            }}
          >
            <View
              style={{
                width: Dimensions.get('window').width + 100,
                height: '100%',
                backgroundColor: 'orange',
                flexDirection: 'row',
              }}
              onLayout={(e) => {
                console.log('test:zuoyu:onlayout:', e.nativeEvent.layout);
              }}
            >
              <View
                style={{
                  backgroundColor: 'yellow',
                  height: '100%',
                  width: 100,
                }}
              />
              <View
                style={{
                  backgroundColor: 'blue',
                  height: '100%',
                  width: Dimensions.get('window').width,
                }}
              />
              {/* <View
                style={{
                  backgroundColor: 'yellow',
                  height: '100%',
                  width: 100,
                }}
              /> */}
              <View />
            </View>
          </SlideListItem>
        );
      }}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, backgroundColor: 'red' }} />
      )}
    />
  );
}

export default function TestAlert() {
  return (
    <View style={{ flex: 1, backgroundColor: 'blue', paddingTop: 100 }}>
      <MySlideListItem />
      <MyBidirectionalSlideListItem />
      <View style={{ height: 10, backgroundColor: 'yellow' }} />
      {/* <TestListItem /> */}
      <TestListItem2 />
    </View>
  );
}
