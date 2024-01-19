import {
  ChatClient,
  ChatConnectEventListener,
  ChatContactEventListener,
  ChatConversationType,
  ChatCustomEventListener,
  ChatExceptionEventListener,
  ChatGroup,
  ChatGroupEventListener,
  ChatGroupMessageAck,
  ChatMessage,
  ChatMessageEventListener,
  ChatMessageReactionEvent,
  ChatMessageThreadEvent,
  ChatMultiDeviceEvent,
  ChatMultiDeviceEventListener,
  ChatPresence,
  ChatPresenceEventListener,
} from 'react-native-chat-sdk';
import type { ChatException } from 'react-native-chat-sdk/lib/typescript/common/ChatError';

import { ChatServiceListener, DisconnectReasonType } from './types';
import { UIListener, UIListenerType } from './types.ui';

let gConnectListener: ChatConnectEventListener;
let gMessageListener: ChatMessageEventListener;
let gGroupListener: ChatGroupEventListener;
let gMultiDeviceListener: ChatMultiDeviceEventListener;
let gCustomListener: ChatCustomEventListener;
let gContactListener: ChatContactEventListener;
let gPresenceListener: ChatPresenceEventListener;
let gExceptListener: ChatExceptionEventListener;

export class ChatServiceListenerImpl {
  _listeners: Set<ChatServiceListener>;
  _uiListeners: Map<UIListenerType, Set<UIListener<any>>>;
  constructor() {
    this._listeners = new Set();
    this._uiListeners = new Map([
      [UIListenerType.Conversation, new Set()],
      [UIListenerType.Contact, new Set()],
      [UIListenerType.Group, new Set()],
      [UIListenerType.GroupParticipant, new Set()],
      [UIListenerType.NewRequest, new Set()],
    ]);
  }

  get client(): ChatClient {
    return ChatClient.getInstance();
  }

  get listeners(): Set<ChatServiceListener> {
    return this._listeners;
  }

  uiListener<DataModel>(type: UIListenerType): Set<UIListener<DataModel>> {
    return this._uiListeners.get(type)!;
  }

  addListener(listener: ChatServiceListener): void {
    this._listeners.add(listener);
  }
  removeListener(listener: ChatServiceListener): void {
    this._listeners.delete(listener);
  }
  clearListener(): void {
    this._listeners.clear();
  }

  addUIListener<DataModel>(listener: UIListener<DataModel>): void {
    this._uiListeners.get(listener.type)?.add(listener);
  }
  removeUIListener<DataModel>(listener: UIListener<DataModel>): void {
    this._uiListeners.get(listener.type)?.delete(listener);
  }
  clearUIListener(): void {
    this._uiListeners.forEach((v) => {
      v.clear();
    });
  }
  sendUIEvent<DataModel>(
    type: UIListenerType,
    event: keyof UIListener<DataModel>,
    data?: DataModel | string,
    ...args: any[]
  ): void {
    this._uiListeners.get(type)?.forEach((v) => {
      if (typeof v[event] === 'function') {
        const f = v[event] as Function;
        f(data, ...args);
      }
    });
  }

  _initListener() {
    this._unInitListener();
    console.log('dev:chat:initListener');
    this._initConnectListener();
    this._initMessageListener();
    this._initGroupListener();
    this._initMultiDeviceListener();
    this._initCustomListener();
    this._initContactListener();
    this._initPresenceListener();
    this._initExtraListener();
    this._initExceptListener();
  }
  _unInitListener() {
    console.log('dev:chat:unInitListener');
    this.client.removeConnectionListener(gConnectListener);
    this.client.chatManager.removeMessageListener(gMessageListener);
    this.client.groupManager.removeGroupListener(gGroupListener);
    this.client.removeMultiDeviceListener(gMultiDeviceListener);
    this.client.removeCustomListener(gCustomListener);
    this.client.contactManager.removeContactListener(gContactListener);
    this.client.presenceManager.removePresenceListener(gPresenceListener);
    this.client.removeExceptListener(gExceptListener);
  }
  _clearListener() {
    console.log('dev:chat:clearListener');
    this.client.removeAllConnectionListener();
    this.client.chatManager.removeAllMessageListener();
    this.client.groupManager.removeAllGroupListener();
    this.client.removeAllMultiDeviceListener();
    this.client.removeAllCustomListener();
    this.client.contactManager.removeAllContactListener();
    this.client.presenceManager.removeAllPresenceListener();
    this.client.removeAllExceptListener();
  }

