import { ErrorCode, UIKitError } from '../error';
import {
  CHAT_VERSION,
  ChatClient,
  ChatConnectEventListener,
  ChatConversationType,
  ChatCursorResult,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageEventListener,
  ChatMessagePinInfo,
  ChatMessageStatusCallback,
  ChatOptions,
  ChatRoom,
  ChatRoomEventListener,
} from '../rename.chat';
import type { Keyof } from '../types';
import { asyncTask } from '../utils';
import {
  chatroom_uikit_userInfo,
  custom_msg_event_type_gift,
  custom_msg_event_type_join,
  gMaxMuterSize,
} from './room.const';
import {
  DisconnectReasonType,
  GiftServiceData,
  RoomEventType,
  RoomMemberOperate,
  RoomService,
  RoomServiceListener,
  RoomState,
  UserServiceData,
} from './types';

export abstract class RoomServiceImpl implements RoomService {
  _listeners: Set<RoomServiceListener>;
  _userMap: Map<string, UserServiceData>;
  _muterMap: Map<string, number>;
  _currentRoomId?: string;
  _currentOwnerId?: string;
  _roomState: RoomState;
  _user?: UserServiceData;
  _connectListener?: ChatConnectEventListener;
  _messageListener?: ChatMessageEventListener;
  _roomListener?: ChatRoomEventListener;

  // static _instance?: RoomServiceImpl;
  // public static getInstance(): RoomService {
  //   if (
  //     RoomServiceImpl._instance === null ||
  //     RoomServiceImpl._instance === undefined
  //   ) {
  //     RoomServiceImpl._instance = new RoomServiceImpl();
  //   }
  //   return RoomServiceImpl._instance;
  // }

  constructor() {
    this._userMap = new Map();
    this._muterMap = new Map();
    this._listeners = new Set();
    this._roomState = 'leaved';
  }

  destructor() {
    console.warn('dev:room:destructor');
  }

