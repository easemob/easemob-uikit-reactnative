import * as React from 'react';

import { ChatPushConfig } from '../../rename.uikit';
import {
  AsyncStorageBasic,
  SingletonObjects,
  UIKitError,
  useAlertContext,
  useChatContext,
  useSimpleToastContext,
  useToastViewContext,
} from '../../rename.uikit';
import { appKey as gAppKey, fcmSenderId } from '../common/const';
import { requestFcmToken } from '../common/fcm';
import { RequestLoginResult, RestApi } from '../common/rest.api';

export function useLogin() {
  const { getSimpleToastRef } = useSimpleToastContext();
  const { getToastViewRef } = useToastViewContext();
  const { getAlertRef } = useAlertContext();
  const im = useChatContext();

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
    s.setData({
      key: 'self',
      value: JSON.stringify({
        phone: data.phoneNumber,
        id: data.chatUserName,
        avatar: data.avatarUrl,
      }),
    });
  }, []);

  const getSelfInfo = React.useCallback(async () => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    const res = await s.getData({ key: 'self' });
    if (res.value) {
      try {
        return JSON.parse(res.value) as {
          phone: string;
          id: string;
          avatar: string;
        };
      } catch (error) {
        return undefined;
      }
    }
    return undefined;
  }, []);

  // const loginAction2 = React.useCallback(
  //   async (params: {
  //     id: string;
  //     pass: string;
  //     onResult: (params: { isOk: boolean }) => void;
  //   }) => {
  //     console.log('loginAction', params);
  //     const { id, pass, onResult } = params;
  //     try {
  //       do {
  //         const result = {
  //           chatUserName: id,
  //           phoneNumber: id,
  //           token: pass,
  //         } as RequestLoginResult;
  //         saveSelfInfo(result);
  //         const p = new Promise<{ isOk: boolean; error?: UIKitError }>(
  //           (resolve, reject) => {
  //             im.login({
  //               userId: result.chatUserName,
  //               userToken: result.token,
  //               usePassword: false,
  //               userAvatarURL: result.avatarUrl,
  //               result: (r) => {
  //                 if (r.isOk) {
  //                   resolve(r);
  //                 } else {
  //                   reject(r);
  //                 }
  //               },
  //             });
  //           }
  //         );
  //         const s = await p;
  //         if (s.isOk) {
  //           requestUpdatePushToken();
  //           onResult?.({ isOk: true });
  //           break;
  //         }
  //         onResult?.({ isOk: false });
  //       } while (false);
  //     } catch (error) {
  //       console.warn('dev:loginAction:error:', error);
  //       onResult?.({ isOk: false });
  //     }
  //   },
  //   [im, requestUpdatePushToken, saveSelfInfo]
  // );

  const loginAction = React.useCallback(
    async (params: {
      id: string;
      pass: string;
      onResult: (params: { isOk: boolean }) => void;
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
                im.login({
                  userId: res.value!.chatUserName,
                  userToken: res.value!.token,
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

  const autoLoginAction = React.useCallback(
    async (params: { onResult: (params: { isOk: boolean }) => void }) => {
      const { onResult } = params;
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
            requestUpdatePushToken();
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
    [getSelfInfo, im, requestUpdatePushToken]
  );

  return {
    getToastRef: getSimpleToastRef,
    getToastViewRef,
    getAlertRef,
    requestUpdatePushToken,
    loginAction,
    autoLoginAction,
    saveSelfInfo,
    getSelfInfo,
  };
}
