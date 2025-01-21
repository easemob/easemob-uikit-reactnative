import * as React from 'react';

import { createTheme, useCreateTheme } from './theme';
import type { Palette, Theme, ThemeType } from './types';

/**
 * Create a light Theme.
 * @param palette - The palette of the Theme. {@link Palette}
 * @returns The light Theme.
 */
export function createLightTheme(palette: Palette): Theme {
  return createTheme({ palette, themeType: 'light' });
}

/**
 * Create a light Theme.
 * @param palette - The palette of the Theme. {@link Palette}
 * @returns The light Theme.
 */
export function useLightTheme(palette: Palette): Theme {
  const params = React.useMemo(() => {
    return { palette, themeType: 'light' as ThemeType };
  }, [palette]);
  const { createTheme } = useCreateTheme(params);
  return createTheme();
}