  async init(params: {
    appKey: string;
    debugMode?: boolean;
    autoLogin?: boolean;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    const { appKey, debugMode, autoLogin } = params;
    const options = ChatOptions.withAppKey({
      appKey,
      debugModel: debugMode,
      autoLogin,
    });
    try {
      await this.client.init(options);
      params.result?.({ isOk: true });
    } catch (error) {
      params.result?.({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.init_error,
          extra: JSON.stringify(error),
        }),
      });
    }
  }
  async initWithOption(params: {
    options: ChatOptions;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    const { options } = params;
    try {
      await this.client.init(options);
      params.result?.({ isOk: true });
    } catch (error) {
      params.result?.({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.init_error,
          extra: JSON.stringify(error),
        }),
      });
    }
  }
  unInit() {}

  addListener(listener: RoomServiceListener): void {
    this._listeners.add(listener);
  }
  removeListener(listener: RoomServiceListener): void {
    this._listeners.delete(listener);
  }
  clearListener(): void {
    this._listeners.clear();
  }

  abstract _updateMember(user: UserServiceData): UserServiceData;
  abstract _removeMember(userId: string): void;
  abstract _clearMember(): void;
  abstract _clearMuter(): void;
  abstract _fromChatError(error: any): string | undefined;
  abstract _clearSdkListener(): void;

  abstract _setRoomId(roomId: string | undefined): void;
  get roomId() {
    return this._currentRoomId;
  }
  abstract _setOwner(ownerId: string): void;
  get ownerId() {
    return this._currentOwnerId;
  }
  abstract _setRoomState(s: RoomState): void;
  get roomState() {
    return this._roomState;
  }

  abstract _reset(): void;
  abstract _join(roomId: string, ownerId: string): void;
  abstract _leave(roomId: string): void;
  abstract _onJoined(roomId: string, ownerId?: string): void;
  abstract _onLeaved(roomId: string): void;

  get client(): ChatClient {
    return ChatClient.getInstance();
  }

  async login(params: {
    userId: string;
    userToken: string;
    userNickname?: string | undefined;
    userAvatarURL?: string | undefined;
    gender?: number;
    identify?: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    const {
      userId,
      userToken,
      userNickname,
      userAvatarURL,
      gender,
      identify,
      result,
    } = params;
    try {
      const version = CHAT_VERSION;
      const list = version.split('.');
      const major = parseInt(list[0]!, 10);
      const minor = parseInt(list[1]!, 10);
      if (major <= 1 && minor < 3) {
        if (userToken.startsWith('00')) {
          await this.client.loginWithAgoraToken(userId, userToken);
        } else {
          await this.client.login(userId, userToken, false);
        }
      } else {
        await this.client.login(userId, userToken, false);
      }

      // !!! hot-reload no pass, into catch codes
      this._user = {
        nickname: userNickname,
        avatarURL: userAvatarURL,
        userId: userId,
        gender: gender,
        identify: identify,
      } as UserServiceData;

      this.client.getCurrentUsername();
      this.updateSelfInfo(this._user);

      result?.({ isOk: true });
    } catch (error: any) {
      if (error?.code === 200) {
        // !!! for dev hot-reload
        this._user = {
          nickname: userNickname,
          avatarURL: userAvatarURL,
          userId: userId,
          gender: gender,
          identify: identify,
        } as UserServiceData;
        this.updateSelfInfo(this._user);
        this.client.getCurrentUsername();
      }
      result?.({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.login_error,
          extra: JSON.stringify(error),
        }),
      });
    }
  }
  async logout(params: {
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    try {
      await this.client.logout();
      params.result?.({ isOk: true });
      this._user = undefined;
    } catch (error) {
      params.result?.({
        isOk: false,
        error: new UIKitError({ code: ErrorCode.logout_error }),
      });
    }
  }
  async loginState(): Promise<'logged' | 'noLogged'> {
    const r = await this.client.isLoginBefore();
    return r === true ? 'logged' : 'noLogged';
  }
  async refreshToken(params: {
    token: string;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    try {
      await this.client.renewAgoraToken(params.token);
      params?.result?.({ isOk: true });
    } catch (error) {
      params.result?.({
        isOk: false,
        error: new UIKitError({ code: ErrorCode.refresh_token_error }),
      });
    }
  }

  get userId(): string | undefined {
    return this.client.currentUserName as string | undefined;
  }
  getMuter(id: string): number | undefined {
    return this._muterMap.get(id);
  }
  delMuter(id: string): void {
    this._muterMap.delete(id);
  }
  updateMuter(ids: string[]): void {
    for (const id of ids) {
      this._muterMap.set(id, -1);
    }
  }
  getUserInfo(id?: string): UserServiceData | undefined {
    if (id === undefined) return undefined;
    if (id === this._user?.userId) {
      return this._user;
    }
    return this._userMap.get(id);
  }
  getUserInfos(ids: string[]): UserServiceData[] {
    return ids
      .map((id) => {
        if (id === this._user?.userId) {
          return this._user;
        }
        return this._userMap.get(id);
      })
      .filter((v) => {
        return v !== undefined;
      }) as UserServiceData[];
  }
  updateUserInfos(users: UserServiceData[]): void {
    for (const user of users) {
      this._updateMember(user);
    }
  }
  async fetchUserInfos(ids: string[]): Promise<UserServiceData[]> {
    if (ids === undefined || ids.length === 0) {
      return [];
    }
    try {
      const list = await this.client.userManager.fetchUserInfoById(ids);
      if (list) {
        const ret: UserServiceData[] = [];
        for (const item of list) {
          let identify;
          try {
            if (item[1].ext && item[1].ext?.length > 0) {
              identify = JSON.parse(item[1].ext)?.identify;
            }
          } catch (error) {
            console.warn('fetchUserInfos:', error);
          }
          ret.push({
            userId: item[1].userId,
            nickname: item[1].nickName ?? undefined,
            avatarURL: item[1].avatarUrl ?? undefined,
            gender: item[1].gender ?? 0,
            identify: identify,
          });
        }
        return ret;
      }
      return [];
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.room_fetch_member_info_error,
        extra: `{chat: ${this._fromChatError(error)}, ids: ${ids}}`,
      });
    }
  }
  updateSelfInfo(self: UserServiceData): Promise<void> {
    try {
      const p = {
        userId: self.userId,
        nickname: self.nickname,
        avatarUrl: self.avatarURL,
        gender: self.gender,
        ext: JSON.stringify({ identify: self.identify }),
      };
      return this.client.userManager.updateOwnUserInfo(p);
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.room_upload_user_info_error,
        extra: `{chat: ${this._fromChatError(error)}, self: ${self}}`,
      });
    }
  }
  getNoExisted(ids: string[]): string[] {
    return ids.filter((v) => {
      return !this._userMap.has(v);
    });
  }
  getIncludes(key: string, type?: Keyof<UserServiceData>): UserServiceData[] {
    return Array.from(this._userMap, (v) => {
      return v[1];
    }).filter((v) => {
      if (type === 'avatarURL') {
        return v.avatarURL?.includes(key);
      } else if (type === 'nickname') {
        return v.nickname?.includes(key);
      } else if (type === 'identify') {
        return v.identify?.includes(key);
      } else if (type === 'gender') {
        return v.gender?.toString().includes(key);
      }
      return v.userId.includes(key);
    });
  }
  async fetchChatroomList(
    pageNum: number,
    pageSize?: number
  ): Promise<ChatRoom[]> {
    try {
      const r = await this.client.roomManager.fetchPublicChatRoomsFromServer(
        pageNum,
        pageSize
      );
      return r.list ?? [];
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.room_fetch_room_list_error,
        extra: `{chat: ${this._fromChatError(
          error
        )}, pageNum: ${pageNum}}, pageSize: ${pageSize}}`,
      });
    }
  }
  async joinRoom(roomId: string, room: { ownerId: string }): Promise<void> {
    this._join(roomId, room.ownerId);
    try {
      await this.client.roomManager.joinChatRoom(roomId);
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.room_join_error,
        extra: `{chat: ${this._fromChatError(
          error
        )}, roomId: ${roomId}, ownerId: ${room.ownerId}}`,
      });
    }
    this._onJoined(roomId);
  }
  async leaveRoom(roomId: string): Promise<void> {
    this._leave(roomId);
    try {
      await this.client.roomManager.leaveChatRoom(roomId);
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.room_leave_error,
        extra: `{chat: ${this._fromChatError(error)}, roomId: ${roomId}}`,
      });
    }
    this._onLeaved(roomId);
  }
  resetRoom(roomId: string): void {
    if (roomId === this.roomId) {
      this._setRoomState('leaved');
      this._reset();
    }
  }
  async kickMember(roomId: string, userId: string): Promise<void> {
    try {
      await this.client.roomManager.removeChatRoomMembers(roomId, [userId]);
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.room_kick_member_error,
        extra: `{chat: ${this._fromChatError(
          error
        )}, roomId: ${roomId}, userId: ${userId}}`,
      });
    }
  }
  async fetchMembers(
    roomId: string,
    pageSize: number,
    cursor?: string
  ): Promise<ChatCursorResult<string>> {
    try {
      return await this.client.roomManager.fetchChatRoomMembers(
        roomId,
        cursor,
        pageSize
      );
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.room_fetch_member_list_error,
        extra: `{chat: ${this._fromChatError(
          error
        )}, roomId: ${roomId}, pageSize: ${pageSize}, cursor: ${cursor}}`,
      });
    }
  }
  async fetchMutedMembers(roomId: string, pageSize: number): Promise<string[]> {
    try {
      return await this.client.roomManager.fetchChatRoomMuteList(
        roomId,
        pageSize,
        gMaxMuterSize
      );
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.room_fetch_mute_member_list_error,
        extra: `{chat: ${this._fromChatError(
          error
        )}, roomId: ${roomId}, pageSize: ${pageSize}}`,
      });
    }
  }
  async updateMemberState(
    roomId: string,
    userId: string,
    op: RoomMemberOperate
  ): Promise<void> {
    if (op === 'mute') {
      try {
        await this.client.roomManager.muteChatRoomMembers(roomId, [userId]);
        this.updateMuter([userId]);
        this._roomListener?.onMuteListAdded?.({
          roomId: roomId,
          mutes: [userId],
        });
      } catch (error) {
        throw new UIKitError({
          code: ErrorCode.room_mute_member_error,
          extra: `{chat: ${this._fromChatError(
            error
          )}, roomId: ${roomId}, userId: ${userId}}`,
        });
      }
    } else if (op === 'unmute') {
      try {
        await this.client.roomManager.unMuteChatRoomMembers(roomId, [userId]);
        this.delMuter(userId);
        this._roomListener?.onMuteListRemoved?.({
          roomId: roomId,
          mutes: [userId],
        });
      } catch (error) {
        throw new UIKitError({
          code: ErrorCode.room_unmute_member_error,
          extra: `{chat: ${this._fromChatError(
            error
          )}, roomId: ${roomId}, userId: ${userId}}`,
        });
      }
    } else {
      throw new UIKitError({ code: ErrorCode.not_impl });
    }
  }
  sendText(params: {
    roomId: string;
    content: string;
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): void {
    return this._sendTextMessage(params);
  }
  sendGift(params: {
    roomId: string;
    gift: GiftServiceData;
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): void {
    return this._sendCustomMessage({
      roomId: params.roomId,
      eventType: custom_msg_event_type_gift,
      eventParams: { chatroom_uikit_gift: JSON.stringify(params.gift) },
      result: params.result,
    });
  }
  sendJoinCmd(params: {
    roomId: string;
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): void {
    return this._sendCustomMessage({
      roomId: params.roomId,
      eventType: custom_msg_event_type_join,
      eventParams: {},
      result: params.result,
    });
  }

  _sendTextMessage(params: {
    roomId: string;
    content: string;
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): void {
    const { roomId, content, result } = params;
    const curUserId = this.userId;
    if (curUserId === undefined) {
      result({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.msg_send_error,
          extra: 'Not logged in yet.',
        }),
      });
      return;
    }
    const user = this._userMap.get(curUserId);
    if (user === undefined) {
      throw new UIKitError({
        code: ErrorCode.existed,
        extra: `use is not existed. ${curUserId}`,
      });
    }
    const msg = ChatMessage.createTextMessage(
      roomId,
      content,
      ChatMessageChatType.ChatRoom
    );
    msg.attributes = {
      chatroom_uikit_userInfo: user,
    };
    this.client.chatManager
      .sendMessage(msg, {
        onError: (_localMsgId, error) => {
          result({
            isOk: false,
            error: new UIKitError({
              code: ErrorCode.msg_send_error,
              desc: JSON.stringify(error),
            }),
          });
        },
        onSuccess: (message: ChatMessage) => {
          result({ isOk: true, message });
        },
      } as ChatMessageStatusCallback)
      .catch((e) => {
        result({
          isOk: false,
          error: new UIKitError({
            code: ErrorCode.msg_send_error,
            desc: JSON.stringify(e),
          }),
        });
      });
  }
  _sendCustomMessage(params: {
    roomId: string;
    eventType: string;
    eventParams: Record<string, string>;
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): void {
    const { roomId, eventType, eventParams, result } = params;
    const curUserId = this.userId;
    if (curUserId === undefined) {
      result({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.msg_send_error,
          extra: 'Not logged in yet.',
        }),
      });
      return;
    }
    const msg = ChatMessage.createCustomMessage(
      roomId,
      eventType,
      ChatMessageChatType.ChatRoom,
      { params: eventParams }
    );
    const user = this._userMap.get(curUserId);
    if (user === undefined) {
      throw new UIKitError({
        code: ErrorCode.existed,
        extra: `use is not existed. ${curUserId}`,
      });
    }
    msg.attributes = {
      chatroom_uikit_userInfo: user,
    };
    this.client.chatManager
      .sendMessage(msg, {
        onError: (_localMsgId, error) => {
          result({
            isOk: false,
            error: new UIKitError({
              code: ErrorCode.msg_send_error,
              desc: `${error.code}: ${error.description}`,
            }),
          });
        },
        onSuccess: (message: ChatMessage) => {
          result({ isOk: true, message });
        },
      } as ChatMessageStatusCallback)
      .catch((e) => {
        result({
          isOk: false,
          error: new UIKitError({
            code: ErrorCode.msg_send_error,
            desc: `${e.code}: ${e.description}`,
          }),
        });
      });
  }
  async recallMessage(messageId: string): Promise<void> {
    try {
      return await this.client.chatManager.recallMessage(messageId);
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.msg_recall_error,
        extra: `{chat: ${this._fromChatError(error)}, messageId: ${messageId}}`,
      });
    }
  }
  async reportMessage(params: {
    messageId: string;
    tag: string;
    reason: string;
  }): Promise<void> {
    const { messageId, tag, reason } = params;
    try {
      return await this.client.chatManager.reportMessage(
        messageId,
        tag,
        reason
      );
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.msg_report_error,
        extra: `{chat: ${this._fromChatError(
          error
        )}, messageId: ${messageId}, tag: ${tag}, reason: ${reason}}`,
      });
    }
  }
  async translateMessage(
    message: ChatMessage,
    languagesCode: string
  ): Promise<ChatMessage> {
    try {
      return await this.client.chatManager.translateMessage(message, [
        languagesCode,
      ]);
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.msg_translate_error,
        extra: `{chat: ${this._fromChatError(error)}, messageId: ${
          message.msgId
        }`,
      });
    }
  }

  async pinMessage(params: { msgId: string }): Promise<void> {
    try {
      await this.client.chatManager.pinMessage(params.msgId);
      this._messageListener?.onMessagePinChanged?.({
        messageId: params.msgId,
        convId: this.roomId ?? '',
        pinOperation: 0,
        pinInfo: new ChatMessagePinInfo({
          operatorId: this.userId ?? '',
          pinTime: new Date().getTime(),
        }),
      });
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.msg_pin_message_error,
        extra: `{chat: ${this._fromChatError(error)}, messageId: ${
          params.msgId
        }`,
      });
    }
  }
  async unPinMessage(params: { msgId: string }): Promise<void> {
    try {
      await this.client.chatManager.unpinMessage(params.msgId);
      this._messageListener?.onMessagePinChanged?.({
        messageId: params.msgId,
        convId: this.roomId ?? '',
        pinOperation: 1,
        pinInfo: new ChatMessagePinInfo({
          operatorId: this.userId ?? '',
          pinTime: new Date().getTime(),
        }),
      });
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.msg_unpin_message_error,
        extra: `{chat: ${this._fromChatError(error)}, messageId: ${
          params.msgId
        }`,
      });
    }
  }
  async fetchPinnedMessages(params: {
    convId: string;
    forceRequest?: boolean;
    onResult: (params: {
      isOk: boolean;
      msgs?: ChatMessage[];
      error?: UIKitError;
    }) => void;
  }): Promise<void> {
    const { forceRequest = false } = params;
    if (forceRequest === false) {
      return this.getPinnedMessages(params);
    }
    try {
      const ret = await this.client.chatManager.fetchPinnedMessages(
        params.convId,
        ChatConversationType.RoomChat,
        false
      );
      params.onResult({ isOk: true, msgs: ret });
    } catch (error) {
      params.onResult({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.msg_send_error,
          extra: JSON.stringify(error),
        }),
      });
    }
  }
  async getPinnedMessages(params: {
    convId: string;
    onResult: (params: {
      isOk: boolean;
      msgs?: ChatMessage[];
      error?: UIKitError;
    }) => void;
  }): Promise<void> {
    try {
      const ret = await this.client.chatManager.getPinnedMessages(
        params.convId,
        ChatConversationType.RoomChat,
        false
      );
      params.onResult({ isOk: true, msgs: ret });
    } catch (error) {
      params.onResult({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.msg_fetch_pinned_message_error,
          extra: JSON.stringify(error),
        }),
      });
    }
  }

  sendError(params: { error: UIKitError; from?: string; extra?: any }): void {
    this._listeners.forEach((v) => {
      asyncTask(() => v.onError?.(params));
    });
  }
  sendFinished(params: { event: RoomEventType; extra?: any }): void {
    this._listeners.forEach((v) => {
      asyncTask(() => v.onFinished?.(params));
    });
  }
  userInfoFromMessage(msg?: ChatMessage): UserServiceData | undefined {
    if (msg === undefined || msg === null) {
      return undefined;
    }
    const jsonUserInfo = (msg.attributes as any)[chatroom_uikit_userInfo];
    if (jsonUserInfo) {
      const userInfo = jsonUserInfo as UserServiceData;
      return userInfo;
    }

    return undefined;
  }
}

