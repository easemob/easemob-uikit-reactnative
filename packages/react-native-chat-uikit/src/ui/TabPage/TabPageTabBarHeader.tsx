import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';

import { getElement, useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import type { TabPageHeaderProps } from '../../ui/TabPage';
import { calculateLeft } from '../../ui/TabPage/TabPageHeader.hooks';
import { SingleLineText } from '../../ui/Text';
import { gTabBarHeaderHeight } from './TabPage.const';

export type TabPageTabBarHeaderProps = TabPageHeaderProps & {
  StateViews?: (React.FC | React.ReactElement | null | undefined)[];
};

/**
 * tab component.
 */
export const TabPageTabBarHeader: React.FunctionComponent<
  TabPageTabBarHeaderProps
> = (props: TabPageTabBarHeaderProps) => {
  const {
    propRef,
    onClicked,
    titles: items,
    width: initWidth,
    containerStyle,
    content,
    initIndex,
    StateViews,
  } = props;
  const { width: winWidth } = useWindowDimensions();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    selected: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    no_selected: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  const [currentIndex, setCurrentIndex] = React.useState(initIndex ?? 0);
  const count = items.length;
  const width = initWidth ?? winWidth;
  const { unitWidth } = calculateLeft({
    width,
    count,
    index: initIndex ?? 0,
    indicatorWidth: 0,
  });

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
        height: gTabBarHeaderHeight,
        justifyContent: 'center',
        marginVertical: 3,
        borderTopColor: getColor('divider'),
        borderTopWidth: 0.5,
      }}
    >
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            // height: '100%',
          },
          containerStyle,
        ]}
      >
        {items.map((v, i) => {
          const StateView = StateViews?.[i];
          return (
            <View
              key={i}
              style={[
                {
                  height: gTabBarHeaderHeight,
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
              <Icon
                name={v.icon ?? 'loading'}
                style={[
                  {
                    height: 32,
                    width: 32,
                    tintColor: getColor(
                      currentIndex === i ? 'selected' : 'no_selected'
                    ),
                  },
                ]}
              />
              {v.title ? (
                <SingleLineText
                  textType={'extraSmall'}
                  paletteType={'label'}
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
                </SingleLineText>
              ) : null}
              {StateView ? (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: unitWidth / 2 - 4,
                  }}
                >
                  {getElement(StateView)}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
};
