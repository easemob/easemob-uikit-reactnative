import * as React from 'react';
import { TextInput as RNTextInput, View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext, useThemeContext } from '../../theme';
import { IconButton, Text1Button } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { TextInput } from '../../ui/TextInput';
import { timeoutTask } from '../../utils';

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
  const inputRef = React.useRef<RNTextInput>(null);
  const { tr } = useI18nContext();
  const { style, cornerRadius } = useThemeContext();
  const { input } = cornerRadius;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    cursor: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    h: {
      light: colors.neutral[6],
      dark: colors.neutral[4],
    },
  });

  React.useEffect(() => {
    // !!! node_modules/@react-navigation/native-stack/src/types.tsx `animationDuration`
    timeoutTask(500, () => inputRef.current?.focus());
  }, []);

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
            ref={inputRef}
            containerStyle={{
              backgroundColor: getColor('bg2'),
              justifyContent: 'center',
              // borderRadius: 18,
              height: 36,
            }}
            style={{
              paddingLeft: 35,
              color: getColor('fg'),
            }}
            onChangeText={onChangeText}
            value={value}
            keyboardAppearance={style === 'light' ? 'light' : 'dark'}
            autoFocus={false}
            cursorColor={getColor('cursor')}
            enableClearButton={true}
            clearButtonContainerStyle={{ padding: 7 }}
            placeholder={tr('_uikit_search_placeholder')}
            placeholderTextColor={getColor('h')}
          />
          <Icon
            name={'magnifier'}
            style={{
              position: 'absolute',
              left: 8,
              width: 22,
              height: 22,
              tintColor: getColor('icon'),
            }}
          />
        </View>
        {onCancel ? (
          <Text1Button
            sizesType={'middle'}
            radiusType={input}
            text={tr('cancel')}
            onPress={onCancel}
            style={{ paddingHorizontal: 20 }}
          />
        ) : null}
      </View>
    </View>
  );
}
