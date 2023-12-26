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
  const im = useChatContext();
  const { tr } = useI18nContext();
  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          im.getUserInfo({
            userId: userId,
            onResult: (result) => {
              if (result.isOk && result.value) {
                setUserName(result.value.userName);
                setUserSign(result.value.sign);
              }
            },
          });
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

  const onRequestModalClose = () => {
    menuRef.current?.startHide?.();
  };

  const onShowStateMenu = React.useCallback(() => {
    menuRef.current?.startShowWithProps({
      onRequestModalClose: onRequestModalClose,
      layoutType: 'center',
      hasCancel: true,
      initItems: [
        {
          name: 'Online',
          isHigh: false,
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
              im.publishPresence({ status: 'online', onResult: () => {} });
            });
          },
        },
        {
          name: 'Busy',
          isHigh: false,
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
              im.publishPresence({ status: 'busy', onResult: () => {} });
            });
          },
        },
        {
          name: 'Leave',
          isHigh: false,
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
              im.publishPresence({ status: 'leave', onResult: () => {} });
            });
          },
        },
        {
          name: 'Not Disturb',
          isHigh: false,
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
              im.publishPresence({ status: 'no-disturb', onResult: () => {} });
            });
          },
        },
      ],
    });
  }, [im]);

  const onClickedState = React.useCallback(() => {
    onShowStateMenu();
  }, [onShowStateMenu]);

  const onClickedLogout = React.useCallback(() => {
    propsOnClickedLogout?.();
  }, [propsOnClickedLogout]);

  const listener = React.useMemo(() => {
    return {
      onPresenceStatusChanged: (list: ChatPresence[]) => {
        console.log('test:zuoyu:onPresenceStatusChanged', list.length);
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
    onRequestModalClose,
    alertRef,
    toastRef,
    userSign,
    onClickedState,
    onClickedLogout,
    userState,
    tr,
  };
}
