import {
  ChatClient,
  ChatContact,
  ChatConversation,
  ChatConversationType,
  ChatGroup,
  ChatGroupOptions,
  ChatGroupStyle,
  ChatMessage,
  ChatMessageStatusCallback,
  ChatMessageType,
  ChatOptions,
  ChatPresence,
  ChatPushRemindType,
  ChatSearchDirection,
  ChatSilentModeParamType,
  ChatUserInfo,
} from 'react-native-chat-sdk';

import { ConversationStorage } from '../db/storage';
import { ErrorCode, UIKitError } from '../error';
import { Services } from '../services';
import { asyncTask, getCurTs, mergeObjects } from '../utils';
import { ChatServiceListenerImpl } from './chat.listener';
import { gGroupMemberMyRemark } from './const';
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
  UserData,
  UserFrom,
} from './types';
import {
  ContactModel,
  ConversationModel,
  GroupModel,
  GroupParticipantModel,
  StateModel,
  UIListener,
  UIListenerType,
} from './types.ui';
import { setUserInfoToMessage, userInfoFromMessage } from './utils';

export class ChatServiceImpl
  extends ChatServiceListenerImpl
  implements ChatService, ConversationServices
{
  _user?: UserData;
  _dataList: Map<string, DataModel>;
  _userList: Map<string, UserData>;
  _convStorage?: ConversationStorage;
  _convList: Map<string, ConversationModel>;
  _contactList: Map<string, ContactModel>;
  _groupList: Map<string, GroupModel>;
  _groupMemberList: Map<string, Map<string, GroupParticipantModel>>;
  _request: RequestList;
  _messageManager: MessageCacheManager;
  _modelState: Map<string, Map<string, StateModel>>;
  _currentConversation?: ConversationModel;
  _silentModeList: Map<string, { convId: string; doNotDisturb?: boolean }>;
  _convDataRequestCallback?: (params: {
    ids: Map<DataModelType, string[]>;
    result: (
      data?: Map<DataModelType, DataModel[]> | undefined,
      error?: UIKitError
    ) => void | Promise<void>;
  }) => void;
  _contactDataRequestCallback:
    | ((params: {
        ids: string[];
        result: (data?: DataModel[], error?: UIKitError) => void;
      }) => void | Promise<void>)
    | undefined;
  _groupDataRequestCallback:
    | ((params: {
        ids: string[];
        result: (data?: DataModel[], error?: UIKitError) => void;
      }) => void | Promise<void>)
    | undefined;
  _groupParticipantDataRequestCallback:
    | ((params: {
        groupId: string;
        ids: string[];
        result: (data?: DataModel[], error?: UIKitError) => void;
      }) => void | Promise<void>)
    | undefined;
  _basicDataRequestCallback?:
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
      }) => Promise<void>);
  _groupNameOnCreateGroupCallback?: (params: {
    selected: ContactModel[];
  }) => string;

  constructor() {
    console.log('dev:chat:constructor:');
    super();
    this._dataList = new Map();
    this._userList = new Map();
    this._convList = new Map();
    this._contactList = new Map();
    this._groupList = new Map();
    this._groupMemberList = new Map();
    this._modelState = new Map();
    this._silentModeList = new Map();
    this._request = new RequestListImpl(this);
    this._messageManager = new MessageCacheManagerImpl(this);
  }

  // !!! warning: no need
  // destructor() {
  // }

  reset(): void {
    console.log('dev:chat:reset:');
    // this.clearListener(); // !!! warn: no clear.
    this._dataList.clear();
    this._userList.clear();
    this._convList.clear();
    this._contactList.clear();
    this._groupList.clear();
    this._groupMemberList.clear();
    this._modelState.clear();
    this._silentModeList.clear();
  }

  async init(params: {
    options: ChatOptionsType;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    console.log('dev:chat:init');
    const { options } = params;
    const { appKey } = options;

    try {
      await this.client.init(new ChatOptions({ ...options }));
      console.log('dev:chat:opt:', this.client.options);

      this._convStorage = new ConversationStorage({ appKey: appKey });
      // !!! hot-reload no pass, into catch codes
      // this._request = new RequestListImpl(this);
      // this._messageManager = new MessageCacheManagerImpl(this);
      this._initListener();
      this._request.init();
      this._messageManager.init();

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
      console.warn('createUserDir:', e);
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
      console.log('dev:chat:login:', params);
      this.reset();
      const version = require('react-native-chat-sdk/src/version');
      const list = version.default.split('.');
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

      console.log('dev:login:finish:1', params);

      result?.({ isOk: true });
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
      console.log('dev:login:finish:2', params, error);
      result?.({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.login_error,
          desc: this._fromChatError(error),
        }),
      });
    }
  }
  async logout(params: {
    unbindDeviceToken?: boolean;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    try {
      console.log('dev:chat:logout:');
      await this.client.logout(params.unbindDeviceToken);
      params.result?.({ isOk: true });
      this._user = undefined;
      this.reset();
    } catch (error) {
      params.result?.({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.logout_error,
          desc: this._fromChatError(error),
        }),
      });
    }
  }
  async autoLogin(params: {
    userId: string;
    userToken: string;
    userName?: string;
    userAvatarURL?: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    if (this.client.options?.autoLogin !== true) {
      params.result?.({ isOk: false });
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
            userName: params.userId,
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
        } else {
          params.result?.({ isOk: false });
        }
      },
    });
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
        const _e = new UIKitError({
          code: ErrorCode.chat_uikit,
          tag: event,
          desc: this._fromChatError(e),
        });
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
    return this._dataList.get(id)?.avatar;
  }

  _getNameFromCache(id: string): string | undefined {
    const data = this._dataList.get(id);
    if (data) {
      return data.remark ?? data.name;
    }
    return undefined;
  }

  _getDoNotDisturbFromCache(convId: string) {
    return this._silentModeList.get(convId)?.doNotDisturb;
  }

  async toUIConversation(conv: ChatConversation): Promise<ConversationModel> {
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
      convName: this._getNameFromCache(conv.convId),
      convAvatar: this._getAvatarFromCache(conv.convId),
    } as ConversationModel;
  }

  toUIContact(contact: ChatContact): ContactModel {
    const others = this._contactList.get(contact.userId);
    return {
      ...others,
      userId: contact.userId,
      remark: contact.remark,
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
    };
  }

  setContactOnRequestData<DataT extends DataModel = DataModel>(
    callback?: (params: {
      ids: string[];
      result: (data?: DataT[], error?: UIKitError) => void;
    }) => void
  ): void {
    this._contactDataRequestCallback = callback;
  }

  setGroupOnRequestData<DataT extends DataModel = DataModel>(
    callback?: (params: {
      ids: string[];
      result: (data?: DataT[], error?: UIKitError) => void;
    }) => void
  ): void {
    this._groupDataRequestCallback = callback;
  }

  setGroupParticipantOnRequestData<DataT extends DataModel = DataModel>(
    callback?: (params: {
      groupId: string;
      ids: string[];
      result: (data?: DataT[], error?: UIKitError) => void;
    }) => void | Promise<void>
  ): void {
    this._groupParticipantDataRequestCallback = callback;
  }

  updateGroupParticipantOnRequestData(params: {
    groupId: string;
    data: Map<DataModelType, DataModel[]>;
  }): void {
    const { groupId, data } = params;
    const list = this._groupMemberList.get(groupId);
    if (list) {
      data.forEach((values: DataModel[]) => {
        values.map((value) => {
          const conv = list.get(value.id);
          if (conv) {
            conv.memberName = value.name;
            conv.memberAvatar = value.avatar;
          }
        });
      });
      this.sendUIEvent(UIListenerType.Group, 'onRequestReloadEvent', groupId);
    }
  }

  setOnRequestMultiData<DataT extends DataModel = DataModel>(
    callback?: (params: {
      ids: Map<DataModelType, string[]>;
      result: (data?: Map<DataModelType, DataT[]>, error?: UIKitError) => void;
    }) => void
  ): void {
    this._convDataRequestCallback = callback;
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
  ): void {
    this._basicDataRequestCallback = callback;
  }

  updateRequestData(params: { data: Map<DataModelType, DataModel[]> }): void {
    const { data } = params;
    data.forEach((values) => {
      values.forEach((value) => {
        const old = this._dataList.get(value.id);
        if (old) {
          this._dataList.set(value.id, {
            ...old,
            name: value.name ?? old.name,
            avatar: value.avatar ?? old.avatar,
          });
        } else {
          // !!! Values that do not exist will not be updated.
        }
      });
    });
    this.sendUIEvent(UIListenerType.Contact, 'onRequestReloadEvent');
    this.sendUIEvent(UIListenerType.Conversation, 'onRequestReloadEvent');
  }

  getRequestData(id: string): DataModel | undefined {
    return this._dataList.get(id);
  }

  async _requestConvData(list: ChatConversation[]): Promise<void> {
    const ret = new Promise<void>((resolve, reject) => {
      if (this._basicDataRequestCallback) {
        const needRequest = new Set<DataModel>();
        Array.from(list.values()).forEach((v) => {
          const old = this._dataList.get(v.convId);
          if (
            old === undefined ||
            old.name === undefined ||
            old.avatar === undefined
          ) {
            needRequest.add({
              id: v.convId,
              type:
                v.convType === ChatConversationType.GroupChat
                  ? 'group'
                  : 'user',
              name: undefined,
              avatar: undefined,
            });
            this._dataList.set(v.convId, {
              ...old,
              id: v.convId,
              type:
                v.convType === ChatConversationType.GroupChat
                  ? 'group'
                  : 'user',
            } as DataModel);
          }
        });
        if (needRequest.size === 0) {
          resolve();
          return;
        }
        this._basicDataRequestCallback({
          ids: new Map([
            [
              'user',
              Array.from(needRequest.values())
                .filter(
                  (v) =>
                    (v?.type === 'user' &&
                      (v.id === v?.name ||
                        v?.name === undefined ||
                        v.name === null ||
                        v.name.length === 0)) ||
                    (v?.type === 'user' && v?.avatar === undefined)
                )
                .map((v) => v.id),
            ],
            [
              'group',
              Array.from(needRequest.values())
                .filter(
                  (v) =>
                    (v?.type === 'group' &&
                      (v.id === v?.name ||
                        v?.name === undefined ||
                        v.name === null ||
                        v.name.length === 0)) ||
                    (v?.type === 'group' && v?.avatar === undefined)
                )
                .map((v) => v.id),
            ],
          ]),
          result: (data, error) => {
            if (data) {
              data.forEach((values: DataModel[]) => {
                values.map((value) => {
                  const conv = this._dataList.get(value.id);
                  if (conv) {
                    conv.name = conv.name ?? value.name;
                    conv.avatar = conv.avatar ?? value.avatar;
                  }
                });
              });
              resolve();
            } else {
              reject(error);
            }
          },
        });
      } else {
        resolve();
      }
    });

    return ret;
  }

  _requestData(list: string[], type: DataModelType = 'user'): Promise<void> {
    const ret = new Promise<void>((resolve, reject) => {
      if (this._basicDataRequestCallback) {
        const needRequest = new Set<DataModel>();
        Array.from(list.values()).forEach((v) => {
          const old = this._dataList.get(v);
          if (
            old === undefined ||
            old.name === undefined ||
            old.avatar === undefined
          ) {
            needRequest.add({
              id: v,
              type: type,
              name: undefined,
              avatar: undefined,
            });
            this._dataList.set(v, {
              ...old,
              id: v,
              type: type,
            } as DataModel);
          }
        });
        if (needRequest.size === 0) {
          resolve();
          return;
        }
        this._basicDataRequestCallback({
          ids: new Map([
            [
              type,
              Array.from(needRequest.values())
                .filter(
                  (v) =>
                    (v?.type === type &&
                      (v.id === v?.name ||
                        v?.name === undefined ||
                        v.name === null ||
                        v.name.length === 0)) ||
                    (v?.type === type && v?.avatar === undefined)
                )
                .map((v) => v.id),
            ],
          ]),
          result: (data, error) => {
            if (data) {
              data.forEach((values: DataModel[]) => {
                values.map((value) => {
                  const conv = this._dataList.get(value.id);
                  if (conv) {
                    conv.name = conv.name ?? value.name;
                    conv.avatar = conv.avatar ?? value.avatar;
                  }
                });
              });
              resolve();
            } else {
              reject(error);
            }
          },
        });
      } else {
        resolve();
      }
    });

    return ret;
  }

  _requestGroupMemberData(
    groupId: string,
    list: GroupParticipantModel[]
  ): Promise<void> {
    const ret = new Promise<void>((resolve, reject) => {
      if (this._groupParticipantDataRequestCallback) {
        const needRequest = new Set<DataModel>();
        let groupMember = this._groupMemberList.get(groupId);
        if (groupMember === undefined) {
          this._groupMemberList.set(groupId, new Map());
        }
        groupMember = this._groupMemberList.get(groupId);
        Array.from(list.values()).forEach((v) => {
          if (
            v === undefined ||
            v.memberName === undefined ||
            v.memberAvatar === undefined
          ) {
            needRequest.add({
              id: v.memberId,
              type: 'user',
              name: undefined,
              avatar: undefined,
              groupId: groupId,
            });
          }
        });
        if (needRequest.size === 0) {
          resolve();
          return;
        }
        this._groupParticipantDataRequestCallback({
          groupId: groupId,
          ids: Array.from(needRequest.values())
            .filter(
              (v) =>
                (v?.type === 'user' &&
                  (v.id === v?.name ||
                    v?.name === undefined ||
                    v.name === null ||
                    v.name.length === 0)) ||
                (v?.type === 'user' && v?.avatar === undefined)
            )
            .map((v) => v.id),
          result: (data, error) => {
            if (data) {
              data.forEach((value: DataModel) => {
                const conv = groupMember?.get(value.id);
                if (conv) {
                  conv.memberName = value.name;
                  conv.memberAvatar = value.avatar;
                }
              });
              resolve();
            } else {
              reject(error);
            }
          },
        });
      } else {
        resolve();
      }
    });

    return ret;
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
              pageSize
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

      onResult({
        isOk: true,
        value: Array.from(this._convList.values()),
      });
    } catch (e) {
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
  }): Promise<ConversationModel | undefined> {
    const { fromNative = false } = params;
    if (fromNative === true) {
      const ret = await this.tryCatchSync({
        promise: this.client.chatManager.getConversation(
          params.convId,
          params.convType,
          params.createIfNotExist ?? true
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
          this.sendUIEvent(UIListenerType.Conversation, 'onAddedEvent', c1);
        }
        return c1;
      }
    } else {
      const conv = this._convList.get(params.convId);
      return conv;
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
        console.warn('dev:remove:', e);
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
            console.warn('dev:remove:', e);
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

  getAllContacts(params: { onResult: ResultCallback<ContactModel[]> }): void {
    if (this._contactList.size > 0) {
      this.tryCatch({
        promise: this.client.contactManager.getAllContacts(),
        event: 'getAllContacts',
        onFinished: async (value) => {
          const list = new Map() as Map<string, ContactModel>;
          value.forEach(async (v) => {
            const conv = this._contactList.get(v.userId);
            if (conv) {
              list.set(v.userId, mergeObjects<ContactModel>(v, conv));
            } else {
              list.set(v.userId, { ...v });
            }
          });

          await this._requestData(
            Array.from(list.values()).map((v) => v.userId)
          );
          list.forEach((v) => {
            const item = this._dataList.get(v.userId);
            if (item && item.avatar) {
              v.userAvatar = item.avatar;
            }
            if (item && item.name) {
              v.userName = item.name;
            }
          });

          this._contactList = list;

          params.onResult({
            isOk: true,
            value: Array.from(this._contactList.values()).map((v) => v),
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
        value.forEach(async (v) => {
          this._contactList.set(v.userId, {
            userId: v.userId,
          } as ContactModel);
        });

        await this._requestData(
          Array.from(this._contactList.values()).map((v) => v.userId)
        );
        this._contactList.forEach((v) => {
          const item = this._dataList.get(v.userId);
          if (item && item.avatar) {
            v.userAvatar = item.avatar;
          }
          if (item && item.name) {
            v.userName = item.name;
          }
        });

        params.onResult({
          isOk: true,
          value: Array.from(this._contactList.values()).map((v) => v),
        });
      },
      onError: (e) => {
        params.onResult({ isOk: false, error: e });
      },
    });
  }

  getContact(params: {
    userId: string;
    useUserData?: boolean;
    onResult: ResultCallback<ContactModel | undefined>;
  }): void {
    this.tryCatch({
      promise: this.client.contactManager.getContact(params.userId),
      event: 'getContact',
      onFinished: async (value) => {
        if (value) {
          await this._requestData([params.userId]);
          const contact = await this.toUIContact(value);
          // if (this._contactDataRequestCallback && params.useUserData) {
          //   this._contactDataRequestCallback({
          //     ids: [params.userId],
          //     result: async (data?: DataModel[], error?: UIKitError) => {
          //       if (data) {
          //         data.forEach((value) => {
          //           const contact = this._contactList.get(value.id);
          //           if (contact) {
          //             contact.nickName = value.name;
          //             contact.avatar = value.avatar;
          //           }
          //         });
          //       }

          //       params.onResult({
          //         isOk: true,
          //         value: contact,
          //         error,
          //       });
          //     },
          //   });
          // } else {
          //   params.onResult({
          //     isOk: true,
          //     value: contact,
          //   });
          // }

          params.onResult({
            isOk: true,
            value: contact,
          });
        } else {
          params.onResult({
            isOk: true,
            value: undefined,
          });
        }
        return false;
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
        await this._requestData([params.userId]);
        const contact = this._contactList.get(params.userId);
        this.sendUIEvent(UIListenerType.Contact, 'onAddedEvent', contact);
        params.onResult?.({
          isOk: true,
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
        const contact = this._contactList.get(params.userId);
        if (contact) {
          contact.remark = params.remark;
          this.sendUIEvent(UIListenerType.Contact, 'onUpdatedEvent', contact);
        }
        params.onResult?.({ isOk: true });
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
        await this._requestData(
          groups.map((v) => v.groupId),
          'group'
        );
        let list: GroupModel[] = [];
        for (const group of groups) {
          list.push(this.toUIGroup(group));
        }
        params.onResult({ isOk: true, value: list });
        return false;
      },
    });
  }

  getPageGroups(params: {
    pageSize: number;
    pageNum: number;
    onResult: ResultCallback<GroupModel[]>;
  }): void {
    // this.client.groupManager.getJoinedGroups();
    this.tryCatch({
      promise: this.client.groupManager.fetchJoinedGroupsFromServer(
        params.pageSize,
        params.pageNum
      ),
      event: 'getPageGroups',
      onFinished: async (value) => {
        await this._requestData(
          value.map((v) => v.groupId),
          'group'
        );
        value.forEach(async (v) => {
          this._groupList.set(v.groupId, this.toUIGroup(v));
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

        await this._requestData(Array.from(memberList.keys()));
        memberList.forEach((v) => {
          const item = this._dataList.get(v.memberId);
          if (item && item.avatar) {
            v.memberAvatar = item.avatar;
          }
          if (item && item.name) {
            v.memberName = item.name;
          }
        });

        this._groupMemberList.set(params.groupId, memberList);
        // await this._requestGroupMemberData(
        //   params.groupId,
        //   Array.from(memberList.values())
        // );

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
        await this._requestData([ret.owner]);
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
        await this._requestData([ret.owner]);
        groupMember.set(ret.owner, {
          memberId: ret.owner,
          memberAvatar: this._getAvatarFromCache(ret.owner),
          memberName: this._getNameFromCache(ret.owner),
        } as GroupParticipantModel);
        this._groupMemberList.set(params.groupId, groupMember);
      }

      // await this._requestGroupMemberData(
      //   params.groupId,
      //   Array.from(groupMember.values())
      // );
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
      onFinished: (value) => {
        if (value) {
          const localGroup = this._groupList.get(params.groupId);
          const group = this.toUIGroup(value);
          if (localGroup) {
            this._groupList.set(group.groupId, mergeObjects(group, localGroup));
          } else {
            this._groupList.set(group.groupId, group);
          }

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
    });
  }

  getGroupInfo(params: {
    groupId: string;
    onResult: ResultCallback<GroupModel>;
  }): void {
    this.tryCatch({
      promise: this.client.groupManager.getGroupWithId(params.groupId),
      event: 'getGroupInfo',
      onFinished: async (value) => {
        if (value === undefined || value.groupId.length === 0) {
          this.tryCatch({
            promise: this.client.groupManager.fetchGroupInfoFromServer(
              params.groupId
            ),
            event: 'getGroupInfo',
            onFinished: (value) => {
              if (value) {
                const group = this.toUIGroup(value);
                params.onResult({
                  isOk: true,
                  value: group,
                });
              } else {
                params.onResult({
                  isOk: true,
                  value: undefined,
                });
              }
            },
          });
        } else {
          params.onResult({
            isOk: true,
            value: value,
          });
        }
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
        // if (value && value.groupId.length > 0) {
        //   this._groupList.set(value.groupId, { ...value } as GroupModel);
        //   if (this._groupDataRequestCallback) {
        //     this._groupDataRequestCallback({
        //       ids: [value.groupId],
        //       result: (data) => {
        //         if (data) {
        //           data.forEach((item) => {
        //             const group = this._groupList.get(item.id);
        //             if (group) {
        //               group.groupName = item.name;
        //               group.groupAvatar = item.avatar;
        //             }
        //           });
        //         }
        //         params.onResult({
        //           isOk: true,
        //           value: this.toUIGroup(value),
        //         });
        //       },
        //     });
        //   } else {
        //     params.onResult({
        //       isOk: true,
        //       value: this.toUIGroup(value),
        //     });
        //   }
        //   return;
        // }
        const group = this.toUIGroup(value);
        this._groupList.set(group.groupId, group);
        const s = this._dataList.get(group.groupId);
        if (s === undefined) {
          this._dataList.set(group.groupId, {
            id: group.groupId,
            name: params.groupName,
            type: 'group',
          });
        }
        this.sendUIEvent(UIListenerType.Group, 'onAddedEvent', group);
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
          const g = this._dataList.get(group.groupId);
          if (g) {
            g.name = group.groupName;
          }
          this.sendUIEvent(UIListenerType.Group, 'onUpdatedEvent', group);
        }
        params.onResult?.({
          isOk: true,
        });
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
          // await this._requestGroupMemberData(
          //   params.groupId,
          //   Array.from(groupMembers.values())
          // );
          await this._requestData(params.members.map((item) => item.memberId));

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
    });
  }

  getUserInfo(params: {
    userId: string;
    onResult: ResultCallback<UserData | undefined>;
  }): void {
    if (this._userList.has(params.userId)) {
      params.onResult({
        isOk: true,
        value: this._userList.get(params.userId),
      });
      return;
    }
    this.tryCatch({
      promise: this.client.userManager.fetchUserInfoById([params.userId]),
      event: 'getUserInfo',
      onFinished: async (value) => {
        if (value) {
          Array.from(value.values()).forEach(async (v) => {
            const user = this.toUserData(v);
            const localUser = this._userList.get(v.userId);
            if (localUser) {
              this._userList.set(user.userId, mergeObjects(user, localUser));
            } else {
              this._userList.set(user.userId, user);
            }
          });
          if (this._userList.has(params.userId)) {
            params.onResult({
              isOk: true,
              value: this._userList.get(params.userId),
            });
          } else {
            params.onResult({
              isOk: true,
            });
          }
        } else {
          params.onResult({
            isOk: true,
          });
        }
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
      onFinished: async (value) => {
        if (value) {
          Array.from(value.values()).forEach(async (v) => {
            const user = this.toUserData(v);
            const localUser = this._userList.get(v.userId);
            this._userList.set(
              user.userId,
              mergeObjects<UserData>(user, localUser ?? ({} as any))
            );
          });
          params.onResult({
            isOk: true,
            value: params.userIds
              .map((v) => this._userList.get(v))
              .filter((v) => v !== undefined) as UserData[],
          });
        } else {
          params.onResult({
            isOk: true,
            value: [],
          });
        }
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
        params.onResult({
          isOk: false,
          error: new UIKitError({
            code: ErrorCode.common,
            desc: this._fromChatError(e),
          }),
        });
      },
    });
  }

  insertMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.insertMessage(params.message),
      event: 'insertMessage',
      onFinished: async () => {
        params.onResult({
          isOk: true,
        });
      },
    });
  }
  updateMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.updateMessage(params.message),
      event: 'updateMessage',
      onFinished: async () => {
        params.onResult({
          isOk: true,
        });
      },
    });
  }

  removeMessage(params: {
    message: ChatMessage;
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.chatManager.deleteMessage(
        params.message.conversationId,
        params.message.chatType as number as ChatConversationType,
        params.message.msgId
      ),
      event: 'removeMessage',
      onFinished: async () => {
        params.onResult({
          isOk: true,
        });
      },
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
        params.onResult({
          isOk: false,
          error: e,
        });
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
  getHistoryMessage(params: {
    convId: string;
    convType: ChatConversationType;
    startMsgId: string;
    direction: ChatSearchDirection;
    loadCount: number;
    onResult: ResultCallback<ChatMessage[]>;
  }): void {
    const { convId, convType, startMsgId, direction, loadCount } = params;
    this.tryCatch({
      promise: this.client.chatManager.getMessages(
        convId,
        convType,
        startMsgId,
        direction,
        loadCount
      ),
      event: 'getHistoryMessage',
      onFinished: (value) => {
        params.onResult({ isOk: true, value: value });
        return false;
      },
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
      onError: () => {
        params.onResult?.({ isOk: false });
      },
    });
  }

  subPresence(params: {
    userIds: string[];
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.presenceManager.subscribe(
        params.userIds,
        60 * 60 * 24 * 3
      ),
      event: 'subPresence',
    });
  }
  unSubPresence(params: {
    userIds: string[];
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.presenceManager.unsubscribe(params.userIds),
      event: 'unSubPresence',
    });
  }
  publishPresence(params: {
    status: string;
    onResult: ResultCallback<void>;
  }): void {
    this.tryCatch({
      promise: this.client.presenceManager.publishPresence(params.status),
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
    });
  }
  fetchPresence(params: {
    userIds: string[];
    onResult: ResultCallback<string[]>;
  }): void {
    this.tryCatch({
      promise: this.client.presenceManager.fetchPresenceStatus(params.userIds),
      event: 'fetchPresence',
      onFinished: (result) => {
        params.onResult?.({
          isOk: true,
          value:
            result.map((v) => {
              return v.statusDescription;
            }) ?? [],
        });
      },
      onError: () => {
        params.onResult?.({ isOk: false });
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
