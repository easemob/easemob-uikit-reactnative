import * as React from 'react';

import type { ReleaseArea } from '../types';
import { createTheme, useCreateTheme } from './theme';
import type { Palette, Theme, ThemeType } from './types';

/**
 * Create a light Theme.
 * @param palette - The palette of the Theme. {@link Palette}
 * @returns The light Theme.
 */
export function createLightTheme(
  palette: Palette,
  releaseArea?: ReleaseArea
): Theme {
  return createTheme({ palette, themeType: 'light', releaseArea });
}

/**
 * Create a light Theme.
 * @param palette - The palette of the Theme. {@link Palette}
 * @returns The light Theme.
 */
export function useLightTheme(
  palette: Palette,
  releaseArea?: ReleaseArea
): Theme {
  const params = React.useMemo(() => {
    return { palette, themeType: 'light' as ThemeType, releaseArea };
  }, [palette, releaseArea]);
  const { createTheme } = useCreateTheme(params);
  return createTheme();
}