  onConnected(): void {
    this._listeners.forEach((v) => {
      v.onConnected?.();
    });
  }
  onDisconnected(): void {
    this._listeners.forEach((v) => {
      v.onDisconnected?.(DisconnectReasonType.others);
    });
  }
  onTokenWillExpire(): void {
    this._listeners.forEach((v) => {
      v.onDisconnected?.(DisconnectReasonType.token_will_expire);
    });
  }
  onTokenDidExpire(): void {
    this._listeners.forEach((v) => {
      v.onDisconnected?.(DisconnectReasonType.token_did_expire);
    });
  }
  onAppActiveNumberReachLimit(): void {
    this._listeners.forEach((v) => {
      v.onDisconnected?.(DisconnectReasonType.app_active_number_reach_limit);
    });
  }
  onUserDidLoginFromOtherDevice(): void {
    this._listeners.forEach((v) => {
      v.onDisconnected?.(DisconnectReasonType.user_did_login_from_other_device);
    });
  }
  onUserDidRemoveFromServer(): void {
    this._listeners.forEach((v) => {
      v.onDisconnected?.(DisconnectReasonType.user_did_remove_from_server);
    });
  }
  onUserDidForbidByServer(): void {
    this._listeners.forEach((v) => {
      v.onDisconnected?.(DisconnectReasonType.user_did_forbid_by_server);
    });
  }
  onUserDidChangePassword(): void {
    this._listeners.forEach((v) => {
      v.onDisconnected?.(DisconnectReasonType.user_did_change_password);
    });
  }
  onUserDidLoginTooManyDevice(): void {
    this._listeners.forEach((v) => {
      v.onDisconnected?.(DisconnectReasonType.user_did_login_too_many_device);
    });
  }
  onUserKickedByOtherDevice(): void {
    this._listeners.forEach((v) => {
      v.onDisconnected?.(DisconnectReasonType.user_kicked_by_other_device);
    });
  }
  onUserAuthenticationFailed(): void {
    this._listeners.forEach((v) => {
      v.onDisconnected?.(DisconnectReasonType.user_authentication_failed);
    });
  }

  _initConnectListener() {
    gConnectListener = {
      onConnected: this.onConnected.bind(this),
      onDisconnected: this.onDisconnected.bind(this),
      onTokenWillExpire: this.onTokenWillExpire.bind(this),
      onTokenDidExpire: this.onTokenDidExpire.bind(this),
      onAppActiveNumberReachLimit: this.onAppActiveNumberReachLimit.bind(this),
      onUserDidLoginFromOtherDevice:
        this.onUserDidLoginFromOtherDevice.bind(this),
      onUserDidRemoveFromServer: this.onUserDidRemoveFromServer.bind(this),
      onUserDidForbidByServer: this.onUserDidForbidByServer.bind(this),
      onUserDidChangePassword: this.onUserDidChangePassword.bind(this),
      onUserDidLoginTooManyDevice: this.onUserDidLoginTooManyDevice.bind(this),
      onUserKickedByOtherDevice: this.onUserKickedByOtherDevice.bind(this),
      onUserAuthenticationFailed: this.onUserAuthenticationFailed.bind(this),
    };
    this.client.addConnectionListener(gConnectListener);
  }

