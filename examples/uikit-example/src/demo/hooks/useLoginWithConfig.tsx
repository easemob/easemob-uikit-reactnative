import * as React from 'react';

import {
  useAlertContext,
  useChatContext,
  useSimpleToastContext,
  useToastViewContext,
} from '../../rename.uikit';
import { accountType } from '../common/const';

export function useLoginWithConfig() {
  const { getSimpleToastRef } = useSimpleToastContext();
  const { getToastViewRef } = useToastViewContext();
  const { getAlertRef } = useAlertContext();
  const im = useChatContext();

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

  const loginAction = React.useCallback(
    async (params: {
      id: string;
      pass: string;
      onResult: (params: { isOk: boolean; reason?: string }) => void;
    }) => {
      console.log('dev:loginAction', params.id);
      const { id, pass, onResult } = params;
      return devLoginAction({
        id: id,
        passOrToken: pass,
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
      console.log('dev:agoraLoginAction', params.id);
      return devLoginAction({
        id: params.id,
        passOrToken: params.pass,
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
  };
}
