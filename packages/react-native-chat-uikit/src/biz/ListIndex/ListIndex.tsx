import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { useColors, useDelayExecTask } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Text } from '../../ui/Text';
import {
  g_index_alphabet_size,
  g_thumb_alphabet_size,
} from './ListIndex.const';
import type { ListIndexProps } from './types';

/**
 * List Index Component.
 *
 * This component is mainly used with alphabetical lists.
 */
export const ListIndex = (props: ListIndexProps) => {
  const {
    indexTitles,
    onIndexSelected,
    indexContainerStyle,
    fontContainerStyle,
    isVisibleLetter = false,
  } = props;
  const ref = React.useRef<View>(null);
  const offsetRef = React.useRef(0);
  const maxIndex = indexTitles.length - 1;
  const [currentIndex, setCurrentIndex] = React.useState<number | undefined>();
  const [currentTitle, setCurrentTitle] = React.useState<string | undefined>();
  const _onIndexSelected = (index: number) => {
    let _index = index;
    if (index < 0) {
      _index = 0;
    } else if (index > maxIndex) {
      _index = maxIndex;
    }
    setCurrentIndex(_index);
    setCurrentTitle(indexTitles[_index]?.[0]);
    onIndexSelected?.(_index);
  };
  const { delayExecTask } = useDelayExecTask(500, () => {
    setCurrentIndex(undefined);
    setCurrentTitle(undefined);
  });
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    fg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    fg2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });

  return (
    <>
      <View
        ref={ref}
        style={[
          {
            position: 'absolute',
            right: 2,
          },
          indexContainerStyle,
        ]}
        onLayout={(_e) => {
          // offsetRef.current = e.nativeEvent.layout.y;
          ref.current?.measure(
            (
              _x: number,
              _y: number,
              _width: number,
              _height: number,
              _pageX: number,
              pageY: number
            ) => {
              offsetRef.current = pageY;
            }
          );
        }}
        onTouchMove={(e) => {
          const y = e.nativeEvent.pageY;
          const index = Math.floor(
            (y - offsetRef.current) / g_index_alphabet_size
          );
          _onIndexSelected(index);
        }}
        onMoveShouldSetResponder={() => {
          return true;
        }}
        onTouchEnd={(e) => {
          const y = e.nativeEvent.pageY;
          const index = Math.floor(
            (y - offsetRef.current) / g_index_alphabet_size
          );
          _onIndexSelected(index);
          delayExecTask();
        }}
      >
        {indexTitles.map((section, index: number) => (
          <View
            key={index}
            style={{
              height: g_index_alphabet_size,
              width: g_index_alphabet_size,
              backgroundColor:
                currentIndex === index ? getColor('bg') : undefined,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: g_index_alphabet_size,
            }}
          >
            <Text
              paletteType={'label'}
              textType={'extraSmall'}
              style={{
                color:
                  currentIndex === index ? getColor('fg') : getColor('fg2'),
              }}
            >
              {section[0]}
            </Text>
          </View>
        ))}
      </View>
      {currentTitle && isVisibleLetter === true ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
            fontContainerStyle,
          ]}
          pointerEvents={'none'}
        >
          <View
            style={{
              backgroundColor: 'grey',
              height: g_thumb_alphabet_size,
              width: g_thumb_alphabet_size,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                lineHeight: 50,
                color: 'white',
              }}
            >
              {currentTitle}
            </Text>
          </View>
        </View>
      ) : null}
    </>
  );
};
