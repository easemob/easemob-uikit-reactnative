import * as React from 'react';

import {
  UIConversationListListener,
  UIListenerType,
  useChatContext,
} from '../../chat';
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
    onDoNotDisturb: propsOnDoNotDisturb,
    onClearChat: propsOnClearChat,
    isContact: propsIsContact,
    onInitMenu,
    onSendMessage: propsOnSendMessage,
    onAudioCall: propsOnAudioCall,
    onVideoCall: propsOnVideoCall,
    onMore: propsOnMore,
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
    onInit: onInitMenu,
    onRemoveContact: () => {
      im.removeContact({ userId });
      im.removeConversation({ convId: userId });
    },
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
                  setUserAvatar(value.value?.userAvatar);
                  setUserName(value.value?.userName);
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
    if (propsOnDoNotDisturb) {
      propsOnDoNotDisturb(value);
      return;
    }
    im.setConversationSilentMode({
      convId: userId,
      convType: 0,
      doNotDisturb: value,
    });
  };
  const onClearChat = () => {
    if (propsOnClearChat) {
      propsOnClearChat();
      return;
    }
    alertRef.current.alertWithInit({
      message: tr('_uikit_info_alert_clear_chat_title'),
      buttons: [
        {
          text: tr('cancel'),
          onPress: () => {
            alertRef.current.close();
          },
        },
        {
          text: tr('confirm'),
          isPreferred: true,
          onPress: () => {
            alertRef.current.close(() => {
              im.removeConversation({ convId: userId });
            });
          },
        },
      ],
    });
  };

  const onRequestCloseMenu = () => {
    menuRef.current?.startHide?.();
  };

  const onMoreMenu = () => {
    if (propsOnMore) {
      propsOnMore();
      return;
    }
    onShowContactInfoActions(userId, userName);
  };

  const onSendMessage = () => {
    if (propsOnSendMessage) {
      propsOnSendMessage(userId);
    }
  };

  const onAudioCall = () => {
    if (propsOnAudioCall) {
      propsOnAudioCall(userId);
    }
  };

  const onVideoCall = () => {
    if (propsOnVideoCall) {
      propsOnVideoCall(userId);
    }
  };

  React.useEffect(() => {
    const listener: UIConversationListListener = {
      onUpdatedEvent: (data) => {
        if (data.convId === userId) {
          setDoNotDisturb(data.doNotDisturb);
        }
      },
      type: UIListenerType.Conversation,
    };
    im.addUIListener(listener);
    return () => {
      im.removeUIListener(listener);
    };
  }, [im, userId]);

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
    onRequestCloseMenu,
    onMore: onMoreMenu,
    alertRef,
    toastRef,
    tr,
    isSelf,
    onSendMessage,
    onAudioCall,
    onVideoCall,
  };
}
