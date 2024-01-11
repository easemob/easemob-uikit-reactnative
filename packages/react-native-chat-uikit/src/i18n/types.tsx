export type StringSetValueType = string | ((...args: any[]) => string);

/**
 * StringSet is a set of strings.
 *
 * key: identifier
 *
 * value: string or function
 */
export interface StringSet {
  [key: string]: StringSetValueType;
}

/**
 * https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support
 */
export type LanguageCode =
  | 'en'
  | 'zh-Hans'
  | 'zh-Hant'
  | 'ru'
  | 'de'
  | 'fr'
  | 'ja'
  | 'ko';

export type CreateStringSet = (type: LanguageCode) => StringSet;

/**
 * I18nInit is the initialization parameters of I18n.
 */
export interface I18nInit {
  /**
   * The language code of the current language.
   */
  languageCode: LanguageCode;
  /**
   * The string set of the current language.
   */
  assets?: CreateStringSet | StringSet;
}

/**
 * I18nTr is the interface of I18n.
 */
export interface I18nTr {
  /**
   * Translate the corresponding language based on the keywords.
   * @param key identifier.
   * @param args any.
   *
   * @test {@link https://github.com/AsteriskZuo/react-native-chat-room/blob/40b04abcfc1bff432db1fb4db62ef81199c93461/example/src/__dev__/test_i18n.tsx}
   *
   * @example
   *
   * ```tsx
   * const { tr } = useI18nContext();
   * // ...
   * <Text>{tr('hello')}</Text>
   * // ...
   * <Text>{tr('hello, ${0}', 'John')}</Text>
   * ```
   */
  tr(key: string, ...args: any[]): string;
  /**
   * Get the current language code.
   */
  currentLanguage: () => LanguageCode;
}
