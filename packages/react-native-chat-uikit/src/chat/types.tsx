import type {
  ChatClient,
  ChatContactEventListener,
  ChatConversationType,
  ChatCustomEventListener,
  ChatGroupEventListener,
  ChatMessage,
  ChatMessageEventListener,
  ChatMessageStatusCallback,
  ChatMultiDeviceEventListener,
  ChatOptions,
  ChatPresenceEventListener,
  ChatSearchDirection,
} from 'react-native-chat-sdk';

import type { UIKitError } from '../error';
import type { PartialUndefinable } from '../types';
import type { MessageCacheManager } from './messageManager.types';
import type { RequestList } from './requestList.types';
import type {
  ContactModel,
  ConversationModel,
  GroupModel,
  GroupParticipantModel,
  UIListener,
  UIListenerType,
} from './types.ui';

export type ChatEventType = 'undefined' | string;

/**
 * The type of disconnect reason.
 */
export enum DisconnectReasonType {
  token_will_expire = 'token_will_expire',
  token_did_expire = 'token_did_expire',
  app_active_number_reach_limit = 'app_active_number_reach_limit',
  user_did_login_from_other_device = 'user_did_login_from_other_device',
  user_did_remove_from_server = 'user_did_remove_from_server',
  user_did_forbid_by_server = 'user_did_forbid_by_server',
  user_did_change_password = 'user_did_change_password',
  user_did_login_too_many_device = 'user_did_login_too_many_device',
  user_kicked_by_other_device = 'user_kicked_by_other_device',
  user_authentication_failed = 'user_authentication_failed',
  others = 'others',
}

export type ResultCallback<T> = (params: {
  isOk: boolean;
  value?: T;
  error?: UIKitError;
}) => void;

export type DataModelType = 'user' | 'group';
export type DataModel = {
  /**
   * User ID, group ID or group member ID.
   */
  id: string;
  /**
   * User name, group name or group member name.
   */
  name?: string;
  /**
   * User avatar URL, group avatar URL or group member avatar URL.
   */
  avatar?: string;
  /**
   * There may also be remark for the `user` type that are specific to the current user.
   */
  remark?: string;
  /**
   * There are only two types: `user` or `groups`. Group members are also `user` types.
   */
  type: DataModelType;
  /**
   * If it is a group member, set the group ID.
   */
  groupId?: string;
};

export type UserFrom = 'user' | 'group' | 'group-member' | 'others';

/**
 * The type of user data.
 */
export type UserData = {
  /**
   * User ID.
   */
  userId: string;
  /**
   * User name.
   */
  userName?: string;
  /**
   * User remark.
   */
  remark?: string;
  /**
   * User avatar URL.
   */
  avatarURL?: string;
  /**
   * The data sources.
   */
  from?: {
    /**
     * The type of data sources.
     */
    type: UserFrom;
    /**
     * The group ID. If the data comes from a cloud group member.
     */
    groupId?: string;
  };
};

export type UserServiceDataFromMessage = {
  nickname: string;
  avatarURL: string;
};

/**
 * The type of client listener.
 */
export interface ConnectServiceListener {
  /**
   * Notification of successful server connection.
   */
  onConnected?(): void;
  /**
   * Notification of disconnection from server.
   *
   * There are many reasons. Disconnection caused by network abnormality is the most common. Other situations may require manual processing by the user. {@link DisconnectReasonType}
   *
   * @param reason {@link DisconnectReasonType}
   */
  onDisconnected?(reason: DisconnectReasonType): void;
}

export type MessageServiceListener =
  PartialUndefinable<ChatMessageEventListener>;

export type ConversationListener = {};

export type GroupServiceListener =
  PartialUndefinable<ChatGroupEventListener> & {};

export type ContactServiceListener =
  PartialUndefinable<ChatContactEventListener>;

export type PresenceServiceListener =
  PartialUndefinable<ChatPresenceEventListener>;

export type CustomServiceListener = PartialUndefinable<ChatCustomEventListener>;

export type MultiDeviceStateListener =
  PartialUndefinable<ChatMultiDeviceEventListener>;

export interface ErrorServiceListener {
  onError?(params: { error: UIKitError; from?: string; extra?: any }): void;
}
export interface ResultServiceListener {
  onFinished?(params: { event: ChatEventType; extra?: any }): void;
}

