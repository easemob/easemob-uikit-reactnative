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
import type { Palette, Theme } from '../theme';
import type { ReleaseArea } from '../types';

/**
 * Properties of the GlobalContainer.
 */
export type GlobalContainerProps = React.PropsWithChildren<{
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
   * The conversation detail config.
   */
  conversationDetail?: ConversationDetailType;
  /**
   * IM initialization is completed.
   */
  onInitialized?: () => void;
  services?: {
    clipboard?: ClipboardService | undefined;
    media?: MediaService | undefined;
    notification?: NotificationService | undefined;
    permission?: PermissionService | undefined;
    storage?: LocalStorageService | undefined;
    dir?: DirCacheService | undefined;
  };
}>;
