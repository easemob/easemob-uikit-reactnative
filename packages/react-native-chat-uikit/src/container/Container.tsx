import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ChatContextProvider } from '../chat';
import { ConfigContextProvider } from '../config';
import { DispatchContextProvider } from '../dispatch';
import { CreateStringSet, I18nContextProvider, LanguageCode } from '../i18n';
import { createStringSet } from '../i18n/StringSet';
import {
  Palette,
  PaletteContextProvider,
  Theme,
  ThemeContextProvider,
  usePresetPalette,
} from '../theme';
import type { ReleaseArea } from '../types';
import {
  getI18nLanguage,
  getReleaseArea,
  getTranslateLanguage,
  useGetTheme,
} from './Container.hook';

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
   * The font family name.
   */
  fontFamily?: string;
  /**
   * The release area.
   */
  releaseArea?: ReleaseArea;
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
    fontFamily,
    releaseArea,
    onInitialized,
  } = props;
  const _palette = usePresetPalette();

  const _languageBuiltInFactory = languageBuiltInFactory ?? createStringSet;
  const _guessLanguage = getI18nLanguage(language, languageBuiltInFactory);
  const _releaseArea = getReleaseArea(releaseArea);
  const _theme = useGetTheme({
    theme: theme,
    palette: palette ?? _palette,
    releaseArea: _releaseArea,
  });
  console.log('test:zuoyu:t:', _theme === undefined, _palette === undefined);

  return (
    <DispatchContextProvider>
      <PaletteContextProvider value={palette ?? _palette}>
        <ThemeContextProvider value={_theme}>
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