export class RoomServicePrivateImpl extends RoomServiceImpl {
  constructor() {
    super();
    this._initListener();
  }
  destructor() {
    super.destructor();
    this._clearListener();
  }

  _clearSdkListener(): void {
    this._clearListener();
  }

  _initListener() {
    this._initConnectListener();
    this._initChatroomListener();
    this._initMessageListener();
  }
  _clearListener() {
    this.client.removeAllConnectionListener();
    this.client.chatManager.removeAllMessageListener();
    this.client.roomManager.removeAllRoomListener();
    this._connectListener = undefined;
    this._messageListener = undefined;
    this._roomListener = undefined;
  }
  _initConnectListener() {
    this._connectListener = {
      onConnected: () => {
        this._listeners.forEach((v) => {
          v.onConnected?.();
        });
      },
      onDisconnected: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.others);
        });
      },
      onTokenWillExpire: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.token_will_expire);
        });
      },
      onTokenDidExpire: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.token_did_expire);
        });
      },
      onAppActiveNumberReachLimit: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(
            DisconnectReasonType.app_active_number_reach_limit
          );
        });
      },
      onUserDidLoginFromOtherDevice: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(
            DisconnectReasonType.user_did_login_from_other_device
          );
        });
      },
      onUserDidRemoveFromServer: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.user_did_remove_from_server);
        });
      },
      onUserDidForbidByServer: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.user_did_forbid_by_server);
        });
      },
      onUserDidChangePassword: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.user_did_change_password);
        });
      },
      onUserDidLoginTooManyDevice: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(
            DisconnectReasonType.user_did_login_too_many_device
          );
        });
      },
      onUserKickedByOtherDevice: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.user_kicked_by_other_device);
        });
      },
      onUserAuthenticationFailed: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.user_authentication_failed);
        });
      },
    };
    this.client.addConnectionListener(this._connectListener);
  }
  _initMessageListener() {
    this._messageListener = {
      // onMessagesRecalled(messages) {
      //   this._listeners.forEach((v) => {
      //     if (this.roomId) {
      //       for (const message of messages) {
      //         v.onMessageRecalled?.(this.roomId, message);
      //       }
      //     }
      //   });
      // },
      onMessagesRecalledInfo(infos) {
        this._listeners.forEach((v) => {
          if (this.roomId) {
            for (const info of infos) {
              v.onMessageRecalled?.(this.roomId, info.recalledMessage);
            }
          }
        });
      },
      onMessagesReceived: (messages) => {
        this._listeners.forEach((v) => {
          if (this.roomId) {
            for (const message of messages) {
              if (message.isBroadcast === true) {
                v.onGlobalNotifyReceived?.(message);
              } else {
                v.onMessageReceived?.(this.roomId, message);
              }
            }
          }
        });
      },
      onMessagePinChanged: (params: {
        messageId: string;
        convId: string;
        pinOperation: number;
        pinInfo: ChatMessagePinInfo;
      }) => {
        this._listeners.forEach((v) => {
          v.onMessagePinChanged?.(params);
        });
      },
    };
    this.client.chatManager.addMessageListener(this._messageListener);
  }
  _initChatroomListener() {
    this._roomListener = {
      onDestroyed: (params: { roomId: string; roomName?: string }) => {
        this._listeners.forEach((v) => {
          v.onUserBeKicked?.(params.roomId, 1);
        });
      },
      onMemberJoined: (params: { roomId: string; participant: string }) => {
        this._listeners.forEach((v) => {
          v.onUserJoined?.(params.roomId, {
            userId: params.participant,
          } as UserServiceData);
        });
      },
      onMemberExited: (params: {
        roomId: string;
        participant: string;
        roomName?: string;
      }) => {
        this._listeners.forEach((v) => {
          v.onUserLeave?.(params.roomId, params.participant);
        });
      },
      onMemberRemoved: (params: {
        roomId: string;
        participant?: string;
        roomName?: string;
        reason?: string;
      }) => {
        this._listeners.forEach((v) => {
          v.onUserBeKicked?.(params.roomId, 2);
        });
      },
      onMuteListAdded: (params: {
        roomId: string;
        mutes: Array<string>;
        expireTime?: string;
      }) => {
        this._listeners.forEach((v) => {
          v.onUserMuted?.(params.roomId, params.mutes, '');
        });
      },
      onMuteListRemoved: (params: { roomId: string; mutes: Array<string> }) => {
        this._listeners.forEach((v) => {
          v.onUserUnmuted?.(params.roomId, params.mutes, '');
        });
      },
      onOwnerChanged: (params: {
        roomId: string;
        newOwner: string;
        oldOwner: string;
      }) => {
        const {} = params;
      },
      onAllowListAdded: (params: {
        roomId: string;
        members: Array<string>;
      }) => {
        const {} = params;
      },
      onAllowListRemoved: (params: {
        roomId: string;
        members: Array<string>;
      }) => {
        const {} = params;
      },
      onAllChatRoomMemberMuteStateChanged: (params: {
        roomId: string;
        isAllMuted: boolean;
      }) => {
        const {} = params;
      },
      onSpecificationChanged: (_room: ChatRoom) => {},
      onAttributesUpdated: (params: {
        roomId: string;
        attributes: Map<string, string>;
        from: string;
      }) => {
        const {} = params;
      },
      onAttributesRemoved: (params: {
        roomId: string;
        removedKeys: Array<string>;
        from: string;
      }) => {
        const {} = params;
      },
    };
    this.client.roomManager.addRoomListener(this._roomListener);
  }

  _updateMember(user: UserServiceData): UserServiceData {
    if (this._userMap.has(user.userId)) {
      const old = this._userMap.get(user.userId);
      const n = { ...old, ...user };
      this._userMap.set(user.userId, n);
      return n;
    } else {
      this._userMap.set(user.userId, user);
      return user;
    }
  }
  _removeMember(userId: string): void {
    this._userMap.delete(userId);
  }
  _clearMember(): void {
    this._userMap.clear();
  }
  _clearMuter(): void {
    this._muterMap.clear();
  }

  _fromChatError(error: any): string | undefined {
    let e: string | undefined;
    try {
      e = JSON.stringify(error);
    } catch (ee) {
      if (typeof error === 'string') {
        e = error;
      } else {
        e = ee?.toString?.();
      }
    }
    return e;
  }

  _setRoomId(roomId: string | undefined): void {
    this._currentRoomId = roomId;
  }
  _setOwner(ownerId: string | undefined): void {
    this._currentOwnerId = ownerId;
  }
  _setRoomState(s: RoomState): void {
    this._roomState = s;
  }

  _reset(): void {
    this._setRoomId(undefined);
    this._setOwner(undefined);
    this._clearMember();
    this._clearMuter();
  }

  _join(roomId: string, ownerId: string): void {
    if (this.roomState === 'leaving' || this.roomState === 'joining') {
      this._reset();
    }
    this._setRoomState('joining');
    this._setRoomId(roomId);
    this._setOwner(ownerId);
    this._updateMember(this._user!);
  }
  _leave(_roomId: string): void {
    this._setRoomState('leaving');
  }
  _onJoined(roomId: string, _ownerId?: string): void {
    this._setRoomState('joined');
    this._listeners.forEach((v) => {
      v.onUserJoined?.(roomId, {
        userId: this.client.currentUserName,
      } as UserServiceData);
    });
  }
  _onLeaved(roomId: string): void {
    this._setRoomState('leaved');
    this._listeners.forEach((v) => {
      v.onUserLeave?.(roomId, this.client.currentUserName);
    });
    this._reset();
  }
}