  onMessagesReceived(messages: Array<ChatMessage>) {
    console.log(
      'dev:chat:onMessagesReceived:',
      messages.length,
      this._listeners?.size
    );
    this._listeners.forEach((v) => {
      v.onMessagesReceived?.(messages);
    });
  }
  onCmdMessagesReceived(messages: Array<ChatMessage>) {
    this._listeners.forEach((v) => {
      v.onCmdMessagesReceived?.(messages);
    });
  }
  onMessagesRead(messages: Array<ChatMessage>) {
    this._listeners.forEach((v) => {
      v.onMessagesRead?.(messages);
    });
  }
  onGroupMessageRead(groupMessageAcks: Array<ChatGroupMessageAck>) {
    this._listeners.forEach((v) => {
      v.onGroupMessageRead?.(groupMessageAcks);
    });
  }
  onMessagesDelivered(messages: Array<ChatMessage>) {
    this._listeners.forEach((v) => {
      v.onMessagesDelivered?.(messages);
    });
  }
  onMessagesRecalled(messages: Array<ChatMessage>) {
    this._listeners.forEach((v) => {
      v.onMessagesRecalled?.(messages);
    });
  }
  onConversationsUpdate() {
    this._listeners.forEach((v) => {
      v.onConversationsUpdate?.();
    });
  }
  onConversationRead(from: string, to?: string) {
    this._listeners.forEach((v) => {
      v.onConversationRead?.(from, to);
    });
  }
  onMessageReactionDidChange(list: Array<ChatMessageReactionEvent>) {
    this._listeners.forEach((v) => {
      v.onMessageReactionDidChange?.(list);
    });
  }
  onChatMessageThreadCreated(event: ChatMessageThreadEvent) {
    this._listeners.forEach((v) => {
      v.onChatMessageThreadCreated?.(event);
    });
  }
  onChatMessageThreadUpdated(event: ChatMessageThreadEvent) {
    this._listeners.forEach((v) => {
      v.onChatMessageThreadUpdated?.(event);
    });
  }
  onChatMessageThreadDestroyed(event: ChatMessageThreadEvent) {
    this._listeners.forEach((v) => {
      v.onChatMessageThreadDestroyed?.(event);
    });
  }
  onChatMessageThreadUserRemoved(event: ChatMessageThreadEvent) {
    this._listeners.forEach((v) => {
      v.onChatMessageThreadUserRemoved?.(event);
    });
  }
  onMessageContentChanged(
    message: ChatMessage,
    lastModifyOperatorId: string,
    lastModifyTime: number
  ) {
    this._listeners.forEach((v) => {
      v.onMessageContentChanged?.(
        message,
        lastModifyOperatorId,
        lastModifyTime
      );
    });
  }

  _initMessageListener() {
    gMessageListener = {
      onMessagesReceived: this.onMessagesReceived.bind(this),
      onCmdMessagesReceived: this.onCmdMessagesReceived.bind(this),
      onMessagesRead: this.onMessagesRead.bind(this),
      onGroupMessageRead: this.onGroupMessageRead.bind(this),
      onMessagesDelivered: this.onMessagesDelivered.bind(this),
      onMessagesRecalled: this.onMessagesRecalled.bind(this),
      onConversationsUpdate: this.onConversationsUpdate.bind(this),
      onConversationRead: this.onConversationRead.bind(this),
      onMessageReactionDidChange: this.onMessageReactionDidChange.bind(this),
      onChatMessageThreadCreated: this.onChatMessageThreadCreated.bind(this),
      onChatMessageThreadUpdated: this.onChatMessageThreadUpdated.bind(this),
      onChatMessageThreadDestroyed:
        this.onChatMessageThreadDestroyed.bind(this),
      onChatMessageThreadUserRemoved:
        this.onChatMessageThreadUserRemoved.bind(this),
      onMessageContentChanged: this.onMessageContentChanged.bind(this),
    };
    this.client.chatManager.addMessageListener(gMessageListener);
  }

