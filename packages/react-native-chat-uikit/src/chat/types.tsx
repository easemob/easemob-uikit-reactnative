import type { ChatClient, ChatMessage } from 'react-native-chat-sdk';

import type { UIKitError } from '../error';

export type ChatEventType = 'undefined';

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

/**
 * The type of message listener.
 */
export interface MessageServiceListener {
  /**
   * When a message is received, you will receive this notification.
   *
   * The message will carry user information to facilitate updating the message status.
   *
   * @param message The message object.
   */
  onMessageReceived?(message: ChatMessage): void;
  /**
   * When a message is recall, other people will receive a notification.
   *
   * @param message the message object.
   */
  onMessageRecalled?(message: ChatMessage): void;
  /**
   * This notification will be received when the backend pushes a globally important message.
   *
   * The GlobalBroadcast component will pay attention to it.
   *
   * @param notifyMessage the message object.
   */
  onGlobalNotifyReceived?(notifyMessage: ChatMessage): void;
}

export interface ErrorServiceListener {
  onError?(params: { error: UIKitError; from?: string; extra?: any }): void;
}
export interface ResultServiceListener {
  onFinished?(params: { event: ChatEventType; extra?: any }): void;
}

export type ChatServiceListener = ConnectServiceListener &
  MessageServiceListener &
  ErrorServiceListener &
  ResultServiceListener;

export interface ChatService {
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