export type ChatServiceListener = ConnectServiceListener &
  MessageServiceListener &
  ConversationListener &
  GroupServiceListener &
  ContactServiceListener &
  PresenceServiceListener &
  CustomServiceListener &
  MultiDeviceStateListener &
  ErrorServiceListener &
  ResultServiceListener;

export interface ConversationServices {
  // setOnRequestMultiData<DataT>(
  //   callback?: (params: {
  //     ids: Map<DataModelType, string[]>;
  //     result: (data?: Map<DataModelType, DataT[]>, error?: UIKitError) => void;
  //   }) => void | Promise<void>
  // ): void;
  setCurrentConversation(params: { conv?: ConversationModel }): void;
  getCurrentConversation(): ConversationModel | undefined;
  getAllConversations(params: {
    onResult: ResultCallback<ConversationModel[]>;
  }): Promise<void>;
  getConversation(params: {
    convId: string;
    convType: ChatConversationType;
    createIfNotExist?: boolean;
    fromNative?: boolean;
  }): Promise<ConversationModel | undefined>;
  /**
   * Remove local conversation.
   *
   * Only when users actively delete the session, if they exit the group, be kicked out of the group, delete contact, add blacklist, etc., will not delete the session list.
   */
  removeConversation(params: { convId: string }): Promise<void>;
  clearAllConversations(): Promise<void>;
  /**
   * Set the conversation pin.
   * @throws {@link UIKitError}
   */
  setConversationPin(params: {
    convId: string;
    convType: ChatConversationType;
    isPin: boolean;
  }): Promise<void>;
  setConversationSilentMode(params: {
    convId: string;
    convType: ChatConversationType;
    doNotDisturb: boolean;
  }): Promise<void>;
  setConversationRead(params: {
    convId: string;
    convType: ChatConversationType;
  }): Promise<void>;
  setConversationExt(params: {
    convId: string;
    convType: ChatConversationType;
    ext: Record<string, string | number | boolean>;
  }): Promise<void>;
  getConversationMessageCount(
    convId: string,
    convType: ChatConversationType
  ): Promise<number>;
  getConversationLatestMessage(
    convId: string,
    convType: ChatConversationType
  ): Promise<ChatMessage | undefined>;
  getDoNotDisturb(
    convId: string,
    convType: ChatConversationType
  ): Promise<boolean>;
}

export interface ContactServices {
  // setContactOnRequestData<DataT>(
  //   callback?: (params: {
  //     ids: string[];
  //     result: (data?: DataT[], error?: UIKitError) => void;
  //   }) => void | Promise<void>
  // ): void;
  isContact(params: { userId: string }): boolean;
  getAllContacts(params: { onResult: ResultCallback<ContactModel[]> }): void;
  getContact(params: {
    userId: string;
    onResult: ResultCallback<ContactModel | undefined>;
  }): void;
  addNewContact(params: {
    useId: string;
    reason?: string;
    onResult?: ResultCallback<void>;
  }): void;
  removeContact(params: {
    userId: string;
    onResult?: ResultCallback<void>;
  }): void;
  setContactRemark(params: {
    userId: string;
    remark: string;
    onResult?: ResultCallback<void>;
  }): void;
  acceptInvitation(params: {
    userId: string;
    onResult: ResultCallback<void>;
  }): void;
  declineInvitation(params: {
    userId: string;
    onResult: ResultCallback<void>;
  }): void;
  /**
   * Save state for multi-page components.
   *
   * **Note** At present, routing is implemented in the application layer, so it is troublesome to transfer complex objects through attribute layers. Therefore, data synchronization and exchange are performed through the bottom layer.
   */
  setContactCheckedState(params: {
    key: string;
    userId: string;
    checked: boolean;
  }): void;
  getContactCheckedState(params: {
    key: string;
    userId: string;
  }): boolean | undefined;
  clearContactCheckedState(params: { key: string }): void;
}

export interface UserServices {
  getUserInfo(params: {
    userId: string;
    onResult: ResultCallback<UserData | undefined>;
  }): void;
  getUsersInfo(params: {
    userIds: string[];
    onResult: ResultCallback<UserData[]>;
  }): void;
}

