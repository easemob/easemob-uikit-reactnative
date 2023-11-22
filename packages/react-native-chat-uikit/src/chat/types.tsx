import type {
  ChatClient,
  ChatContactEventListener,
  ChatConversationType,
  ChatCustomEventListener,
  ChatGroupEventListener,
  ChatMessage,
  ChatMessageEventListener,
  ChatMultiDeviceEventListener,
  ChatPresenceEventListener,
} from 'react-native-chat-sdk';

import type { UIKitError } from '../error';

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

/**
 * The type of user data.
 */
export type UserServiceData = {
  /**
   * User ID.
   */
  userId: string;
  /**
   * User nick name. It is very important to set.
   */
  nickName?: string;
  /**
   * User avatar URL.
   */
  avatarURL?: string;
  /**
   * User gender. [0, 1, 2]
   */
  gender?: number;
  /**
   * User custom identify.
   */
  identify?: string;
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

export type MessageServiceListener = ChatMessageEventListener;

export type GroupServiceListener = ChatGroupEventListener;

export type ContactServiceListener = ChatContactEventListener;

export type PresenceServiceListener = ChatPresenceEventListener;

export type CustomServiceListener = ChatCustomEventListener;

export type MultiDeviceStateListener = ChatMultiDeviceEventListener;

export interface ErrorServiceListener {
  onError?(params: { error: UIKitError; from?: string; extra?: any }): void;
}
export interface ResultServiceListener {
  onFinished?(params: { event: ChatEventType; extra?: any }): void;
}

export type ChatServiceListener = ConnectServiceListener &
  MessageServiceListener &
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
export interface ConversationServices {
  setOnRequestMultiData<DataT>(
    callback: (params: {
      ids: Map<DataModelType, string[]>;
      result: (data?: Map<DataModelType, DataT[]>, error?: UIKitError) => void;
    }) => void
  ): void;
  getAllConversations(params: {
    onResult: ResultCallback<ConversationModel[]>;
  }): Promise<void>;
  getConversation(params: {
    convId: string;
    convType: ChatConversationType;
    createIfNotExist?: boolean;
  }): Promise<ConversationModel | undefined>;
  removeConversation(params: { convId: string }): Promise<void>;
  clearAllConversations(): Promise<void>;
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
}

export interface ChatService extends ConversationServices {
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
   * - debugMode: Whether to enable debug mode.
   * - autoLogin: Whether to automatically log in after initialization.
   * - result: The result after performing the operation. If failed, an error object is returned.
   *
   * @noThrows {@link UIKitError}
   */
  init(params: {
    appKey: string;
    debugMode?: boolean;
    autoLogin?: boolean;
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
   * - userNickname: User nickname. It is very important to set.
   * - userAvatarURL: User avatar URL.
   * - gender: User gender. [0, 1, 2]
   * - identify: User identify.
   * - result: The result after performing the operation. If failed, an error object is returned.
   *
   * @noThrows {@link UIKitError}
   */
  login(params: {
    userId: string;
    userToken: string;
    userNickname?: string;
    userAvatarURL?: string;
    gender?: number;
    identify?: string;
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
}

/**
 * ChatServiceInit is the initialization parameters of ChatService.
 */
export type ChatServiceInit = {
  /**
   * Agora appKey.
   */
  appKey: string;
  /**
   * Whether to enable debug mode.
   */
  debugMode?: boolean;
  /**
   * IM initialization is completed.
   */
  onInitialized?: () => void;
};
