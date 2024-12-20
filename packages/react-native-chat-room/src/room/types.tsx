import type { UIKitError } from '../error';
import type {
  ChatClient,
  ChatCursorResult,
  ChatMessage,
  ChatMessagePinInfo,
  ChatOptions,
  ChatRoom,
} from '../rename.chat';
import type { Keyof } from '../types';

/**
 * The type of operation performed on the chat room member.
 */
export type RoomMemberOperate =
  | 'mute'
  | 'unmute'
  | 'block'
  | 'unblock'
  | 'admin'
  | 'unadmin';

/**
 * The type of room state.
 */
export type RoomState = 'joining' | 'joined' | 'leaving' | 'leaved';

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
 * The type of IM event.
 */
export type RoomEventType =
  | 'init'
  | 'join'
  | 'leave'
  | 'kick'
  | 'mute'
  | 'unmute'
  | 'translate_message'
  | 'recall_message'
  | 'report_message'
  | 'fetch_member_list'
  | 'fetch_muter_list'
  | 'send_gift'
  | 'send_text'
  | 'pin_message'
  | 'unpin_message'
  | 'fetch_pin_message';

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
  nickname?: string;
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
 * The type of gift data.
 */
export type GiftServiceData = {
  /**
   * Gift ID.
   */
  giftId: string;
  /**
   * Gift name.
   */
  giftName: string;
  /**
   * Gift price.
   */
  giftPrice: string;
  /**
   * Gift count.
   */
  giftCount: number;
  /**
   * Gift icon URL.
   */
  giftIcon: string;
  /**
   * Gift effect URL.
   */
  giftEffect: string;
  selected?: boolean;
  sendedThenClose?: boolean;
};

/**
 * The type of chat room listener.
 */
export interface ChatroomServiceListener {
  /**
   * This callback is received when someone joins the room. If you join yourself, you will also receive this callback.
   *
   * @note owner enters and exits without notification.
   *
   * @param roomId The chat room ID.
   * @param user the user information.
   */
  onUserJoined?(roomId: string, user: UserServiceData): void;
  /**
   * This callback will be received when someone exits the room.
   * @param roomId The chat room ID.
   * @param userId the user ID.
   */
  onUserLeave?(roomId: string, userId: string): void;
  /**
   * When you are kicked out of the chat room, you will receive this notification.
   *
   * @param roomId the chat room id.
   * @param reason the reason of kick.
   */
  onUserBeKicked?(roomId: string, reason: number): void;
  /**
   * When someone is muted, you will receive this notification.
   *
   * @param roomId the chat room id.
   * @param userIds the user id list.
   * @param operatorId the operator id.
   */
  onUserMuted?(roomId: string, userIds: string[], operatorId: string): void;
  /**
   * When someone is unmuted, you will receive this notification.
   * @param roomId the chat room id.
   * @param userIds the user id list.
   * @param operatorId the operator id.
   */
  onUserUnmuted?(roomId: string, userIds: string[], operatorId: string): void;
}

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
   * The gift message will be paid attention to by the `MessageList` component and the `GiftMessageList` component. When a user joins a chat room, `UIKit` will automatically send a join command message, and `UIKit` will automatically process it on the receiving end. Emoji messages will be treated as text messages and displayed after special processing.
   *
   * @param roomId The chat room ID.
   * @param message The message object.
   */
  onMessageReceived?(roomId: string, message: ChatMessage): void;
  /**
   * When a message is recall, other people in the chat room will receive a notification.
   *
   * @param roomId the chat room ID.
   * @param message the message object.
   */
  onMessageRecalled?(roomId: string, message: ChatMessage): void;
  /**
   * This notification will be received when the backend pushes a globally important message.
   *
   * The GlobalBroadcast component will pay attention to it.
   *
   * @param notifyMessage the message object.
   */
  onGlobalNotifyReceived?(notifyMessage: ChatMessage): void;

  /**
   * This notification will be received when the message is pined.
   * @param params -
   * - messageId: the message id.
   * - convId: the conversation id.
   * - pinOperation: the pin operation.
   * - pinInfo: the pin info.
   */
  onMessagePinChanged?(params: {
    messageId: string;
    convId: string;
    pinOperation: number;
    pinInfo: ChatMessagePinInfo;
  }): void;
}

export interface ErrorServiceListener {
  onError?(params: { error: UIKitError; from?: string; extra?: any }): void;
}
export interface ResultServiceListener {
  onFinished?(params: { event: RoomEventType; extra?: any }): void;
}

export type RoomServiceListener = ConnectServiceListener &
  ChatroomServiceListener &
  MessageServiceListener &
  ErrorServiceListener &
  ResultServiceListener;

