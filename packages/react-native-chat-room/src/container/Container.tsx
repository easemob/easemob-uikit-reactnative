import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ConfigContextProvider, RoomOption } from '../config';
import { DispatchContextProvider } from '../dispatch';
import { CreateStringSet, I18nContextProvider, LanguageCode } from '../i18n';
import { createStringSet } from '../i18n/StringSet';
import { ChatOptions } from '../rename.chat';
import { RoomContextProvider } from '../room';
import {
  CornerRadiusPaletteType,
  Palette,
  PaletteContextProvider,
  Theme,
  ThemeContextProvider,
  useLightTheme,
  usePresetPalette,
} from '../theme';
import type { PartialDeep } from '../types';
import { mergeObjects } from '../utils';
import { getI18nLanguage, getTranslateLanguage } from './Container.hook';

type PartialRoomOption = PartialDeep<RoomOption>;

/**
 * Properties of the Container.
 */
export type ContainerProps = React.PropsWithChildren<{
  /**
   * The application key.
   *
   * @deprecated Please use {@link ContainerProps.opt} instead.
   */
  appKey?: string;
  /**
   * Whether to enable the development mode.
   */
  isDevMode?: boolean;
  /**
   * The chat sdk options.
   */
  opt: ChatOptions;
  /**
   * The language code.
   */
  language?: LanguageCode;
  /**
   * The language built-in factory.
   *
   * If set, replace the data inside uikit.
   */
  languageBuiltInFactory?: CreateStringSet;
  /**
   * The language extension factory.
   *
   * If set, it can also be used in the application.
   */
  languageExtensionFactory?: CreateStringSet;
  /**
   * The palette.
   */
  palette?: Palette;
  /**
   * The theme.
   */
  theme?: Theme;
  /**
   * The room option.
   */
  roomOption?: PartialRoomOption;
  /**
   * Avatar option.
   *
   * Invalid for `GiftMessageList`.
   */
  avatar?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
    localIcon?: number | undefined;
  };
  /**
   * The font family name.
   */
  fontFamily?: string;
  /**
   * IM initialization is completed.
   */
  onInitialized?: () => void;
}>;

/**
 * Entry to the UIKit component library. It will complete initialization, configure custom parameters and other preparations.
 *
 * **Note** IM will be initialized here. If other UIKit is integrated at the same time, the parameters initialized first shall prevail.
For example: if `chat uikit sdk` and `chat room uikit sdk` are integrated at the same time, then the parameter initialized first will prevail.
 * @param props {@link ContainerProps}
 * @returns JSX.Element
 */
export function Container(props: ContainerProps) {
  const {
    appKey,
    children,
    language,
    languageBuiltInFactory,
    languageExtensionFactory,
    isDevMode = false,
    opt,
    palette,
    theme,
    roomOption,
    avatar,
    fontFamily,
    onInitialized,
  } = props;
  const _palette = usePresetPalette();
  const light = useLightTheme(palette ?? _palette);

  const _languageBuiltInFactory = languageBuiltInFactory ?? createStringSet;
  const _guessLanguage = getI18nLanguage(language, languageBuiltInFactory);

  return (
    <DispatchContextProvider>
      <PaletteContextProvider value={palette ?? _palette}>
        <ThemeContextProvider value={theme ?? light}>
          <I18nContextProvider
            value={{
              languageCode: _guessLanguage,
              factory: _languageBuiltInFactory,
              stringSet: languageExtensionFactory?.(language ?? _guessLanguage),
            }}
          >
            <RoomContextProvider
              value={{
                appKey,
                debugMode: isDevMode,
                opt: opt,
                onInitialized: onInitialized,
              }}
            >
              <ConfigContextProvider
                value={{
                  isDevMode,
                  enableCompare: false,
                  enableCheckType: false,
                  roomOption: mergeObjects<RoomOption>(
                    roomOption ?? ({} as PartialDeep<RoomOption>),
                    {
                      globalBroadcast: {
                        isVisible: true,
                      },
                      gift: {
                        isVisible: true,
                      },
                      messageList: {
                        isVisibleGift: true,
                        isVisibleAvatar: true,
                        isVisibleTag: true,
                        isVisibleTime: true,
                      },
                      messagePin: {
                        isVisible: true,
                        isVisibleAvatar: true,
                        isVisibleName: true,
                        isVisibleTag: true,
                      },
                    } as RoomOption
                  ),
                  languageCode: getTranslateLanguage(language),
                  avatar: mergeObjects(
                    avatar ??
                      ({} as {
                        borderRadiusStyle: CornerRadiusPaletteType;
                        localIcon?: number | undefined;
                      }),
                    {
                      borderRadiusStyle: 'large',
                    }
                  ),
                  fontFamily: fontFamily,
                }}
              >
                <SafeAreaProvider>{children}</SafeAreaProvider>
              </ConfigContextProvider>
            </RoomContextProvider>
          </I18nContextProvider>
        </ThemeContextProvider>
      </PaletteContextProvider>
    </DispatchContextProvider>
  );
}
