import type { LanguageCode } from '../i18n';
import type { CornerRadiusPaletteType } from '../theme';

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
   * Room option.
   */
  roomOption: RoomOption;
  /**
   * This language code is used to translate message.
   */
  languageCode: LanguageCode;

  /**
   * Avatar option.
   *
   * Invalid for `GiftMessageList`.
   */
  avatar: {
    borderRadiusStyle: CornerRadiusPaletteType;
    localIcon?: number | undefined;
  };
  /**
   * The font family name.
   */
  fontFamily?: string;
};
/**
 * Room option types
 */
export type RoomOption = {
  /**
   * GlobalBroadcast option.
   */
  globalBroadcast: {
    /**
     * Whether to load.
     */
    isVisible: boolean;
  };
  /**
   * Gift option.
   */
  gift: {
    /**
     * Whether to load.
     */
    isVisible: boolean;
  };
  /**
   * Message list option.
   */
  messageList: {
    /**
     * Whether to load for gift message.
     */
    isVisibleGift: boolean;
    /**
     * Whether to load for timestamp.
     */
    isVisibleTime: boolean;
    /**
     * Whether to load for Tag.
     */
    isVisibleTag: boolean;
    /**
     * Whether to load for Avatar.
     */
    isVisibleAvatar: boolean;
  };
  /**
   * Message pin option.
   */
  messagePin: {
    /**
     * Whether to load.
     */
    isVisible: boolean;
    /**
     * Whether to load for Tag.
     */
    isVisibleTag: boolean;
    /**
     * Whether to load for avatar.
     */
    isVisibleAvatar: boolean;
    /**
     * Whether to load for name.
     */
    isVisibleName: boolean;
  };
};
