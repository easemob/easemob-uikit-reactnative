import * as React from 'react';

import type { ReleaseArea } from '../types';
import { createTheme, useCreateTheme } from './theme';
import type { Palette, Theme, ThemeType } from './types';

/**
 * Create a dark Theme.
 * @param palette - The palette of the Theme. {@link Palette}
 * @returns The dark Theme.
 */
export function createDarkTheme(
  palette: Palette,
  releaseArea?: ReleaseArea
): Theme {
  return createTheme({ palette, themeType: 'dark', releaseArea });
}

/**
 * Create a dark Theme.
 * @param palette - The palette of the Theme. {@link Palette}
 * @returns The dark Theme.
 */
export function useDarkTheme(
  palette: Palette,
  releaseArea?: ReleaseArea
): Theme {
  const params = React.useMemo(() => {
    return { palette, themeType: 'dark' as ThemeType, releaseArea };
  }, [palette, releaseArea]);
  const { createTheme } = useCreateTheme(params);
  return createTheme();
}
