import { uilog } from '../const';
import { ConversationStorage } from '../db/storage';
import { ErrorCode, UIKitError } from '../error';
import {
  CHAT_VERSION,
  ChatClient,
  ChatContact,
  ChatConversation,
  ChatConversationType,
  ChatCursorResult,
  ChatError,
  ChatGroup,
  ChatGroupOptions,
  ChatGroupStyle,
  ChatMessage,
  ChatMessageReaction,
  type ChatMessageStatusCallback,
  ChatMessageThread,
  ChatMessageType,
  ChatOptions,
  ChatPresence,
  ChatPushRemindType,
  ChatSearchDirection,
  ChatSilentModeParamType,
  ChatUserInfo,
} from '../rename.chat';
import { Services } from '../services';
import { asyncTask, getCurTs, mergeObjects } from '../utils';
import { ChatServiceListenerImpl } from './chat.listener';
import { gGroupMemberMyRemark } from './const';
import { DataProfileProvider } from './DataProfileProvider';
import { MessageCacheManagerImpl } from './messageManager';
import type { MessageCacheManager } from './messageManager.types';
import { RequestListImpl } from './requestList';
import type { RequestList } from './requestList.types';
import type {
  ChatEventType,
  ChatOptionsType,
  ChatService,
  ChatServiceListener,
  ConversationServices,
  DataModel,
  DataModelType,
  ResultCallback,
  ResultValue,
  UserData,
  UserFrom,
} from './types';
import {
  type BlockModel,
  type ContactModel,
  type ConversationModel,
  type GroupModel,
  type GroupParticipantModel,
  type StateModel,
  type UIListener,
  UIListenerType,
} from './types.ui';
import {
  PresenceUtil,
  setUserInfoToMessage,
  userInfoFromMessage,
} from './utils';

