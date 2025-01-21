import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Image } from '../../ui/Image';

/**
 * Blank placeholder component.
 * @returns JSX.Element
 */
export function EmptyPlaceholder() {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    fg: {
      light: colors.neutral[7],
      dark: colors.neutral[4],
    },
  });
  return (
    <View style={[styles.container, { backgroundColor: getColor('bg') }]}>
      <Image
        source={require('../../assets/bg/blank.png')}
        style={{ height: 140 }}
        resizeMode={'contain'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
