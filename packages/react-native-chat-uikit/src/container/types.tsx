import type { ChatOptionsType } from '../chat';
import type { ConversationDetailType } from '../config';
import type { CreateStringSet, LanguageCode, StringSet } from '../i18n';
import type { CornerRadiusPaletteType, Palette, Theme } from '../theme';

/**
 * Properties of the GlobalContainer.
 */
export type GlobalContainerProps = React.PropsWithChildren<{
  /**
   * Initialization parameters, the parameters that must be filled in include `appKey`, `debugModel`, `autoLogin`.
   */
  options: ChatOptionsType;
  /**
   * The language code.
   */
  language?: LanguageCode;
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
  // releaseArea?: ReleaseArea;

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
  /**
   * The conversation detail config.
   */
  conversationDetail?: ConversationDetailType;
  /**
   * The group config.
   */
  group?: {
    /**
     * The group member limit.
     *
     * Default value is `1000`.
     */
    createGroupMemberLimit?: number;
  };
  /**
   * Avatar option.
   */
  avatar?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
    localIcon?: number | undefined;
  };
  /**
   * Input component option.
   */
  input?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
  };
  /**
   * Alert component option.
   */
  alert?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
  };
  /**
   * Initialize language pack. When {@link GlobalContainerProps.language} is modified, this callback will be called again.
   *
   * UIKit has built-in Chinese and English language packs. If the user sets other languages, corresponding language packs need to be provided. See {@link createStringSetCn} or {@link createStringSetEn} for details
   *
   * If no language code is set, the default `language` code is used. When this callback is called, the default language code will be returned to the user.
   *
   * @returns UIKit calls this method. Provide user-set `language` and default UIKit language pack. This method is defined by the user and returns the new language pack.
   */
  onInitLanguageSet?: () => (
    language: LanguageCode,
    defaultSet: StringSet
  ) => CreateStringSet | StringSet;
  /**
   * IM initialization is completed.
   */
  onInitialized?: () => void;
}>;
