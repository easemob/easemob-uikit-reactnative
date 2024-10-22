import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { gDotHeaderHeight } from './TabPage.const';
import type { TabPageHeaderProps } from './types';

export function TabPageDotHeader(props: TabPageHeaderProps) {
  const { propRef, onClicked, titles, containerStyle, content, initIndex } =
    props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    selected: {
      light: colors.neutral[5],
      dark: colors.neutral[5],
    },
    no_selected: {
      light: colors.neutral[9],
      dark: colors.neutral[9],
    },
  });
  const [currentIndex, setCurrentIndex] = React.useState(initIndex ?? 0);

  if (propRef.current) {
    propRef.current.toLeft = (movedCount: number) => {
      if (movedCount === 0) return;
      const cur = currentIndex - movedCount;
      setCurrentIndex(cur);
    };
    propRef.current.toRight = (movedCount: number) => {
      if (movedCount === 0) return;
      const cur = currentIndex + movedCount;
      setCurrentIndex(cur);
    };
  }

  return (
    <View
      style={{
        flexDirection: 'column',
      }}
    >
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            paddingTop: 2,
            paddingBottom: 8,
          },
          containerStyle,
        ]}
      >
        {titles.map((_, i) => {
          return (
            <View
              key={i}
              style={[
                {
                  height: gDotHeaderHeight,
                  width: gDotHeaderHeight,
                  borderRadius: gDotHeaderHeight,
                  backgroundColor: getColor(
                    currentIndex === i ? 'selected' : 'no_selected'
                  ),
                  marginHorizontal: gDotHeaderHeight,
                },
                content?.containerStyle,
              ]}
              onTouchEnd={() => {
                onClicked?.(i);
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

export type TabPageDotHeaderComponent = typeof TabPageDotHeader;
