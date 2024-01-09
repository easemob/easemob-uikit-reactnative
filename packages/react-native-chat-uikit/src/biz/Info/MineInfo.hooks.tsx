import * as React from 'react';
import type { ChatPresence } from 'react-native-chat-sdk';

import {
  ChatServiceListener,
  useChatContext,
  useChatListener,
} from '../../chat';
import { useLifecycle } from '../../hook';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { SimpleToastRef } from '../../ui/Toast';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useMineInfoActions } from '../hooks/useMineInfoActions';
import type { MineInfoProps, UserState } from './types';

export function useMineInfo(props: MineInfoProps) {
  const {
    userId,
    userName: propsUserName,
    userAvatar: propsUserAvatar,
    doNotDisturb: propsDoNotDisturb,
    onClearChat: propsOnClearChat,
    onClickedLogout: propsOnClickedLogout,
  } = props;
  const [doNotDisturb, setDoNotDisturb] = React.useState(propsDoNotDisturb);
  const [userName, setUserName] = React.useState(propsUserName);
  const [userAvatar] = React.useState(propsUserAvatar);
  const [userSign, setUserSign] = React.useState<string>();
  const [userState, setUserState] = React.useState<UserState>('offline');
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const toastRef = React.useRef<SimpleToastRef>({} as any);
  const { onShowMineInfoActions } = useMineInfoActions({ menuRef, alertRef });
  const im = useChatContext();
  const { tr } = useI18nContext();
  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          const self = im.user(userId);
          if (self) {
            setUserName(self.userName);
            setUserSign('self.sign');
          }
          // im.getUserInfo({
          //   userId: userId,
          //   onResult: (result) => {
          //     if (result.isOk && result.value) {
          //       setUserName(result.value.userName);
          //       setUserSign(result.value.sign);
          //     }
          //   },
          // });
        }
      },
      [im, userId]
    )
  );
  const onDoNotDisturb = (value: boolean) => {
    im.setConversationSilentMode({
      convId: userId,
      convType: 0,
      doNotDisturb: value,
    })
      .then(() => {
        setDoNotDisturb(value);
      })
      .catch((e) => {
        im.sendError({ error: e });
      });
  };
  const onClearChat = () => {
    im.removeConversation({ convId: userId })
      .then(() => {
        propsOnClearChat?.();
      })
      .catch((e) => {
        im.sendError({ error: e });
      });
  };

  const onRequestCloseMenu = () => {
    menuRef.current?.startHide?.();
  };

  const onClickedState = React.useCallback(() => {
    onShowMineInfoActions();
  }, [onShowMineInfoActions]);

  const onClickedLogout = React.useCallback(() => {
    propsOnClickedLogout?.();
  }, [propsOnClickedLogout]);

  const listener = React.useMemo(() => {
    return {
      onPresenceStatusChanged: (list: ChatPresence[]) => {
        if (list && list.length > 0) {
          const presence = list[0];
          if (presence?.publisher === userId) {
            setUserState(presence.statusDescription as any);
          }
        }
      },
    } as ChatServiceListener;
  }, [userId]);
  useChatListener(listener);

  return {
    ...props,
    doNotDisturb,
    onDoNotDisturb,
    onClearChat,
    userName,
    userAvatar,
    userId,
    menuRef,
    onRequestCloseMenu,
    alertRef,
    toastRef,
    userSign,
    onClickedState,
    onClickedLogout,
    userState,
    tr,
  };
}
