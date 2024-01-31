import * as React from 'react';
import {
  Animated,
  // TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { ErrorCode, UIKitError } from '../../error';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Text } from '../Text';
import {
  gHeaderHeight,
  gIndicatorBorderRadius,
  gIndicatorHeight,
  gIndicatorWidth,
} from './TabPage.const';
import { useTabPageHeaderAnimation2 } from './TabPageHeader.hooks';
import type { TabPageHeaderProps } from './types';

export function TabPageHeader(props: TabPageHeaderProps) {
  const {
    propRef,
    onClicked,
    titles,
    width: initWidth,
    indicatorStyle,
    containerStyle,
    content,
    initIndex,
  } = props;
  const { width: winWidth } = useWindowDimensions();
  const { colors } = usePaletteContext();
  // const { getColor } = useGetColor();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    selected: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    no_selected: {
      light: colors.neutral[7],
      dark: colors.neutral[4],
    },
  });
  const [currentIndex, setCurrentIndex] = React.useState(initIndex ?? 0);
  const count = titles.length;
  const indicatorWidth = (indicatorStyle as any)?.width ?? 28;
  const width = initWidth ?? winWidth;
  const { left, toNext, unitWidth } = useTabPageHeaderAnimation2({
    index: initIndex,
    width: width,
    count: count,
    indicatorWidth: indicatorWidth,
  });

  if (indicatorWidth * count >= width) {
    throw new UIKitError({ code: ErrorCode.params });
  }

  if (propRef.current) {
    propRef.current.toLeft = (movedCount: number) => {
      if (movedCount === 0) return;
      const cur = currentIndex - movedCount;
      setCurrentIndex(cur);
      toNext({
        count: count,
        width: width,
        indicatorWidth: indicatorWidth,
        index: cur,
      })();
    };
    propRef.current.toRight = (movedCount: number) => {
      if (movedCount === 0) return;
      const cur = currentIndex + movedCount;
      setCurrentIndex(cur);
      toNext({
        count: count,
        width: width,
        indicatorWidth: indicatorWidth,
        index: cur,
      })();
    };
  }

  return (
    <View
      style={{
        flexDirection: 'column',
        height: gHeaderHeight + gIndicatorHeight,
      }}
    >
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '100%',
          },
          containerStyle,
        ]}
      >
        {titles.map((v, i) => {
          return (
            <View
              key={i}
              style={[
                {
                  height: gHeaderHeight,
                  width: unitWidth - unitWidth * 0.1,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                content?.containerStyle,
              ]}
              onTouchEnd={() => {
                onClicked?.(i);
              }}
            >
              <Text
                textType={'medium'}
                paletteType={'title'}
                style={[
                  content?.style,
                  {
                    color: getColor(
                      currentIndex === i ? 'selected' : 'no_selected'
                    ),
                  },
                ]}
              >
                {v.title}
              </Text>
            </View>
          );
        })}
      </View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: gIndicatorWidth,
            height: gIndicatorHeight,
            borderRadius: gIndicatorBorderRadius,
            backgroundColor: getColor('backgroundColor'),
            bottom: 0,
            left: left,
          },
          indicatorStyle,
        ]}
      />
    </View>
  );
}

export type TabPageHeaderComponent = typeof TabPageHeader;