export interface MessageServices {
  getMessage(params: { messageId: string }): Promise<ChatMessage | undefined>;
  resendMessage(params: {
    message: ChatMessage;
    callback?: ChatMessageStatusCallback;
  }): void;
  recallMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void;
  insertMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void;
  updateMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void;
  removeMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void;
  editMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<ChatMessage>;
  }): void;
  getNewRequestList(params: {
    convId: string;
    convType: ChatConversationType;
    timestamp?: number;
    pageSize?: number;
    direction?: ChatSearchDirection;
    onResult: ResultCallback<ChatMessage[]>;
  }): void;
  sendMessage(params: {
    message: ChatMessage;
    callback?: ChatMessageStatusCallback;
  }): void;
  downloadMessageAttachment(params: {
    message: ChatMessage;
    callback?: ChatMessageStatusCallback;
  }): void;
  getHistoryMessage(params: {
    convId: string;
    convType: ChatConversationType;
    startMsgId: string;
    direction: ChatSearchDirection;
    loadCount: number;
    onResult: ResultCallback<ChatMessage[]>;
  }): void;
  /**
   * Get the user information from the message.
   */
  userInfoFromMessage(msg?: ChatMessage): UserData | undefined;
  /**
   * Set the user information to the message.
   */
  setUserInfoToMessage(params: { msg: ChatMessage; user: UserData }): void;
  setMessageRead(params: {
    convId: string;
    convType: ChatConversationType;
    msgId: string;
    onResult: ResultCallback<void>;
  }): void;
  sendMessageReadAck(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void;
  reportMessage(params: {
    messageId: string;
    tag: string;
    reason: string;
    onResult: ResultCallback<void>;
  }): void;
}

export interface GroupServices {
  // setGroupOnRequestData<DataT>(
  //   callback?: (params: {
  //     ids: string[];
  //     result: (data?: DataT[], error?: UIKitError) => void;
  //   }) => void | Promise<void>
  // ): void;
  /**
   * Create a group name customization. You can register the callback. When you create a group, call it. If it is not provided, the default name will be used.
   * @param callback Provide group IDs and selected personnel lists, and return to the new group name.
   */
  setGroupNameOnCreateGroup(
    callback: (params: { selected: ContactModel[] }) => string
  ): void;
  getCreateGroupCustomNameCallback():
    | ((params: { selected: ContactModel[] }) => string)
    | undefined;
  setGroupParticipantOnRequestData<DataT>(
    callback?: (params: {
      groupId: string;
      ids: string[];
      result: (data?: DataT[], error?: UIKitError) => void;
    }) => void | Promise<void>
  ): void;
  updateGroupParticipantOnRequestData(params: {
    groupId: string;
    data: Map<DataModelType, DataModel[]>;
  }): void;
  getPageGroups(params: {
    pageSize: number;
    pageNum: number;
    onResult: ResultCallback<GroupModel[]>;
  }): void;
  getGroupAllMembers(params: {
    groupId: string;
    isReset?: boolean;
    onResult: ResultCallback<GroupParticipantModel[]>;
  }): void;
  getGroupMember(params: {
    groupId: string;
    userId: string;
  }): GroupParticipantModel | undefined;
  setGroupMemberState(params: {
    groupId: string;
    userId: string;
    checked: boolean;
    onResult: ResultCallback<void>;
  }): void;
  fetchJoinedGroupCount(params: { onResult: ResultCallback<number> }): void;
  getGroupInfo(params: {
    groupId: string;
    onResult: ResultCallback<GroupModel>;
  }): void;
  getGroupInfoFromServer(params: {
    groupId: string;
    onResult: ResultCallback<GroupModel>;
  }): void;
  createGroup(params: {
    groupName: string;
    groupDescription?: string;
    inviteMembers: string[];
    onResult?: ResultCallback<GroupModel>;
  }): void;
  quitGroup(params: { groupId: string; onResult?: ResultCallback<void> }): void;
  destroyGroup(params: {
    groupId: string;
    onResult?: ResultCallback<void>;
  }): void;
  setGroupName(params: {
    groupId: string;
    groupNewName: string;
    onResult?: ResultCallback<void>;
  }): void;
  setGroupDescription(params: {
    groupId: string;
    groupDescription: string;
    onResult?: ResultCallback<void>;
  }): void;
  setGroupMyRemark(params: {
    groupId: string;
    memberId: string;
    groupMyRemark: string;
    ext?: Record<string, string>;
    onResult?: ResultCallback<void>;
  }): void;
  getGroupMyRemark(params: {
    groupId: string;
    memberId: string;
    onResult: ResultCallback<string | undefined>;
  }): void;
  addGroupMembers(params: {
    groupId: string;
    members: GroupParticipantModel[];
    welcomeMessage?: string;
    onResult: ResultCallback<void>;
  }): void;
  removeGroupMembers(params: {
    groupId: string;
    members: string[];
    onResult: ResultCallback<void>;
  }): void;
  changeGroupOwner(params: {
    groupId: string;
    newOwnerId: string;
    onResult?: ResultCallback<void>;
  }): void;
}

