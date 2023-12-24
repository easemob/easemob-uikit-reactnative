import * as React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

import { useDelayExecTask } from '../../hook';
import { calculateIndex } from './TabPage.hooks';
import type { TabPageBodyProps } from './types';

export function TabPageBody(props: TabPageBodyProps) {
  const {
    style,
    children,
    propsRef,
    height: initHeight,
    width: initWidth,
    containerStyle,
    initIndex = 0,
    onLayout: propsOnLayout,
    onCurrentIndex,
    onScroll: propsScroll,
    onMomentumScrollEnd: propsOnMomentumScrollEnd,
    ...others
  } = props;
  const ref = React.useRef<ScrollView>({} as any);
  const { width: winWidth } = useWindowDimensions();
  const w = initWidth ?? winWidth;
  let viewRef = React.useRef<View | undefined>();
  if (propsRef.current) {
    propsRef.current.scrollTo = (index: number, animated?: boolean) => {
      ref.current?.scrollTo({ x: index * w, animated: animated });
      onCurrentIndex?.(index);
    };
  }
  const { delayExecTask: _onCurrentIndex } = useDelayExecTask(
    100,
    (index: number) => {
      onCurrentIndex?.(index);
    }
  );
  return (
    <View
      style={[
        {
          height: initHeight ? initHeight : undefined,
          flexGrow: 1,
        },
        containerStyle,
      ]}
      ref={(ref) => {
        if (ref) {
          viewRef.current = ref;
        }
      }}
    >
      <ScrollView
        ref={ref}
        style={[style]}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onLayout={(e) => {
          if (propsOnLayout) {
            propsOnLayout(e);
          }
          if (initIndex > 0) {
            ref.current?.scrollTo({ x: initIndex * w, animated: false });
          }
        }}
        onScroll={(e) => {
          propsScroll?.(e);
        }}
        onMomentumScrollEnd={(e) => {
          propsOnMomentumScrollEnd?.(e);
          const x = e.nativeEvent.contentOffset.x;
          _onCurrentIndex(calculateIndex({ width: w, contentOffsetX: x }));
        }}
        {...others}
      >
        {children.map((Body, i) => {
          return (
            <View key={i} style={{ width: w }}>
              {Body}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
