import type {
  ChatClient,
  ChatContact,
  ChatContactEventListener,
  ChatConversationType,
  ChatCustomEventListener,
  ChatGroupEventListener,
  ChatGroupOptions,
  ChatGroupPermissionType,
  ChatMessage,
  ChatMessageEventListener,
  ChatMessageStatusCallback,
  ChatMultiDeviceEventListener,
  ChatOptions,
  ChatPresenceEventListener,
  ChatSearchDirection,
} from 'react-native-chat-sdk';

import type { UIKitError } from '../error';
import type { Keyof, PartialNullable, PartialUndefinable } from '../types';
import type { MessageCacheManager } from './messageManager.types';
import type { RequestList } from './requestList.types';

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
  id: string;
  name: string;
  avatar: string;
};

export type UserFrom = 'friend' | 'group' | 'black' | 'others';
export type NewRequestStateType = 'pending' | 'accepted' | 'declined';

/**
 * The type of user data.
 */
export type UserServiceData = {
  /**
   * User ID.
   */
  userId: string;
  /**
   * User name.
   */
  userName: string;
  /**
   * User remark.
   */
  remark?: string;
  /**
   * User avatar URL.
   */
  avatarURL?: string;
  /**
   * User gender. [0, 1, 2]
   */
  gender?: number;
  /**
   * User sign.
   */
  sign?: string;
  /**
   * User from information.
   */
  from?: {
    type: UserFrom;
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

export type MessageServiceListener = PartialNullable<ChatMessageEventListener>;

export type ConversationListener = {
  onConversationChanged?: (conv: ConversationModel) => void;
};

export type GroupServiceListener = PartialNullable<ChatGroupEventListener> & {
  onGroupInfoChanged?: (group: GroupModel) => void;
  onCreateGroup?: (group: GroupModel) => void;
  onQuitGroup?: (groupId: string) => void;
};

export type ContactServiceListener = PartialNullable<ChatContactEventListener>;

export type PresenceServiceListener =
  PartialNullable<ChatPresenceEventListener>;

export type CustomServiceListener = PartialNullable<ChatCustomEventListener>;

export type MultiDeviceStateListener =
  PartialNullable<ChatMultiDeviceEventListener>;

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

export type ConversationModel = {
  /**
   * The conversation ID.
   */
  convId: string;
  /**
   * The conversation type.
   */
  convType: ChatConversationType;
  /**
 * Whether the current conversation is a thread conversation.
 * 
 * - `true`: Yes.
 * - `false`: No.
 *
 * **Note**

 * This parameter is valid only for group chat.
 */
  isChatThread?: boolean;
  /**
   * The conversation extension.
   */
  ext?: Record<string, string | number | boolean>;
  /**
   * Whether the conversation is pinned:
   *
   * - `true`: Yes.
   * - (Default) `false`: No.
   */
  isPinned?: boolean;
  /**
   * The UNIX timestamp when the conversation is pinned. The unit is millisecond. This value is `0` when the conversation is not pinned.
   */
  pinnedTime?: number;
  /**
   * The message unread count.
   */
  unreadMessageCount?: number;
  /**
   * The conversation name.
   */
  convName?: string;
  /**
   * The conversation avatar URL.
   */
  convAvatar?: string;
  /**
   * Whether the conversation is silent.
   */
  doNotDisturb?: boolean;
  /**
   * The last message.
   */
  lastMessage?: ChatMessage;
};

export type ContactModel = Record<Keyof<ChatContact>, string> & {
  nickName?: string;
  avatar?: string;
  checked?: boolean;
  disable?: boolean;
};

export type GroupModel = {
  /**
   * The group ID.
   */
  groupId: string;
  /**
   * The group name.
   */
  groupName?: string;
  /**
   * The group description.
   */
  description?: string;
  /**
   * The user ID of the group owner.
   */
  owner: string;
  /**
   * The content of the group announcement.
   */
  announcement?: string;
  /**
   * The member count of the group.
   */
  memberCount?: number;
  /**
   * Whether group messages are blocked.
   * - `true`: Yes.
   * - `false`: No.
   */
  messageBlocked?: boolean;
  /**
   * Whether all group members are muted.
   * - `true`: Yes.
   * - `false`: No.
   */
  isAllMemberMuted?: boolean;
  /**
   * The role of the current user in the group.
   */
  permissionType: ChatGroupPermissionType;
  /**
   * The group options.
   */
  options?: ChatGroupOptions;
  /**
   * The group avatar url.
   */
  groupAvatar?: string;
  /**
   * The group my remark.
   */
  myRemark?: string;
};

export type GroupParticipantModel = {
  id: string;
  name?: string;
  avatar?: string;
  checked?: boolean;
  disable?: boolean;
};

export type NewRequestModel = {
  id: string;
  name: string;
  avatar?: string;
  tip?: string;
  state?: NewRequestStateType;
  msg?: ChatMessage;
};

export interface ConversationServices {
  setOnRequestMultiData<DataT>(
    callback?: (params: {
      ids: Map<DataModelType, string[]>;
      result: (data?: Map<DataModelType, DataT[]>, error?: UIKitError) => void;
    }) => void
  ): void;
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
  setConversationMsg(params: {
    convId: string;
    convType: ChatConversationType;
    lastMessage: ChatMessage;
  }): Promise<void>;
  updateConversation(params: { conv: ConversationModel }): Promise<void>;
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
  setContactOnRequestData<DataT>(
    callback?: (params: {
      ids: string[];
      result: (data?: DataT[], error?: UIKitError) => void;
    }) => void
  ): void;
  isContact(params: { userId: string }): boolean;
  getAllContacts(params: { onResult: ResultCallback<ContactModel[]> }): void;
  getContact(params: {
    userId: string;
    onResult: ResultCallback<ContactModel | undefined>;
  }): void;
  addNewContact(params: {
    useId: string;
    reason?: string;
    onResult: ResultCallback<void>;
  }): void;
  removeContact(params: {
    userId: string;
    onResult: ResultCallback<void>;
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
    onResult: ResultCallback<UserServiceData | undefined>;
  }): void;
  getUsersInfo(params: {
    userIds: string[];
    onResult: ResultCallback<UserServiceData[]>;
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
   * @param msg the message.
   */
  userInfoFromMessage(msg?: ChatMessage): UserServiceData | undefined;
  setUserInfoToMessage(params: {
    msg: ChatMessage;
    user: UserServiceData;
  }): void;
  setMessageRead(params: {
    convId: string;
    convType: ChatConversationType;
    msgId: string;
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
  setGroupOnRequestData<DataT>(
    callback?: (params: {
      ids: string[];
      result: (data?: DataT[], error?: UIKitError) => void;
    }) => void
  ): void;
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
  CreateGroup(params: {
    groupName: string;
    groupDescription?: string;
    inviteMembers: string[];
    onResult: ResultCallback<GroupModel>;
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
    onResult: ResultCallback<void>;
  }): void;
  setGroupMyRemark(params: {
    groupId: string;
    memberId: string;
    groupMyRemark: string;
    ext?: Record<string, string>;
    onResult: ResultCallback<void>;
  }): void;
  setGroupAvatar(params: {
    groupId: string;
    groupAvatar: string;
    ext?: Record<string, string>;
    onResult: ResultCallback<void>;
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
    onResult: ResultCallback<void>;
  }): void;
}

export interface PresenceServices {
  subPresence(params: {
    userIds: string[];
    onResult: ResultCallback<void>;
  }): void;
  unSubPresence(params: {
    userIds: string[];
    onResult: ResultCallback<void>;
  }): void;
  publishPresence(params: {
    status: string;
    onResult: ResultCallback<void>;
  }): void;
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
   */
  clearListener(): void;

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
   * - gender: User gender. [0, 1, 2]
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
    gender?: number;
    sign?: string;
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
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void>;
  /**
   * Automatically log in to the IM server.
   * @params params
   * - result: The result after performing the operation. If failed, an error object is returned.
   */
  autoLogin(params: {
    userName: string;
    userAvatarURL?: string | undefined;
    gender?: number;
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
  user(userId?: string): UserServiceData | undefined;

  /**
   * Set the users information to memory.
   * @params params {@link UserServiceData}
   */
  setUser(params: { users: UserServiceData[] }): void;

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

  get requestList(): RequestList;
  get messageManager(): MessageCacheManager;
}

type ChatOptionsType1 = PartialUndefinable<ChatOptions>;
export type ChatOptionsType = ChatOptionsType1 & {
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
   * IM initialization is completed.
   */
  onInitialized?: () => void;
};
