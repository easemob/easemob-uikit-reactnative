import * as React from 'react';

import {
  ChatService,
  AsyncStorageBasic,
  SingletonObjects,
  UIKitError,
  useAlertContext,
  useChatContext,
  useSimpleToastContext,
  useToastViewContext,
} from '../../rename.uikit';
import { accountType, fcmSenderId, useAppServerDomain } from '../common/const';
import { requestFcmToken } from '../common/fcm';
import {
  AgoraRequestLoginResult,
  EasemobRequestLoginResult,
  RequestLoginResult,
  RestApi,
} from '../common/rest.api';
import { AppKey } from './useServerConfig';

type SavedLogin = {
  accountType: string;
  phone?: string;
  id: string;
  token: string;
  avatar?: string;
  context: string;
  devMode: boolean;
};

function loginStorage() {
  return SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
    appKey: `${AppKey.gAppKey()}/uikit/demo`,
  });
}

function loginContext(im: ChatService): string {
  const options = im.client.options;
  return JSON.stringify([
    options?.appKey,
    options?.appId,
    options?.enableDNSConfig,
    options?.imServer,
    options?.imPort,
    options?.restServer,
  ]);
}

export async function clearSavedLogin(): Promise<void> {
  const result = await loginStorage().setData({ key: 'self', value: '' });
  if (!result.isOk) console.warn('Failed to clear saved login.');
}

async function saveLogin(
  im: ChatService,
  data: Omit<SavedLogin, 'context'>
): Promise<void> {
  const result = await loginStorage().setData({
    key: 'self',
    value: JSON.stringify({ ...data, context: loginContext(im) }),
  });
  if (!result.isOk) console.warn('Failed to save login for the next launch.');
}

async function bindPushToken(im: ChatService): Promise<void> {
  try {
    const token = await requestFcmToken();
    await im.client.bindDeviceToken({
      deviceToken: token,
      notifierName: fcmSenderId,
    });
  } catch (error) {
    console.warn('dev:bindDeviceToken:error:', error);
  }
}

