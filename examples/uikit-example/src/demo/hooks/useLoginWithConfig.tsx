import * as React from 'react';

import { ChatService } from '../../rename.uikit';
import {
  AsyncStorageBasic,
  SingletonObjects,
  UIKitError,
  useAlertContext,
  useChatContext,
  useSimpleToastContext,
  useToastViewContext,
} from '../../rename.uikit';
import { accountType } from '../common/const';
import { AppKey } from './useServerConfig';

export function useAutoLogin() {
  const getSelfInfo = React.useCallback(async () => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${AppKey.gAppKey()}/uikit/demo`,
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

  const requestUpdatePushToken = React.useCallback((_im: ChatService) => {
    // todo:
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

export function useLoginWithConfig() {
  const { getSimpleToastRef } = useSimpleToastContext();
  const { getToastViewRef } = useToastViewContext();
  const { getAlertRef } = useAlertContext();
  const im = useChatContext();

  const getFcmToken = React.useCallback(() => {
    return im.client.options?.pushConfig?.deviceToken;
  }, [im.client.options?.pushConfig?.deviceToken]);

  const devLoginAction = React.useCallback(
    async (params: {
      id: string;
      passOrToken: string;
      usePassword: boolean;
      onResult: (params: { isOk: boolean; reason?: string }) => void;
    }) => {
      const { id, passOrToken, usePassword, onResult } = params;
      im.login({
        userId: id,
        userToken: passOrToken,
        usePassword: usePassword,
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

  const loginAction = React.useCallback(
    async (params: {
      id: string;
      pass: string;
      onResult: (params: { isOk: boolean; reason?: string }) => void;
    }) => {
      console.log('dev:loginAction', params);
      const { id, pass, onResult } = params;
      return devLoginAction({
        id: id,
        passOrToken: pass,
        usePassword: true,
        onResult: onResult,
      });
    },
    [devLoginAction]
  );

  const agoraLoginAction = React.useCallback(
    async (params: {
      id: string;
      pass: string;
      onResult: (params: { isOk: boolean; reason?: string }) => void;
    }) => {
      console.log('dev:agoraLoginAction', params);
      return devLoginAction({
        id: params.id,
        passOrToken: params.pass,
        usePassword: false,
        onResult: params.onResult,
      });
    },
    [devLoginAction]
  );

  return {
    getToastRef: getSimpleToastRef,
    getToastViewRef,
    getAlertRef,
    loginAction: accountType === 'agora' ? agoraLoginAction : loginAction,
    devLoginAction,
    getFcmToken,
  };
}
