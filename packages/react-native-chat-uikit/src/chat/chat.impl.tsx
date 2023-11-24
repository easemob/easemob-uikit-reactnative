import {
  ChatClient,
  ChatContact,
  ChatConversation,
  ChatConversationType,
  ChatGroup,
  ChatGroupMessageAck,
  ChatMessage,
  ChatMessageReactionEvent,
  ChatMessageThreadEvent,
  ChatMultiDeviceEvent,
  ChatOptions,
  ChatPresence,
  ChatPushRemindType,
  ChatSilentModeParamType,
} from 'react-native-chat-sdk';

import { ConversationStorage } from '../db/storage';
import { ErrorCode, UIKitError } from '../error';
import { asyncTask } from '../utils';
import {
  ChatEventType,
  ChatService,
  ChatServiceListener,
  ContactModel,
  ConversationModel,
  ConversationServices,
  DataModel,
  DataModelType,
  DisconnectReasonType,
  ResultCallback,
  UserServiceData,
} from './types';

export abstract class ChatServiceImpl
  implements ChatService, ConversationServices
{
  _listeners: Set<ChatServiceListener>;
  _user?: UserServiceData;
  _convStorage?: ConversationStorage;
  _convList: Map<string, ConversationModel>;
  _contactList: Map<string, ContactModel>;
  _convDataRequestCallback?: (params: {
    ids: Map<DataModelType, string[]>;
    result: (
      data?: Map<DataModelType, any[]> | undefined,
      error?: UIKitError
    ) => void;
  }) => void;
  _contactDataRequestCallback:
    | ((params: {
        ids: string[];
        result: (data?: any[], error?: UIKitError) => void;
      }) => void)
    | undefined;

  constructor() {
    this._listeners = new Set();
    this._convList = new Map();
    this._contactList = new Map();
  }

  destructor() {
    this._convStorage?.destructor();
    this.clearListener();
    this._reset();
  }

  _reset(): void {
    this._convList.clear();
  }

  async init(params: {
    appKey: string;
    debugMode?: boolean;
    autoLogin?: boolean;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    const { appKey, debugMode, autoLogin } = params;
    this._convStorage = new ConversationStorage({ appKey: '' });
    const options = new ChatOptions({
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
  unInit() {}

  addListener(listener: ChatServiceListener): void {
    this._listeners.add(listener);
  }
  removeListener(listener: ChatServiceListener): void {
    this._listeners.delete(listener);
  }
  clearListener(): void {
    this._listeners.clear();
  }

  abstract _fromChatError(error: any): string | undefined;

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
    usePassword?: boolean;
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
      usePassword,
    } = params;
    try {
      if (userToken.startsWith('00')) {
        await this.client.loginWithAgoraToken(userId, userToken);
      } else {
        await this.client.login(userId, userToken, usePassword ?? false);
      }

      this._convStorage?.setCurrentId(userId);

      // !!! hot-reload no pass, into catch codes
      this._user = {
        nickName: userNickname,
        avatarURL: userAvatarURL,
        userId: userId,
        gender: gender,
        identify: identify,
      } as UserServiceData;

      this.client.getCurrentUsername();

      result?.({ isOk: true });
    } catch (error: any) {
      if (error?.code === 200) {
        this._convStorage?.setCurrentId(userId);
        // !!! for dev hot-reload
        this._user = {
          nickName: userNickname,
          avatarURL: userAvatarURL,
          userId: userId,
          gender: gender,
          identify: identify,
        } as UserServiceData;

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
    this.tryCatch({
      promise: this.client.renewAgoraToken(params.token),
      event: 'renewAgoraToken',
      onFinished: () => {
        params?.result?.({ isOk: true });
      },
      onError: () => {
        params.result?.({
          isOk: false,
          error: new UIKitError({ code: ErrorCode.refresh_token_error }),
        });
      },
    });
  }

  get userId(): string | undefined {
    return this.client.currentUserName as string | undefined;
  }

  sendError(params: { error: UIKitError; from?: string; extra?: any }): void {
    this._listeners.forEach((v) => {
      asyncTask(() => v.onError?.(params));
    });
  }
  sendFinished(params: { event: ChatEventType; extra?: any }): void {
    this._listeners.forEach((v) => {
      asyncTask(() => v.onFinished?.(params));
    });
  }

  tryCatch<T>(params: {
    promise: Promise<T>;
    event: string;
    onFinished?: (value: T) => void;
    onError?: (e: any) => void;
  }): void {
    const { promise, event, onFinished, onError } = params;
    promise
      .then((value: T) => {
        if (onFinished) {
          onFinished(value);
        } else {
          this.sendFinished({ event: event });
        }
      })
      .catch((e) => {
        if (onError) {
          onError(e);
        } else {
          this.sendError({
            error: new UIKitError({
              code: ErrorCode.common,
              desc: event,
              extra: this._fromChatError(e),
            }),
            from: event,
          });
        }
      });
  }
  async tryCatchSync<T>(params: {
    promise: Promise<T>;
    event: string;
  }): Promise<T> {
    const { promise, event } = params;
    try {
      return await promise;
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.common,
        desc: event,
        extra: this._fromChatError(error),
      });
    }
  }

  async toUIConversation(conv: ChatConversation): Promise<ConversationModel> {
    const getDoNotDisturb = async () => {
      if (conv.ext?.doNotDisturb !== undefined) {
        return conv.ext.doNotDisturb as boolean;
      } else {
        const ret =
          await this.client.pushManager.fetchSilentModeForConversation({
            convId: conv.convId,
            convType: conv.convType,
          });
        if (ret) {
          return (
            ret?.remindType === ChatPushRemindType.MENTION_ONLY ||
            ret?.remindType === ChatPushRemindType.NONE
          );
        }
        return false;
      }
    };
    return {
      convId: conv.convId,
      convType: conv.convType,
      isChatThread: conv.isChatThread,
      ext: conv.ext,
      isPinned: conv.isPinned,
      pinnedTime: conv.pinnedTime,
      unreadMessageCount: await this.getConversationMessageCount(
        conv.convId,
        conv.convType
      ),
      lastMessage: await this.getConversationLatestMessage(
        conv.convId,
        conv.convType
      ),
      doNotDisturb: await getDoNotDisturb(),
    } as ConversationModel;
  }

  async toUIContact(contact: ChatContact): Promise<ContactModel> {
    return {
      userId: contact.userId,
      remark: contact.remark,
      nickName:
        this._contactList.get(contact.userId)?.nickName ??
        contact.remark ??
        contact.userId,
      avatar: this._contactList.get(contact.userId)?.avatar,
    };
  }

  setContactOnRequestData<DataT>(
    callback?: (params: {
      ids: string[];
      result: (data?: DataT[], error?: UIKitError) => void;
    }) => void
  ): void {
    this._contactDataRequestCallback = callback;
  }

  setOnRequestMultiData<DataT>(
    callback?: (params: {
      ids: Map<DataModelType, string[]>;
      result: (data?: Map<DataModelType, DataT[]>, error?: UIKitError) => void;
    }) => void
  ): void {
    this._convDataRequestCallback = callback;
  }

  /**
   * @description Get the current user all conversation list.
   * @params params
   * - onResult: The callback function of the result.
   */
  async getAllConversations(params: {
    onResult: ResultCallback<ConversationModel[]>;
  }): Promise<void> {
    const { onResult } = params;
    try {
      const map = new Map<string, ChatConversation>();
      const isFinished = await this._convStorage?.isFinishedForFetchList();
      console.log('test:zuoyu:', isFinished);
      if (isFinished === true) {
        const list = await this.client.chatManager.getAllConversations();
        const ret = list.map(async (v) => {
          this._convList.set(v.convId, await this.toUIConversation(v));
        });
        await Promise.all(ret);
      } else {
        let cursor = '';
        const pageSize = 50;
        const pinList =
          await this.client.chatManager.fetchPinnedConversationsFromServerWithCursor(
            cursor,
            pageSize
          );
        console.log('test:zuoyu:2:', pinList);
        pinList.list?.forEach((v) => {
          map.set(v.convId, {
            ...v,
            ext: v.ext ?? { doNotDisturb: false },
          } as ChatConversation);
        });
        cursor = '';
        for (;;) {
          const list =
            await this.client.chatManager.fetchConversationsFromServerWithCursor(
              cursor,
              pageSize
            );
          list.list?.forEach((v) => {
            map.set(v.convId, {
              ...v,
              ext: v.ext ?? { doNotDisturb: false },
            } as ChatConversation);
          });
          console.log('test:zuoyu:3:', list);

          if (list.list && list.list.length > 0) {
            const silentList =
              await this.client.pushManager.fetchSilentModeForConversations(
                list.list.map((v) => {
                  return {
                    convId: v.convId,
                    convType: v.convType,
                  } as any;
                })
              );
            silentList.forEach((v) => {
              const conv = map.get(v.conversationId);
              if (conv) {
                conv.ext.doNotDisturb =
                  v.remindType === ChatPushRemindType.MENTION_ONLY ||
                  v.remindType === ChatPushRemindType.NONE;
              }
            });
            console.log('test:zuoyu:4:', silentList);
          }

          if (
            list.cursor.length === 0 ||
            (list.list && list.list?.length < pageSize) ||
            list.list === undefined
          ) {
            console.log('test:zuoyu:5:');
            break;
          }
        }
        await this._convStorage?.setFinishedForFetchList(true);
        await this._convStorage?.setAllConversation(Array.from(map.values()));
        console.log('test:zuoyu:6:');

        const ret = Array.from(map.values()).map(async (v) => {
          const conv = await this.toUIConversation(v);
          this._convList.set(conv.convId, conv);
          return conv;
        });
        await Promise.all(ret);
        console.log('test:zuoyu:7:', this._convList);
      }

      if (this._convDataRequestCallback) {
        this._convDataRequestCallback({
          ids: new Map([
            [
              'user',
              Array.from(this._convList.values())
                .filter(
                  (v) =>
                    v.convType === ChatConversationType.PeerChat &&
                    (v.convId === v.convName || v.convName === undefined) &&
                    v.convAvatar === undefined
                )
                .map((v) => v.convId),
            ],
            [
              'group',
              Array.from(this._convList.values())
                .filter(
                  (v) =>
                    v.convType === ChatConversationType.GroupChat &&
                    (v.convId === v.convName || v.convName === undefined) &&
                    v.convAvatar === undefined
                )
                .map((v) => v.convId),
            ],
          ]),
          result: (data, error) => {
            if (data) {
              data.forEach((values: DataModel[]) => {
                values.map((value) => {
                  const conv = this._convList.get(value.id);
                  if (conv) {
                    conv.convName = value.name;
                    conv.convAvatar = value.avatar;
                  }
                });
              });
            }
            console.log('test:zuoyu:8:', data, this._convList);

            onResult({
              isOk: true,
              value: Array.from(this._convList.values()),
              error,
            });
          },
        });
      } else {
        console.log('test:zuoyu:9:');
        onResult({
          isOk: true,
          value: Array.from(this._convList.values()),
        });
      }
    } catch (e) {
      console.log('test:zuoyu:10:error:', e);
      onResult({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.get_all_conversations_error,
          extra: this._fromChatError(e),
        }),
      });
    }
  }
  async getConversation(params: {
    convId: string;
    convType: ChatConversationType;
    createIfNotExist?: boolean;
  }): Promise<ConversationModel | undefined> {
    if (params.createIfNotExist === true) {
      const conv = this._convList.get(params.convId);
      if (conv === undefined) {
        const ret = await this.tryCatchSync({
          promise: this.client.chatManager.getConversation(
            params.convId,
            params.convType,
            true
          ),
          event: 'createConversation',
        });
        if (ret) {
          const c = await this.toUIConversation(ret);
          this._convList.set(c.convId, c);
          return c;
        }
      } else {
        return conv;
      }
    } else {
      return this._convList.get(params.convId);
    }
    return undefined;
  }
  async removeConversation(params: { convId: string }): Promise<void> {
    const { convId } = params;
    const ret = await this.tryCatchSync({
      promise: this.client.chatManager.deleteConversation(convId, true),
      event: 'deleteConversation',
    });
    this._convList.delete(convId);
    return ret;
  }
  async clearAllConversations(): Promise<void> {
    const ret = Array.from(this._convList.values()).map(async (v) => {
      await this.tryCatchSync({
        promise: this.client.chatManager.deleteConversation(v.convId, true),
        event: 'deleteConversation',
      });
    });
    await Promise.all(ret);
    this._convList.clear();
  }
  async setConversationPin(params: {
    convId: string;
    convType: ChatConversationType;
    isPin: boolean;
  }): Promise<void> {
    const ret = await this.tryCatchSync({
      promise: this.client.chatManager.pinConversation(
        params.convId,
        params.isPin
      ),
      event: 'pinConversation',
    });
    const conv = this._convList.get(params.convId);
    if (conv) {
      conv.isPinned = params.isPin;
    }
    return ret;
  }
  async setConversationSilentMode(params: {
    convId: string;
    convType: ChatConversationType;
    doNotDisturb: boolean;
  }): Promise<void> {
    const ret = await this.tryCatchSync({
      promise: this.client.pushManager.setSilentModeForConversation({
        convId: params.convId,
        convType: params.convType,
        option: {
          remindType:
            params.doNotDisturb === true
              ? ChatPushRemindType.NONE
              : ChatPushRemindType.ALL,
          paramType: ChatSilentModeParamType.REMIND_TYPE,
        },
      }),
      event: 'setSilentModeForConversation',
    });
    const conv = this._convList.get(params.convId);
    if (conv) {
      conv.doNotDisturb = params.doNotDisturb;
    }
    return ret;
  }
  async setConversationRead(params: {
    convId: string;
    convType: ChatConversationType;
  }): Promise<void> {
    const ret = await this.tryCatchSync({
      promise: this.client.chatManager.markAllMessagesAsRead(
        params.convId,
        params.convType
      ),
      event: 'markAllMessagesAsRead',
    });
    const conv = this._convList.get(params.convId);
    if (conv) {
      conv.unreadMessageCount = 0;
    }
    return ret;
  }
  async setConversationExt(params: {
    convId: string;
    convType: ChatConversationType;
    ext: Record<string, string | number | boolean>;
  }): Promise<void> {
    const ret = await this.tryCatchSync({
      promise: this.client.chatManager.setConversationExtension(
        params.convId,
        params.convType,
        params.ext
      ),
      event: 'setConversationExtension',
    });
    const conv = this._convList.get(params.convId);
    if (conv) {
      conv.ext = params.ext;
    }
    return ret;
  }
  async setConversationMsg(params: {
    convId: string;
    convType: ChatConversationType;
    lastMessage: ChatMessage;
  }): Promise<void> {
    const conv = this._convList.get(params.convId);
    if (conv) {
      conv.lastMessage = params.lastMessage;
    }
  }
  async updateConversation(params: { conv: ConversationModel }): Promise<void> {
    const _conv = this._convList.get(params.conv.convId);
    if (_conv) {
      if (_conv.isPinned !== params.conv.isPinned && params.conv.isPinned) {
        this.setConversationPin({
          convId: params.conv.convId,
          convType: params.conv.convType,
          isPin: params.conv.isPinned,
        });
      }
      if (_conv.unreadMessageCount !== params.conv.unreadMessageCount) {
        this.setConversationRead({
          convId: params.conv.convId,
          convType: params.conv.convType,
        });
      }
      if (
        _conv.doNotDisturb !== params.conv.doNotDisturb &&
        params.conv.doNotDisturb
      ) {
        this.setConversationSilentMode({
          convId: params.conv.convId,
          convType: params.conv.convType,
          doNotDisturb: params.conv.doNotDisturb,
        });
      }
      if (
        _conv.lastMessage !== params.conv.lastMessage &&
        params.conv.lastMessage
      ) {
        this.setConversationMsg({
          convId: params.conv.convId,
          convType: params.conv.convType,
          lastMessage: params.conv.lastMessage,
        });
      }
      if (_conv.ext !== params.conv.ext && params.conv.ext) {
        this.client.chatManager.setConversationExtension(
          params.conv.convId,
          params.conv.convType,
          params.conv.ext
        );
      }
    }
  }
  getConversationMessageCount(
    convId: string,
    convType: ChatConversationType
  ): Promise<number> {
    return this.tryCatchSync({
      promise: this.client.chatManager.getConversationUnreadCount(
        convId,
        convType
      ),
      event: 'getUnreadCount',
    });
  }
  getConversationLatestMessage(
    convId: string,
    convType: ChatConversationType
  ): Promise<ChatMessage | undefined> {
    return this.tryCatchSync({
      promise: this.client.chatManager.getLatestMessage(convId, convType),
      event: 'getLastMessage',
    });
  }

  getAllContacts(params: { onResult: ResultCallback<ContactModel[]> }): void {
    if (this._contactList.size > 0) {
      params.onResult({
        isOk: true,
        value: Array.from(this._contactList.values()),
      });
      return;
    }
    this.tryCatch({
      promise: this.client.contactManager.getAllContacts(),
      event: 'getAllContacts',
      onFinished: async (value) => {
        value.forEach(async (v) => {
          this._contactList.set(v.userId, {
            ...v,
            nickName:
              v.remark === undefined || v.remark.length === 0
                ? v.userId
                : v.remark,
          });
        });

        if (this._contactDataRequestCallback) {
          this._contactDataRequestCallback({
            ids: Array.from(this._contactList.values())
              .filter(
                (v) => v.nickName === undefined || v.nickName === v.userId
              )
              .map((v) => v.userId),
            result: async (data?: DataModel[], error?: UIKitError) => {
              if (data) {
                data.forEach((value) => {
                  const contact = this._contactList.get(value.id);
                  if (contact) {
                    contact.nickName = value.name;
                    contact.avatar = value.avatar;
                  }
                });
              }

              params.onResult({
                isOk: true,
                value: Array.from(this._contactList.values()).map((v) => v),
                error,
              });
            },
          });
        } else {
          params.onResult({
            isOk: true,
            value: Array.from(this._contactList.values()).map((v) => v),
          });
        }
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }
}

export class ChatServicePrivateImpl extends ChatServiceImpl {
  constructor() {
    super();
  }

  _initListener() {
    this._initConnectListener();
    this._initMessageListener();
    this._initGroupListener();
    this._initMultiDeviceListener();
    this._initCustomListener();
    this._initContactListener();
    this._initPresenceListener();
  }
  _initConnectListener() {
    this.client.removeAllConnectionListener();
    this.client.addConnectionListener({
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
    });
  }

  _initMessageListener() {
    this.client.chatManager.removeAllMessageListener();
    this.client.chatManager.addMessageListener({
      onMessagesReceived: (messages: Array<ChatMessage>): void => {
        this._listeners.forEach((v) => {
          v.onMessagesReceived?.(messages);
        });
      },
      onCmdMessagesReceived: (messages: Array<ChatMessage>): void => {
        this._listeners.forEach((v) => {
          v.onCmdMessagesReceived?.(messages);
        });
      },
      onMessagesRead: (messages: Array<ChatMessage>): void => {
        this._listeners.forEach((v) => {
          v.onMessagesRead?.(messages);
        });
      },
      onGroupMessageRead: (
        groupMessageAcks: Array<ChatGroupMessageAck>
      ): void => {
        this._listeners.forEach((v) => {
          v.onGroupMessageRead?.(groupMessageAcks);
        });
      },
      onMessagesDelivered: (messages: Array<ChatMessage>): void => {
        this._listeners.forEach((v) => {
          v.onMessagesDelivered?.(messages);
        });
      },
      onMessagesRecalled: (messages: Array<ChatMessage>): void => {
        this._listeners.forEach((v) => {
          v.onMessagesRecalled?.(messages);
        });
      },
      onConversationsUpdate: (): void => {
        this._listeners.forEach((v) => {
          v.onConversationsUpdate?.();
        });
      },
      onConversationRead: (from: string, to?: string): void => {
        this._listeners.forEach((v) => {
          v.onConversationRead?.(from, to);
        });
      },
      onMessageReactionDidChange: (
        list: Array<ChatMessageReactionEvent>
      ): void => {
        this._listeners.forEach((v) => {
          v.onMessageReactionDidChange?.(list);
        });
      },
      onChatMessageThreadCreated: (event: ChatMessageThreadEvent): void => {
        this._listeners.forEach((v) => {
          v.onChatMessageThreadCreated?.(event);
        });
      },
      onChatMessageThreadUpdated: (event: ChatMessageThreadEvent): void => {
        this._listeners.forEach((v) => {
          v.onChatMessageThreadUpdated?.(event);
        });
      },
      onChatMessageThreadDestroyed: (event: ChatMessageThreadEvent): void => {
        this._listeners.forEach((v) => {
          v.onChatMessageThreadDestroyed?.(event);
        });
      },
      onChatMessageThreadUserRemoved: (event: ChatMessageThreadEvent): void => {
        this._listeners.forEach((v) => {
          v.onChatMessageThreadUserRemoved?.(event);
        });
      },
      onMessageContentChanged: (
        message: ChatMessage,
        lastModifyOperatorId: string,
        lastModifyTime: number
      ): void => {
        this._listeners.forEach((v) => {
          v.onMessageContentChanged?.(
            message,
            lastModifyOperatorId,
            lastModifyTime
          );
        });
      },
    });
  }

  _initGroupListener() {
    this.client.groupManager.removeAllGroupListener();
    this.client.groupManager.addGroupListener({
      onInvitationReceived: (params: {
        groupId: string;
        inviter: string;
        groupName: string;
        reason?: string;
      }): void => {
        this._listeners.forEach((v) => {
          v.onInvitationReceived?.(params);
        });
      },
      onRequestToJoinReceived: (params: {
        groupId: string;
        applicant: string;
        groupName?: string;
        reason?: string;
      }): void => {
        this._listeners.forEach((v) => {
          v.onRequestToJoinReceived?.(params);
        });
      },
      onRequestToJoinAccepted: (params: {
        groupId: string;
        accepter: string;
        groupName?: string;
      }): void => {
        this._listeners.forEach((v) => {
          v.onRequestToJoinAccepted?.(params);
        });
      },
      onRequestToJoinDeclined: (params: {
        groupId: string;
        decliner: string;
        groupName?: string;
        applicant?: string;
        reason?: string;
      }): void => {
        this._listeners.forEach((v) => {
          v.onRequestToJoinDeclined?.(params);
        });
      },
      onInvitationAccepted: (params: {
        groupId: string;
        invitee: string;
        reason?: string;
      }): void => {
        this._listeners.forEach((v) => {
          v.onInvitationAccepted?.(params);
        });
      },
      onInvitationDeclined: (params: {
        groupId: string;
        invitee: string;
        reason?: string;
      }): void => {
        this._listeners.forEach((v) => {
          v.onInvitationDeclined?.(params);
        });
      },
      onMemberRemoved: (params: {
        groupId: string;
        groupName?: string;
      }): void => {
        this._listeners.forEach((v) => {
          v.onMemberRemoved?.(params);
        });
      },
      onDestroyed: (params: { groupId: string; groupName?: string }): void => {
        this._listeners.forEach((v) => {
          v.onDestroyed?.(params);
        });
      },
      onAutoAcceptInvitation: (params: {
        groupId: string;
        inviter: string;
        inviteMessage?: string;
      }): void => {
        this._listeners.forEach((v) => {
          v.onAutoAcceptInvitation?.(params);
        });
      },
      onMuteListAdded: (params: {
        groupId: string;
        mutes: Array<string>;
        muteExpire?: number;
      }): void => {
        this._listeners.forEach((v) => {
          v.onMuteListAdded?.(params);
        });
      },
      onMuteListRemoved: (params: {
        groupId: string;
        mutes: Array<string>;
      }): void => {
        this._listeners.forEach((v) => {
          v.onMuteListRemoved?.(params);
        });
      },
      onAdminAdded: (params: { groupId: string; admin: string }): void => {
        this._listeners.forEach((v) => {
          v.onAdminAdded?.(params);
        });
      },
      onAdminRemoved: (params: { groupId: string; admin: string }): void => {
        this._listeners.forEach((v) => {
          v.onAdminRemoved?.(params);
        });
      },
      onOwnerChanged: (params: {
        groupId: string;
        newOwner: string;
        oldOwner: string;
      }): void => {
        this._listeners.forEach((v) => {
          v.onOwnerChanged?.(params);
        });
      },
      onMemberJoined: (params: { groupId: string; member: string }): void => {
        this._listeners.forEach((v) => {
          v.onMemberJoined?.(params);
        });
      },
      onMemberExited: (params: { groupId: string; member: string }): void => {
        this._listeners.forEach((v) => {
          v.onMemberExited?.(params);
        });
      },
      onAnnouncementChanged: (params: {
        groupId: string;
        announcement: string;
      }): void => {
        this._listeners.forEach((v) => {
          v.onAnnouncementChanged?.(params);
        });
      },
      onSharedFileAdded: (params: {
        groupId: string;
        sharedFile: string;
      }): void => {
        this._listeners.forEach((v) => {
          v.onSharedFileAdded?.(params);
        });
      },
      onSharedFileDeleted: (params: {
        groupId: string;
        fileId: string;
      }): void => {
        this._listeners.forEach((v) => {
          v.onSharedFileDeleted?.(params);
        });
      },
      onAllowListAdded: (params: {
        groupId: string;
        members: Array<string>;
      }): void => {
        this._listeners.forEach((v) => {
          v.onAllowListAdded?.(params);
        });
      },
      onAllowListRemoved: (params: {
        groupId: string;
        members: Array<string>;
      }): void => {
        this._listeners.forEach((v) => {
          v.onAllowListRemoved?.(params);
        });
      },
      onAllGroupMemberMuteStateChanged: (params: {
        groupId: string;
        isAllMuted: boolean;
      }): void => {
        this._listeners.forEach((v) => {
          v.onAllGroupMemberMuteStateChanged?.(params);
        });
      },
      onDetailChanged: (group: ChatGroup): void => {
        this._listeners.forEach((v) => {
          v.onDetailChanged?.(group);
        });
      },
      onStateChanged: (group: ChatGroup): void => {
        this._listeners.forEach((v) => {
          v.onStateChanged?.(group);
        });
      },
      onMemberAttributesChanged: (params: {
        groupId: string;
        member: string;
        attributes: any;
        operator: string;
      }): void => {
        this._listeners.forEach((v) => {
          v.onMemberAttributesChanged?.(params);
        });
      },
    });
  }

  _initMultiDeviceListener() {
    this.client.removeAllMultiDeviceListener();
    this.client.addMultiDeviceListener({
      onContactEvent: (
        event?: ChatMultiDeviceEvent,
        target?: string,
        ext?: string
      ): void => {
        this._listeners.forEach((v) => {
          v.onContactEvent?.(event, target, ext);
        });
      },
      onGroupEvent: (
        event?: ChatMultiDeviceEvent,
        target?: string,
        usernames?: Array<string>
      ): void => {
        this._listeners.forEach((v) => {
          v.onGroupEvent?.(event, target, usernames);
        });
      },
      onThreadEvent: (
        event?: ChatMultiDeviceEvent,
        target?: string,
        usernames?: Array<string>
      ): void => {
        this._listeners.forEach((v) => {
          v.onThreadEvent?.(event, target, usernames);
        });
      },
      onMessageRemoved: (convId?: string, deviceId?: string): void => {
        this._listeners.forEach((v) => {
          v.onMessageRemoved?.(convId, deviceId);
        });
      },
      onConversationEvent: (
        event?: ChatMultiDeviceEvent,
        convId?: string,
        convType?: ChatConversationType
      ): void => {
        this._listeners.forEach((v) => {
          v.onConversationEvent?.(event, convId, convType);
        });
      },
    });
  }
  _initCustomListener() {
    this.client.removeAllCustomListener();
    this.client.addCustomListener({
      onDataReceived: (params: any): void => {
        this._listeners.forEach((v) => {
          v.onDataReceived?.(params);
        });
      },
    });
  }
  _initContactListener() {
    this.client.contactManager.removeAllContactListener();
    this.client.contactManager.addContactListener({
      onContactAdded: (userName: string): void => {
        this._listeners.forEach((v) => {
          v.onContactAdded?.(userName);
        });
      },
      onContactDeleted: (userName: string): void => {
        this._listeners.forEach((v) => {
          v.onContactDeleted?.(userName);
        });
      },
      onContactInvited: (userName: string, reason?: string): void => {
        this._listeners.forEach((v) => {
          v.onContactInvited?.(userName, reason);
        });
      },
      onFriendRequestAccepted: (userName: string): void => {
        this._listeners.forEach((v) => {
          v.onFriendRequestAccepted?.(userName);
        });
      },
      onFriendRequestDeclined: (userName: string): void => {
        this._listeners.forEach((v) => {
          v.onFriendRequestDeclined?.(userName);
        });
      },
    });
  }
  _initPresenceListener() {
    this.client.presenceManager.removeAllPresenceListener();
    this.client.presenceManager.addPresenceListener({
      onPresenceStatusChanged: (list: Array<ChatPresence>): void => {
        this._listeners.forEach((v) => {
          v.onPresenceStatusChanged?.(list);
        });
      },
    });
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
}

let gIMService: ChatService;

export function getChatService(): ChatService {
  if (gIMService === undefined) {
    gIMService = new ChatServicePrivateImpl();
  }
  return gIMService;
}

// export class IMServicePrivateImplTest extends ChatServicePrivateImpl {
//   constructor() {
//     super();
//   }
//   test() {
//     this._clearMuter();
//   }
// }