export function useAutoLogin() {
  const getSelfInfo = React.useCallback(async () => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${AppKey.gAppKey()}/uikit/demo`,
    });
    const res = await s.getData({ key: 'self' });
    if (res.value) {
      try {
        return JSON.parse(res.value) as SavedLogin;
      } catch (error) {
        return undefined;
      }
    }
    return undefined;
  }, []);

  const autoLoginAction = React.useCallback(
    async (params: {
      im: ChatService;
      devMode: boolean;
      onResult: (params: { isOk: boolean }) => void;
    }) => {
      const { im, devMode, onResult } = params;
      try {
        const saved = await getSelfInfo();
        if (
          !saved ||
          typeof saved.id !== 'string' ||
          !saved.id ||
          typeof saved.token !== 'string' ||
          !saved.token ||
          saved.context !== loginContext(im) ||
          saved.devMode !== devMode
        ) {
          onResult({ isOk: false });
          return;
        }
        await im.login({
          userId: saved.id,
          userToken: saved.token,
          userAvatarURL: saved.avatar,
          result: async (result) => {
            if (result.isOk) {
              void bindPushToken(im);
            } else {
              try {
                const code = JSON.parse(result.error?.desc ?? '{}').code;
                if ([104, 108, 202].includes(code)) await clearSavedLogin();
              } catch {
                // Keep credentials on transient failures or an unstructured error.
              }
            }
            onResult({ isOk: result.isOk });
          },
        });
      } catch (error) {
        console.warn('dev:autoLoginAction:error:', error);
        onResult({ isOk: false });
      }
    },
    [getSelfInfo]
  );
  return {
    autoLoginAction,
    getSelfInfo,
  };
}

export function useLogin() {
  const { getSimpleToastRef } = useSimpleToastContext();
  const { getToastViewRef } = useToastViewContext();
  const { getAlertRef } = useAlertContext();
  const im = useChatContext();

  const requestUpdatePushToken = React.useCallback(
    () => bindPushToken(im),
    [im]
  );

  const saveSelfInfo = React.useCallback(
    async (data: RequestLoginResult) => {
      const agora = data as AgoraRequestLoginResult;
      const easemob = data as EasemobRequestLoginResult;
      await saveLogin(im, {
        accountType: data.accountType,
        phone: accountType === 'agora' ? agora.agoraUid : easemob.phoneNumber,
        id: data.chatUserName,
        token: accountType === 'agora' ? agora.accessToken : easemob.token,
        avatar: data.avatarUrl,
        devMode: false,
      });
    },
    [im]
  );

  const devLoginAction = React.useCallback(
    async (params: {
      id: string;
      passOrToken: string;
      onResult: (params: { isOk: boolean; reason?: string }) => void;
    }) => {
      const { id, passOrToken, onResult } = params;
      im.login({
        userId: id,
        userToken: passOrToken,
        userAvatarURL: undefined,
        result: async (r) => {
          if (r.isOk) {
            await saveLogin(im, {
              accountType,
              id,
              token: passOrToken,
              devMode: true,
            });
            void bindPushToken(im);
            onResult({ isOk: true });
          } else {
            onResult({ isOk: false, reason: r.error?.desc });
          }
        },
      });
    },
    [im]
  );

  const loginWithToken = React.useCallback(
    async (params: {
      id: string;
      pass: string;
      onResult: (params: { isOk: boolean; reason?: string }) => void;
    }) => {
      const { id, pass, onResult } = params;
      im.login({
        userId: id,
        userToken: pass,
        userAvatarURL: '',
        result: async (r) => {
          if (r.isOk)
            await saveLogin(im, {
              accountType,
              id,
              token: pass,
              devMode: false,
            });
          if (r.isOk) void bindPushToken(im);
          onResult({
            isOk: r.isOk,
            reason: r.error?.desc,
          });
        },
      });
    },
    [im]
  );
  const loginAction = React.useCallback(
    async (params: {
      id: string;
      pass: string;
      onResult: (params: { isOk: boolean; reason?: string }) => void;
    }) => {
      console.log('dev:loginAction', params.id);
      const { id, pass, onResult } = params;
      try {
        do {
          const res = await RestApi.requestLogin({ phone: id, code: pass });
          if (res.isOk && res.value && res.value.code === 200) {
            const p = new Promise<{ isOk: boolean; error?: UIKitError }>(
              (resolve, reject) => {
                const v = res.value as EasemobRequestLoginResult;
                im.login({
                  userId: v.chatUserName,
                  userToken: v.token,
                  userAvatarURL: res.value?.avatarUrl,
                  result: (r) => {
                    if (r.isOk) {
                      resolve(r);
                    } else {
                      reject(r);
                    }
                  },
                });
              }
            );
            const s = await p;
            if (s.isOk) {
              await saveSelfInfo(res.value);
              requestUpdatePushToken();
              onResult?.({ isOk: true });
              break;
            }
          }
          onResult?.({ isOk: false, reason: (res.value as any)?.errorInfo });
        } while (false);
      } catch (error) {
        console.warn('dev:loginAction:error:', error);
        onResult?.({ isOk: false });
      }
    },
    [im, requestUpdatePushToken, saveSelfInfo]
  );

  const agoraLoginAction = React.useCallback(
    async (params: {
      id: string;
      pass: string;
      onResult: (params: { isOk: boolean; reason?: string }) => void;
    }) => {
      console.log('dev:agoraLoginAction', params.id);
      const { id, pass, onResult } = params;
      try {
        do {
          const res = await RestApi.requestAgoraLogin({
            userId: id,
            password: pass,
          });
          if (res.isOk && res.value && res.value.code === 200) {
            const p = new Promise<{ isOk: boolean; error?: UIKitError }>(
              (resolve, reject) => {
                const v = res.value as AgoraRequestLoginResult;
                im.login({
                  userId: v.chatUserName,
                  userToken: v.accessToken,
                  userAvatarURL: res.value?.avatarUrl,
                  result: (r) => {
                    if (r.isOk) {
                      resolve(r);
                    } else {
                      reject(r);
                    }
                  },
                });
              }
            );
            const s = await p;
            if (s.isOk) {
              await saveSelfInfo(res.value);
              requestUpdatePushToken();
              onResult?.({ isOk: true });
              break;
            }
          }
          onResult?.({ isOk: false, reason: (res.value as any)?.errorInfo });
        } while (false);
      } catch (error) {
        console.warn('dev:agoraLoginAction:error:', error);
        onResult?.({ isOk: false, reason: error as string });
      }
    },
    [im, requestUpdatePushToken, saveSelfInfo]
  );

  return {
    getToastRef: getSimpleToastRef,
    getToastViewRef,
    getAlertRef,
    requestUpdatePushToken,
    loginAction: useAppServerDomain
      ? accountType === 'agora'
        ? agoraLoginAction
        : loginAction
      : loginWithToken,
    devLoginAction,
    saveSelfInfo,
  };
}
