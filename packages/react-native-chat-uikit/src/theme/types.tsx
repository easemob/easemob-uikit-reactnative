import type { ColorValue, TextStyle, ViewStyle } from 'react-native';

import type { Keyof, ReleaseArea } from '../types';

/**
 * The color enum value.
 */
export type Colors = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  95: string;
  98: string;
  100: string;
};

/**
 * The color palette.
 */
export type ColorsPalette = {
  primary: Colors;
  secondary: Colors;
  error: Colors;
  neutral: Colors;
  neutralSpecial: Colors;
  barrage: {
    onLight: Colors;
    onDark: Colors;
  };
};

/**
 * The font styles
 */
export type FontStyles = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight'
>;

/**
 * The icon styles
 */
export type IconStyles = {
  size?: number | string | undefined;
};

export type FontsType = Keyof<Fonts>;

/**
 * The font styles palette
 */
export type Fonts = {
  large: FontStyles;
  medium: FontStyles;
  small: FontStyles;
  extraSmall?: FontStyles;
};

export type FontsPaletteType = Keyof<FontsPalette>;

/**
 * The font styles palette
 */
export type FontsPalette = {
  headline: Fonts;
  title: Fonts;
  label: Fonts;
  body: Fonts;
};

/**
 * The gradient point
 */
export type GradientPoint = {
  x: number; // [0 - 1]
  y: number; // [0 - 1]
};

/**
 * The line gradient point
 */
export type LineGradientPoint = {
  start: GradientPoint;
  end: GradientPoint;
};

export type ColorLineGradientDirection = Keyof<ColorLineGradientPalette>;

/**
 * The line gradient palette
 */
export type ColorLineGradientPalette = {
  topToBottom: LineGradientPoint; // ⬇️
  bottomToTop: LineGradientPoint; // ⬆️
  leftToRight: LineGradientPoint; // ➡️
  rightToLeft: LineGradientPoint; // ⬅️
  leftTopToRightBottom: LineGradientPoint; // ↘️
  rightTopToLeftBottom: LineGradientPoint; // ↙️
  rightBottomToLeftTop: LineGradientPoint; // ↖️
  leftBottomToRightTop: LineGradientPoint; // ↗️
};

export type CornerRadiusPaletteType = Keyof<CornerRadiusPalette>;

/**
 * The corner radius palette
 */
export type CornerRadiusPalette = {
  extraSmall: number;
  small: number;
  medium: number;
  large: number;
  /**
   * The extra large corner radius.
   *
   * It is dynamic. It is calculated by the following formula:
   *
   * Half the maximum width or height.
   */
  extraLarge: number;
};

/**
 * The palette
 */
export interface Palette {
  colors: ColorsPalette;
  fonts: FontsPalette;
  lineGradient: ColorLineGradientPalette;
  cornerRadius: CornerRadiusPalette;
}

/**
 * The button state colors.
 */
export type ButtonColors = {
  color?: ColorValue | undefined;
  backgroundColor?: ColorValue | undefined;
  borderColor?: ColorValue | undefined;
};

/**
 * The button size.
 */
export type ButtonSize = Pick<
  ViewStyle,
  | 'borderWidth'
  | 'borderRadius'
  | 'height'
  | 'minWidth'
  | 'maxWidth'
  | 'paddingHorizontal'
  | 'paddingVertical'
  | 'width'
>;

export type ButtonSizesType = Keyof<ButtonSizes>;

/**
 * The button size style.
 */
export type ButtonSizes = {
  small: {
    button: ButtonSize;
    text: FontStyles;
    icon: IconStyles;
  };
  middle: {
    button: ButtonSize;
    text: FontStyles;
    icon: IconStyles;
  };
  large: {
    button: ButtonSize;
    text: FontStyles;
    icon: IconStyles;
  };
};

export type ButtonStateColorType = Keyof<ButtonStateColor>;

/**
 * The button state color.
 */
export type ButtonStateColor = {
  enabled: ButtonColors;
  disabled: ButtonColors;
  pressed: ButtonColors;
  loading: ButtonColors;
};

export type ButtonStyleType = Keyof<ButtonStyle>;

/**
 * The button style.
 */
export type ButtonStyle = {
  commonButton: {
    state: ButtonStateColor;
  };
  textButton1: {
    state: ButtonStateColor;
  };
  textButton2: {
    state: ButtonStateColor;
  };
  borderButton: {
    state: ButtonStateColor;
  };
};

/**
 * The shadow.
 */
export type Shadow = {
  shadowColor?: ColorValue | undefined;
  shadowOffset?: { width: number; height: number } | undefined;
  shadowOpacity?: number | undefined;
  shadowRadius?: number | undefined;
  elevation?: number | undefined;
};

/**
 * The shadow style.
 */
export type ShadowStyle = {
  small: Shadow[];
  middle: Shadow[];
  large: Shadow[];
};

/**
 * The theme.
 */
export interface Theme {
  style: ThemeType;
  button: {
    style: ButtonStyle;
    size: ButtonSizes;
  };
  shadow: {
    style: ShadowStyle;
  };
  cornerRadius: {
    avatar: CornerRadiusPaletteType;
    alert: CornerRadiusPaletteType;
    input: CornerRadiusPaletteType;
    bubble: CornerRadiusPaletteType[];
  };
}

/**
 * The parameters to create a palette.
 */
export type createPaletteParams = {
  colors: {
    primary: number;
    secondary: number;
    error: number;
    neutral: number;
    neutralSpecial: number;
  };
};

export type ThemeType = 'light' | 'dark';

/**
 * The parameters to create a Theme.
 */
export type createThemeParams = {
  palette: Palette;
  themeType: ThemeType;
  releaseArea?: ReleaseArea;
};
