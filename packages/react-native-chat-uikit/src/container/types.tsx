import type { ChatOptionsType, DataModel, DataModelType } from '../chat';
import type { ConversationDetailType } from '../config';
import type { UIKitError } from '../error';
import type { CreateStringSet, LanguageCode, StringSet } from '../i18n';
import type { CornerRadiusPaletteType, Palette, Theme } from '../theme';

/**
 * Properties of the Container.
 */
export type ContainerProps = React.PropsWithChildren<{
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
   * Default avatar option.
   */
  avatar?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
    personAvatar?: number | undefined;
    groupAvatar?: number | undefined;
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
  onInitialized?: () => void;

  /**
   * @description Registered user information callback. The avatar and nickname of the contact, group member and group are obtained through the callback of this registration. If not provided, the default value will be used.
   *
   * In addition, data updates can also be achieved by actively calling `ChatService.updateRequestData`.
   *
   * Developer should also pay attention to notifications of name or avatar changes to maintain data consistency. For example: pay attention to contact name updates, group name updates, etc. These notifications need to pay attention to the corresponding listeners.
   *
   * This callback will be used in the contact list, conversation list, group list, and group member list.
   *
   * See `DataModelType` for details on acquisition types.
   *
   * For details on obtaining results, see `DataModel`.
   *
   * @params params -
   * - ids: The id of the item.
   * - result: The callback function of the result.
   *
   * @example
   *
   * ```tsx
   * onRequestMultiData={(params: {
   *   ids: Map<DataModelType, string[]>;
   *   result: (
   *     data?: Map<DataModelType, DataModel[]>,
   *     error?: UIKitError
   *   ) => void;
   * }) => {
   *   const userIds = params.ids.get('user');
   *   const users = userIds?.map<DataModel>((id) => {
   *     return {
   *       id,
   *       name: id + 'name',
   *       // avatar: 'https://i.pravatar.cc/300',
   *       avatar:
   *         'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
   *       type: 'user' as DataModelType,
   *     };
   *   });
   *   const groupIds = params.ids.get('group');
   *   const groups = groupIds?.map<DataModel>((id) => {
   *     return {
   *       id,
   *       name: id + 'name',
   *       avatar:
   *         'https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-2-512.png',
   *       type: 'group' as DataModelType,
   *     };
   *   });
   *   params?.result(
   *     new Map([
   *       ['user', users ?? []],
   *       ['group', groups ?? []],
   *     ])
   *   );
   * }}
   * ```
   */
  onRequestMultiData?: (params: {
    ids: Map<DataModelType, string[]>;
    result: (
      data?: Map<DataModelType, DataModel[]>,
      error?: UIKitError
    ) => void;
  }) => void | Promise<void>;
}>;
