import { ChatClient, ChatOptions } from 'react-native-chat-sdk';

import { ErrorCode, UIKitError } from '../error';
import { asyncTask } from '../utils';
import {
  ChatEventType,
  ChatService,
  ChatServiceListener,
  DisconnectReasonType,
  UserServiceData,
} from './types';

export abstract class ChatServiceImpl implements ChatService {
  _listeners: Set<ChatServiceListener>;
  _user?: UserServiceData;

  constructor() {
    this._listeners = new Set();
  }

  async init(params: {
    appKey: string;
    debugMode?: boolean;
    autoLogin?: boolean;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    const { appKey, debugMode, autoLogin } = params;
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

  abstract _reset(): void;

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
      if (userToken.startsWith('00')) {
        await this.client.loginWithAgoraToken(userId, userToken);
      } else {
        await this.client.login(userId, userToken, false);
      }

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
  // destructor() {}
}

export class ChatServicePrivateImpl extends ChatServiceImpl {
  constructor() {
    super();
    this._initListener();
  }

  _initListener() {
    this._initConnectListener();
    this._initMessageListener();
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
      // onUserDidLoginFromOtherDevice: () => {
      //   this._listeners.forEach((v) => {
      //     v.onDisconnected?.(
      //       DisconnectReasonType.user_did_login_from_other_device
      //     );
      //   });
      // },
      // onUserDidRemoveFromServer: () => {
      //   this._listeners.forEach((v) => {
      //     v.onDisconnected?.(DisconnectReasonType.user_did_remove_from_server);
      //   });
      // },
      // onUserDidForbidByServer: () => {
      //   this._listeners.forEach((v) => {
      //     v.onDisconnected?.(DisconnectReasonType.user_did_forbid_by_server);
      //   });
      // },
      // onUserDidChangePassword: () => {
      //   this._listeners.forEach((v) => {
      //     v.onDisconnected?.(DisconnectReasonType.user_did_change_password);
      //   });
      // },
      // onUserDidLoginTooManyDevice: () => {
      //   this._listeners.forEach((v) => {
      //     v.onDisconnected?.(
      //       DisconnectReasonType.user_did_login_too_many_device
      //     );
      //   });
      // },
      // onUserKickedByOtherDevice: () => {
      //   this._listeners.forEach((v) => {
      //     v.onDisconnected?.(DisconnectReasonType.user_kicked_by_other_device);
      //   });
      // },
      // onUserAuthenticationFailed: () => {
      //   this._listeners.forEach((v) => {
      //     v.onDisconnected?.(DisconnectReasonType.user_authentication_failed);
      //   });
      // },
    });
  }
  _initMessageListener() {
    this.client.chatManager.removeAllMessageListener();
    this.client.chatManager.addMessageListener({
      onMessagesRecalled: (messages) => {
        this._listeners.forEach((v) => {
          for (const message of messages) {
            v.onMessageRecalled?.(message);
          }
        });
      },
      // onMessagesReceived: (messages) => {
      //   this._listeners.forEach((v) => {
      //     for (const message of messages) {
      //       if (message.isBroadcast === true) {
      //         v.onGlobalNotifyReceived?.(message);
      //       } else {
      //         v.onMessageReceived?.(message);
      //       }
      //     }
      //   });
      // },
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

  _reset(): void {}
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
