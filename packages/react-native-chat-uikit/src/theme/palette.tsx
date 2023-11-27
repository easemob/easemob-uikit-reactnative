import * as React from 'react';

import {
  generateBarrageColor,
  generateNeutralColor,
  generateNeutralSpecialColor,
  generatePrimaryColor,
} from './generate.color';
import {
  generateExtraSmallCornerRadius,
  generateLargeCornerRadius,
  generateMediumCornerRadius,
  generateSmallCornerRadius,
} from './generate.cr';
import {
  generateBodyFont,
  generateHeadlineFont,
  generateLabelFont,
  generateTitleFont,
} from './generate.font';
import { generateLineGradientPoint } from './generate.gradient';
import type {
  ColorLineGradientPalette,
  ColorsPalette,
  CornerRadiusPalette,
  createPaletteParams,
  FontsPalette,
  Palette,
} from './types';

/**
 * Context of the Palette.
 */
export const PaletteContext = React.createContext<Palette | undefined>(
  undefined
);
PaletteContext.displayName = 'UIKitPaletteContextContext';

/**
 * Properties of the Palette context.
 */
type PaletteContextProps = React.PropsWithChildren<{ value: Palette }>;

/**
 * The Palette context's provider.
 */
export function PaletteContextProvider({
  value,
  children,
}: PaletteContextProps) {
  return (
    <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>
  );
}

/**
 * Get the Palette context's value.
 * @returns The Palette context's value.
 */
export function usePaletteContext(): Palette {
  const palette = React.useContext(PaletteContext);
  if (!palette) throw Error(`${PaletteContext.displayName} is not provided`);
  return palette;
}

/**
 * Create a Palette.
 *
 * Create a default Palette. {@link createPresetPalette}
 *
 * @param params - The parameters to create a Palette. {@link createPaletteParams}
 * @returns The Palette.
 */
export function createPalette(params: createPaletteParams): Palette {
  const { colors } = params;
  return {
    colors: {
      primary: generatePrimaryColor(colors.primary),
      secondary: generatePrimaryColor(colors.secondary),
      error: generatePrimaryColor(colors.error),
      neutral: generateNeutralColor(colors.neutral),
      neutralSpecial: generateNeutralSpecialColor(colors.neutralSpecial),
      barrage: {
        onLight: generateBarrageColor('light'),
        onDark: generateBarrageColor('dark'),
      },
    } as ColorsPalette,
    fonts: {
      headline: generateHeadlineFont(),
      title: generateTitleFont(),
      label: generateLabelFont(),
      body: generateBodyFont(),
    } as FontsPalette,
    lineGradient: {
      topToBottom: generateLineGradientPoint('topToBottom'),
      bottomToTop: generateLineGradientPoint('bottomToTop'),
      leftToRight: generateLineGradientPoint('leftToRight'),
      rightToLeft: generateLineGradientPoint('rightToLeft'),
      leftTopToRightBottom: generateLineGradientPoint('leftTopToRightBottom'),
      leftBottomToRightTop: generateLineGradientPoint('leftBottomToRightTop'),
      rightTopToLeftBottom: generateLineGradientPoint('rightTopToLeftBottom'),
      rightBottomToLeftTop: generateLineGradientPoint('rightBottomToLeftTop'),
    } as ColorLineGradientPalette,
    cornerRadius: {
      extraSmall: generateExtraSmallCornerRadius(),
      small: generateSmallCornerRadius(),
      medium: generateMediumCornerRadius(),
      large: generateLargeCornerRadius(),
    } as CornerRadiusPalette,
  } as Palette;
}

/**
 * Create a Palette' hook.
 *
 * Create a default Palette. see {@link usePresetPalette}
 *
 * Cache the `createPalette` function.
 *
 * @param params - The parameters to create a Palette. {@link createPaletteParams}
 * @returns The `createPalette` function.
 */
export function useCreatePalette(params: createPaletteParams) {
  const palette = React.useMemo(() => createPalette(params), [params]);
  return {
    createPalette: () => palette,
  };
}
