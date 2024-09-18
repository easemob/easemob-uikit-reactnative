import { StyleProp, ViewStyle } from 'react-native';

import type { StatusType } from '../biz/types';
import type { ChatOptionsType, ChatService, DataModel } from '../chat';
import type { ConversationDetailType } from '../config';
import type { CreateStringSet, LanguageCode, StringSet } from '../i18n';
import { ChatMessage } from '../rename.chat';
import type { CornerRadiusPaletteType, Palette, Theme } from '../theme';
import type { MessageMenuStyle, ReleaseArea } from '../types';

/**
 * Properties of the Container.
 */
export type ContainerProps = React.PropsWithChildren<{
  /**
   * Initialization parameters, the parameters that must be filled in include `appKey`, `debugModel`, `autoLogin`.
   *
   * This parameter type is equivalent to the `ChatOptions` type. All parameters can be set.
   */
  options: ChatOptionsType;
  /**
   * The language code.
   *
   * Default value is system language.
   */
  language?: LanguageCode;
  /**
   * The target language code for the translation function.
   *
   * Default value is system language.
   */
  translateLanguage?: LanguageCode;
  /**
   * Whether to enable translation.
   *
   * Default value is `true`.
   */
  enableTranslate?: boolean;
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
   * The emoji font family name.
   */
  emojiFontFamily?: string;
  /**
   * The header font family name.
   */
  headerFontFamily?: string;
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
   * The message long press menu style.
   *
   * Detail for `BottomSheetNameMenu` and `BottomSheetNameMenu`.
   */
  messageMenuStyle?: MessageMenuStyle;

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
   * Default avatar option.
   *
   * This setting takes effect for `Avatar`, `GroupAvatar`, `StatusAvatar` components.
   */
  avatar?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
    personAvatar?: number | undefined;
    groupAvatar?: number | undefined;
  };
  /**
   * Input component option.
   *
   * This setting takes effect for `SearchStyle`, `TextInput` components.
   */
  input?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
  };
  /**
   * Alert component option.
   *
   * This setting takes effect for `Alert` components.
   */
  alert?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
  };
  /**
   * Initialize language pack. When {@link ContainerProps.language} is modified, this callback will be called again.
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
  onInitialized?: (im: ChatService) => void;

  /**
   * @description Registered user information callback. The avatar and nickname of the contact, group member and group are obtained through the callback of this registration. If not provided, the default value will be used.
   *
   * @param data The user information list. The default value is provided by UIKit. Their values can be customized.
   * @returns Returns the modified value.
   */
  onUsersHandler?:
    | ((data: Map<string, DataModel>) => Map<string, DataModel>)
    | ((data: Map<string, DataModel>) => Promise<Map<string, DataModel>>);

  /**
   * @description Registered group information callback. The avatar and nickname of the contact, group member and group are obtained through the callback of this registration. If not provided, the default value will be used.
   *
   * @param data The group information list. The default value is provided by UIKit. Their values can be customized.
   * @returns Returns the modified value.
   */
  onGroupsHandler?:
    | ((data: Map<string, DataModel>) => Map<string, DataModel>)
    | ((data: Map<string, DataModel>) => Promise<Map<string, DataModel>>);

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
   * Whether to enable the message quote function.
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
   * Whether to enable the URL preview function.
   */
  enableUrlPreview?: boolean;
}>;
