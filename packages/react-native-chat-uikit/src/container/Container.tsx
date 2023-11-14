import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ChatContextProvider } from '../chat';
import { ConfigContextProvider } from '../config';
import { DispatchContextProvider } from '../dispatch';
import { CreateStringSet, I18nContextProvider, LanguageCode } from '../i18n';
import { createStringSet } from '../i18n/StringSet';
import {
  CornerRadiusPaletteType,
  Palette,
  PaletteContextProvider,
  Theme,
  ThemeContextProvider,
  useLightTheme,
  usePresetPalette,
} from '../theme';
import { mergeObjects } from '../utils';
import { getI18nLanguage, getTranslateLanguage } from './Container.hook';

/**
 * Properties of the Container.
 */
export type ContainerProps = React.PropsWithChildren<{
  /**
   * The application key.
   */
  appKey: string;
  /**
   * Whether to enable the development mode.
   */
  isDevMode?: boolean;
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
   * Avatar option.
   *
   * Invalid for `GiftMessageList`.
   */
  avatar?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
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
For example: if `chat uikit sdk` and `chat uikit sdk` are integrated at the same time, then the parameter initialized first will prevail.
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
    palette,
    theme,
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
            <ChatContextProvider
              value={{
                appKey,
                debugMode: isDevMode,
                onInitialized: onInitialized,
              }}
            >
              <ConfigContextProvider
                value={{
                  isDevMode,
                  enableCompare: false,
                  enableCheckType: false,
                  languageCode: getTranslateLanguage(language),
                  avatar: mergeObjects(
                    avatar ??
                      ({} as { borderRadiusStyle: CornerRadiusPaletteType }),
                    {
                      borderRadiusStyle: 'large',
                    }
                  ),
                  fontFamily: fontFamily,
                }}
              >
                <SafeAreaProvider>{children}</SafeAreaProvider>
              </ConfigContextProvider>
            </ChatContextProvider>
          </I18nContextProvider>
        </ThemeContextProvider>
      </PaletteContextProvider>
    </DispatchContextProvider>
  );
}
