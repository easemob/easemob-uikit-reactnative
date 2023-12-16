import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ChatContextProvider } from '../chat';
import { ConfigContextProvider, ConversationDetailType } from '../config';
import { DispatchContextProvider } from '../dispatch';
import { I18nContextProvider } from '../i18n';
import { createStringSet } from '../i18n/StringSet';
import {
  PaletteContextProvider,
  ThemeContextProvider,
  usePresetPalette,
} from '../theme';
import { mergeObjects } from '../utils';
import {
  getI18nLanguage,
  getReleaseArea,
  getTranslateLanguage,
  useGetTheme,
  useInitServices,
} from './Container.hook';
import type { GlobalContainerProps } from './types';

/**
 * Entry to the UIKit component library. It will complete initialization, configure custom parameters and other preparations.
 * 
 * **Note** IM will be initialized here. If other UIKit is integrated at the same time, the parameters initialized first shall prevail.
For example: if `chat uikit sdk` and `chat uikit sdk` are integrated at the same time, then the parameter initialized first will prevail.
 * @param props {@link GlobalContainerProps}
 * @returns JSX.Element
 */
export function GlobalContainer(props: GlobalContainerProps) {
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
    conversationDetail,
  } = props;
  useInitServices(props);
  const _palette = usePresetPalette();

  const _languageBuiltInFactory = languageBuiltInFactory ?? createStringSet;
  const _guessLanguage = getI18nLanguage(language, languageBuiltInFactory);
  const _releaseArea = getReleaseArea(releaseArea);
  const _theme = useGetTheme({
    theme: theme,
    palette: palette ?? _palette,
    releaseArea: _releaseArea,
  });

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
                  conversationDetail: mergeObjects(
                    conversationDetail as ConversationDetailType,
                    {
                      bubble: {
                        radiusStyle: 'small',
                      },
                    }
                  ),
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