  onInvitationReceived(params: {
    groupId: string;
    inviter: string;
    groupName: string;
    reason?: string;
  }): void {
    this._listeners.forEach((v) => {
      v.onInvitationReceived?.(params);
    });
  }
  onRequestToJoinReceived(params: {
    groupId: string;
    applicant: string;
    groupName?: string;
    reason?: string;
  }): void {
    this._listeners.forEach((v) => {
      v.onRequestToJoinReceived?.(params);
    });
  }
  onRequestToJoinAccepted(params: {
    groupId: string;
    accepter: string;
    groupName?: string;
  }): void {
    this._listeners.forEach((v) => {
      v.onRequestToJoinAccepted?.(params);
    });
  }
  onRequestToJoinDeclined(params: {
    groupId: string;
    decliner: string;
    groupName?: string;
    applicant?: string;
    reason?: string;
  }): void {
    this._listeners.forEach((v) => {
      v.onRequestToJoinDeclined?.(params);
    });
  }
  onInvitationAccepted(params: {
    groupId: string;
    invitee: string;
    reason?: string;
  }): void {
    this._listeners.forEach((v) => {
      v.onInvitationAccepted?.(params);
    });
  }
  onInvitationDeclined(params: {
    groupId: string;
    invitee: string;
    reason?: string;
  }): void {
    this._listeners.forEach((v) => {
      v.onInvitationDeclined?.(params);
    });
  }
  onMemberRemoved(params: { groupId: string; groupName?: string }): void {
    this._listeners.forEach((v) => {
      v.onMemberRemoved?.(params);
    });
  }
  onDestroyed(params: { groupId: string; groupName?: string }): void {
    this._listeners.forEach((v) => {
      v.onDestroyed?.(params);
    });
  }
  onAutoAcceptInvitation(params: {
    groupId: string;
    inviter: string;
    inviteMessage?: string;
  }): void {
    this._listeners.forEach((v) => {
      v.onAutoAcceptInvitation?.(params);
    });
  }
  onMuteListAdded(params: {
    groupId: string;
    mutes: Array<string>;
    muteExpire?: number;
  }): void {
    this._listeners.forEach((v) => {
      v.onMuteListAdded?.(params);
    });
  }
  onMuteListRemoved(params: { groupId: string; mutes: Array<string> }): void {
    this._listeners.forEach((v) => {
      v.onMuteListRemoved?.(params);
    });
  }
  onAdminAdded(params: { groupId: string; admin: string }): void {
    this._listeners.forEach((v) => {
      v.onAdminAdded?.(params);
    });
  }
  onAdminRemoved(params: { groupId: string; admin: string }): void {
    this._listeners.forEach((v) => {
      v.onAdminRemoved?.(params);
    });
  }
  onOwnerChanged(params: {
    groupId: string;
    newOwner: string;
    oldOwner: string;
  }): void {
    this._listeners.forEach((v) => {
      v.onOwnerChanged?.(params);
    });
  }
  onMemberJoined(params: { groupId: string; member: string }): void {
    this._listeners.forEach((v) => {
      v.onMemberJoined?.(params);
    });
  }
  onMemberExited(params: { groupId: string; member: string }): void {
    this._listeners.forEach((v) => {
      v.onMemberExited?.(params);
    });
  }
  onAnnouncementChanged(params: {
    groupId: string;
    announcement: string;
  }): void {
    this._listeners.forEach((v) => {
      v.onAnnouncementChanged?.(params);
    });
  }
  onSharedFileAdded(params: { groupId: string; sharedFile: string }): void {
    this._listeners.forEach((v) => {
      v.onSharedFileAdded?.(params);
    });
  }
  onSharedFileDeleted(params: { groupId: string; fileId: string }): void {
    this._listeners.forEach((v) => {
      v.onSharedFileDeleted?.(params);
    });
  }
  onAllowListAdded(params: { groupId: string; members: Array<string> }): void {
    this._listeners.forEach((v) => {
      v.onAllowListAdded?.(params);
    });
  }
  onAllowListRemoved(params: {
    groupId: string;
    members: Array<string>;
  }): void {
    this._listeners.forEach((v) => {
      v.onAllowListRemoved?.(params);
    });
  }
  onAllGroupMemberMuteStateChanged(params: {
    groupId: string;
    isAllMuted: boolean;
  }): void {
    this._listeners.forEach((v) => {
      v.onAllGroupMemberMuteStateChanged?.(params);
    });
  }
  onDetailChanged(group: ChatGroup): void {
    this._listeners.forEach((v) => {
      v.onDetailChanged?.(group);
    });
  }
  onStateChanged(group: ChatGroup): void {
    this._listeners.forEach((v) => {
      v.onStateChanged?.(group);
    });
  }
  onMemberAttributesChanged(params: {
    groupId: string;
    member: string;
    attributes: any;
    operator: string;
  }): void {
    this._listeners.forEach((v) => {
      v.onMemberAttributesChanged?.(params);
    });
  }

  _initGroupListener() {
    gGroupListener = {
      onInvitationReceived: this.onInvitationReceived.bind(this),
      onRequestToJoinReceived: this.onRequestToJoinReceived.bind(this),
      onRequestToJoinAccepted: this.onRequestToJoinAccepted.bind(this),
      onRequestToJoinDeclined: this.onRequestToJoinDeclined.bind(this),
      onInvitationAccepted: this.onInvitationAccepted.bind(this),
      onInvitationDeclined: this.onInvitationDeclined.bind(this),
      onMemberRemoved: this.onMemberRemoved.bind(this),
      onDestroyed: this.onDestroyed.bind(this),
      onAutoAcceptInvitation: this.onAutoAcceptInvitation.bind(this),
      onMuteListAdded: this.onMuteListAdded.bind(this),
      onMuteListRemoved: this.onMuteListRemoved.bind(this),
      onAdminAdded: this.onAdminAdded.bind(this),
      onAdminRemoved: this.onAdminRemoved.bind(this),
      onOwnerChanged: this.onOwnerChanged.bind(this),
      onMemberJoined: this.onMemberJoined.bind(this),
      onMemberExited: this.onMemberExited.bind(this),
      onAnnouncementChanged: this.onAnnouncementChanged.bind(this),
      onSharedFileAdded: this.onSharedFileAdded.bind(this),
      onSharedFileDeleted: this.onSharedFileDeleted.bind(this),
      onAllowListAdded: this.onAllowListAdded.bind(this),
      onAllowListRemoved: this.onAllowListRemoved.bind(this),
      onAllGroupMemberMuteStateChanged:
        this.onAllGroupMemberMuteStateChanged.bind(this),
      onDetailChanged: this.onDetailChanged.bind(this),
      onStateChanged: this.onStateChanged.bind(this),
      onMemberAttributesChanged: this.onMemberAttributesChanged.bind(this),
    };
    this.client.groupManager.addGroupListener(gGroupListener);
  }

