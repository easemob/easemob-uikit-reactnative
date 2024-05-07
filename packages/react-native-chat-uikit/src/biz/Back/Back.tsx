import * as React from 'react';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';

/**
 * Navigation bar back button style.
 * @returns JSX.Element
 */
export function BackButton() {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    icon: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
  });
  return (
    <Icon
      name={'chevron_left'}
      style={{ width: 24, height: 24, tintColor: getColor('icon') }}
    />
  );
}
