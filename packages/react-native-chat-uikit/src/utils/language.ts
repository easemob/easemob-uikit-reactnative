import { NativeModules, Platform } from 'react-native';

/**
 * Get system current language.
 *
 * see {@url https://github.com/facebook/react-native/issues/26540}
 * see {@url https://docs.expo.dev/versions/latest/sdk/localization/}
 *
 * @returns {string} system current language
 */
export function getSystemLanguage(): string {
  if (Platform.OS === 'ios') {
    console.log(
      'dev:getSystemLanguage',
      NativeModules.SettingsManager.settings
    );
    // https://github.com/facebook/react-native/issues/26540
    let locale = NativeModules.SettingsManager.settings.AppleLocale;
    if (locale === undefined) {
      // iOS 13 workaround, take first of AppleLanguages array  ["en", "en-NZ"]
      locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
      if (locale === undefined) {
        return 'en'; // default language
      }
    }
    return locale;
  } else if (Platform.OS === 'android') {
    console.log('dev:getSystemLanguage', NativeModules.I18nManager);
    // ["en_US", "zh_CN_#Hans"]
    return NativeModules.I18nManager.localeIdentifier;
  }
  return '';
}
