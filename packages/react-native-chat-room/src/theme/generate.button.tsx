import { ErrorCode, UIKitError } from '../error';
import type { ButtonSizes, ButtonStyle, Palette, ThemeType } from './types';

export function generateButton(params: {
  palette: Palette;
  themeType: ThemeType;
}): {
  style: ButtonStyle;
  size: ButtonSizes;
} {
  const { themeType } = params;
  switch (themeType) {
    case 'light':
      return generateLightButton(params);
    case 'dark':
      return generateDarkButton(params);
    default:
      throw new UIKitError({
        code: ErrorCode.enum,
        extra: `ThemeType: ${themeType}`,
      });
  }
}

function generateLightButton(params: { palette: Palette }): {
  style: ButtonStyle;
  size: ButtonSizes;
} {
  const { palette } = params;
  const ret = {} as ReturnType<typeof generateLightButton>;
  ret.style = {
    commonButton: {
      state: {
        enabled: {
          color: palette.colors.neutral[98],
          backgroundColor: palette.colors.primary[5],
          borderColor: undefined,
        },
        disabled: {
          color: palette.colors.neutral[7],
          backgroundColor: palette.colors.neutral[95],
          borderColor: undefined,
        },
        pressed: {
          color: palette.colors.neutral[95],
          backgroundColor: palette.colors.primary[4],
          borderColor: undefined,
        },
        loading: {
          color: palette.colors.neutral[7],
          backgroundColor: palette.colors.neutral[95],
          borderColor: undefined,
        },
      },
    },
    textButton1: {
      state: {
        enabled: {
          color: palette.colors.primary[5],
          backgroundColor: undefined,
          borderColor: undefined,
        },
        disabled: {
          color: palette.colors.neutral[7],
          backgroundColor: undefined,
          borderColor: undefined,
        },
        pressed: {
          color: palette.colors.primary[4],
          backgroundColor: undefined,
          borderColor: undefined,
        },
        loading: {
          color: palette.colors.primary[5],
          backgroundColor: undefined,
          borderColor: undefined,
        },
      },
    },
    textButton2: {
      state: {
        enabled: {
          color: palette.colors.neutral[3],
          backgroundColor: undefined,
          borderColor: undefined,
        },
        disabled: {
          color: palette.colors.neutral[7],
          backgroundColor: undefined,
          borderColor: undefined,
        },
        pressed: {
          color: palette.colors.primary[5],
          backgroundColor: undefined,
          borderColor: undefined,
        },
        loading: {
          color: palette.colors.neutral[3],
          backgroundColor: undefined,
          borderColor: undefined,
        },
      },
    },
    borderButton: {
      state: {
        enabled: {
          color: palette.colors.neutral[3],
          backgroundColor: palette.colors.neutral[98],
          borderColor: palette.colors.neutral[7],
        },
        disabled: {
          color: palette.colors.neutral[8],
          backgroundColor: palette.colors.neutral[98],
          borderColor: palette.colors.neutral[7],
        },
        pressed: {
          color: palette.colors.primary[5],
          backgroundColor: palette.colors.primary[95],
          borderColor: palette.colors.primary[5],
        },
        loading: {
          color: palette.colors.neutral[3],
          backgroundColor: palette.colors.neutral[98],
          borderColor: palette.colors.neutral[7],
        },
      },
    },
  };

  ret.size = generateSizeButton(params);

  return ret;
}

function generateDarkButton(params: { palette: Palette }): {
  style: ButtonStyle;
  size: ButtonSizes;
} {
  const { palette } = params;
  const ret = {} as ReturnType<typeof generateDarkButton>;
  ret.style = {
    commonButton: {
      state: {
        enabled: {
          color: palette.colors.neutral[98],
          backgroundColor: palette.colors.primary[6],
          borderColor: undefined,
        },
        disabled: {
          color: palette.colors.neutral[4],
          backgroundColor: palette.colors.neutral[2],
          borderColor: undefined,
        },
        pressed: {
          color: palette.colors.neutral[95],
          backgroundColor: palette.colors.primary[5],
          borderColor: undefined,
        },
        loading: {
          color: palette.colors.neutral[98],
          backgroundColor: palette.colors.primary[6],
          borderColor: undefined,
        },
      },
    },
    textButton1: {
      state: {
        enabled: {
          color: palette.colors.primary[6],
          backgroundColor: undefined,
          borderColor: undefined,
        },
        disabled: {
          color: palette.colors.neutral[3],
          backgroundColor: undefined,
          borderColor: undefined,
        },
        pressed: {
          color: palette.colors.primary[5],
          backgroundColor: undefined,
          borderColor: undefined,
        },
        loading: {
          color: palette.colors.primary[6],
          backgroundColor: undefined,
          borderColor: undefined,
        },
      },
    },
    textButton2: {
      state: {
        enabled: {
          color: palette.colors.neutral[98],
          backgroundColor: undefined,
          borderColor: undefined,
        },
        disabled: {
          color: palette.colors.neutral[3],
          backgroundColor: undefined,
          borderColor: undefined,
        },
        pressed: {
          color: palette.colors.primary[5],
          backgroundColor: undefined,
          borderColor: undefined,
        },
        loading: {
          color: palette.colors.neutral[98],
          backgroundColor: undefined,
          borderColor: undefined,
        },
      },
    },
    borderButton: {
      state: {
        enabled: {
          color: palette.colors.neutral[98],
          backgroundColor: palette.colors.neutral[1],
          borderColor: palette.colors.neutral[4],
        },
        disabled: {
          color: palette.colors.neutral[3],
          backgroundColor: palette.colors.neutral[1],
          borderColor: palette.colors.neutral[2],
        },
        pressed: {
          color: palette.colors.primary[5],
          backgroundColor: palette.colors.primary[2],
          borderColor: palette.colors.primary[6],
        },
        loading: {
          color: palette.colors.neutral[98],
          backgroundColor: palette.colors.neutral[1],
          borderColor: palette.colors.neutral[4],
        },
      },
    },
  };

  ret.size = generateSizeButton(params);

  return ret;
}

function generateSizeButton(params: { palette: Palette }): ButtonSizes {
  const { palette } = params;
  const ret = {} as ButtonSizes;
  ret.small = {
    button: {
      borderWidth: undefined,
      borderRadius: undefined,
      height: 28,
      minWidth: 28,
      maxWidth: undefined,
      paddingHorizontal: 10,
      // paddingVertical: 5,
      width: undefined,
    },
    text: palette.fonts.label.medium,
    icon: {
      size: 18,
    },
  };
  ret.middle = {
    button: {
      borderWidth: undefined,
      borderRadius: undefined,
      height: 36,
      minWidth: 36,
      maxWidth: undefined,
      paddingHorizontal: 16,
      // paddingVertical: 8,
      width: undefined,
    },
    text: palette.fonts.label.medium,
    icon: {
      size: 18,
    },
  };
  ret.large = {
    button: {
      borderWidth: undefined,
      borderRadius: undefined,
      height: 48,
      minWidth: 48,
      maxWidth: undefined,
      paddingHorizontal: 24,
      // paddingVertical: 12,
      width: undefined,
    },
    text: palette.fonts.headline.small,
    icon: {
      size: 22,
    },
  };
  return ret;
}
