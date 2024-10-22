import { StyleProp, ViewStyle } from 'react-native';

import type { StatusType } from '../biz/types';
import type { LanguageCode } from '../i18n';
import { ChatMessage } from '../rename.chat';
import {
  MessageContextMenuStyle,
  MessageInputBarExtensionStyle,
  ReleaseArea,
} from '../types';

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
   * The release area.
   */
  releaseArea?: ReleaseArea;
  /**
   * Whether to enable the debug mode.
   *
   * Whether to activate the object comparison tool. If activated, the `useCompare` tool can be used.
   */
  enableCompare: boolean;
  /**
   * Whether to enable the type check.
   *
   * Whether to activate the object type check tool. If activated, the `useCheckType` tool can be used.
   */
  enableCheckType: boolean;
  /**
   * This language code is used to translate message.
   *
   * If not set, it is obtained from the system. If the language set is not built-in, the local environment is automatically set.
   */
  languageCode: LanguageCode;

  /**
   * The font family name.
   *
   * Default value is `undefined`.
   *
   * **Note** https://github.com/facebook/react-native/issues/29259
   */
  fontFamily?: string;
  /**
   * The emoji font family name.
   */
  emojiFontFamily?: string;
  /**
   * The header font family name.
   */
  headerFontFamily?: string;

  /**
   * The conversation detail config.
   */
  conversationDetail?: ConversationDetailType;
  /**
   * The message long press menu style.
   *
   * Detail for `BottomSheetNameMenu` and `MessageContextNameMenu`.
   *
   * If you want to customize it, you need to set the custom component `MessageCustomLongPressMenu` in the properties of `ConversationDetail`.
   */
  messageMenuStyle?: MessageContextMenuStyle;

  /**
   * The message input bar style.
   *
   * Detail for `BottomSheetNameMenu` and `MessageInputBarExtensionMenu`.
   */
  messageInputBarStyle?: MessageInputBarExtensionStyle;

  /**
   * The group config.
   */
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
  /**
   * The default person avatar.
   */
  personAvatar?: number | undefined;
  /**
   * The default group avatar.
   */
  groupAvatar?: number | undefined;
  /**
   * Whether to enable translation.
   *
   * Default value is `true`.
   */
  enableTranslate: boolean;

  /**
   * Custom avatar state component render.
   * @param status current status.
   * @returns component.
   */
  AvatarStatusRender?:
    | React.FC<{
        status: StatusType;
        style?: StyleProp<ViewStyle>;
      }>
    | React.MemoExoticComponent<
        (props: {
          status: StatusType;
          style?: StyleProp<ViewStyle>;
        }) => JSX.Element
      >;

  /**
   * System message prompt callback.
   * @param msg The tip message.
   * @param tr The translation function.
   */
  onSystemTip?: (
    msg: ChatMessage,
    tr: (key: string, ...args: any[]) => string
  ) => string | undefined;

  /**
   * Customize the conversation list message snapshot.
   *
   * @param msg The last message.
   * @returns The snapshot string.
   */
  onConversationListLastMessageSnapshot?: (msg: ChatMessage) => string;

  /**
   * Customize the conversation list message snapshot params.
   * @param msg The last message.
   * @returns The snapshot string array.
   */
  onConversationListLastMessageSnapshotParams?: (msg: ChatMessage) => any[];

  /**
   * Whether to activate the thread function. If you do not activate it, you will not be able to actively use thread-related functions, if there are still problems after activation, check whether the relevant settings of the console are enabled.
   *
   * Default is `false`.
   */
  enableThread?: boolean;

  /**
   * Whether to activate the reaction function. If you do not activate it, you will not be able to actively use reaction-related functions, if there are still problems after activation, check whether the relevant settings of the console are enabled.
   *
   * Default is `false`.
   */
  enableReaction?: boolean;

  /**
   * Whether to activate the presence function. If you do not enable the presence-related feature, check whether the settings are enabled in the console.
   *
   * Default is `false`.
   */
  enablePresence?: boolean;

  /**
   * Whether to activate the AV meeting function. If you do not enable the AV meeting-related feature, check whether the settings are enabled in the console.
   *
   * Default is `true`.
   */
  enableAVMeeting?: boolean;

  /**
   * Whether to enable the message quote function. If you do not enable the message quote-related feature, check whether the settings are enabled in the console.
   */
  enableMessageQuote?: boolean;

  /**
   * Whether to enable the message forward function.
   */
  enableMessageForward?: boolean;

  /**
   * Whether to enable the message multi-select function.
   */
  enableMessageMultiSelect?: boolean;

  /**
   * Whether to enable typing status.
   */
  enableTyping?: boolean;

  /**
   * Whether to enable the block list function.
   */
  enableBlock?: boolean;

  /**
   * Whether to enable the message pin function.
   */
  enableMessagePin?: boolean;

  /**
   * Whether to enable the message pin function.
   */
  enableUrlPreview?: boolean;
};
