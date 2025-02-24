import { Platform } from 'react-native';

import { ErrorCode, UIKitError } from '../error';
import type { Palette, Shadow, ShadowStyle, ThemeType } from './types';

export function generateShadow(params: {
  palette: Palette;
  themeType: ThemeType;
}): {
  style: ShadowStyle;
} {
  const { themeType } = params;
  switch (themeType) {
    case 'light':
      return generateLightShadow(params);
    case 'dark':
      return generateDarkShadow(params);
    default:
      throw new UIKitError({
        code: ErrorCode.enum,
        extra: `ThemeType: ${themeType}`,
      });
  }
}

function generateLightShadow(params: { palette: Palette }): {
  style: ShadowStyle;
} {
  const {} = params;
  const ret = {} as ReturnType<typeof generateLightShadow>;
  const s = generateShadowSize();
  ret.style = {
    small: [
      {
        ...Platform.select({
          ios: { shadowColor: 'hsla(203, 8%, 30%, 1)', shadowOpacity: 0.15 },
          android: {},
        }),
        ...s.style.small1,
      },
      {
        ...Platform.select({
          ios: { shadowColor: 'hsla(204, 10%, 10%, 1)', shadowOpacity: 0.1 },
          android: {},
        }),
        ...s.style.small2,
      },
    ],
    middle: [
      {
        ...Platform.select({
          ios: { shadowColor: 'hsla(203, 8%, 30%, 1)', shadowOpacity: 0.15 },
          android: {},
        }),
        ...s.style.middle1,
      },
      {
        ...Platform.select({
          ios: { shadowColor: 'hsla(204, 10%, 10%, 1)', shadowOpacity: 0.1 },
          android: {},
        }),
        ...s.style.middle2,
      },
    ],
    large: [
      {
        ...Platform.select({
          ios: { shadowColor: 'hsla(203, 8%, 30%, 1)', shadowOpacity: 0.15 },
          android: {},
        }),
        ...s.style.large1,
      },
      {
        ...Platform.select({
          ios: { shadowColor: 'hsla(204, 10%, 10%, 1)', shadowOpacity: 0.08 },
          android: {},
        }),
        ...s.style.large2,
      },
    ],
  };

  return ret;
}

function generateDarkShadow(params: { palette: Palette }): {
  style: ShadowStyle;
} {
  const {} = params;
  const ret = {} as ReturnType<typeof generateLightShadow>;
  const s = generateShadowSize();
  ret.style = {
    small: [
      {
        ...Platform.select({
          ios: { shadowColor: 'hsla(203, 8%, 30%, 1)', shadowOpacity: 0.3 },
          android: {},
        }),
        ...s.style.small1,
      },
      {
        ...Platform.select({
          ios: { shadowColor: 'hsla(204, 10%, 10%, 1)', shadowOpacity: 0.2 },
          android: {},
        }),
        ...s.style.small2,
      },
    ],
    middle: [
      {
        ...Platform.select({
          ios: { shadowColor: 'hsla(203, 8%, 30%, 1)', shadowOpacity: 0.3 },
          android: {},
        }),
        ...s.style.middle1,
      },
      {
        ...Platform.select({
          ios: { shadowColor: 'hsla(204, 10%, 10%, 1)', shadowOpacity: 0.2 },
          android: {},
        }),
        ...s.style.middle2,
      },
    ],
    large: [
      {
        ...Platform.select({
          ios: { shadowColor: 'hsla(203, 8%, 30%, 1)', shadowOpacity: 0.3 },
          android: {},
        }),
        ...s.style.large1,
      },
      {
        ...Platform.select({
          ios: { shadowColor: 'hsla(204, 10%, 10%, 1)', shadowOpacity: 0.16 },
          android: {},
        }),
        ...s.style.large2,
      },
    ],
  };

  return ret;
}

function generateShadowSize(): {
  style: {
    small1: Pick<Shadow, 'elevation' | 'shadowOffset' | 'shadowRadius'>;
    small2: Pick<Shadow, 'elevation' | 'shadowOffset' | 'shadowRadius'>;
    middle1: Pick<Shadow, 'elevation' | 'shadowOffset' | 'shadowRadius'>;
    middle2: Pick<Shadow, 'elevation' | 'shadowOffset' | 'shadowRadius'>;
    large1: Pick<Shadow, 'elevation' | 'shadowOffset' | 'shadowRadius'>;
    large2: Pick<Shadow, 'elevation' | 'shadowOffset' | 'shadowRadius'>;
  };
} {
  const ret = {} as ReturnType<typeof generateShadowSize>;
  ret.style = {
    small1: {
      ...Platform.select({
        ios: { shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
        android: { elevation: 6 },
      }),
    },
    small2: {
      ...Platform.select({
        ios: { shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
        android: { elevation: 4 },
      }),
    },
    middle1: {
      ...Platform.select({
        ios: { shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
        android: { elevation: 6 },
      }),
    },
    middle2: {
      ...Platform.select({
        ios: { shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
        android: { elevation: 16 },
      }),
    },
    large1: {
      ...Platform.select({
        ios: { shadowRadius: 36, shadowOffset: { width: 0, height: 24 } },
        android: { elevation: 72 },
      }),
    },
    large2: {
      ...Platform.select({
        ios: { shadowRadius: 24, shadowOffset: { width: 8, height: 0 } },
        android: { elevation: 48 },
      }),
    },
  };
  return ret;
}
