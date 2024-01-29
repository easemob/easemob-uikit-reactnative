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
  StateModel,
  UIListener,
  UIListenerType,
} from './types.ui';

/**
 * Event type. Usually calling the interface provided by `ChatService` will trigger a callback notification. The event type in the callback notification is the name of the calling interface.
 */
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
  /**
   * In addition to the above reasons, other reasons are here. Including network issues.
   */
  others = 'others',
}

/**
 * The callback type of the calling interface. Might return a result if the call completes, or an error object if it fails.
 */
export type ResultCallback<T> = (params: {
  /**
   * Whether the call is successful.
   */
  isOk: boolean;
  /**
   * The result of the call.
   */
  value?: T;
  /**
   * The error object of the call.
   */
  error?: UIKitError;
}) => void;

/**
 * The type of data model.
 */
export type DataModelType = 'user' | 'group';

/**
 * The type of data model.
 */
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

/**
 * User from type.
 */
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

/**
 * The type of user data.
 */
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

/**
 * The type of message listener.
 */
export type MessageServiceListener =
  PartialUndefinable<ChatMessageEventListener>;

/**
 * The type of conversation listener.
 */
export type ConversationListener = {};

/**
 * The type of group listener.
 */
export type GroupServiceListener =
  PartialUndefinable<ChatGroupEventListener> & {};

/**
 * The type of contact listener.
 */
export type ContactServiceListener =
  PartialUndefinable<ChatContactEventListener>;

/**
 * The type of presence listener.
 */
export type PresenceServiceListener =
  PartialUndefinable<ChatPresenceEventListener>;

/**
 * The type of custom listener.
 */
export type CustomServiceListener = PartialUndefinable<ChatCustomEventListener>;

/**
 * The type of multi device state listener.
 */
export type MultiDeviceStateListener =
  PartialUndefinable<ChatMultiDeviceEventListener>;

/**
 * When calling the `ChatService` common interface, the corresponding event will be triggered. Events before calling the interface, calling completion events and calling failure events.
 */
export interface EventServiceListener {
  /**
   * Event notification before calling the interface.
   */
  onBefore?(params: { event: ChatEventType; extra?: any }): void;
  /**
   * Event notification after calling the interface.
   */
  onFinished?(params: { event: ChatEventType; extra?: any }): void;
  /**
   * Event notification when an error occurs.
   */
  onError?(params: { error: UIKitError; from?: string; extra?: any }): void;
}

/**
 * A collection of listeners.
 *
 * You can use one or more listeners, for example: only care about changes in the contact list.
 *
 * @example
 *
 * ```tsx
 * React.useEffect(() => {
 *   const listener: ContactServiceListener = {
 *     onContactAdded: async (_userId: string) => {
 *       if (userId === _userId) {
 *         setIsContact(true);
 *       }
 *     },
 *     onContactDeleted: async (_userId: string) => {
 *       if (userId === _userId) {
 *         setIsContact(false);
 *       }
 *     },
 *   };
 *   im.addListener(listener);
 *   return () => {
 *     im.removeListener(listener);
 *   };
 * }, [im, userId]);
 * ```
 */
export type ChatServiceListener = ConnectServiceListener &
  MessageServiceListener &
  ConversationListener &
  GroupServiceListener &
  ContactServiceListener &
  PresenceServiceListener &
  CustomServiceListener &
  MultiDeviceStateListener &
  EventServiceListener;

/**
 * The type of conversation service.
 */
