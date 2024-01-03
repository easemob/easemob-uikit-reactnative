import * as React from 'react';

import { generateButton } from './generate.button';
import { generateShadow } from './generate.shadow';
import type { createThemeParams, Theme } from './types';

/**
 * Context of the Theme.
 */
export const ThemeContext = React.createContext<Theme | undefined>(undefined);
ThemeContext.displayName = 'UIKitThemeContext';

/**
 * Properties of the Theme context.
 */
type ThemeContextProps = React.PropsWithChildren<{ value: Theme }>;

/**
 * The Theme context's provider.
 */
export function ThemeContextProvider({ value, children }: ThemeContextProps) {
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Get the Theme context's value.
 * @returns The Theme context's value.
 */
export function useThemeContext(): Theme {
  const theme = React.useContext(ThemeContext);
  if (!theme) throw Error(`${ThemeContext.displayName} is not provided`);
  return theme;
}

/**
 * Create a Theme.
 *
 * For a shortcut to create a `dark` theme, see `createDarkTheme`.
 *
 * For a shortcut to create a `light` theme, see `createLightTheme`.
 *
 * @param params - The parameters to create a Theme. {@link createThemeParams}
 * @returns The Theme.
 */
export function createTheme(params: createThemeParams): Theme {
  const { palette, themeType, releaseArea } = params;
  return {
    style: themeType,
    button: generateButton({
      palette: palette,
      themeType: themeType,
    }),
    shadow: generateShadow({
      palette: palette,
      themeType: themeType,
    }),
    cornerRadius: {
      avatar: releaseArea === 'china' ? 'extraSmall' : 'extraLarge',
      alert: releaseArea === 'china' ? 'extraSmall' : 'large',
      input: releaseArea === 'china' ? 'extraSmall' : 'extraLarge',
      bubble:
        releaseArea === 'china'
          ? ['extraSmall']
          : ['extraSmall', 'medium', 'extraLarge'],
    },
  };
}

/**
 * Create a Theme' hook.
 *
 * Cache the `createTheme` function.
 *
 * @param params - The parameters to create a Theme. {@link createThemeParams}
 * @returns The `createTheme` function.
 */
export function useCreateTheme(params: createThemeParams) {
  const theme = React.useMemo(() => createTheme(params), [params]);
  return {
    createTheme: () => theme,
  };
}
