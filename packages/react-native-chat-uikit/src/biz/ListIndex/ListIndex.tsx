import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useDelayExecTask } from '../../hook';
import { Text } from '../../ui/Text';
import {
  g_index_alphabet_size,
  g_thumb_alphabet_size,
} from './ListIndex.const';

export type ListIndexProps = {
  indexTitles: string[];
  onIndexSelected: (index: number) => void;
  indexContainerStyle?: StyleProp<ViewStyle>;
  fontContainerStyle?: StyleProp<ViewStyle>;
};
export const ListIndex = (props: ListIndexProps) => {
  const {
    indexTitles,
    onIndexSelected,
    indexContainerStyle,
    fontContainerStyle,
  } = props;
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
    onIndexSelected(_index);
  };
  const { delayExecTask } = useDelayExecTask(500, () => {
    setCurrentIndex(undefined);
    setCurrentTitle(undefined);
  });
  return (
    <>
      <View
        style={[
          {
            position: 'absolute',
            right: 10,
          },
          indexContainerStyle,
        ]}
        onLayout={(e) => {
          offsetRef.current = e.nativeEvent.layout.y;
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
              backgroundColor: currentIndex === index ? 'blue' : undefined,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: g_index_alphabet_size,
            }}
          >
            <Text
              paletteType={'label'}
              textType={'extraSmall'}
              style={{ color: 'grey' }}
            >
              {section[0]}
            </Text>
          </View>
        ))}
      </View>
      {currentTitle ? (
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