export interface ConversationServices {
  // setOnRequestMultiData<DataT>(
  //   callback?: (params: {
  //     ids: Map<DataModelType, string[]>;
  //     result: (data?: Map<DataModelType, DataT[]>, error?: UIKitError) => void;
  //   }) => void | Promise<void>
  // ): void;
  /**
   * Set the current conversation.
   */
  setCurrentConversation(params: { conv?: ConversationModel }): void;
  /**
   * Get the current conversation.
   */
  getCurrentConversation(): ConversationModel | undefined;
  /**
   * Get all conversations.
   */
  getAllConversations(params: {
    onResult: ResultCallback<ConversationModel[]>;
  }): Promise<void>;
  /**
   * Get the conversation.
   *
   * @params -
   * - convId: Conversation ID.
   * - convType: Conversation type.
   * - createIfNotExist: Whether to create a new conversation if it does not exist.
   * - fromNative: Whether it is called from the native layer.
   */
  getConversation(params: {
    convId: string;
    convType: ChatConversationType;
    createIfNotExist?: boolean;
    fromNative?: boolean;
  }): Promise<ConversationModel | undefined>;
  /**
   * Remove local conversation all messages.
   */
  removeConversationAllMessages(params: {
    convId: string;
    convType: ChatConversationType;
  }): Promise<void>;
  /**
   * Remove local conversation.
   *
   * Only when users actively delete the session, if they exit the group, be kicked out of the group, delete contact, add blacklist, etc., will not delete the session list.
   */
  removeConversation(params: {
    convId: string;
    removeMessage?: boolean;
  }): Promise<void>;
  /**
   * Clear all conversations.
   */
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
  /**
   * Set the conversation disturb.
   * @throws {@link UIKitError}
   */
  setConversationSilentMode(params: {
    convId: string;
    convType: ChatConversationType;
    doNotDisturb: boolean;
  }): Promise<void>;
  /**
   * Set the conversation top.
   * @throws {@link UIKitError}
   */
  setConversationRead(params: {
    convId: string;
    convType: ChatConversationType;
  }): Promise<void>;
  /**
   * Set the conversation extension.
   * @throws {@link UIKitError}
   */
  setConversationExt(params: {
    convId: string;
    convType: ChatConversationType;
    ext: Record<string, string | number | boolean>;
  }): Promise<void>;
  /**
   * Get the conversation extension.
   * @throws {@link UIKitError}
   */
  getConversationMessageCount(
    convId: string,
    convType: ChatConversationType
  ): Promise<number>;
  /**
   * Get the conversation latest message.
   */
  getConversationLatestMessage(
    convId: string,
    convType: ChatConversationType
  ): Promise<ChatMessage | undefined>;
  /**
   * Get the conversation disturb.
   */
  getDoNotDisturb(
    convId: string,
    convType: ChatConversationType
  ): Promise<boolean>;
}

/**
 * The type of contact service.
 */
export interface ContactServices {
  // setContactOnRequestData<DataT>(
  //   callback?: (params: {
  //     ids: string[];
  //     result: (data?: DataT[], error?: UIKitError) => void;
  //   }) => void | Promise<void>
  // ): void;
  /**
   * Whether it is a contact person.
   */
  isContact(params: { userId: string }): boolean;
  /**
   * Get all contacts.
   */
  getAllContacts(params: { onResult: ResultCallback<ContactModel[]> }): void;
  /**
   * Get the contact.
   */
  getContact(params: {
    userId: string;
    onResult: ResultCallback<ContactModel | undefined>;
  }): void;
  /**
   * Add a new contact.
   *
   * Trigger contact callback notification. {@link UIContactListListener}
   */
  addNewContact(params: {
    userId: string;
    reason?: string;
    onResult?: ResultCallback<void>;
  }): void;
  /**
   * Remove a contact.
   *
   * Trigger contact callback notification. {@link UIContactListListener}
   */
  removeContact(params: {
    userId: string;
    onResult?: ResultCallback<void>;
  }): void;
  /**
   * Update the contact remark.
   *
   * Trigger contact callback notification. {@link UIContactListListener}
   */
  setContactRemark(params: {
    userId: string;
    remark: string;
    onResult?: ResultCallback<void>;
  }): void;
  /**
   * Accept the invitation.
   */
  acceptInvitation(params: {
    userId: string;
    onResult: ResultCallback<void>;
  }): void;
  /**
   * Decline the invitation.
   */
  declineInvitation(params: {
    userId: string;
    onResult: ResultCallback<void>;
  }): void;
}

/**
 * The type of user service.
 */
export interface UserServices {
  /**
   * Get the user information.
   */
  getUserInfo(params: {
    userId: string;
    onResult: ResultCallback<UserData | undefined>;
  }): void;
  /**
   * Get the user information list.
   */
  getUsersInfo(params: {
    userIds: string[];
    onResult: ResultCallback<UserData[]>;
  }): void;
}

