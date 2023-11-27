import type { LanguageCode } from '../i18n';

/**
 * Config types
 */
export type Config = {
  /**
   * Whether to enable the development mode.
   */
  isDevMode: boolean;
  /**
   * Whether to enable the debug mode.
   */
  enableCompare: boolean;
  /**
   * Whether to enable the type check.
   */
  enableCheckType: boolean;
  /**
   * This language code is used to translate message.
   */
  languageCode: LanguageCode;

  /**
   * The font family name.
   */
  fontFamily?: string;
};
