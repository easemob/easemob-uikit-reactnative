import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext, useThemeContext } from '../../theme';
import { IconButton, Text1Button } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { TextInput } from '../../ui/TextInput';

/**
 * Search Component properties.
 */
export type SearchProps = {
  /**
   * Cancel button click event.
   */
  onCancel?: () => void;
  /**
   * Text change event.
   */
  onChangeText?: ((text: string) => void) | undefined;
  /**
   * Text value.
   */
  value?: string | undefined;
  /**
   * Back button click event.
   */
  onBack?: () => void;
};

/**
 * Search Component.
 */
export function Search(props: SearchProps) {
  const { onCancel, onChangeText, value, onBack } = props;
  const { tr } = useI18nContext();
  const { style, cornerRadius } = useThemeContext();
  const { input } = cornerRadius;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg2: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    color: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    cursor: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    icon: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
  });
  return (
    <View
      style={
        {
          // flex: 1,
          // paddingTop: 100,
        }
      }
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: getColor('bg'),
          paddingLeft: 8,
          // paddingRight: 8,
        }}
      >
        {onBack ? (
          <IconButton
            iconName={'chevron_left'}
            style={{
              width: 24,
              height: 24,
              tintColor: getColor('icon'),
            }}
            onPress={onBack}
          />
        ) : null}
        <View
          style={{
            height: 44,
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <TextInput
            containerStyle={{
              backgroundColor: getColor('bg2'),
              justifyContent: 'center',
              // borderRadius: 18,
              height: 36,
            }}
            style={{
              paddingLeft: 35,
              color: getColor('color'),
            }}
            onChangeText={onChangeText}
            value={value}
            keyboardAppearance={style === 'light' ? 'light' : 'dark'}
            autoFocus={true}
            cursorColor={getColor('cursor')}
            enableClearButton={true}
            clearButtonStyle={{ padding: 7 }}
          />
          <Icon
            name={'magnifier'}
            style={{
              position: 'absolute',
              left: 8,
              width: 22,
              height: 22,
              tintColor: getColor('color'),
            }}
          />
        </View>
        {onCancel ? (
          <Text1Button
            sizesType={'middle'}
            radiusType={input}
            contentType={'only-text'}
            text={tr('cancel')}
            onPress={onCancel}
            style={{ paddingHorizontal: 20 }}
          />
        ) : null}
      </View>
    </View>
  );
}