/**
 * The type of message service.
 */
export interface MessageServices {
  /**
   * Get the message.
   */
  getMessage(params: { messageId: string }): Promise<ChatMessage | undefined>;
  /**
   * Resend the message.
   */
  resendMessage(params: {
    message: ChatMessage;
    callback?: ChatMessageStatusCallback;
  }): void;
  /**
   * Recall the message.
   */
  recallMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void;
  /**
   * Insert the message.
   */
  insertMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void;
  /**
   * Update the message.
   */
  updateMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void;
  /**
   * Remove the message.
   */
  removeMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void;
  /**
   * Edit the message.
   */
  editMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<ChatMessage>;
  }): void;
  /**
   * Get the message list.
   */
  getNewRequestList(params: {
    convId: string;
    convType: ChatConversationType;
    timestamp?: number;
    pageSize?: number;
    direction?: ChatSearchDirection;
    onResult: ResultCallback<ChatMessage[]>;
  }): void;
  /**
   * Send the message list.
   */
  sendMessage(params: {
    message: ChatMessage;
    callback?: ChatMessageStatusCallback;
  }): void;
  /**
   * Download the message attachment.
   */
  downloadMessageAttachment(params: {
    message: ChatMessage;
    callback?: ChatMessageStatusCallback;
  }): void;
  /**
   * Get the history message list.
   */
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
  /**
   * Set message read flag.
   */
  setMessageRead(params: {
    convId: string;
    convType: ChatConversationType;
    msgId: string;
    onResult: ResultCallback<void>;
  }): void;
  /**
   * Send message read ack.
   */
  sendMessageReadAck(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void;
  /**
   * Report message to server.
   */
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
  /**
   * Get the group name customization callback.
   */
  getCreateGroupCustomNameCallback():
    | ((params: { selected: ContactModel[] }) => string)
    | undefined;
  /**
   * Registrar. When loading the group member list, the avatars and nicknames of the group members will be obtained.
   */
  setGroupParticipantOnRequestData<DataT extends DataModel = DataModel>(
    callback?: (params: {
      groupId: string;
      ids: string[];
      result: (data?: DataT[], error?: UIKitError) => void;
    }) => void | Promise<void>
  ): void;
  /**
   * Actively update group members' avatars and nicknames. The component will take effect next time.
   */
  updateGroupParticipantOnRequestData(params: {
    groupId: string;
    data: Map<DataModelType, DataModel[]>;
  }): void;
  /**
   * Get joined groups.
   */
  getJoinedGroups(params: { onResult: ResultCallback<GroupModel[]> }): void;
  /**
   * Get the group list in pages..
   */
  getPageGroups(params: {
    pageSize: number;
    pageNum: number;
    onResult: ResultCallback<GroupModel[]>;
  }): void;
  /**
   * Get the group member list.
   */
  getGroupAllMembers(params: {
    groupId: string;
    isReset?: boolean;
    owner?: GroupParticipantModel;
    onResult: ResultCallback<GroupParticipantModel[]>;
  }): void;
  /**
   * Get group owner.
   */
  getGroupOwner(params: {
    groupId: string;
  }): Promise<GroupParticipantModel | undefined>;
  /**
   * Get group member.
   */
  getGroupMember(params: {
    groupId: string;
    userId: string;
  }): GroupParticipantModel | undefined;
  /**
   * fetch joined group count.
   */
  fetchJoinedGroupCount(params: { onResult: ResultCallback<number> }): void;
  /**
   * Get the group information.
   */
  getGroupInfo(params: {
    groupId: string;
    onResult: ResultCallback<GroupModel>;
  }): void;
  /**
   * Get the group information from the server.
   */
  getGroupInfoFromServer(params: {
    groupId: string;
    onResult: ResultCallback<GroupModel>;
  }): void;
  /**
   * Create a group.
   */
  createGroup(params: {
    groupName: string;
    groupDescription?: string;
    inviteMembers: string[];
    onResult?: ResultCallback<GroupModel>;
  }): void;
  /**
   * Quit the group.
   *
   * Trigger group callback notification. {@link UIGroupListListener}
   */
  quitGroup(params: { groupId: string; onResult?: ResultCallback<void> }): void;
  /**
   * Destroy the group.
   *
   * Trigger group callback notification. {@link UIGroupListListener}
   */
  destroyGroup(params: {
    groupId: string;
    onResult?: ResultCallback<void>;
  }): void;
  /**
   * Set the group name.
   *
   * Trigger group callback notification. {@link UIGroupListListener}
   */
  setGroupName(params: {
    groupId: string;
    groupNewName: string;
    onResult?: ResultCallback<void>;
  }): void;
  /**
   * Set the group description.
   *
   * Trigger group callback notification. {@link UIGroupListListener}
   */
  setGroupDescription(params: {
    groupId: string;
    groupDescription: string;
    onResult?: ResultCallback<void>;
  }): void;
  /**
   * Set the group extension.
   *
   * Trigger group callback notification. {@link UIGroupListListener}
   */
  setGroupMyRemark(params: {
    groupId: string;
    memberId: string;
    groupMyRemark: string;
    ext?: Record<string, string>;
    onResult?: ResultCallback<void>;
  }): void;
  /**
   * Get the group member remark.
   */
  getGroupMyRemark(params: {
    groupId: string;
    memberId: string;
    onResult: ResultCallback<string | undefined>;
  }): void;
  /**
   * Add group members.
   *
   * Trigger group callback notification. {@link UIGroupParticipantListListener}
   */
  addGroupMembers(params: {
    groupId: string;
    members: GroupParticipantModel[];
    welcomeMessage?: string;
    onResult: ResultCallback<void>;
  }): void;
  /**
   * Remove group members.
   *
   * Trigger group callback notification. {@link UIGroupParticipantListListener}
   */
  removeGroupMembers(params: {
    groupId: string;
    members: string[];
    onResult: ResultCallback<void>;
  }): void;
  /**
   * Set the group owner.
   *
   * Trigger group callback notification. {@link UIGroupParticipantListListener}
   */
  changeGroupOwner(params: {
    groupId: string;
    newOwnerId: string;
    onResult?: ResultCallback<void>;
  }): void;
}

