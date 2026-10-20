import * as React from 'react';

import {
  AsyncStorageBasic,
  SingletonObjects,
  UIKitError,
  useAlertContext,
  useChatContext,
  useSimpleToastContext,
  useToastViewContext,
} from '../../rename.uikit';
import { accountType, useAppServerDomain } from '../common/const';
import {
  AgoraRequestLoginResult,
  EasemobRequestLoginResult,
  RequestLoginResult,
  RestApi,
} from '../common/rest.api';
import { AppKey } from './useServerConfig';

export function useSavedLoginInfo() {
  const getSelfInfo = React.useCallback(async () => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${AppKey.gAppKey()}/uikit/demo`,
    });
    const res = await s.getData({ key: 'self' });
    if (res.value) {
      try {
        return JSON.parse(res.value);
      } catch (event: any) {
        console.warn('getSelfInfo:error:', event);
        return undefined;
      }
    }
    return undefined;
  }, []);

  return { getSelfInfo };
}

export function useLogin() {
  const { getSimpleToastRef } = useSimpleToastContext();
  const { getToastViewRef } = useToastViewContext();
  const { getAlertRef } = useAlertContext();
  const im = useChatContext();

  const requestUpdatePushToken = React.useCallback(() => {
    // todo:
  }, []);

  const saveSelfInfo = React.useCallback((data: RequestLoginResult) => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${AppKey.gAppKey()}/uikit/demo`,
    });
    if (accountType === 'agora') {
      const d = data as AgoraRequestLoginResult;
      s.setData({
        key: 'self',
        value: JSON.stringify({
          accountType: data.accountType,
          phone: d.agoraUid,
          id: d.chatUserName,
          token: d.accessToken,
          avatar: d.avatarUrl,
        }),
      });
    } else {
      const d = data as EasemobRequestLoginResult;
      s.setData({
        key: 'self',
        value: JSON.stringify({
          accountType: data.accountType,
          phone: d.phoneNumber,
          id: d.chatUserName,
          token: d.token,
          avatar: d.avatarUrl,
        }),
      });
    }
  }, []);

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
        result: (r) => {
          if (r.isOk) {
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
        result: (r) => {
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
            saveSelfInfo(res.value);
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
            saveSelfInfo(res.value);
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
