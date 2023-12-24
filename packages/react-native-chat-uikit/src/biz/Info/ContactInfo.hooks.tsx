import * as React from 'react';

import { useChatContext } from '../../chat';
import { useLifecycle } from '../../hook';
import type { AlertRef } from '../../ui/Alert';
import type { SimpleToastRef } from '../../ui/Toast';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import type { ContactInfoProps } from './types';

export function useContactInfo(props: ContactInfoProps) {
  const {
    userId,
    userName: propsUserName,
    userAvatar: propsUserAvatar,
    doNotDisturb: propsDoNotDisturb,
    onClearChat: propsOnClearChat,
    isContact: propsIsContact,
  } = props;
  const [doNotDisturb, setDoNotDisturb] = React.useState(propsDoNotDisturb);
  const [userName, setUserName] = React.useState(propsUserName);
  const [userAvatar, setUserAvatar] = React.useState(propsUserAvatar);
  const [isContact, setIsContact] = React.useState(propsIsContact);
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const toastRef = React.useRef<SimpleToastRef>({} as any);
  const im = useChatContext();
  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          im.getConversation({
            convId: userId,
            convType: 0,
            createIfNotExist: true,
          })
            .then((value) => {
              setDoNotDisturb(value?.doNotDisturb ?? false);
            })
            .catch((e) => {
              im.sendError({ error: e });
            });

          im.getContact({
            userId: userId,
            onResult: (value) => {
              if (value) {
                setUserAvatar(value.value?.avatar);
                setUserName(value.value?.nickName);
              }
            },
          });
          setIsContact(im.isContact({ userId }));
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

  const onMoreMenu = () => {
    menuRef.current?.startShowWithProps({
      onRequestModalClose: onRequestModalClose,
      layoutType: 'center',
      hasCancel: true,
      initItems: [
        {
          name: 'Delete Contact',
          isHigh: true,
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
              alertRef.current?.alertWithInit({
                title: 'Delete Contact',
                message: 'Are you sure you want to delete this contact?',
                buttons: [
                  {
                    text: 'Cancel',
                    onPress: () => {
                      alertRef.current?.close?.();
                    },
                  },
                  {
                    text: 'Confirm',
                    isPreferred: true,
                    onPress: () => {
                      alertRef.current?.close?.(() => {
                        im.removeContact({ userId, onResult: () => {} });
                      });
                    },
                  },
                ],
              });
            });
          },
        },
      ],
    });
  };

  return {
    ...props,
    doNotDisturb,
    onDoNotDisturb,
    onClearChat,
    userName,
    userAvatar,
    userId,
    isContact,
    menuRef,
    onRequestModalClose,
    onMore: onMoreMenu,
    alertRef,
    toastRef,
  };
}