export interface RoomService {
  /**
   * Add listener.
   * @param listener {@link RoomServiceListener}
   */
  addListener(listener: RoomServiceListener): void;
  /**
   * Remove listener.
   * @param listener {@link RoomServiceListener}
   */
  removeListener(listener: RoomServiceListener): void;
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
   * The initialization operation is a necessary prerequisite for using `RoomService`. Usually it won't fail. Usually an error is reported because `appKey` is not set or `appKey` is empty.
   *
   * @params
   * - appKey: Agora appKey.
   * - debugMode: Whether to enable debug mode.
   * - autoLogin: Whether to automatically log in after initialization.
   * - result: The result after performing the operation. If failed, an error object is returned.
   *
   * @noThrows {@link UIKitError}
   *
   * @deprecated please use with {@link initWithOption}
   */
  init(params: {
    appKey: string;
    debugMode?: boolean;
    autoLogin?: boolean;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void>;

  /**
   * Initialize the IM service.
   *
   * The initialization operation is a necessary prerequisite for using `RoomService`. Usually it won't fail. Usually an error is reported because `appKey` is not set or `appKey` is empty.
   *
   * @params
   * - opt: chat sdk option.
   * - result: The result after performing the operation. If failed, an error object is returned.
   *
   * @noThrows {@link UIKitError}
   */
  initWithOption(params: {
    options: ChatOptions;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void>;

  /**
   * Log in to the IM server.
   *
   * The login result is returned through `result`. If you want to know whether you are logged in, you can call `loginState`.
   *
   * After successful login, the listener will also receive notification `RoomServiceListener.onConnected`.
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
   * Get the mute status of the specified user. If the value is returned, it indicates the ban duration. If the user is not muted, undefined is returned.
   *
   * @param id User ID.
   */
  getMuter(id: string): number | undefined;
  /**
   * Adds the specified list of muted user IDs to the local cache.
   * @param ids User ID list.
   */
  updateMuter(ids: string[]): void;

  /**
   * Get user information. If not found, undefined is returned.
   * @param id User ID.
   */
  getUserInfo(id?: string): UserServiceData | undefined;
  /**
   * Get users information. If not found, empty list is returned.
   * @param ids User ID list.
   */
  getUserInfos(ids: string[]): UserServiceData[];
  /**
   * Update user information to local cache.
   * @param users User information list.
   */
  updateUserInfos(users: UserServiceData[]): void;
  /**
   * Get user information from the server. The result may be empty.
   * @param ids User ID list.
   * @throws {@link UIKitError}
   */
  fetchUserInfos(ids: string[]): Promise<UserServiceData[]>;
  /**
   * Update self user information to the server.
   * @param self User information.
   * @throws {@link UIKitError}
   */
  updateSelfInfo(self: UserServiceData): Promise<void>;
  /**
   * Get the list of users who are not in the local cache.
   * @param ids User ID list.
   */
  getNoExisted(ids: string[]): string[];
  /**
   * Filter the list of qualified users based on keywords.
   * @param key Keyword.
   */
  getIncludes(key: string, type?: Keyof<UserServiceData>): UserServiceData[];

  /**
   * Get the current chat room ID. If you are not in the chat room, undefined is returned.
   */
  get roomId(): string | undefined;
  /**
   * Get the current chat room owner ID. If you are not in the chat room, undefined is returned.
   */
  get ownerId(): string | undefined;
  /**
   * Get the current chat room state.
   */
  get roomState(): RoomState;

  /**
   * fetch the chat room info list from server. If not found, empty list is returned.
   * @param pageNum Which page of data is requested. Start with 1.
   * @param pageSize Target number per page. If not, the default value is used.
   * @throws {@link UIKitError}
   */
  fetchChatroomList(pageNum: number, pageSize?: number): Promise<ChatRoom[]>;
  /**
   * Join the chat room.
   * @param roomId the chat room id.
   * @param room the chat room info.
   * @throws {@link UIKitError}
   */
  joinRoom(roomId: string, room: { ownerId: string }): Promise<void>;
  /**
   * Leave the chat room.
   * @param roomId the chat room id.
   * @throws {@link UIKitError}
   */
  leaveRoom(roomId: string): Promise<void>;
  /**
   * Reset the chat room resources.
   *
   * When kicked out of the chat room, you can call this method to reset the chat room resources.
   *
   * @param roomId the chat room id.
   */
  resetRoom(roomId: string): void;
  /**
   * Kick the specified user out of the chat room.
   * @param roomId the chat room id.
   * @param userId the user id.
   * @throws {@link UIKitError}
   */
  kickMember(roomId: string, userId: string): Promise<void>;
  /**
   * Fetch the chat room members from server.
   * @param roomId the chat room id.
   * @param pageSize Target number per page. If not, the default value is used.
   * @param cursor The cursor of the current page. If not, the default value '' is used.
   * @throws {@link UIKitError}
   */
  fetchMembers(
    roomId: string,
    pageSize: number,
    cursor?: string
  ): Promise<ChatCursorResult<string>>;
  /**
   * Fetch the chat room muted members from server.
   * @param roomId the chat room id.
   * @param pageSize Target number per page. If not, the default value is used.
   * @throws {@link UIKitError}
   */
  fetchMutedMembers(roomId: string, pageSize: number): Promise<string[]>;
  /**
   * Update the chat room member state to server.
   * @param roomId the chat room id.
   * @param userId the user id.
   * @param op the operate type. {@link RoomMemberOperate}
   * @throws {@link UIKitError}
   */
  updateMemberState(
    roomId: string,
    userId: string,
    op: RoomMemberOperate
  ): Promise<void>;

  /**
   * Send a text message to the chat room.
   * @params
   * - roomId: the chat room id.
   * - content: the text message content.
   * - result: The result after performing the operation. If failed, an error object is returned.
   * @noThrows {@link UIKitError}
   */
  sendText(params: {
    roomId: string;
    content: string;
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): void;
  /**
   * Send a gift message to the chat room.
   *
   * @params
   * - roomId: the chat room id.
   * - gift: the gift message content.
   * - result: The result after performing the operation. If failed, an error object is returned.
   * @noThrows {@link UIKitError}
   */
  sendGift(params: {
    roomId: string;
    gift: GiftServiceData;
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): void;
  /**
   * Send a join command to the chat room.
   * @params
   * - roomId: the chat room id.
   * - result: The result after performing the operation. If failed, an error object is returned.
   * @noThrows {@link UIKitError}
   */
  sendJoinCmd(params: {
    roomId: string;
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): void;
  /**
   * Send a recall message command to the chat room. Others will delete the message.
   * @param messageId the message id.
   * @throws {@link UIKitError}
   */
  recallMessage(messageId: string): Promise<void>;
  /**
   * Send a report message to server.
   * @params
   * - messageId: the message id.
   * - tag: the report tag.
   * - reason: the report reason.
   * @throws {@link UIKitError}
   */
  reportMessage(params: {
    messageId: string;
    tag: string;
    reason: string;
  }): Promise<void>;
  /**
   * Translate the message.
   *
   * @param message the message object.
   * @param languagesCode the language code. {@link https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support}
   * @returns the translated message.
   *
   * @throws {@link UIKitError}
   */
  translateMessage(
    message: ChatMessage,
    languagesCode: string
  ): Promise<ChatMessage>;
  /**
   * Get the user information from the message.
   * @param msg the message.
   */
  userInfoFromMessage(msg?: ChatMessage): UserServiceData | undefined;

  /**
   * Pin message.
   * @param params -
   * - msgId: the message id.
   *
   * @throws {@link UIKitError}
   */
  pinMessage(params: { msgId: string }): Promise<void>;
  /**
   * Unpin message.
   * @param params -
   * - msgId: the message id.
   *
   * @throws {@link UIKitError}
   */
  unPinMessage(params: { msgId: string }): Promise<void>;
  /**
   * Fetch pinned messages list.
   * @param params -
   * - convId: the conversation id.
   * - forceRequest: whether to force request.
   * - onResult: the result callback.
   */
  fetchPinnedMessages(params: {
    convId: string;
    forceRequest?: boolean;
    onResult: (params: {
      isOk: boolean;
      msgs?: ChatMessage[];
      error?: UIKitError;
    }) => void;
  }): Promise<void>;
  /**
   * Get local pinned messages list.
   * @param params -
   * - convId: the conversation id.
   * - onResult: the result callback.
   */
  getPinnedMessages(params: {
    convId: string;
    onResult: (params: {
      isOk: boolean;
      msgs?: ChatMessage[];
      error?: UIKitError;
    }) => void;
  }): Promise<void>;

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
  sendFinished(params: { event: RoomEventType; extra?: any }): void;
}

/**
 * RoomServiceInit is the initialization parameters of RoomService.
 */
export type RoomServiceInit = {
  /**
   * Agora appKey.
   *
   * @deprecated Please use {@link ChatOptions} instead.
   */
  appKey: string;
  /**
   * Whether to enable debug mode.
   *
   * @deprecated Please use {@link ChatOptions} instead.
   */
  debugMode?: boolean;
  /**
   * IM initialization is completed.
   */
  opt: ChatOptions;
  /**
   * IM initialization is completed.
   */
  onInitialized?: () => void;
};