let gIMService: RoomService;

export function getRoomService(): RoomService {
  if (gIMService === undefined) {
    gIMService = new RoomServicePrivateImpl();
  }
  return gIMService;
}

export class RoomServiceStatic {
  /**
   * In development mode, hot-reload is often performed, so the user needs to manually handle the listener. If there is no hot-reload in release mode, no operation is required.
   *
   * It is recommended to handle it in the app.
   * For example:
   * @example
   * ```tsx
   *   useEffect(() => {
   *     return () => {
   *       RoomService.clearSDKListener();
   *     };
   *   }, []);
   * ```
   */
  static clearSDKListener(): void {
    ChatClient.getInstance().removeAllConnectionListener();
    ChatClient.getInstance().removeAllCustomListener();
    ChatClient.getInstance().removeAllMultiDeviceListener();
    ChatClient.getInstance().chatManager.removeAllMessageListener();
    ChatClient.getInstance().groupManager.removeAllGroupListener();
    ChatClient.getInstance().roomManager.removeAllRoomListener();
    ChatClient.getInstance().contactManager.removeAllContactListener();
    ChatClient.getInstance().presenceManager.removeAllPresenceListener();
  }
}

// export class IMServicePrivateImplTest extends RoomServicePrivateImpl {
//   constructor() {
//     super();
//   }
//   test() {
//     this._clearMuter();
//   }
// }
