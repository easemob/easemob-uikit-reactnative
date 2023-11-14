import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { LoadingIcon } from '../../ui/Image';

/**
 * The data is not ready for loading placeholder component.
 * @returns JSX.Element
 */
export function LoadingPlaceholder() {
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
      <LoadingIcon
        style={{ width: 36, height: 36, tintColor: getColor('fg') }}
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
