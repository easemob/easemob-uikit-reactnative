import * as React from 'react';

import { ChatPushConfig, ChatService } from '../../rename.uikit';
import {
  AsyncStorageBasic,
  SingletonObjects,
  UIKitError,
  useAlertContext,
  useChatContext,
  useSimpleToastContext,
  useToastViewContext,
} from '../../rename.uikit';
import { accountType, appKey as gAppKey, fcmSenderId } from '../common/const';
import { requestFcmToken } from '../common/fcm';
import {
  AgoraRequestLoginResult,
  EasemobRequestLoginResult,
  RequestLoginResult,
  RestApi,
} from '../common/rest.api';

export function useAutoLogin() {
  const getSelfInfo = React.useCallback(async () => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    const res = await s.getData({ key: 'self' });
    if (res.value) {
      try {
        return JSON.parse(res.value);
      } catch (error) {
        return undefined;
      }
    }
    return undefined;
  }, []);

  const requestUpdatePushToken = React.useCallback((im: ChatService) => {
    requestFcmToken()
      .then((fcmToken) => {
        im.client
          .updatePushConfig(
            new ChatPushConfig({
              deviceId: fcmSenderId,
              deviceToken: fcmToken,
            })
          )
          .then()
          .catch((e) => {
            console.warn('dev:updatePushConfig:error:', e);
          });
      })
      .catch((e) => {
        console.warn('dev:requestFcmToken:error:', e);
      });
  }, []);

  const autoLoginAction = React.useCallback(
    async (params: {
      im: ChatService;
      onResult: (params: { isOk: boolean }) => void;
    }) => {
      const { im, onResult } = params;
      try {
        do {
          const p = new Promise<{ isOk: boolean; error?: UIKitError }>(
            async (resolve, reject) => {
              const ret = await getSelfInfo();
              im.autoLogin({
                userAvatarURL: ret?.avatar,
                result: (res) => {
                  if (res.isOk) {
                    resolve(res);
                  } else {
                    reject(res);
                  }
                },
              });
            }
          );
          const ret = await p;
          if (ret.isOk) {
            requestUpdatePushToken(im);
            onResult?.({ isOk: true });
            break;
          }
          onResult?.({ isOk: false });
        } while (false);
      } catch (error) {
        console.warn('dev:autoLoginAction:error:', error);
        onResult?.({ isOk: false });
      }
    },
    [getSelfInfo, requestUpdatePushToken]
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

  const getFcmToken = React.useCallback(() => {
    return im.client.options?.pushConfig?.deviceToken;
  }, [im.client.options?.pushConfig?.deviceToken]);

  const requestUpdatePushToken = React.useCallback(() => {
    requestFcmToken()
      .then((fcmToken) => {
        im.client
          .updatePushConfig(
            new ChatPushConfig({
              deviceId: fcmSenderId,
              deviceToken: fcmToken,
            })
          )
          .then()
          .catch((e) => {
            console.warn('dev:updatePushConfig:error:', e);
          });
      })
      .catch((e) => {
        console.warn('dev:requestFcmToken:error:', e);
      });
  }, [im.client]);

  const saveSelfInfo = React.useCallback((data: RequestLoginResult) => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
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

  const loginAction = React.useCallback(
    async (params: {
      id: string;
      pass: string;
      onResult: (params: { isOk: boolean; reason?: string }) => void;
    }) => {
      console.log('loginAction', params);
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
                  usePassword: false,
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
          onResult?.({ isOk: false });
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
      console.log('agoraLoginAction', params);
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
                  usePassword: false,
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
          onResult?.({ isOk: false });
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
    loginAction: accountType === 'agora' ? agoraLoginAction : loginAction,
    saveSelfInfo,
    getFcmToken,
  };
}
