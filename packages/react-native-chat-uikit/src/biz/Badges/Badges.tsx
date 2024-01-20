import * as React from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Text } from '../../ui/Text';

export const gMaxCount = 99;

export type BadgesProps = {
  /**
   * @description unread count.
   * - `undefined` means is disturb.
   * - `0` means no unread count.
   * - `others` means unread count.
   */
  count?: number;
  /**
   * Set the maximum value. Default value is 99.
   */
  maxCount?: number;
  /**
   * Text style properties.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Component container style properties.
   */
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * Unread components.
 */
export function Badges(props: BadgesProps) {
  const { count, maxCount = gMaxCount, containerStyle, textStyle } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    color: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    backgroundColor: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  const getCount = () => {
    if (count === undefined || count === 0) {
      return null;
    }
    return count > maxCount ? `${maxCount}+` : count;
  };
  const getSize = (type: 'width' | 'height') => {
    if (count === 0) {
      return 0;
    } else if (count === undefined) {
      return 8;
    } else if (count < 10) {
      return 18;
    } else {
      return type === 'width' ? undefined : 18;
    }
  };
  return (
    <View
      style={[
        {
          borderRadius: 9,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: getColor('backgroundColor'),
          height: getSize('height'),
          width: getSize('width'),
        },
        containerStyle,
      ]}
    >
      <Text
        paletteType={'label'}
        textType={'small'}
        style={[
          {
            color: getColor('color'),
            paddingHorizontal: 5,
          },
          textStyle,
        ]}
      >
        {getCount()}
      </Text>
    </View>
  );
}