export class ChatServiceImpl
  extends ChatServiceListenerImpl
  implements ChatService, ConversationServices
{
  _user?: UserData;
  _dataFileProvider: DataProfileProvider;
  _userList: Map<string, UserData>;
  _convStorage?: ConversationStorage;
  _convList: Map<string, ConversationModel>;
  _contactList: Map<string, ContactModel>;
  _blockList: Map<string, BlockModel>;
  _groupList: Map<string, GroupModel>;
  _groupMemberList: Map<string, Map<string, GroupParticipantModel>>;
  _request: RequestList;
  _messageManager: MessageCacheManager;
  _modelState: Map<string, Map<string, StateModel>>;
  _currentConversation?: ConversationModel;
  _silentModeList: Map<string, { convId: string; doNotDisturb?: boolean }>;
  _pinMessageList: Map<string, boolean>;
  _groupNameOnCreateGroupCallback?: (params: {
    selected: ContactModel[];
  }) => string;

  constructor() {
    uilog.log('chat:constructor:');
    super();
    this._userList = new Map();
    this._convList = new Map();
    this._contactList = new Map();
    this._blockList = new Map();
    this._groupList = new Map();
    this._groupMemberList = new Map();
    this._modelState = new Map();
    this._silentModeList = new Map();
    this._pinMessageList = new Map();
    this._request = new RequestListImpl(this);
    this._messageManager = new MessageCacheManagerImpl(this);
    this._dataFileProvider = new DataProfileProvider();
  }

  // !!! warning: no need
  // destructor() {
  // }

  reset(): void {
    uilog.log('chat:reset:');
    // this.clearListener(); // !!! warn: no clear.
    this._userList.clear();
    this._convList.clear();
    this._blockList.clear();
    this._contactList.clear();
    this._groupList.clear();
    this._groupMemberList.clear();
    this._modelState.clear();
    this._silentModeList.clear();
    this._pinMessageList.clear();
  }

  async init(params: {
    options: ChatOptionsType;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    uilog.log('chat:init');
    const { options } = params;
    const { appKey } = options;

    try {
      await this.client.init(new ChatOptions({ ...options }));
      uilog.log('chat:opt:', this.client.options);

      this._convStorage = new ConversationStorage({ appKey: appKey });
      // !!! hot-reload no pass, into catch codes
      // this._request = new RequestListImpl(this);
      // this._messageManager = new MessageCacheManagerImpl(this);
      this._initListener();
      this._request.init();
      this._messageManager.init();
      this._dataFileProvider.clearDataList();

      params.result?.({ isOk: true });
    } catch (error) {
      params.result?.({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.init_error,
          desc: this._fromChatError(error),
        }),
      });
    }
  }

  addListener(listener: ChatServiceListener): void {
    super.addListener(listener);
  }
  removeListener(listener: ChatServiceListener): void {
    super.removeListener(listener);
  }
  clearListener(): void {
    super.clearListener();
  }

  addUIListener<DataModel>(listener: UIListener<DataModel>): void {
    super.addUIListener<DataModel>(listener);
  }
  removeUIListener<DataModel>(listener: UIListener<DataModel>): void {
    super.removeUIListener<DataModel>(listener);
  }
  clearUIListener(): void {
    super.clearUIListener();
  }
  sendUIEvent<DataModel>(
    type: UIListenerType,
    event: keyof UIListener<DataModel>,
    data?: DataModel | string,
    ...args: DataModel[]
  ): void {
    super.sendUIEvent<DataModel>(type, event, data, ...args);
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

  async _createUserDir(): Promise<void> {
    try {
      const isExisted = await Services.dcs.isExistedUserDir();
      if (isExisted !== true) {
        await Services.dcs.createUserDir();
      }
    } catch (e) {
      uilog.warn('createUserDir:', e);
      this.sendError({
        error: new UIKitError({
          code: ErrorCode.chat_uikit,
          desc: 'createUserDir failed.',
        }),
      });
    }
  }

  get client(): ChatClient {
    return super.client;
  }

  async login(params: {
    userId: string;
    userToken: string;
    userName: string;
    userAvatarURL?: string | undefined;
    usePassword?: boolean;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    const { userId, userToken, userName, userAvatarURL, result, usePassword } =
      params;
    try {
      uilog.log('chat:login:', params);
      this.reset();
      const version = CHAT_VERSION;
      const list = version.split('.');
      const major = parseInt(list[0]!, 10);
      const minor = parseInt(list[1]!, 10);
      if (major <= 1 && minor < 3) {
        if (userToken.startsWith('00')) {
          await this.client.loginWithAgoraToken(userId, userToken);
        } else {
          await this.client.login(userId, userToken, usePassword ?? false);
        }
      } else {
        await this.client.login(userId, userToken, usePassword ?? false);
      }

      this._convStorage?.setCurrentId(userId);

      // !!! hot-reload no pass, into catch codes
      this._user = {
        userName: userName,
        remark: userName,
        avatarURL: userAvatarURL,
        userId: userId,
      } as UserData;

      Services.dcs.init(
        `${this.client.options!.appKey.replace('#', '-')}/${userId}`
      );

      await this._createUserDir();

      this.client.getCurrentUsername();
      // this.updateSelfInfo({ self: this._user, onResult: () => {} });

      uilog.log('login:finish:1', params);

      result?.({ isOk: true });

      this.sendFinished({ event: 'login', extra: { isOk: true } });
    } catch (error: any) {
      if (error?.code === 200) {
        this._convStorage?.setCurrentId(userId);
        // !!! for dev hot-reload
        this._user = {
          userName: userName,
          remark: userName,
          avatarURL: userAvatarURL,
          userId: userId,
        } as UserData;

        Services.dcs.init(
          `${this.client.options!.appKey.replace('#', '-')}/${userId}`
        );

        await this._createUserDir();

        this.client.getCurrentUsername();
        // this.updateSelfInfo({ self: this._user, onResult: () => {} });
      }
      uilog.log('login:finish:2', params, error);
      result?.({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.login_error,
          desc: this._fromChatError(error),
        }),
      });

      this.sendFinished({ event: 'login', extra: { isOk: false } });
    }
  }
  async logout(params: {
    unbindDeviceToken?: boolean;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    try {
      uilog.log('chat:logout:');
      await this.client.logout(params.unbindDeviceToken);
      params.result?.({ isOk: true });
      this._user = undefined;
      this.reset();
      this.sendFinished({ event: 'logout', extra: { isOk: true } });
    } catch (error) {
      params.result?.({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.logout_error,
          desc: this._fromChatError(error),
        }),
      });
      this.sendFinished({ event: 'logout', extra: { isOk: false } });
    }
  }
  async autoLogin(params: {
    userName?: string;
    userAvatarURL?: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    if (this.client.options?.autoLogin !== true) {
      params.result?.({ isOk: false });
      this.sendFinished({ event: 'autoLogin', extra: { isOk: false } });
      return;
    }
    this.tryCatch({
      promise: this.client.isLoginBefore(),
      event: 'autoLogin',
      onFinished: async (value) => {
        if (value === true) {
          const userId = await this.client.getCurrentUsername();
          this._convStorage?.setCurrentId(userId);

          this._user = {
            userName: params.userName,
            remark: params.userName,
            avatarURL: params.userAvatarURL,
            userId: userId,
          } as UserData;

          Services.dcs.init(
            `${this.client.options!.appKey.replace('#', '-')}/${userId}`
          );

          await this._createUserDir();
          this.client.getCurrentUsername();

          params.result?.({ isOk: true });
          this.sendFinished({ event: 'autoLogin', extra: { isOk: true } });
        } else {
          params.result?.({ isOk: false });
          this.sendFinished({ event: 'autoLogin', extra: { isOk: false } });
        }
      },
      onError: (e) => {
        params.result?.({
          isOk: false,
          error: e,
        });
      },
    });
  }
  async loginState(): Promise<'logged' | 'noLogged'> {
    const r = await this.client.isLoginBefore();
    return r === true ? 'logged' : 'noLogged';
  }
  refreshToken(params: {
    token: string;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): void {
    this.tryCatch({
      promise: this.client.renewAgoraToken(params.token),
      event: 'refreshToken',
      onFinished: () => {
        params?.result?.({ isOk: true });
      },
      onError: (error) => {
        params.result?.({
          isOk: false,
          error: new UIKitError({
            code: ErrorCode.refresh_token_error,
            desc: this._fromChatError(error),
          }),
        });
      },
    });
  }

  checkTokenIsExpired(params: {
    onResult: (isExpired: boolean) => void;
  }): void {
    this.client.userManager
      .fetchUserInfoById(['test'])
      .then(() => {
        params.onResult?.(false);
      })
      .catch((e: ChatError) => {
        if (e.code === 401) {
          params.onResult?.(true);
        } else {
          params.onResult?.(false);
        }
      });
  }

  get userId(): string | undefined {
    return this.client.currentUserName as string | undefined;
  }

  user(userId?: string): UserData | undefined {
    if (this._user?.userId === userId) {
      return this._user;
    } else if (userId) {
      return this._userList.get(userId);
    }
    return undefined;
  }

  setUser(params: { users: UserData[] }): void {
    params.users.forEach((v) => {
      if (v.userId === this._user?.userId && v.userId) {
        this._user = { ...this._user, ...v };
      } else {
        this._userList.set(v.userId, v);
      }
    });
  }

  sendError(params: { error: UIKitError; from?: string; extra?: any }): void {
    this.listeners.forEach((v) => {
      asyncTask(() => v.onError?.(params));
    });
  }
  sendFinished(params: { event: ChatEventType; extra?: any }): void {
    this.listeners.forEach((v) => {
      asyncTask(() => v.onFinished?.(params));
    });
  }
  sendBefore(params: { event: ChatEventType; extra?: any }): void {
    this.listeners.forEach((v) => {
      asyncTask(() => v.onBefore?.(params));
    });
  }

  get requestList(): RequestList {
    return this._request!;
  }

  get messageManager(): MessageCacheManager {
    return this._messageManager!;
  }

  tryCatch<T>(params: {
    promise: Promise<T>;
    event: string;
    onFinished?:
      | ((value: T) => Promise<void | boolean> | void | boolean)
      | undefined;
    onError?: ((e: UIKitError) => void | boolean) | undefined;
  }): void {
    const { promise, event, onFinished, onError } = params;
    this.sendBefore({ event: event });
    promise
      .then(async (value: T) => {
        const ret = await onFinished?.(value);
        if (ret !== false) {
          this.sendFinished({ event: event });
        }
      })
      .catch((e) => {
        const isErrorObject = e instanceof UIKitError;
        let _e = e;
        if (isErrorObject === false) {
          _e = new UIKitError({
            code: ErrorCode.chat_uikit,
            tag: event,
            desc: this._fromChatError(e),
          });
        }
        const ret = onError?.(_e);
        if (ret !== false) {
          this.sendError({
            error: _e,
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
        code: ErrorCode.chat_uikit,
        tag: event,
        desc: this._fromChatError(error),
      });
    }
  }

  async tryCatchSyncList<T>(params: { promises: Promise<T>[]; event: string }) {
    const { promises, event } = params;
    try {
      return await Promise.all(promises);
    } catch (error) {
      throw new UIKitError({
        code: ErrorCode.chat_uikit,
        tag: event,
        desc: this._fromChatError(error),
      });
    }
  }

  toUserData(
    user: ChatUserInfo,
    from?: {
      type: UserFrom;
      groupId?: string;
    }
  ): UserData {
    return {
      userId: user.userId,
      userName: user.nickName,
      remark: user.nickName,
      avatarURL: user.avatarUrl,
      from: from,
    };
  }

  _getAvatarFromCache(id: string): string | undefined {
    return this._dataFileProvider.getDataById(id)?.avatar;
  }

  _getNameFromCache(id: string): string | undefined {
    return this._dataFileProvider.getDataById(id)?.name;
  }

  _getRemarkFromCache(id: string): string | undefined {
    return this._dataFileProvider.getDataById(id)?.remark;
  }

  _getDoNotDisturbFromCache(convId: string) {
    return this._silentModeList.get(convId)?.doNotDisturb;
  }

  async toUIConversation(conv: ChatConversation): Promise<ConversationModel> {
    const name =
      conv.convType === ChatConversationType.PeerChat
        ? this._getRemarkFromCache(conv.convId) ??
          this._getNameFromCache(conv.convId)
        : this._getNameFromCache(conv.convId);
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
      doNotDisturb: this._getDoNotDisturbFromCache(conv.convId),
      convName: name,
      convAvatar: this._getAvatarFromCache(conv.convId),
    } as ConversationModel;
  }

  toUIContact(contact: ChatContact): ContactModel {
    const others = this._contactList.get(contact.userId);
    return {
      ...others,
      userId: contact.userId,
      remark: this._getRemarkFromCache(contact.userId) ?? contact.remark,
      userAvatar: this._getAvatarFromCache(contact.userId),
      userName: this._getNameFromCache(contact.userId),
    };
  }

  toUIGroup(group: ChatGroup): GroupModel {
    const others = this._groupList.get(group.groupId);
    return {
      ...others,
      ...group,
      groupAvatar: this._getAvatarFromCache(group.groupId),
      groupName: this._getNameFromCache(group.groupId) ?? group.groupName,
    };
  }

  setGroupNameOnCreateGroup(
    callback: (params: { selected: ContactModel[] }) => string
  ): void {
    this._groupNameOnCreateGroupCallback = callback;
  }

  getCreateGroupCustomNameCallback():
    | ((params: { selected: ContactModel[] }) => string)
    | undefined {
    return this._groupNameOnCreateGroupCallback;
  }

  updateDataList(params: {
    dataList: Map<string, DataModel>;
    isUpdateNotExisted?: boolean;
    disableDispatch?: boolean;
    dispatchHandler?: (data: Map<string, DataModel>) => boolean;
  }): void {
    this._updateDataList(params);
  }

  getDataModel(id: string): DataModel | undefined {
    return this._dataFileProvider.getDataById(id);
  }

  getDataFileProvider(): DataProfileProvider {
    return this._dataFileProvider;
  }

  async _requestConvData(list: ChatConversation[]): Promise<void> {
    const tmp = new Map<string, DataModelType>();
    list.forEach((v) => {
      tmp.set(
        v.convId,
        v.convType === ChatConversationType.GroupChat ? 'group' : 'user'
      );
    });
    await this._dataFileProvider.requestDataList({
      dataList: tmp,
      disableDispatch: true,
      requestHasData: false,
      isUpdateNotExisted: true,
    });
  }

  async _requestData(params: {
    list: string[];
    type: DataModelType;
    disableDispatch?: boolean;
    requestHasData: boolean;
    isUpdateNotExisted?: boolean;
  }): Promise<void> {
    const {
      list,
      type = 'user',
      requestHasData = false,
      disableDispatch = true,
      isUpdateNotExisted = false,
    } = params;
    const tmp = new Map<string, DataModelType>();
    list.forEach((v) => {
      tmp.set(v, type);
    });
    await this._dataFileProvider.requestDataList({
      dataList: tmp,
      disableDispatch: disableDispatch,
      requestHasData: requestHasData,
      isUpdateNotExisted: isUpdateNotExisted,
    });
  }

  _updateDataList(params: {
    dataList: Map<string, DataModel>;
    isUpdateNotExisted?: boolean | undefined;
    disableDispatch?: boolean | undefined;
    dispatchHandler?: (data: Map<string, DataModel>) => boolean;
  }): void {
    this._dataFileProvider.updateDataList(params);
  }

  setCurrentConversation(params: { conv?: ConversationModel }): void {
    if (params.conv && params.conv.convId) {
      const conv = this._convList.get(params.conv.convId);
      if (conv) {
        this._currentConversation = conv;
      } else {
        this._currentConversation = params.conv;
      }
    } else {
      this._currentConversation = params.conv;
    }
  }
  getCurrentConversation(): ConversationModel | undefined {
    return this._currentConversation;
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
      if (isFinished === true) {
        const list = await this.client.chatManager.getAllConversations();
        const list2 = await this._convStorage?.getAllConversation();
        if (list2 && list2?.length > 0) {
          list2?.forEach((v) => {
            this._silentModeList.set(v.convId, {
              convId: v.convId,
              doNotDisturb: v.doNotDisturb,
            });
          });
        }
        await this._requestConvData(list);
        this._convList.clear();

        const ret = list.map(async (v) => {
          const conv = await this.toUIConversation(v);
          this._convList.set(v.convId, conv);
        });
        await Promise.all(ret);
      } else {
        let cursor = '';
        const pageSize = 50;
        const pageSize2 = 20;
        const pinList =
          await this.client.chatManager.fetchPinnedConversationsFromServerWithCursor(
            cursor,
            pageSize
          );
        pinList.list?.forEach((v) => {
          map.set(v.convId, {
            ...v,
          } as ChatConversation);
        });
        cursor = '';
        for (;;) {
          const list =
            await this.client.chatManager.fetchConversationsFromServerWithCursor(
              cursor,
              pageSize2
            );
          list.list?.forEach((v) => {
            map.set(v.convId, {
              ...v,
            } as ChatConversation);
          });

          if (
            list.cursor.length === 0 ||
            (list.list && list.list?.length < pageSize) ||
            list.list === undefined
          ) {
            break;
          }
        }

        if (map.size > 0) {
          const silentList =
            await this.client.pushManager.fetchSilentModeForConversations(
              Array.from(map.values()).map((v) => {
                return {
                  convId: v.convId,
                  convType: v.convType,
                } as any;
              })
            );
          silentList.forEach((v) => {
            this._silentModeList.set(v.conversationId, {
              convId: v.conversationId,
              doNotDisturb:
                v.remindType === ChatPushRemindType.MENTION_ONLY ||
                v.remindType === ChatPushRemindType.NONE,
            });
          });
          if (this._silentModeList.size > 0) {
            await this._convStorage?.setAllConversation(
              Array.from(this._silentModeList.values()).map((item) => {
                return {
                  convId: item.convId,
                  doNotDisturb: item.doNotDisturb,
                } as ConversationModel;
              })
            );
          }
        }

        await this._convStorage?.setFinishedForFetchList(true);

        await this._requestConvData(Array.from(map.values()));

        const ret = Array.from(map.values()).map(async (v) => {
          const conv = await this.toUIConversation(v);
          this._convList.set(conv.convId, conv);
          return conv;
        });
        await Promise.all(ret);
      }

      this.sendFinished({
        event: 'getAllConversations',
        extra: { isOk: true },
      });
      onResult({
        isOk: true,
        value: Array.from(this._convList.values()),
      });
    } catch (e) {
      this.sendError({
        error: new UIKitError({
          code: ErrorCode.chat_uikit,
          desc: 'getAllConversations failed.',
        }),
      });
      onResult({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.get_all_conversations_error,
          desc: this._fromChatError(e),
        }),
      });
    }
  }
  async getConversation(params: {
    convId: string;
    convType: ChatConversationType;
    createIfNotExist?: boolean;
    fromNative?: boolean;
    isChatThread?: boolean;
  }): Promise<ConversationModel | undefined> {
    const { fromNative = false, createIfNotExist } = params;
    if (fromNative === true) {
      const ret = await this.tryCatchSync({
        promise: this.client.chatManager.getConversation(
          params.convId,
          params.convType,
          params.createIfNotExist ?? true,
          params.isChatThread ?? false
        ),
        event: 'getConversation',
      });
      if (ret) {
        await this._requestConvData([
          {
            convId: params.convId,
            convType: params.convType,
          } as ChatConversation,
        ]);
        const c1 = await this.toUIConversation(ret);
        const c2 = this._convList.get(params.convId);
        if (c2) {
          const conv = mergeObjects(c1, c2);
          this._convList.set(conv.convId, conv);
          return conv;
        } else {
          this._convList.set(c1.convId, c1);
          if (params.isChatThread !== true) {
            this.sendUIEvent(UIListenerType.Conversation, 'onAddedEvent', c1);
          }
        }
        return c1;
      }
    } else {
      if (createIfNotExist === true) {
        const isExisted = this._convList.get(params.convId);
        if (isExisted) {
          return isExisted;
        } else {
          await this._requestConvData([
            {
              convId: params.convId,
              convType: params.convType,
            } as ChatConversation,
          ]);
          const conv = await this.toUIConversation({
            convId: params.convId,
            convType: params.convType,
          } as ChatConversation);
          this._convList.set(conv.convId, conv);
          if (params.isChatThread !== true) {
            this.sendUIEvent(UIListenerType.Conversation, 'onAddedEvent', conv);
          }
          return conv;
        }
      } else {
        const conv = this._convList.get(params.convId);
        return conv;
      }
    }
    return undefined;
  }
  async removeConversationAllMessages(params: {
    convId: string;
    convType: ChatConversationType;
  }): Promise<void> {
    const ret = this.tryCatchSync({
      promise: this.client.chatManager.deleteConversationAllMessages(
        params.convId,
        params.convType
      ),
      event: 'removeConversationAllMessages',
    });
    const conv = this._convList.get(params.convId);
    if (conv) {
      this.sendUIEvent(
        UIListenerType.Conversation,
        'onRequestReloadEvent',
        conv.convId
      );
    }
    Services.dcs
      .deleteConversationDir(params.convId)
      .then()
      .catch((e) => {
        uilog.warn('remove:', e);
      });
    return ret;
  }
  async removeConversation(params: {
    convId: string;
    removeMessage?: boolean;
  }): Promise<void> {
    const { convId, removeMessage = true } = params;
    const ret = await this.tryCatchSync({
      promise: this.client.chatManager.deleteConversation(
        convId,
        removeMessage ?? true
      ),
      event: 'removeConversation',
    });
    const conv = this._convList.get(convId);
    if (conv) {
      this._convList.delete(convId);
      this.sendUIEvent(UIListenerType.Conversation, 'onDeletedEvent', conv);
      if (removeMessage === true) {
        Services.dcs
          .deleteConversationDir(params.convId)
          .then()
          .catch((e) => {
            uilog.warn('remove:', e);
          });
      }
    }
    return ret;
  }
  async clearAllConversations(): Promise<void> {
    const ret = Array.from(this._convList.values()).map(async (v) => {
      await this.tryCatchSync({
        promise: this.client.chatManager.deleteConversation(v.convId, true),
        event: 'clearAllConversations',
      });
      this.sendUIEvent(UIListenerType.Conversation, 'onDeletedEvent', v);
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
      event: 'setConversationPin',
    });
    // const conv = this._convList.get(params.convId);
    const conv = await this.getConversation({
      convId: params.convId,
      convType: params.convType,
      fromNative: true,
    });
    if (conv) {
      conv.isPinned = params.isPin;
      this.sendUIEvent(UIListenerType.Conversation, 'onUpdatedEvent', conv);
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
      event: 'setConversationSilentMode',
    });
    // const conv = this._convList.get(params.convId);
    const conv = await this.getConversation({
      convId: params.convId,
      convType: params.convType,
      fromNative: true,
    });
    if (conv) {
      conv.doNotDisturb = params.doNotDisturb;
      this._silentModeList.set(conv.convId, {
        convId: conv.convId,
        doNotDisturb: params.doNotDisturb,
      });
      await this._convStorage?.setAllConversation(
        Array.from(this._silentModeList.values()).map((item) => {
          return {
            convId: item.convId,
            doNotDisturb: item.doNotDisturb,
          } as ConversationModel;
        })
      );
      this.sendUIEvent(UIListenerType.Conversation, 'onUpdatedEvent', conv);
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
      event: 'setConversationRead',
    });
    // const conv = this._convList.get(params.convId);
    const conv = await this.getConversation({
      convId: params.convId,
      convType: params.convType,
      fromNative: true,
    });
    if (conv) {
      conv.unreadMessageCount = 0;
      this.messageManager.emitConversationUnreadCountChanged();
      this.sendUIEvent(UIListenerType.Conversation, 'onUpdatedEvent', conv);
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
      event: 'setConversationExt',
    });
    // const conv = this._convList.get(params.convId);
    const conv = await this.getConversation({
      convId: params.convId,
      convType: params.convType,
      fromNative: true,
    });
    if (conv) {
      conv.ext = params.ext;
      this.sendUIEvent(UIListenerType.Conversation, 'onUpdatedEvent', conv);
    }
    return ret;
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
      event: 'getConversationMessageCount',
    });
  }
  getConversationLatestMessage(
    convId: string,
    convType: ChatConversationType
  ): Promise<ChatMessage | undefined> {
    return this.tryCatchSync({
      promise: this.client.chatManager.getLatestMessage(convId, convType),
      event: 'getConversationLatestMessage',
    });
  }
  async getDoNotDisturb(
    convId: string,
    convType: ChatConversationType
  ): Promise<boolean> {
    const ret = await this.tryCatchSync({
      promise: this.client.pushManager.fetchSilentModeForConversation({
        convId,
        convType,
      }),
      event: 'getDoNotDisturb',
    });
    if (ret) {
      return (
        ret?.remindType === ChatPushRemindType.MENTION_ONLY ||
        ret?.remindType === ChatPushRemindType.NONE
      );
    }
    return false;
  }

  isContact(params: { userId: string }): boolean {
    return (
      this._contactList.has(params.userId) && this.userId !== params.userId
    );
  }

  getAllContacts(params: {
    requestServer?: boolean;
    onResult: ResultCallback<ContactModel[]>;
  }): void {
    const { requestServer = false } = params;
    if (this._contactList.size > 0 && requestServer === false) {
      this.tryCatch({
        promise: this.client.contactManager.getAllContacts(),
        event: 'getAllContacts',
        onFinished: async (value) => {
          const list = new Map() as Map<string, ContactModel>;
          const tmp = new Map<string, DataModel>();
          value.forEach((v) => {
            tmp.set(v.userId, {
              id: v.userId,
              type: 'user',
              remark: v.remark && v.remark.length > 0 ? v.remark : undefined,
            } as DataModel);
          });
          this._updateDataList({
            dataList: tmp,
            disableDispatch: true,
            isUpdateNotExisted: true,
          });
          await this._requestData({
            list: Array.from(tmp.keys()),
            type: 'user',
            requestHasData: true,
            isUpdateNotExisted: true,
          });
          const tmp2 = this._dataFileProvider.getUserList(
            Array.from(tmp.keys())
          );
          tmp2.forEach((v) => {
            list.set(v.id, {
              userId: v.id,
              userName: v.name,
              userAvatar: v.avatar,
              remark: v.remark,
            } as ContactModel);
          });

          this._contactList = list;

          params.onResult({
            isOk: true,
            value: Array.from(this._contactList.values()),
          });
        },
        onError: (e) => {
          params.onResult({ isOk: false, error: e });
        },
      });
      return;
    }
    this.tryCatch({
      promise: this.client.contactManager.fetchAllContacts(),
      event: 'fetchAllContacts',
      onFinished: async (value) => {
        const list = new Map() as Map<string, ContactModel>;
        const tmp = new Map<string, DataModel>();
        value.forEach((v) => {
          tmp.set(v.userId, {
            id: v.userId,
            type: 'user',
            remark: v.remark && v.remark.length > 0 ? v.remark : undefined,
          } as DataModel);
        });
        this._updateDataList({
          dataList: tmp,
          disableDispatch: true,
          isUpdateNotExisted: true,
        });
        await this._requestData({
          list: Array.from(tmp.keys()),
          type: 'user',
          requestHasData: true,
          isUpdateNotExisted: true,
        });
        const tmp2 = this._dataFileProvider.getUserList(Array.from(tmp.keys()));
        tmp2.forEach((v) => {
          list.set(v.id, {
            userId: v.id,
            userName: v.name,
            userAvatar: v.avatar,
            remark: v.remark,
          } as ContactModel);
        });
        this._contactList = list;

        params.onResult({
          isOk: true,
          value: Array.from(this._contactList.values()),
        });
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  async getContactSync(params: {
    userId: string;
  }): Promise<ResultValue<ContactModel | undefined>> {
    const ret = await this.tryCatchSync({
      promise: this.client.contactManager.getContact(params.userId),
      event: 'getContactSync',
    });
    if (ret) {
      const contact = this.toUIContact(ret);
      return {
        isOk: true,
        value: contact,
      };
    }
    return {
      isOk: true,
      value: undefined,
    };
  }

  getContact(params: {
    userId: string;
    onResult: ResultCallback<ContactModel | undefined>;
  }): void {
    this.tryCatch({
      promise: this.getContactSync(params),
      event: 'getContact',
      onFinished: async (value) => {
        params.onResult(value);
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  getAllContacts2(params: {
    requestServer?: boolean;
    onResult: ResultCallback<ContactModel[]>;
  }): void {
    const { requestServer = false } = params;
    if (this._contactList.size > 0 && requestServer === false) {
      this.tryCatch({
        promise: this.client.contactManager.getAllContactsFromDB(),
        event: 'getAllContactsFromDB',
        onFinished: async (value) => {
          const list = new Map() as Map<string, ContactModel>;
          const tmp = new Map<string, DataModel>();
          value.forEach((v: string) => {
            tmp.set(v, {
              id: v,
              type: 'user',
              remark: undefined,
            } as DataModel);
          });
          this._updateDataList({
            dataList: tmp,
            disableDispatch: true,
            isUpdateNotExisted: true,
          });
          await this._requestData({
            list: Array.from(tmp.keys()),
            type: 'user',
            requestHasData: true,
            isUpdateNotExisted: true,
          });
          const tmp2 = this._dataFileProvider.getUserList(
            Array.from(tmp.keys())
          );
          tmp2.forEach((v) => {
            list.set(v.id, {
              userId: v.id,
              userName: v.name,
              userAvatar: v.avatar,
              remark: v.remark,
            } as ContactModel);
          });

          this._contactList = list;

          params.onResult({
            isOk: true,
            value: Array.from(this._contactList.values()),
          });
        },
        onError: (e) => {
          params.onResult({ isOk: false, error: e });
        },
      });
      return;
    }
    this.tryCatch({
      promise: this.client.contactManager.getAllContactsFromServer(),
      event: 'getAllContactsFromServer',
      onFinished: async (value) => {
        const list = new Map() as Map<string, ContactModel>;
        const tmp = new Map<string, DataModel>();
        value.forEach((v: string) => {
          tmp.set(v, {
            id: v,
            type: 'user',
            remark: undefined,
          } as DataModel);
        });
        this._updateDataList({
          dataList: tmp,
          disableDispatch: true,
          isUpdateNotExisted: true,
        });
        await this._requestData({
          list: Array.from(tmp.keys()),
          type: 'user',
          requestHasData: true,
          isUpdateNotExisted: true,
        });
        const tmp2 = this._dataFileProvider.getUserList(Array.from(tmp.keys()));
        tmp2.forEach((v) => {
          list.set(v.id, {
            userId: v.id,
            userName: v.name,
            userAvatar: v.avatar,
            remark: v.remark,
          } as ContactModel);
        });
        this._contactList = list;

        params.onResult({
          isOk: true,
          value: Array.from(this._contactList.values()),
        });
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  addNewContact(params: {
    userId: string;
    reason?: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.contactManager.addContact(
        params.userId,
        params.reason
      ),
      event: 'addNewContact',
      onFinished: async () => {
        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({
          isOk: false,
          error: e,
        });
      },
    });
  }
  removeContact(params: {
    userId: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.contactManager.deleteContact(params.userId),
      event: 'removeContact',
      onFinished: async () => {
        const contact = this._contactList.get(params.userId);
        this._contactList.delete(params.userId);
        this.sendUIEvent(UIListenerType.Contact, 'onDeletedEvent', contact);
        params.onResult?.({
          isOk: true,
        });
      },
    });
  }
  setContactRemark(params: {
    userId: string;
    remark: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.contactManager.setContactRemark({
        userId: params.userId,
        remark: params.remark,
      }),
      event: 'setContactRemark',
      onFinished: () => {
        this._updateDataList({
          dataList: DataProfileProvider.toMap([
            {
              id: params.userId,
              remark: params.remark,
              type: 'user',
            } as DataModel,
          ]),
          dispatchHandler: () => {
            const contact = this._contactList.get(params.userId);
            if (contact) {
              contact.remark = params.remark;
              contact.userName = this._getNameFromCache(params.userId);
              contact.remark = this._getRemarkFromCache(params.userId);
              contact.userAvatar = this._getAvatarFromCache(params.userId);
              this.sendUIEvent(
                UIListenerType.Contact,
                'onUpdatedEvent',
                contact
              );
            }
            return false;
          },
        });

        params.onResult?.({ isOk: true });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  acceptInvitation(params: {
    userId: string;
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.contactManager.acceptInvitation(params.userId),
      event: 'acceptInvitation',
      onFinished: async () => {
        params.onResult({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }
  declineInvitation(params: {
    userId: string;
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.contactManager.declineInvitation(params.userId),
      event: 'declineInvitation',
      onFinished: async () => {
        params.onResult({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  setModelState(params: { tag: string; id: string; state: StateModel }): void {
    const list = this._modelState.get(params.tag);
    if (list) {
      list.set(params.id, params.state);
    } else {
      this._modelState.set(params.tag, new Map([[params.id, params.state]]));
    }
  }

  getModelState(params: { tag: string; id: string }): StateModel | undefined {
    const list = this._modelState.get(params.tag);
    return list?.get(params.id);
  }

  clearModelState(params: { tag: string }): void {
    this._modelState.delete(params.tag);
  }

  getJoinedGroups(params: { onResult: ResultCallback<GroupModel[]> }): void {
    this.tryCatch({
      promise: this.client.groupManager.getJoinedGroups(),
      event: 'getJoinedGroups',
      onFinished: async (groups) => {
        let list: GroupModel[] = [];
        for (const group of groups) {
          list.push(this.toUIGroup(group));
        }
        params.onResult({ isOk: true, value: list });
        return false;
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  getPageGroups(params: {
    pageSize: number;
    pageNum: number;
    onResult: ResultCallback<GroupModel[]>;
  }): void {
    this.tryCatch({
      promise: this.client.groupManager.fetchJoinedGroupsFromServer(
        params.pageSize,
        params.pageNum
      ),
      event: 'getPageGroups',
      onFinished: async (value) => {
        const list = new Map<string, DataModel>();
        value.forEach((v) => {
          list.set(v.groupId, {
            id: v.groupId,
            name: v.groupName,
            type: 'group',
          } as DataModel);
        });
        this._updateDataList({
          dataList: list,
          isUpdateNotExisted: true,
          disableDispatch: true,
        });
        await this._requestData({
          list: value.map((v) => v.groupId),
          type: 'group',
          requestHasData: true,
          isUpdateNotExisted: true,
        });
        value.forEach(async (v) => {
          const group = this.toUIGroup(v);
          this._groupList.set(v.groupId, group);
          this.sendUIEvent(UIListenerType.Group, 'onUpdatedEvent', group);
        });
        params.onResult({
          isOk: true,
          value: Array.from(value).map((v) => this.toUIGroup(v)),
        });
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  getGroupAllMembers(params: {
    groupId: string;
    isReset?: boolean;
    owner?: GroupParticipantModel;
    onResult: ResultCallback<GroupParticipantModel[]>;
  }): void {
    const { isReset = false, owner } = params;
    const memberList = this._groupMemberList.get(params.groupId);
    if (memberList && memberList.size > 1 && isReset === false) {
      params.onResult({
        isOk: true,
        value: Array.from(memberList.values()),
      });
      return;
    }
    let cursor = '';
    const pageSize = 200;
    this.tryCatch({
      promise: this.client.groupManager.fetchMemberListFromServer(
        params.groupId,
        pageSize,
        cursor
      ),
      event: 'getGroupAllMembers',
      onFinished: async (value) => {
        const memberList = new Map<string, GroupParticipantModel>();
        value.list?.forEach(async (v) => {
          memberList.set(v, { memberId: v });
        });

        cursor = value.cursor;
        if (
          cursor.length === 0 ||
          (value.list && value.list.length < pageSize) ||
          value.list === undefined
        ) {
        } else {
          for (;;) {
            const list =
              await this.client.groupManager.fetchMemberListFromServer(
                params.groupId,
                pageSize,
                cursor
              );
            list.list?.forEach((v) => {
              memberList.set(v, { memberId: v });
            });

            cursor = value.cursor;
            if (
              cursor.length === 0 ||
              (value.list && value.list.length < pageSize) ||
              value.list === undefined
            ) {
              break;
            }
          }
        }

        if (owner) {
          memberList.set(owner.memberId, owner);
        }

        await this._requestData({
          list: Array.from(memberList.keys()),
          type: 'user',
          requestHasData: true,
          isUpdateNotExisted: true,
        });
        memberList.forEach((v) => {
          v.memberAvatar = this._getAvatarFromCache(v.memberId);
          v.memberName = this._getNameFromCache(v.memberId);
        });

        this._groupMemberList.set(params.groupId, memberList);

        params.onResult({
          isOk: true,
          value: Array.from(memberList.values()),
        });
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  async getGroupOwner(params: {
    groupId: string;
  }): Promise<GroupParticipantModel | undefined> {
    const ret = await this.tryCatchSync({
      promise: this.client.groupManager.getGroupWithId(params.groupId),
      event: 'getGroupOwner',
    });
    if (ret) {
      let groupMember = this._groupMemberList.get(params.groupId);
      if (groupMember) {
        const member = groupMember.get(ret.owner);
        if (member && member.memberName && member.memberAvatar) {
          return member;
        }
        await this._requestData({
          list: [ret.owner],
          type: 'user',
          requestHasData: true,
        });
        groupMember.set(ret.owner, {
          memberId: ret.owner,
          ...member,
          memberAvatar: this._getAvatarFromCache(ret.owner),
          memberName: this._getNameFromCache(ret.owner),
        } as GroupParticipantModel);
      } else {
        groupMember = new Map([
          [ret.owner, { memberId: ret.owner } as GroupParticipantModel],
        ]);
        await this._requestData({
          list: [ret.owner],
          type: 'user',
          requestHasData: true,
        });
        groupMember.set(ret.owner, {
          memberId: ret.owner,
          memberAvatar: this._getAvatarFromCache(ret.owner),
          memberName: this._getNameFromCache(ret.owner),
        } as GroupParticipantModel);
        this._groupMemberList.set(params.groupId, groupMember);
      }

      return this._groupMemberList.get(params.groupId)?.get(ret.owner);
    }
    return undefined;
  }

  getGroupMember(params: {
    groupId: string;
    userId: string;
  }): GroupParticipantModel | undefined {
    const memberList = this._groupMemberList.get(params.groupId);
    if (memberList) {
      return memberList.get(params.userId);
    }
    return undefined;
  }

  fetchJoinedGroupCount(params: { onResult: ResultCallback<number> }): void {
    this.tryCatch({
      promise: this.client.groupManager.fetchJoinedGroupCount(),
      event: 'fetchJoinedGroupCount',
      onFinished: async (value) => {
        params.onResult({ isOk: true, value: value });
        return false;
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  getGroupInfoFromServer(params: {
    groupId: string;
    onResult: ResultCallback<GroupModel>;
  }): void {
    this.tryCatch({
      promise: this.client.groupManager.fetchGroupInfoFromServer(
        params.groupId
      ),
      event: 'getGroupInfoFromServer',
      onFinished: async (value) => {
        if (value) {
          this._updateDataList({
            dataList: DataProfileProvider.toMap([
              {
                id: value.groupId,
                name: value.groupName,
                type: 'group',
              } as DataModel,
            ]),
            dispatchHandler: () => {
              return false;
            },
          });
          await this._requestData({
            list: [value.groupId],
            type: 'group',
            requestHasData: true,
          });

          const localGroup = this._groupList.get(params.groupId);
          const group = this.toUIGroup(value);
          if (localGroup) {
            this._groupList.set(group.groupId, mergeObjects(group, localGroup));
          } else {
            this._groupList.set(group.groupId, group);
          }

          this.sendUIEvent(UIListenerType.Group, 'onUpdatedEvent', group);

          params.onResult({
            isOk: true,
            value: group,
          });
        } else {
          params.onResult({
            isOk: false,
          });
        }
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  async getGroupInfoSync(params: {
    groupId: string;
  }): Promise<ResultValue<GroupModel | undefined>> {
    const ret = await this.tryCatchSync({
      promise: this.client.groupManager.getGroupWithId(params.groupId),
      event: 'getGroupInfoSync',
    });
    // !!! fix bug: if group is not exist, return error object.
    if (ret && ret.groupName.length > 0) {
      const group = this.toUIGroup(ret);
      return {
        isOk: true,
        value: group,
      };
    } else {
      const ret2 = await this.tryCatchSync({
        promise: this.client.groupManager.fetchGroupInfoFromServer(
          params.groupId
        ),
        event: 'getGroupInfoSync',
      });
      if (ret2) {
        this._updateDataList({
          dataList: DataProfileProvider.toMap([
            {
              id: ret2.groupId,
              name: ret2.groupName,
              type: 'group',
            } as DataModel,
          ]),
          dispatchHandler: () => {
            return false;
          },
        });
        await this._requestData({
          list: [ret2.groupId],
          type: 'group',
          requestHasData: true,
        });

        const localGroup = this._groupList.get(params.groupId);
        const group = this.toUIGroup(ret2);
        if (localGroup) {
          this._groupList.set(group.groupId, mergeObjects(group, localGroup));
        } else {
          this._groupList.set(group.groupId, group);
        }

        this.sendUIEvent(UIListenerType.Group, 'onUpdatedEvent', group);
        return {
          isOk: true,
          value: group,
        };
      }
    }
    return {
      isOk: false,
    };
  }

  getGroupInfo(params: {
    groupId: string;
    onResult: ResultCallback<GroupModel | undefined>;
  }): void {
    this.tryCatch({
      promise: this.getGroupInfoSync(params),
      event: 'getGroupInfo',
      onFinished: (value) => {
        params.onResult(value);
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  createGroup(params: {
    groupName: string;
    groupDescription?: string;
    inviteMembers: string[];
    onResult?: ResultCallback<GroupModel>;
  }): void {
    this.tryCatch({
      promise: this.client.groupManager.createGroup(
        new ChatGroupOptions({
          style: ChatGroupStyle.PrivateMemberCanInvite,
          maxCount: 1000,
          inviteNeedConfirm: false,
        }),
        params.groupName,
        params.groupDescription,
        params.inviteMembers
      ),
      event: 'createGroup',
      onFinished: async (value) => {
        this._updateDataList({
          dataList: DataProfileProvider.toMap([
            {
              id: value.groupId,
              name: value.groupName,
              type: 'group',
            } as DataModel,
          ]),
          isUpdateNotExisted: true,
          dispatchHandler: () => {
            const group = this.toUIGroup(value);
            this._groupList.set(group.groupId, group);
            this.sendUIEvent(UIListenerType.Group, 'onAddedEvent', group);
            return false;
          },
        });

        params.onResult?.({
          isOk: true,
          value: value,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }

  quitGroup(params: {
    groupId: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.groupManager.leaveGroup(params.groupId),
      event: 'quitGroup',
      onFinished: async () => {
        const group = this._groupList.get(params.groupId);
        if (group) {
          this._groupList.delete(params.groupId);
          this.sendUIEvent(UIListenerType.Group, 'onDeletedEvent', group);
        }

        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  destroyGroup(params: {
    groupId: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.groupManager.destroyGroup(params.groupId),
      event: 'destroyGroup',
      onFinished: async () => {
        const group = this._groupList.get(params.groupId);
        if (group) {
          this._groupList.delete(params.groupId);
          this.sendUIEvent(UIListenerType.Group, 'onDeletedEvent', group);
        }

        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }

  setGroupName(params: {
    groupId: string;
    groupNewName: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.groupManager.changeGroupName(
        params.groupId,
        params.groupNewName
      ),
      event: 'setGroupName',
      onFinished: async () => {
        const group = this._groupList.get(params.groupId);
        if (group) {
          group.groupName = params.groupNewName;
          this._updateDataList({
            dataList: DataProfileProvider.toMap([
              {
                id: group.groupId,
                name: group.groupName,
                type: 'group',
              } as DataModel,
            ]),
            dispatchHandler: () => {
              this.sendUIEvent(UIListenerType.Group, 'onUpdatedEvent', group);
              return false;
            },
          });
        }
        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  setGroupDescription(params: {
    groupId: string;
    groupDescription: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.groupManager.changeGroupDescription(
        params.groupId,
        params.groupDescription
      ),
      event: 'setGroupDescription',
      onFinished: async () => {
        const group = this._groupList.get(params.groupId);
        if (group) {
          group.description = params.groupDescription;
          this.sendUIEvent(UIListenerType.Group, 'onUpdatedEvent', group);
        }
        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  setGroupMyRemark(params: {
    groupId: string;
    memberId: string;
    groupMyRemark: string;
    ext?: Record<string, string>;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.groupManager.setMemberAttribute(
        params.groupId,
        params.memberId,
        { [gGroupMemberMyRemark]: params.groupMyRemark }
      ),
      event: 'setGroupMyRemark',
      onFinished: async () => {
        const group = this._groupList.get(params.groupId);
        if (group) {
          group.myRemark = params.groupMyRemark;
          this.sendUIEvent(UIListenerType.Group, 'onUpdatedEvent', group);
        }
        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  getGroupMyRemark(params: {
    groupId: string;
    memberId: string;
    onResult: ResultCallback<string | undefined>;
  }): void {
    this.tryCatch({
      promise: this.client.groupManager.fetchMemberAttributes(
        params.groupId,
        params.memberId
      ),
      event: 'getGroupMyRemark',
      onFinished: (result) => {
        const group = this._groupList.get(params.groupId);
        if (group) {
          group.myRemark = result?.[gGroupMemberMyRemark];
        }
        params.onResult({ isOk: true, value: result?.[gGroupMemberMyRemark] });
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  addGroupMembers(params: {
    groupId: string;
    members: GroupParticipantModel[];
    welcomeMessage?: string;
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.groupManager.addMembers(
        params.groupId,
        params.members.map((item) => item.memberId),
        params.welcomeMessage
      ),
      event: 'addGroupMembers',
      onFinished: async () => {
        const groupMembers = this._groupMemberList.get(params.groupId);
        if (groupMembers) {
          await this._requestData({
            list: params.members.map((item) => item.memberId),
            type: 'user',
            requestHasData: true,
            isUpdateNotExisted: true,
          });

          for (const member of params.members) {
            groupMembers.set(member.memberId, {
              ...member,
              memberName: this._getNameFromCache(member.memberId),
              memberAvatar: this._getAvatarFromCache(member.memberId),
            });
          }

          for (const member of params.members) {
            this.sendUIEvent(
              UIListenerType.GroupParticipant,
              'onAddedEvent',
              member
            );
          }

          params.onResult({
            isOk: true,
          });
        } else {
          params.onResult({
            isOk: false,
          });
        }
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  removeGroupMembers(params: {
    groupId: string;
    members: string[];
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.groupManager.removeMembers(
        params.groupId,
        params.members
      ),
      event: 'removeGroupMembers',
      onFinished: async () => {
        for (const memberId of params.members) {
          const groupMember = this._groupMemberList.get(params.groupId);
          if (groupMember) {
            const member = groupMember.get(memberId);
            if (member) {
              groupMember.delete(memberId);
              this.sendUIEvent(
                UIListenerType.GroupParticipant,
                'onDeletedEvent',
                member
              );
            }
          }
        }

        params.onResult({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  changeGroupOwner(params: {
    groupId: string;
    newOwnerId: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.groupManager.changeOwner(
        params.groupId,
        params.newOwnerId
      ),
      event: 'changeGroupOwner',
      onFinished: () => {
        const group = this._groupList.get(params.groupId);
        if (group) {
          group.owner = params.newOwnerId;
          this.sendUIEvent(UIListenerType.Group, 'onUpdatedEvent', group);
        }
        params.onResult?.({ isOk: true });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }

  async getUserInfoSync(params: {
    userId: string;
  }): Promise<ResultValue<UserData | undefined>> {
    const ret = await this.tryCatchSync({
      promise: this.client.userManager.fetchUserInfoById([params.userId]),
      event: 'getUserInfoSync',
    });
    const list = Array.from(ret.values()).map((v) => this.toUserData(v));
    if (list.length > 0) {
      const first = list[0]!;
      this.setUser({ users: [first] });
      return {
        isOk: true,
        value: first,
      };
    }
    return {
      isOk: true,
    };
  }

  getUserInfo(params: {
    userId: string;
    onResult?: ResultCallback<UserData | undefined>;
  }): void {
    this.tryCatch({
      promise: this.getUserInfoSync(params),
      event: 'getUserInfo',
      onFinished: (value) => {
        params.onResult?.(value);
      },
      onError: (error) => {
        params.onResult?.({ isOk: false, error });
      },
    });
  }

  getUsersInfo(params: {
    userIds: string[];
    onResult: ResultCallback<UserData[]>;
  }): void {
    this.tryCatch({
      promise: this.client.userManager.fetchUserInfoById(params.userIds),
      event: 'getUsersInfo',
      onFinished: (value) => {
        if (value) {
          const list = Array.from(value.values()).map((v) => {
            return this.toUserData(v);
          });
          this.setUser({ users: list });
          params.onResult({
            isOk: true,
            value: list,
          });
        } else {
          params.onResult({
            isOk: true,
            value: [],
          });
        }
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  updateSelfInfo(params: {
    self: UserData;
    onResult: ResultCallback<void>;
  }): void {
    const { self } = params;
    const p = {
      userId: self.userId,
      nickName: self.userName,
      avatarUrl: self.avatarURL,
    };
    this.tryCatch({
      promise: this.client.userManager.updateOwnUserInfo(p),
      event: 'updateSelfInfo',
      onFinished: () => {
        this.setUser({ users: [{ ...this.user, ...self }] });
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  getMessage(params: { messageId: string }): Promise<ChatMessage | undefined> {
    return this.tryCatchSync({
      promise: this.client.chatManager.getMessage(params.messageId),
      event: 'getMessage',
    });
  }

  resendMessage(params: {
    message: ChatMessage;
    callback: ChatMessageStatusCallback;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.resendMessage(
        params.message,
        params.callback
      ),
      event: 'resendMessage',
    });
  }

  recallMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.recallMessage(params.message.msgId),
      event: 'recallMessage',
      onFinished: async () => {
        params.onResult({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }

  insertMessage(params: {
    message: ChatMessage;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.insertMessage(params.message),
      event: 'insertMessage',
      onFinished: async () => {
        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  updateMessage(params: {
    message: ChatMessage;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.updateMessage(params.message),
      event: 'updateMessage',
      onFinished: async () => {
        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }

  removeMessage(params: {
    message: ChatMessage;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.deleteMessage(
        params.message.conversationId,
        params.message.chatType as number as ChatConversationType,
        params.message.msgId,
        params.message.isChatThread
      ),
      event: 'removeMessage',
      onFinished: async () => {
        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }

  removeMessages(params: { message: ChatMessage[] }): Promise<void[]> {
    return this.tryCatchSyncList({
      promises: params.message.map((item) =>
        this.client.chatManager.deleteMessage(
          item.conversationId,
          item.chatType as number as ChatConversationType,
          item.msgId,
          item.isChatThread
        )
      ),
      event: 'removeMessages',
    });
  }

  editMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<ChatMessage>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.modifyMessageBody(
        params.message.msgId,
        params.message.body
      ),
      event: 'editMessage',
      onFinished: async (msg) => {
        params.onResult({
          isOk: true,
          value: msg,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }

  translateMessage(params: {
    message: ChatMessage;
    languages: string[];
    onResult: ResultCallback<ChatMessage>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.translateMessage(
        params.message,
        params.languages
      ),
      event: 'translateMessage',
      onFinished: async (msg) => {
        params.onResult({
          isOk: true,
          value: msg,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }

  getNewRequestList(params: {
    convId: string;
    convType: ChatConversationType;
    timestamp?: number;
    pageSize?: number;
    direction?: ChatSearchDirection;
    onResult: ResultCallback<ChatMessage[]>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.getMessagesWithMsgType(
        params.convId,
        params.convType,
        ChatMessageType.CUSTOM,
        params.direction,
        params.timestamp,
        params.pageSize
      ),
      event: 'getNewRequestList',
      onFinished: async (value) => {
        params.onResult({
          isOk: true,
          value: value,
        });
        return false;
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  sendMessage(params: {
    message: ChatMessage;
    callback?: ChatMessageStatusCallback;
  }): void {
    const { message, callback } = params;
    this.setUserInfoToMessage({ msg: message, user: this._user });
    this.tryCatch({
      promise: this.client.chatManager.sendMessage(message, callback),
      event: 'sendMessage',
    });
  }

  downloadMessageAttachment(params: {
    message: ChatMessage;
    callback?: ChatMessageStatusCallback;
  }): void {
    this.tryCatchSync({
      promise: this.client.chatManager.downloadAttachment(
        params.message,
        params.callback
      ),
      event: 'downloadMessageAttachment',
    });
  }
  downloadMessageAttachmentForThread(params: {
    message: ChatMessage;
    callback?: ChatMessageStatusCallback;
  }): void {
    this.tryCatchSync({
      promise: this.client.chatManager.downloadAttachmentInCombine(
        params.message,
        params.callback
      ),
      event: 'downloadMessageAttachmentForThread',
    });
  }
  getHistoryMessage(params: {
    convId: string;
    convType: ChatConversationType;
    startMsgId: string;
    direction: ChatSearchDirection;
    loadCount: number;
    isChatThread?: boolean;
  }): Promise<ChatMessage[]> {
    const { convId, convType, startMsgId, direction, loadCount, isChatThread } =
      params;
    return this.tryCatchSync({
      promise: this.client.chatManager.getMessages(
        convId,
        convType,
        startMsgId,
        direction,
        loadCount,
        isChatThread
      ),
      event: 'getHistoryMessage',
    });
  }
  fetchHistoryMessages(params: {
    convId: string;
    convType: ChatConversationType;
    startMsgId: string;
    direction: ChatSearchDirection;
    pageSize: number;
  }): Promise<ChatCursorResult<ChatMessage>> {
    const { convId, convType, startMsgId, direction, pageSize } = params;
    return this.tryCatchSync({
      promise: this.client.chatManager.fetchHistoryMessages(convId, convType, {
        startMsgId,
        direction,
        pageSize,
      }),
      event: 'fetchHistoryMessages',
    });
  }

  userInfoFromMessage(msg?: ChatMessage): UserData | undefined {
    return userInfoFromMessage(msg);
  }

  setUserInfoToMessage(params: { msg: ChatMessage; user?: UserData }): void {
    return setUserInfoToMessage(params);
  }

  setMessageRead(params: {
    convId: string;
    convType: ChatConversationType;
    msgId: string;
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.markMessageAsRead(
        params.convId,
        params.convType,
        params.msgId
      ),
      event: 'setMessageRead',
      onFinished: () => {
        params.onResult({ isOk: true });
        return false;
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  sendMessageReadAck(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.sendMessageReadAck(params.message),
      event: 'sendMessageReadAck',
      onFinished: async () => {
        params.onResult({
          isOk: true,
        });
        return false;
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  reportMessage(params: {
    messageId: string;
    tag: string;
    reason: string;
    onResult: ResultCallback<void>;
  }): void {
    const { messageId, tag, reason } = params;
    this.tryCatch({
      promise: this.client.chatManager.reportMessage(messageId, tag, reason),
      event: 'reportMessage',
      onFinished: async () => {
        params.onResult?.({ isOk: true });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }

  fetchCombineMessageDetail(params: {
    msg: ChatMessage;
  }): Promise<ChatMessage[]> {
    return this.tryCatchSync({
      promise: this.client.chatManager.fetchCombineMessageDetail(params.msg),
      event: 'fetchCombineMessageDetail',
    });
  }

  getMessagesByKeyword(params: {
    keyword: string;
    convId: string;
    convType: ChatConversationType;
    direction?: ChatSearchDirection;
    timestamp?: number;
    maxCount?: number;
    onResult: ResultCallback<ChatMessage[]>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.getMessagesWithKeyword(
        params.convId,
        params.convType,
        params.keyword,
        params.direction,
        params.timestamp,
        params.maxCount ?? 200
      ),
      event: 'getMessagesByKeyword',
      onFinished: (value) => {
        params.onResult({ isOk: true, value: value });
        return false;
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  pinMessage(params: { msgId: string; onResult?: ResultCallback<void> }): void {
    this.tryCatch({
      promise: this.client.chatManager.pinMessage(params.msgId),
      event: 'pinMessage',
      onFinished: () => {
        params.onResult?.({ isOk: true });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  unPinMessage(params: {
    msgId: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.unpinMessage(params.msgId),
      event: 'unPinMessage',
      onFinished: () => {
        params.onResult?.({ isOk: true });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  fetchPinnedMessages(params: {
    convId: string;
    convType: ChatConversationType;
    forceRequest?: boolean;
    onResult: ResultCallback<ChatMessage[]>;
  }): void {
    const { forceRequest = false } = params;
    if (this._pinMessageList.has(params.convId) && forceRequest === false) {
      this.getPinnedMessages(params);
      return;
    }
    this.tryCatch({
      promise: this.client.chatManager.fetchPinnedMessages(
        params.convId,
        params.convType
      ),
      event: 'fetchPinnedMessages',
      onFinished: (value) => {
        this._pinMessageList.set(params.convId, true);
        params.onResult({ isOk: true, value: value });
        return false;
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }
  getPinnedMessages(params: {
    convId: string;
    convType: ChatConversationType;
    onResult: ResultCallback<ChatMessage[]>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.getPinnedMessages(
        params.convId,
        params.convType
      ),
      event: 'getPinnedMessages',
      onFinished: (value) => {
        params.onResult({ isOk: true, value: value });
        return false;
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  addReactionToMessage(params: {
    msgId: string;
    reaction: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.addReaction(
        params.reaction,
        params.msgId
      ),
      event: 'addReactionToMessage',
      onFinished: () => {
        params.onResult?.({ isOk: true });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }

  removeReactionFromMessage(params: {
    msgId: string;
    reaction: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.removeReaction(
        params.reaction,
        params.msgId
      ),
      event: 'removeReactionFromMessage',
      onFinished: () => {
        params.onResult?.({ isOk: true });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }

  getMessageReactionsList(params: {
    msgId: string;
    onResult: ResultCallback<ChatMessageReaction[]>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.getReactionList(params.msgId),
      event: 'getMessageReactionsList',
      onFinished: (value) => {
        params.onResult({
          isOk: true,
          value: value,
        });
        return false;
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  getMessageReactionsDetail(params: {
    msgId: string;
    reaction: string;
    cursor?: string;
    pageSize?: number;
    onResult: ResultCallback<ChatCursorResult<ChatMessageReaction>>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.fetchReactionDetail(
        params.msgId,
        params.reaction,
        params.cursor,
        params.pageSize
      ),
      event: 'getMessageReactionsDetail',
      onFinished: (value) => {
        params.onResult({
          isOk: true,
          value: value,
        });
        return false;
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  subPresence(params: {
    userIds: string[];
    onResult?: ResultCallback<ChatPresence[]>;
  }): void {
    this.tryCatch({
      promise: this.client.presenceManager.subscribe(
        params.userIds,
        60 * 60 * 24 * 3
      ),
      event: 'subPresence',
      onFinished: (res) => {
        params.onResult?.({
          isOk: true,
          value: res,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  unSubPresence(params: {
    userIds: string[];
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.presenceManager.unsubscribe(params.userIds),
      event: 'unSubPresence',
      onFinished: () => {
        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  publishPresence(params: {
    status: string;
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.presenceManager.publishPresence(
        PresenceUtil.convertToProtocol(params.status)
      ),
      event: 'publishPresence',
      onFinished: () => {
        const userId = this.userId;
        const status = params.status;
        if (userId) {
          this.listeners.forEach((v) => {
            v.onPresenceStatusChanged?.([
              new ChatPresence({
                publisher: userId,
                statusDescription: status,
                lastTime: getCurTs('s').toString(),
                expiryTime: (60 * 60 * 24 * 3).toString(),
                statusDetails: new Map(),
              }),
            ]);
          });
        }
        params.onResult?.({ isOk: true });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  fetchPresence(params: {
    userIds: string[];
    onResult: ResultCallback<Map<string, string>>;
  }): void {
    this.tryCatch({
      promise: this.client.presenceManager.fetchPresenceStatus(params.userIds),
      event: 'fetchPresence',
      onFinished: (result) => {
        const map = new Map<string, string>();
        for (const item of result) {
          map.set(item.publisher, PresenceUtil.convertFromProtocol(item));
        }
        params.onResult?.({
          isOk: true,
          value: map,
        });
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  createThread(params: {
    name: string;
    msgId: string;
    parentId: string;
    onResult: ResultCallback<ChatMessageThread>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.createChatThread(
        params.name,
        params.msgId,
        params.parentId
      ),
      event: 'createThread',
      onFinished: (value) => {
        params.onResult({
          isOk: true,
          value: value,
        });
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }
  joinThread(params: {
    threadId: string;
    onResult?: ResultCallback<ChatMessageThread>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.joinChatThread(params.threadId),
      event: 'joinThread',
      onFinished: (value) => {
        params.onResult?.({
          isOk: true,
          value: value,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  leaveThread(params: {
    threadId: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.leaveChatThread(params.threadId),
      event: 'leaveThread',
      onFinished: () => {
        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  destroyThread(params: {
    threadId: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.destroyChatThread(params.threadId),
      event: 'destroyThread',
      onFinished: () => {
        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  updateThreadName(params: {
    threadId: string;
    name: string;
    onResult?: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.updateChatThreadName(
        params.threadId,
        params.name
      ),
      event: 'updateThreadName',
      onFinished: () => {
        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  removeMemberFromThread(params: {
    threadId: string;
    userId: string;
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.removeMemberWithChatThread(
        params.threadId,
        params.userId
      ),
      event: 'removeMemberFromThread',
      onFinished: () => {
        params.onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  fetchMembersFromThread(params: {
    threadId: string;
    cursor: string;
    pageSize: number;
    onResult: ResultCallback<ChatCursorResult<string>>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.fetchMembersWithChatThreadFromServer(
        params.threadId,
        params.cursor,
        params.pageSize
      ),
      event: 'fetchMembersFromThread',
      onFinished: (value) => {
        params.onResult({
          isOk: true,
          value: value,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  fetchThreadsFromGroup(params: {
    parentId: string;
    cursor: string;
    pageSize: number;
    onResult: ResultCallback<ChatCursorResult<ChatMessageThread>>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.fetchChatThreadWithParentFromServer(
        params.parentId,
        params.cursor,
        params.pageSize
      ),
      event: 'fetchThreadsFromGroup',
      onFinished: (value) => {
        params.onResult({
          isOk: true,
          value: value,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  fetchThreadsLastMessage(params: {
    threadId: string[];
    onResult: ResultCallback<Map<string, ChatMessage>>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.fetchLastMessageWithChatThread(
        params.threadId
      ),
      event: 'fetchThreadsLastMessage',
      onFinished: (value) => {
        params.onResult({
          isOk: true,
          value: value,
        });
      },
      onError: (e) => {
        params.onResult?.({ isOk: false, error: e });
      },
    });
  }
  async fetchThreadsLastMessageSync(params: {
    threadId: string[];
  }): Promise<ResultValue<Map<string, ChatMessage>>> {
    const ret = await this.tryCatchSync({
      promise: this.client.chatManager.fetchLastMessageWithChatThread(
        params.threadId
      ),
      event: 'fetchThreadsLastMessageSync',
    });
    return {
      isOk: true,
      value: ret,
    };
  }
  fetchThread(params: {
    threadId: string;
    onResult: ResultCallback<ChatMessageThread>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.fetchChatThreadFromServer(
        params.threadId
      ),
      event: 'fetchThread',
      onFinished: (value) => {
        params.onResult({
          isOk: true,
          value: value,
        });
      },
      onError: (e) => {
        params.onResult({
          isOk: false,
          error: e,
        });
      },
    });
  }
  getThread(params: {
    threadId: string;
    onResult: ResultCallback<ChatMessageThread>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.getMessageThread(params.threadId),
      event: 'getThread',
      onFinished: (value) => {
        params.onResult({
          isOk: true,
          value: value,
        });
      },
      onError: (e) => {
        params.onResult({
          isOk: false,
          error: e,
        });
      },
    });
  }

  async getAllBlockList(params: {
    isForce?: boolean;
    onResult: ResultCallback<BlockModel[]>;
  }): Promise<void> {
    try {
      let ret: string[];
      if (this._blockList.size === 0 || params.isForce === true) {
        ret = await this.client.contactManager.getBlockListFromServer();
      } else {
        ret = await this.client.contactManager.getBlockListFromDB();
      }
      if (ret.length > 0) {
        await this._requestData({
          list: ret,
          type: 'user',
          requestHasData: true,
          isUpdateNotExisted: true,
        });
        this._blockList.clear();
        for (const item of ret) {
          this._blockList.set(item, {
            userId: item,
            userAvatar: this._getAvatarFromCache(item),
            userName: this._getNameFromCache(item),
            remark: this._getRemarkFromCache(item),
          } as BlockModel);
        }
      } else {
        this._blockList.clear();
      }
      params.onResult({
        isOk: true,
        value: Array.from(this._blockList.values()),
      });
    } catch (e) {
      params.onResult({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.ui_error,
          desc: this._fromChatError(e),
        }),
      });
    }
  }
  isBlockUser(params: { userId: string }): boolean {
    return this._blockList.has(params.userId);
  }
  addUserToBlock(params: {
    userId: string;
    onResult?: ResultCallback<void>;
  }): void {
    const { userId, onResult } = params;
    this.tryCatch({
      promise: this.client.contactManager.addUserToBlockList(userId),
      event: 'addUserToBlock',
      onFinished: () => {
        const user = this.getDataModel(userId);
        if (user) {
          const item = {
            userId: userId,
            userAvatar: user.avatar,
            userName: user.name,
            remark: user.remark,
          } as BlockModel;
          this._blockList.set(userId, item);
          this.sendUIEvent(UIListenerType.Block, 'onAddedEvent', item);
        } else {
          this._blockList.set(userId, {
            userId: userId,
          } as BlockModel);
          this.sendUIEvent(UIListenerType.Block, 'onAddedEvent', {
            userId: userId,
          } as BlockModel);
        }
        onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        onResult?.({
          isOk: false,
          error: e,
        });
      },
    });
  }
  removeUserFromBlock(params: {
    userId: string;
    onResult?: ResultCallback<void>;
  }): void {
    const { userId, onResult } = params;
    this.tryCatch({
      promise: this.client.contactManager.removeUserFromBlockList(userId),
      event: 'removeUserFromBlock',
      onFinished: () => {
        this._blockList.delete(userId);
        this.sendUIEvent(UIListenerType.Block, 'onDeletedEvent', {
          userId: userId,
        } as BlockModel);
        onResult?.({
          isOk: true,
        });
      },
      onError: (e) => {
        onResult?.({
          isOk: false,
          error: e,
        });
      },
    });
  }
}

let gIMService: ChatService;

export function getChatServiceImpl(): ChatService {
  if (gIMService === undefined) {
    gIMService = new ChatServiceImpl();
  }
  return gIMService;
}
