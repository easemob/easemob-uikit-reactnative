import type { ChatOptionsType } from '../chat';
import type { ConversationDetailType } from '../config';
import type { CreateStringSet, LanguageCode } from '../i18n';
import type {
  ClipboardService,
  DirCacheService,
  LocalStorageService,
  MediaService,
  NotificationService,
  PermissionService,
} from '../services';
import type { CornerRadiusPaletteType, Palette, Theme } from '../theme';
import type { ReleaseArea } from '../types';

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
   * IM initialization is completed.
   */
  onInitialized?: () => void;
  /**
   * reserve.
   */
  services?: {
    clipboard?: ClipboardService | undefined;
    media?: MediaService | undefined;
    notification?: NotificationService | undefined;
    permission?: PermissionService | undefined;
    storage?: LocalStorageService | undefined;
    dir?: DirCacheService | undefined;
  };
}>;
