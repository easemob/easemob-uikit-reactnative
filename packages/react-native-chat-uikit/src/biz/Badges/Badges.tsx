import * as React from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Text } from '../../ui/Text';

export const gMaxCount = 99;

export type BadgesProps = {
  count: number;
  maxCount?: number;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};
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
    return count > maxCount ? `${maxCount}+` : count;
  };
  const isUnitsDigit = () => {
    return count < 10;
  };
  return (
    <View
      style={[
        {
          borderRadius: 9,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: getColor('backgroundColor'),
          height: isUnitsDigit() ? 18 : 18,
          width: isUnitsDigit() ? 18 : undefined,
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