/**
 * The type of presence service.
 */
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

/**
 * The type of chat service.
 *
 * Interfaces are mainly divided into two categories: synchronous method and asynchronous method. Synchronous method may throw exceptions, but asynchronous method do not. The main difference between them is whether `ResultCallback` is included in the parameters.
 */
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
   * Save the selected state of the data. To synchronize the list data status between pages, the parameters provided by the interface are usually used. However, it is troublesome to pass complex objects of react-native between routes and require layer-by-layer penetration. Therefore, the bottom layer save and update processing is used here. Just refresh the list to achieve synchronization.
   * @param params -
   * - tag: The tag of the data. You can use classification tags, such as contact tags, group tags, etc.
   * - id: The ID of the data.
   * - state: The state of the data.
   */
  setModelState(params: { tag: string; id: string; state: StateModel }): void;
  /**
   * Get the selected state of the data.
   */
  getModelState(params: { tag: string; id: string }): StateModel | undefined;
  /**
   * Clear the selected state of the data.
   */
  clearModelState(params: { tag: string }): void;

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
   * Send a before to the listener.
   * @param params -
   * - event: the event type.
   * - extra: the extra data.
   */
  sendBefore(params: { event: ChatEventType; extra?: any }): void;

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

  /**
   * Get the request data information.
   */
  getRequestData(id: string): DataModel | undefined;
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
  /**
   * App key. (required)
   */
  appKey: string;
};

/**
 * ChatServiceInit is the initialization parameters of ChatService.
 */
export type ChatServiceInit = {
  /**
   * Chat SDK options.
   */
  options: ChatOptionsType;
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
   */
  onRequestMultiData?: (params: {
    ids: Map<DataModelType, string[]>;
    result: (
      data?: Map<DataModelType, DataModel[]>,
      error?: UIKitError
    ) => void;
  }) => void | Promise<void>;
  /**
   * IM initialization is completed callback notification.
   */
  onInitialized?: () => void;
};