  onContactEvent(
    event?: ChatMultiDeviceEvent,
    target?: string,
    ext?: string
  ): void {
    this._listeners.forEach((v) => {
      v.onContactEvent?.(event, target, ext);
    });
  }
  onGroupEvent(
    event?: ChatMultiDeviceEvent,
    target?: string,
    usernames?: Array<string>
  ): void {
    this._listeners.forEach((v) => {
      v.onGroupEvent?.(event, target, usernames);
    });
  }
  onThreadEvent(
    event?: ChatMultiDeviceEvent,
    target?: string,
    usernames?: Array<string>
  ): void {
    this._listeners.forEach((v) => {
      v.onThreadEvent?.(event, target, usernames);
    });
  }
  onMessageRemoved(convId?: string, deviceId?: string): void {
    this._listeners.forEach((v) => {
      v.onMessageRemoved?.(convId, deviceId);
    });
  }
  onConversationEvent(
    event?: ChatMultiDeviceEvent,
    convId?: string,
    convType?: ChatConversationType
  ): void {
    this._listeners.forEach((v) => {
      v.onConversationEvent?.(event, convId, convType);
    });
  }

  _initMultiDeviceListener() {
    gMultiDeviceListener = {
      onContactEvent: this.onContactEvent.bind(this),
      onGroupEvent: this.onGroupEvent.bind(this),
      onThreadEvent: this.onThreadEvent.bind(this),
      onMessageRemoved: this.onMessageRemoved.bind(this),
      onConversationEvent: this.onConversationEvent.bind(this),
    };
    this.client.addMultiDeviceListener(gMultiDeviceListener);
  }
  _initCustomListener() {
    gCustomListener = {
      onDataReceived: (params: any): void => {
        this._listeners.forEach((v) => {
          v.onDataReceived?.(params);
        });
      },
    };
    this.client.addCustomListener(gCustomListener);
  }

  onContactAdded(userName: string): void {
    this._listeners.forEach((v) => {
      v.onContactAdded?.(userName);
    });
  }
  onContactDeleted(userName: string): void {
    this._listeners.forEach((v) => {
      v.onContactDeleted?.(userName);
    });
  }
  onContactInvited(userName: string, reason?: string): void {
    this._listeners.forEach((v) => {
      v.onContactInvited?.(userName, reason);
    });
  }
  onFriendRequestAccepted(userName: string): void {
    this._listeners.forEach((v) => {
      v.onFriendRequestAccepted?.(userName);
    });
  }
  onFriendRequestDeclined(userName: string): void {
    this._listeners.forEach((v) => {
      v.onFriendRequestDeclined?.(userName);
    });
  }

  _initContactListener() {
    gContactListener = {
      onContactAdded: this.onContactAdded.bind(this),
      onContactDeleted: this.onContactDeleted.bind(this),
      onContactInvited: this.onContactInvited.bind(this),
      onFriendRequestAccepted: this.onFriendRequestAccepted.bind(this),
      onFriendRequestDeclined: this.onFriendRequestDeclined.bind(this),
    };
    this.client.contactManager.addContactListener(gContactListener);
  }
  _initPresenceListener() {
    gPresenceListener = {
      onPresenceStatusChanged: (list: Array<ChatPresence>): void => {
        this._listeners.forEach((v) => {
          v.onPresenceStatusChanged?.(list);
        });
      },
    };
    this.client.presenceManager.addPresenceListener(gPresenceListener);
  }

  _initExtraListener() {}

  bindOnExcept(params: {
    except: ChatException;
    from?: string | undefined;
    extra?: Record<string, string> | undefined;
  }) {
    console.error('dev:chat:except', params);
  }
  _initExceptListener() {
    gExceptListener = {
      onExcept: this.bindOnExcept.bind(this),
    };
    this.client.addExceptListener(gExceptListener);
  }
}
