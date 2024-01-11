import * as React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

import type { IconNameType } from '../../assets';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../Image';
import { Text } from '../Text';
import { gMaxTimeout } from './Button.const';

export type BlockButtonProps = {
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  iconName: IconNameType;
  text: string;
  preventHighFrequencyClicks?: boolean;
  frequencyInterval?: number;
};

export function BlockButton(props: BlockButtonProps) {
  const {
    containerStyle,
    iconName,
    text,
    preventHighFrequencyClicks = true,
    frequencyInterval = gMaxTimeout,
    onPress,
  } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[95],
      dark: colors.neutral[95],
    },
    fg: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  const clicked = React.useRef(false);

  const onPressInternal = () => {
    if (preventHighFrequencyClicks === true) {
      if (onPress) {
        if (clicked.current === false) {
          setTimeout(() => {
            clicked.current = false;
          }, frequencyInterval);
          clicked.current = true;
          onPress();
        }
      }
    } else {
      onPress?.();
    }
  };

  return (
    <TouchableOpacity
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: getColor('bg'),
          borderRadius: 8,
        },
        containerStyle,
      ]}
      onPress={onPressInternal}
    >
      <View>
        <Icon
          name={iconName}
          style={{ width: 32, height: 32, tintColor: getColor('fg') }}
        />
      </View>
      <Text
        textType={'extraSmall'}
        paletteType={'body'}
        style={{ color: getColor('fg') }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export type BlockButtonComponentType =
  | React.ComponentType<BlockButtonProps>
  | React.ExoticComponent<BlockButtonProps>;
