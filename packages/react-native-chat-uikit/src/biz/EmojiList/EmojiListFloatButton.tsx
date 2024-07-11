import * as React from 'react';
import { ImageStyle, StyleProp, View, ViewStyle } from 'react-native';

import type { IconNameType } from '../../assets';
import { useColors } from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { IconButton } from '../../ui/Button';

type EmojiListFloatButtonProps = {
  isVisible: boolean;
  onClicked: () => void;
  iconName: IconNameType;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};
export function EmojiListFloatButton(params: EmojiListFloatButtonProps) {
  const { isVisible, onClicked, iconName, containerStyle, style } = params;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    fg2: {
      light: colors.neutral[3],
      dark: colors.neutral[98],
    },
  });
  const { shadow } = useThemeContext();
  return (
    <View
      style={{
        //  WARN  (ADVICE) View #3647 of type RCTView has a shadow set but cannot calculate shadow efficiently. Consider setting a background color to fix this, or apply the shadow to a more specific component.
        // backgroundColor: getColor('backgroundColor'),
        ...shadow.style.small[0],
        display: isVisible === true ? 'flex' : 'none',
      }}
    >
      <View
        style={{
          //  WARN  (ADVICE) View #3645 of type RCTView has a shadow set but cannot calculate shadow efficiently. Consider setting a background color to fix this, or apply the shadow to a more specific component.
          // backgroundColor: getColor('backgroundColor'),
          ...shadow.style.small[1],
        }}
      >
        <View
          style={[
            {
              position: 'absolute',
              backgroundColor: getColor('bg'),
              borderRadius: 44,
            },
            containerStyle,
          ]}
        >
          <IconButton
            iconName={iconName}
            style={[
              {
                width: 24,
                height: 24,
                margin: 10,
                tintColor: getColor('fg2'),
              },
              style,
            ]}
            onPress={onClicked}
            frequencyInterval={200}
          />
        </View>
      </View>
    </View>
  );
}

const EmojiListFloatButtonCompare = (
  prevProps: Readonly<EmojiListFloatButtonProps>,
  nextProps: Readonly<EmojiListFloatButtonProps>
) => {
  if (prevProps.isVisible !== nextProps.isVisible) {
    return false;
  }
  return true;
};

export const EmojiListFloatButtonMemo = React.memo(
  EmojiListFloatButton,
  EmojiListFloatButtonCompare
);
