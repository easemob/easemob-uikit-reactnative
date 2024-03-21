import * as React from 'react';
import { ChatPushConfig } from 'react-native-chat-sdk';
import {
  UIKitError,
  useAlertContext,
  useChatContext,
  useSimpleToastContext,
  useToastViewContext,
} from 'react-native-chat-uikit';

import { fcmSenderId } from '../common/const';
import { requestFcmToken } from '../common/fcm';
import { RequestLoginResult, RequestResult, RestApi } from '../common/rest.api';

export function useLogin() {
  const { getSimpleToastRef } = useSimpleToastContext();
  const { getToastViewRef } = useToastViewContext();
  const { getAlertRef } = useAlertContext();
  const im = useChatContext();
  const onLogin = React.useCallback(
    (
      id: string,
      pass: string,
      onResult: (result: RequestResult<RequestLoginResult, any>) => void
    ) => {
      RestApi.reqLogin({ phone: id, code: pass }).then((res) => {
        onResult(res);
      });
    },
    []
  );

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
          const res = await RestApi.reqLogin({ phone: id, code: pass });
          if (res.isOk && res.value && res.value.code === 200) {
            const p = new Promise<{ isOk: boolean; error?: UIKitError }>(
              (resolve, reject) => {
                im.login({
                  userId: res.value!.chatUserName,
                  userToken: res.value!.token,
                  usePassword: false,
                  result: (rres) => {
                    if (rres.isOk) {
                      resolve(rres);
                    } else {
                      reject(rres);
                    }
                  },
                });
              }
            );
            const s = await p;
            if (s.isOk) {
              requestUpdatePushToken();
              onResult?.({ isOk: true });
              return;
            }
          }
        } while (false);
        onResult?.({ isOk: false });
      } catch (error) {
        console.warn('dev:loginAction:error:', error);
        onResult?.({ isOk: false });
      }
    },
    [im, requestUpdatePushToken]
  );

  const autoLoginAction = React.useCallback(
    async (params: { onResult: (params: { isOk: boolean }) => void }) => {
      const { onResult } = params;
      try {
        do {
          const p = new Promise<{ isOk: boolean; error?: UIKitError }>(
            (resolve, reject) => {
              im.autoLogin({
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
            return;
          }
        } while (false);
      } catch (error) {
        console.warn('dev:autoLoginAction:error:', error);
        onResult?.({ isOk: false });
      }
    },
    [im, requestUpdatePushToken]
  );

  return {
    onLogin,
    getToastRef: getSimpleToastRef,
    getToastViewRef,
    getAlertRef,
    requestUpdatePushToken,
    loginAction,
    autoLoginAction,
  };
}
