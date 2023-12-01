import * as React from 'react';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Switch, SwitchProps } from './Switch';

export function CommonSwitch(
  props: Omit<SwitchProps, 'thumbColor' | 'thumbBackgroundColor' | 'trackColor'>
) {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    switch_fg: {
      light: colors.neutral[100],
      dark: colors.neutral[100],
    },
    switch_track_disable: {
      light: colors.neutral[9],
      dark: colors.neutral[3],
    },
    switch_track_enable: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  return (
    <Switch
      thumbColor={getColor('switch_fg')}
      thumbBackgroundColor={getColor('switch_fg')}
      trackColor={{
        false: getColor('switch_track_disable'),
        true: getColor('switch_track_enable'),
      }}
      {...props}
    />
  );
}
