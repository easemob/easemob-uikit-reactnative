import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useColors, useGetStyleProps } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext, useThemeContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { SingleLineText } from '../../ui/Text';

/**
 * Search Style Component properties.
 */
export type SearchStyleProps = {
  /**
   * Title.
   */
  title: string;
  /**
   * Press event.
   */
  onPress: () => void;
};

/**
 * Search Style Component.
 */
export function SearchStyle(props: SearchStyleProps) {
  const { title, onPress } = props;
  const { colors, cornerRadius } = usePaletteContext();
  const { cornerRadius: corner } = useThemeContext();
  const { getBorderRadius } = useGetStyleProps();
  const { getColor } = useColors({
    fg2: {
      light: colors.neutral[6],
      dark: colors.neutral[4],
    },
  });
  const { tr } = useI18nContext();
  return (
    <View
      style={{
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        height: 44,
      }}
    >
      <Pressable onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            borderRadius: getBorderRadius({
              height: 36,
              crt: corner.input,
              cr: cornerRadius,
            }),
            height: 36,
            paddingVertical: 7,
            width: '100%',
            backgroundColor: getColor('bg2'),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon
            name={'magnifier'}
            style={{
              width: 22,
              height: 22,
              tintColor: getColor('fg2'),
            }}
          />
          <View style={{ width: 4 }} />
          <SingleLineText
            textType={'large'}
            paletteType={'body'}
            style={{
              color: getColor('fg2'),
            }}
          >
            {tr(title)}
          </SingleLineText>
        </View>
      </Pressable>
    </View>
  );
}
