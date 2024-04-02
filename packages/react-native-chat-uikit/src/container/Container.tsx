import * as React from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ChatContextProvider } from '../chat';
import { ConfigContextProvider, ConversationDetailType } from '../config';
import { DispatchContextProvider } from '../dispatch';
import { I18nContextProvider } from '../i18n';
import {
  PaletteContextProvider,
  ThemeContextProvider,
  usePresetPalette,
} from '../theme';
import { AlertContextProvider } from '../ui/Alert';
import {
  SimpleToastContextProvider,
  ToastViewContextProvider,
} from '../ui/Toast';
import { AbsoluteViewContextProvider } from '../ui/View';
import { mergeObjects } from '../utils';
import {
  getI18nLanguage,
  getLanguagePackage,
  getReleaseArea as _getReleaseArea,
  getTranslateLanguage,
  useGetTheme,
  useInitServices,
} from './Container.hook';
import type { ContainerProps } from './types';

/**
 * Entry to the UIKit component library. It will complete initialization, configure custom parameters and other preparations.
 *
 * **Note** IM will be initialized here. If other UIKit is integrated at the same time, the parameters initialized first shall prevail.
 * For example: if `chat uikit sdk` and `chat uikit sdk` are integrated at the same time, then the parameter initialized first will prevail.
 *
 * @param props {@link ContainerProps}
 */
export function Container(props: ContainerProps) {
  const {
    options,
    children,
    language,
    translateLanguage,
    enableTranslate = true,
    palette,
    theme,
    fontFamily,
    emojiFontFamily,
    headerFontFamily,
    onInitialized,
    conversationDetail,
    group,
    avatar,
    input,
    alert,
    formatTime,
    recallTimeout,
    onInitLanguageSet,
    onRequestMultiData,
    onChangeStatus,
    enablePresence = false,
    enableReaction = false,
    enableThread = false,
    enableAVMeeting = true,
    releaseArea,
  } = props;
  useInitServices(props);
  const _palette = usePresetPalette();

  const _guessLanguage = getI18nLanguage(language);
  const _languagePackage = getLanguagePackage(
    _guessLanguage,
    onInitLanguageSet?.()
  );
  const _releaseArea = _getReleaseArea();
  const _theme = useGetTheme({
    theme: theme,
    palette: palette ?? _palette,
    releaseArea: releaseArea ?? _releaseArea,
    avatar,
    input,
    alert,
  });

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      const id = DeviceInfo.getBundleId();
      console.log('dev:getBundleId', id);
    } else if (Platform.OS === 'android') {
      const id = DeviceInfo.getBundleId();
      console.log('dev:getBundleId', id);
    }
  }, []);

  return (
    <DispatchContextProvider>
      <PaletteContextProvider value={palette ?? _palette}>
        <ThemeContextProvider value={_theme}>
          <I18nContextProvider
            value={{
              languageCode: _guessLanguage,
              assets: _languagePackage,
            }}
          >
            <ChatContextProvider
              value={{
                options: options,
                onRequestMultiData: onRequestMultiData,
                onInitialized: onInitialized,
              }}
            >
              <ConfigContextProvider
                value={{
                  isDevMode: options.debugModel ?? false,
                  enableCompare: false,
                  enableCheckType: false,
                  languageCode: getTranslateLanguage(translateLanguage),
                  enableTranslate: enableTranslate,
                  fontFamily: fontFamily,
                  emojiFontFamily: emojiFontFamily,
                  headerFontFamily: headerFontFamily,
                  formatTime: formatTime,
                  recallTimeout: recallTimeout,
                  conversationDetail: mergeObjects(
                    conversationDetail as ConversationDetailType,
                    {
                      bubble: {
                        radiusStyle: 'small',
                      },
                    }
                  ),
                  group: mergeObjects(
                    { ...group },
                    {
                      createGroupMemberLimit: 1000,
                    }
                  ),
                  personAvatar: avatar?.personAvatar,
                  groupAvatar: avatar?.groupAvatar,
                  onChangeStatus: onChangeStatus,
                  enablePresence: enablePresence,
                  enableReaction: enableReaction,
                  enableThread: enableThread,
                  enableAVMeeting: enableAVMeeting,
                }}
              >
                <AbsoluteViewContextProvider>
                  <SimpleToastContextProvider>
                    <ToastViewContextProvider>
                      <AlertContextProvider>
                        <SafeAreaProvider>{children}</SafeAreaProvider>
                      </AlertContextProvider>
                    </ToastViewContextProvider>
                  </SimpleToastContextProvider>
                </AbsoluteViewContextProvider>
              </ConfigContextProvider>
            </ChatContextProvider>
          </I18nContextProvider>
        </ThemeContextProvider>
      </PaletteContextProvider>
    </DispatchContextProvider>
  );
}

export const getReleaseArea = _getReleaseArea;
