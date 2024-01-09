import type { LanguageCode } from '../i18n';

export type ConversationDetailType = {
  bubble?: {
    radiusStyle?: 'small' | 'large';
  };
};

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

  /**
   * The conversation detail config.
   */
  conversationDetail?: ConversationDetailType;

  group: {
    /**
     * The create group member limit.
     *
     * Default value is `1000`.
     */
    createGroupMemberLimit?: number;
  };

  /**
   * Format timestamp. Users can provide a timestamp format string callback interface for session lists and session details.
   */
  formatTime?: {
    /**
     * The locale.
     */
    locale?: Locale;
    /**
     * The conversation list format timestamp callback.
     * @param timestamp The timestamp.
     * @param locale The locale.
     * @returns The format timestamp string.
     */
    conversationListCallback?: (timestamp: number, locale?: Locale) => string;
    /**
     * The conversation detail format timestamp callback.
     * @param timestamp The timestamp.
     * @param locale The locale.
     * @returns The format timestamp string.
     */
    conversationDetailCallback?: (timestamp: number, locale?: Locale) => string;
  };
  /**
   * The recall timeout.
   *
   * Default value is `120000`. (2 minutes)
   */
  recallTimeout?: number;
};
