import * as React from 'react';

import { createTheme, useCreateTheme } from './theme';
import type { Palette, Theme, ThemeType } from './types';

/**
 * Create a dark Theme.
 * @param palette - The palette of the Theme. {@link Palette}
 * @returns The dark Theme.
 */
export function createDarkTheme(palette: Palette): Theme {
  return createTheme({ palette, themeType: 'dark' });
}

/**
 * Create a dark Theme.
 * @param palette - The palette of the Theme. {@link Palette}
 * @returns The dark Theme.
 */
export function useDarkTheme(palette: Palette): Theme {
  const params = React.useMemo(() => {
    return { palette, themeType: 'dark' as ThemeType };
  }, [palette]);
  const { createTheme } = useCreateTheme(params);
  return createTheme();
}
