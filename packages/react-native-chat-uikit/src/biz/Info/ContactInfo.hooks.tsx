import * as React from 'react';

import { useChatContext } from '../../chat';
import { useLifecycle } from '../../hook';
import { useI18nContext } from '../../i18n';
import type { AlertRef } from '../../ui/Alert';
import type { SimpleToastRef } from '../../ui/Toast';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useContactInfoActions } from '../hooks/useContactInfoActions';
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
  const [isSelf, setIsSelf] = React.useState(false);
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const toastRef = React.useRef<SimpleToastRef>({} as any);
  const { onShowContactInfoActions } = useContactInfoActions({
    menuRef,
    alertRef,
  });
  const im = useChatContext();
  const { tr } = useI18nContext();
  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          setIsContact(im.isContact({ userId }));
          setIsSelf(im.userId === userId);

          if (im.userId !== userId) {
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
          } else {
            const user = im.user(im.userId);
            setUserAvatar(user?.avatarURL);
            setUserName(user?.userName);
          }
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
    onShowContactInfoActions(userId, userName);
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
    tr,
    isSelf,
  };
}
