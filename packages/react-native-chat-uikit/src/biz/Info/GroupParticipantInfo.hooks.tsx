import * as React from 'react';
import { ChatConversationType } from 'react-native-chat-sdk';

import {
  ContactServiceListener,
  UIConversationListListener,
  UIListenerType,
  useChatContext,
} from '../../chat';
import { useLifecycle } from '../../hook';
import { useI18nContext } from '../../i18n';
import { Services } from '../../services';
import type { AlertRef } from '../../ui/Alert';
import type { SimpleToastRef } from '../../ui/Toast';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useCloseMenu } from '../hooks';
import type { GroupParticipantInfoProps } from './types';

export function useGroupParticipantInfo(props: GroupParticipantInfoProps) {
  const {
    groupId,
    userId,
    userName: propsUserName,
    userAvatar: propsUserAvatar,
    userRemark: propsUserRemark,
    doNotDisturb: propsDoNotDisturb,
    onDoNotDisturb: propsOnDoNotDisturb,
    onClearChat: propsOnClearChat,
    onCopyId: propsOnCopyId,
    onGroupParticipantRemark: propsOnGroupParticipantRemark,
    isContact: propsIsContact,
    onAddContact: propsOnAddContact,
    onSendMessage: propsOnSendMessage,
    onAudioCall: propsOnAudioCall,
    onVideoCall: propsOnVideoCall,
  } = props;
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const toastRef = React.useRef<SimpleToastRef>({} as any);
  const [doNotDisturb, setDoNotDisturb] = React.useState(propsDoNotDisturb);
  const [userName, _setUserName] = React.useState(propsUserName);
  const [userAvatar, _setUserAvatar] = React.useState(propsUserAvatar);
  const [userRemark, _setUserRemark] = React.useState(propsUserRemark);
  const [isContact, setIsContact] = React.useState(propsIsContact);
  const [isSelf, setIsSelf] = React.useState(false);
  const im = useChatContext();
  const { tr } = useI18nContext();
  const { closeMenu } = useCloseMenu({ menuRef });

  const addContact = React.useCallback(
    (userId: string) => {
      im.addNewContact({
        userId: userId,
        reason: 'add contact',
      });
    },
    [im]
  );

  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          setIsContact(im.isContact({ userId }));
          setIsSelf(im.userId === userId);
          im.getConversation({
            convId: userId,
            convType: ChatConversationType.PeerChat,
          })
            .then((result) => {
              setDoNotDisturb(result?.doNotDisturb ?? false);
            })
            .catch();
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
      convType: ChatConversationType.PeerChat,
      doNotDisturb: value,
    });
  };
  const onClearChat = () => {
    if (propsOnClearChat) {
      propsOnClearChat();
      return;
    }
    alertRef.current.alertWithInit({
      title: tr('_uikit_info_alert_clear_chat_title'),
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
              im.removeConversationAllMessages({ convId: userId, convType: 0 });
            });
          },
        },
      ],
    });
  };

  const onCopyId = () => {
    if (propsOnCopyId) {
      propsOnCopyId(userId);
      return;
    }
    Services.cbs.setString(userId);
    toastRef.current.show({
      message: tr('copy_success'),
    });
  };

  const onRemark = () => {
    if (propsOnGroupParticipantRemark) {
      propsOnGroupParticipantRemark(groupId, userId);
    }
  };

  const onAddContact = () => {
    if (propsOnAddContact) {
      propsOnAddContact(userId);
      return;
    }
    addContact(userId);
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
        if (data.convId === groupId) {
          setDoNotDisturb(data.doNotDisturb ?? false);
        }
      },
      type: UIListenerType.Conversation,
    };
    im.addUIListener(listener);
    return () => {
      im.removeUIListener(listener);
    };
  }, [groupId, im]);

  React.useEffect(() => {
    const listener: ContactServiceListener = {
      onContactAdded: async (_userId: string) => {
        if (userId === _userId) {
          setIsContact(true);
        }
      },
      onContactDeleted: async (_userId: string) => {
        if (userId === _userId) {
          setIsContact(false);
        }
      },
    };
    im.addListener(listener);
    return () => {
      im.removeListener(listener);
    };
  }, [im, userId]);

  return {
    ...props,
    doNotDisturb,
    onDoNotDisturb,
    onClearChat,
    alertRef,
    userName,
    userAvatar,
    userRemark,
    onCopyId,
    toastRef,
    onRemark,
    isContact,
    tr,
    onAddContact,
    onSendMessage,
    onVideoCall,
    onAudioCall,
    isSelf,
    onRequestCloseMenu: closeMenu,
    menuRef,
  };
}
