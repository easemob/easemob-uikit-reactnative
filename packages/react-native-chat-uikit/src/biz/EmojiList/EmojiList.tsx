import * as React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import emoji from 'twemoji';

import { FACE_ASSETS } from '../../assets';
import { useConfigContext } from '../../config';
import {
  useCheckType,
  useColors,
  useCompare,
  useGetStyleProps,
} from '../../hook';
import { usePaletteContext } from '../../theme';
import { Text } from '../../ui/Text';
import { gCountPerRow } from './EmojiList.const';
import { EmojiListFloatButtonMemo } from './EmojiListFloatButton';

/**
 * Emoji List Component properties.
 */
export type EmojiListProps = {
  /**
   * Callback function when an emoji is selected.
   */
  onFace: (id: string) => void;
  /**
   * Callback function when the delete button is clicked.
   */
  onDel: () => void;
  /**
   * Callback function when the send button is clicked.
   */
  onSend: () => void;
  /**
   * The style of the container.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * The number of emojis per row.
   */
  countPerRow?: number;
  /**
   * The list of emoji expressions.
   *
   * The format needs to be followed. For example: `U+1F641` {@link FACE_ASSETS}. It will replace the built-in emoji  list.
   */
  emojiList?: string[];
};

/**
 * List of emoji expressions.
 *
 * @param props {@link EmojiListProps}
 * @returns JSX.Element
 */
export function EmojiList(props: EmojiListProps) {
  const { colors } = usePaletteContext();
  const { width: winWidth } = useWindowDimensions();
  const { getColor } = useColors({
    bg1: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    btn1: {
      light: colors.neutral[3],
      dark: colors.neutral[98],
    },
    btn2: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  const {
    onFace,
    containerStyle,
    countPerRow = gCountPerRow,
    emojiList,
    onDel,
    onSend,
  } = props;
  const { getStyleSize } = useGetStyleProps();
  const { width: propsWidth } = getStyleSize(containerStyle);
  const { checkType } = useCheckType();
  const { fontFamily } = useConfigContext();
  if (propsWidth) {
    checkType(propsWidth, 'number');
  }
  const getUnitSize = () => {
    if (propsWidth) {
      return (propsWidth as number) / countPerRow - 1;
    }
    return winWidth / countPerRow - 1;
  };
  const { enableCompare } = useConfigContext();
  useCompare(getColor, { enabled: enableCompare });

  const _emojiList = emojiList ?? FACE_ASSETS;

  return (
    <View
      style={[
        {
          // height: gAspectRatio * winWidth,
          backgroundColor: getColor('bg1'),
        },
        containerStyle,
      ]}
    >
      <ScrollView>
        <View style={styles.group}>
          <View style={styles.list}>
            {_emojiList.map((v, i) => {
              const r = emoji.convert.fromCodePoint(v.substring(2));
              return (
                <Pressable
                  key={i}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: getUnitSize(),
                    height: getUnitSize(),
                    // alignSelf: 'baseline', // !!! crash
                  }}
                  onPress={() => {
                    onFace?.(v);
                  }}
                >
                  <Text
                    style={{
                      fontSize: Platform.OS === 'ios' ? 32 : 26,
                      fontFamily: fontFamily,
                    }}
                  >
                    {r}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <EmojiListFloatButtonMemo
        iconName={'arrow_left_thick'}
        isVisible={true}
        onClicked={onDel}
        containerStyle={{
          right: 16 + 36 + 12,
          bottom: 16,
          borderRadius: 4,
          backgroundColor: getColor('bg1'),
        }}
        style={{
          tintColor: getColor('btn1'),
        }}
      />
      <EmojiListFloatButtonMemo
        iconName={'airplane'}
        isVisible={true}
        onClicked={onSend}
        containerStyle={{
          right: 16,
          bottom: 16,
          borderRadius: 4,
          backgroundColor: getColor('btn2'),
        }}
        style={{
          tintColor: getColor('bg1'),
        }}
      />
    </View>
  );
}

const EmojiListCompare = (
  _prevProps: Readonly<EmojiListProps>,
  _nextProps: Readonly<EmojiListProps>
) => {
  return true;
};

const styles = StyleSheet.create({
  group: { alignItems: 'center', flex: 1 },
  title: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
  },
});

export const EmojiListMemo = React.memo(EmojiList, EmojiListCompare);
