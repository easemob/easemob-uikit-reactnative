import { NativeModules, Platform } from 'react-native';

export function getSystemLanguage(): string {
  if (Platform.OS === 'ios') {
    return NativeModules.SettingsManager.settings.AppleLocale;
  } else if (Platform.OS === 'android') {
    return NativeModules.I18nManager.localeIdentifier;
  }
  return '';
}