export interface PresenceServices {
  /**
   * Subscribe to user status.
   */
  subPresence(params: {
    userIds: string[];
    onResult: ResultCallback<void>;
  }): void;
  /**
   * Unsubscribe to user status.
   */
  unSubPresence(params: {
    userIds: string[];
    onResult: ResultCallback<void>;
  }): void;
  /**
   * Publish user status.
   */
  publishPresence(params: {
    status: string;
    onResult: ResultCallback<void>;
  }): void;
  /**
   * Get the status of the specified user list.
   */
  fetchPresence(params: {
    userIds: string[];
    onResult: ResultCallback<string[]>;
  }): void;
}

export interface ChatService
  extends ConversationServices,
    ContactServices,
    GroupServices,
    UserServices,
    MessageServices,
    PresenceServices {
  /**
   * Add listener.
   * @param listener {@link ChatServiceListener}
   */
  addListener(listener: ChatServiceListener): void;
  /**
   * Remove listener.
   * @param listener {@link ChatServiceListener}
   */
  removeListener(listener: ChatServiceListener): void;
  /**
   * Clear all listeners.
   *
   * **Note** Please use this interface with caution, as it may result in deleting other listeners and failing to receive notifications.
   */
  clearListener(): void;

  /**
   * It is a complement to `ChatServiceListener`. Usually data changes due to user behavior are received and processed through this listener. For example: actions such as creating a group and adding contacts will trigger an `onAddedEvent` callback notification. Modifying the group name and modifying contact notes will trigger an `onUpdatedEvent` callback notification. Exiting the group and deleting a contact will trigger an `onDeletedEvent` callback notification.
   */
  addUIListener<DataModel>(listener: UIListener<DataModel>): void;
  /**
   * Remove UI listener.
   */
  removeUIListener<DataModel>(listener: UIListener<DataModel>): void;
  /**
   * Clear all UI listeners.
   */
  clearUIListener(): void;
  /**
   * Certain user behaviors will trigger corresponding event callback notifications from the listener. See each interface for details. {@link ChatService}
   * @param type {@link UIListenerType}
   * @param event {@link UIListener}
   * @param data Generic data.
   * @param args Any number of parameters.
   */
  sendUIEvent<DataModel>(
    type: UIListenerType,
    event: keyof UIListener<DataModel>,
    data?: DataModel | string,
    ...args: any[]
  ): void;

  /**
   * If the built-in method is not enough, you can get the original IM object through this method.
   */
  get client(): ChatClient;

  /**
   * Initialize the IM service.
   *
   * The initialization operation is a necessary prerequisite for using `ChatService`. Usually it won't fail. Usually an error is reported because `appKey` is not set or `appKey` is empty.
   *
   * @params
   * - appKey: Agora appKey.
   * - debugModel: Whether to enable debug mode.
   * - autoLogin: Whether to automatically log in after initialization.
   * - result: The result after performing the operation. If failed, an error object is returned.
   *
   * @noThrows {@link UIKitError}
   */
  init(params: {
    options: ChatOptionsType;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void>;

  /**
   * Log in to the IM server.
   *
   * The login result is returned through `result`. If you want to know whether you are logged in, you can call `loginState`.
   *
   * After successful login, the listener will also receive notification `ChatServiceListener.onConnected`.
   *
   * After successful login, the information set by the user will be synchronized to the server.
   *
   * If login fails, an error code or prompt will be returned. Please refer to `ChatError` .
   *
   * @params
   * - userId: User ID.
   * - userToken: User token.
   * - userName: User nickname. It is very important to set.
   * - userAvatarURL: User avatar URL.
   * - usePassword: Whether to use password login. If you use password login, you need to set the password. If you use token login, you do not need to set the password.
   * - result: The result after performing the operation. If failed, an error object is returned.
   *
   * @noThrows {@link UIKitError}
   */
  login(params: {
    userId: string;
    userToken: string;
    userName?: string;
    userAvatarURL?: string;
    usePassword?: boolean;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void>;
  /**
   * Log out from the IM server.
   *
   * The log out result is returned through `result`.
   *
   * @params
   * - result: The result after performing the operation. If failed, an error object is returned.
   *
   * @noThrows {@link UIKitError}
   */
  logout(params: {
    unbindDeviceToken?: boolean;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void>;
  /**
   * Automatically log in to the IM server.
   * @params params
   * - result: The result after performing the operation. If failed, an error object is returned.
   */
  autoLogin(params: {
    userId: string;
    userToken: string;
    userName?: string;
    userAvatarURL?: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void>;
  /**
   * Get the login status.
   */
  loginState(): Promise<'logged' | 'noLogged'>;
  /**
   * Only agora token refresh is supported.
   *
   * When receiving notification {@link DisconnectReasonType.token_will_expire} that the token is about to expire, you can refresh the token.
   *
   * @params
   * - token: Agora token.
   * - result: The result after performing the operation. If failed, an error object is returned.
   *
   * @noThrows {@link UIKitError}
   */
  refreshToken(params: {
    token: string;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void>;

  /**
   * Get the current logged user ID. If you are not logged in, undefined is returned.
   */
  get userId(): string | undefined;

  /**
   * Get the user information from memory.
   * @param userId User ID.
   */
  user(userId?: string): UserData | undefined;

  /**
   * Set the users information to memory.
   * @params params {@link UserData}
   */
  setUser(params: { users: UserData[] }): void;

  /**
   * Send a error to the listener.
   * @params
   * - error: the error object.
   * - from: the error from.
   * - extra: the extra data.
   */
  sendError(params: { error: UIKitError; from?: string; extra?: any }): void;
  /**
   * Send a finished to the listener.
   * @params
   * - event: the event type.
   * - extra: the extra data.
   */
  sendFinished(params: { event: ChatEventType; extra?: any }): void;

  /**
   * This is the cache list of new notifications. When the new notification component has not been loaded and the notification is received, the cache will be automatically updated. Keep data updated when new notification components are loaded.
   */
  get requestList(): RequestList;

  /**
   * This is the message cache manager, which is mainly responsible for caching notifications of received messages and distributing notifications when the session details page has not been loaded. Monitor message sending status updates when sending messages.
   */
  get messageManager(): MessageCacheManager;

  /**
   * Register UIKit to obtain callback notifications for user or group information. When the session list component, contact component, etc. are loaded, a callback will be initiated to obtain user information. After the user information is completed, if you want to update it, please use `updateRequestData`.
   */
  setOnRequestData(
    callback?:
      | ((params: {
          ids: Map<DataModelType, string[]>;
          result: (
            data?: Map<DataModelType, DataModel[]>,
            error?: UIKitError
          ) => void;
        }) => void)
      | ((params: {
          ids: Map<DataModelType, string[]>;
          result: (
            data?: Map<DataModelType, DataModel[]>,
            error?: UIKitError
          ) => void;
        }) => Promise<void>)
  ): void;

  /**
   * Actively update user information and take effect in subsequent loaded components.
   */
  updateRequestData(params: { data: Map<DataModelType, DataModel[]> }): void;
}

type _ChatOptionsType = PartialUndefinable<ChatOptions>;
/**
 * ChatOptionsType is the initialization parameters of ChatService.
 *
 * appKey, autoLogin and debugModel is required.
 *
 * This parameter option is consistent with `Agora Chat SDK`.
 *
 */
export type ChatOptionsType = _ChatOptionsType & {
  appKey: string;
  autoLogin: boolean;
  debugModel: boolean;
};

/**
 * ChatServiceInit is the initialization parameters of ChatService.
 */
export type ChatServiceInit = {
  options: ChatOptionsType;
  /**
   * IM initialization is completed callback notification.
   */
  onInitialized?: () => void;
};
