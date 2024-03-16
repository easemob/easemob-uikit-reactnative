import * as React from 'react';
import { Dimensions, Platform, Pressable, View } from 'react-native';
import emoji from 'twemoji';

import type { IconNameType } from '../../assets';
import { useConfigContext } from '../../config';
import { useColors, useGetStyleProps } from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import type { EmojiIconItem } from '../types';

export type BottomSheetMenuHeaderProps = {
  emojiList?: EmojiIconItem[];
  onClickedEmoji?: (emoji: IconNameType | string) => void;
  /**
   * Whether to use the emoji chat mode.
   *
   * Its setting will affect the type of the return value of `onClickedEmoji`. If true, returns the emoji string, otherwise returns the `U+xxxxx` string.
   *
   * @default false
   */
  isEmojiCharacter?: boolean;
};

export function BottomSheetMenuHeader(props: BottomSheetMenuHeaderProps) {
  const { emojiList, onClickedEmoji, isEmojiCharacter = false } = props;
  const { fontFamily } = useConfigContext();
  const { cornerRadius } = usePaletteContext();
  const { getBorderRadius } = useGetStyleProps();
  const { cornerRadius: corner } = useThemeContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    selected: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });

  return (
    <View
      style={{
        flex: undefined,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: Dimensions.get('window').width,
      }}
    >
      {emojiList?.map((v, i) => {
        const r = emoji.convert.fromCodePoint(v.name.substring(2));
        if (i === emojiList.length - 1) {
          return (
            <Pressable key={i} onPress={() => onClickedEmoji?.('faceplus')}>
              <View
                style={{
                  borderRadius: getBorderRadius({
                    height: Platform.OS === 'ios' ? 36 : 36,
                    crt: corner.avatar,
                    cr: cornerRadius,
                  }),
                }}
              >
                <Icon name={'faceplus'} style={{ height: 36, width: 36 }} />
              </View>
            </Pressable>
          );
        }
        return (
          <Pressable
            key={i}
            style={{
              backgroundColor: getColor(
                v.state === 'selected' ? 'selected' : ''
              ),
              borderRadius: getBorderRadius({
                height: Platform.OS === 'ios' ? 32 : 32,
                crt: corner.avatar,
                cr: cornerRadius,
              }),
            }}
            onPress={() =>
              onClickedEmoji?.(isEmojiCharacter === true ? r : v.name)
            }
          >
            <Text
              style={{
                fontSize: Platform.OS === 'ios' ? 32 : 32,
                fontFamily: fontFamily,
              }}
            >
              {r}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export type BottomSheetMenuHeaderType =
  | React.FC<BottomSheetMenuHeaderProps>
  | React.ReactElement<BottomSheetMenuHeaderProps>;
