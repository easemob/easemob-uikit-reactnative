import * as React from 'react';
import { Dimensions, Platform, Pressable, View } from 'react-native';
import emoji from 'twemoji';

import { useConfigContext } from '../../config';
import { useColors, useGetStyleProps } from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { SingleLineText } from '../../ui/Text';
import { MessageMenuHeaderProps } from '../types';

export function BottomSheetMenuHeader(props: MessageMenuHeaderProps) {
  const {
    emojiList,
    onClickedEmoji,
    isEmojiCharacter = false,
    messageMenuStyle = 'bottom-sheet',
  } = props;
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
  const screenWidth = Dimensions.get('window').width;
  const contentWidth = screenWidth >= 392 ? screenWidth - 42 : screenWidth - 32;
  const width =
    messageMenuStyle === 'bottom-sheet' ? screenWidth : contentWidth;

  return (
    <View
      style={{
        flex: undefined,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: width,
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
                    height: Platform.OS === 'ios' ? 50 : 50,
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
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() =>
              onClickedEmoji?.(isEmojiCharacter === true ? r : v.name)
            }
          >
            <SingleLineText
              style={{
                fontSize: Platform.OS === 'ios' ? 32 : 32,
                fontFamily: fontFamily,
                color: getColor('fg'),
              }}
            >
              {r}
            </SingleLineText>
          </Pressable>
        );
      })}
    </View>
  );
}
