import * as React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

import { useDelayExecTask } from '../../hook';
import { timeoutTask } from '../../utils';
import { gAnimatedDuration } from './TabPage.const';
import { calculateIndex } from './TabPage.hooks';
import type { TabPageBodyTProps } from './types';

export function TabPageBodyT<Props extends {} = {}>(
  props: TabPageBodyTProps<Props>
) {
  const {
    style,
    childrenCount,
    RenderChildren,
    RenderChildrenProps,
    propsRef,
    height: initHeight,
    width: initWidth,
    containerStyle,
    initIndex = 0,
    onLayout: propsOnLayout,
    onCurrentIndex,
    onScroll: propsScroll,
    onMomentumScrollEnd: propsOnMomentumScrollEnd,
    scrollEnabled,
    ...others
  } = props;
  const ref = React.useRef<ScrollView>({} as any);
  const { width: winWidth } = useWindowDimensions();
  const w = initWidth ?? winWidth;
  let viewRef = React.useRef<View | undefined>();
  const [currentIndex, setCurrentIndex] = React.useState(initIndex);
  if (propsRef.current) {
    propsRef.current.scrollTo = (index: number, animated?: boolean) => {
      ref.current?.scrollTo({ x: index * w, animated: animated });
      timeoutTask(gAnimatedDuration, () => setCurrentIndex(index));
      onCurrentIndex?.(index);
    };
  }
  const { delayExecTask: _onCurrentIndex } = useDelayExecTask(
    100,
    (index: number) => {
      timeoutTask(gAnimatedDuration, () => setCurrentIndex(index));
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
        scrollEnabled={scrollEnabled}
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
        {Array.from({ length: childrenCount }, (_, i) => i).map((index, i) => {
          return (
            <View key={i} style={{ width: w }}>
              <RenderChildren
                {...RenderChildrenProps}
                index={index}
                currentIndex={currentIndex}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
