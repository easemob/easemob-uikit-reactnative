import * as React from 'react';
import { ChatConversationType } from 'react-native-chat-sdk';

import { useChatContext } from '../../chat';
import { useLifecycle } from '../../hook';
import { useI18nContext } from '../../i18n';
import { Services } from '../../services';
import type { AlertRef } from '../../ui/Alert';
import type { SimpleToastRef } from '../../ui/Toast';
import type { GroupParticipantInfoProps } from './types';

export function useGroupParticipantInfo(props: GroupParticipantInfoProps) {
  const {
    groupId,
    userId,
    userName: propsUserName,
    userAvatar: propsUserAvatar,
    userRemark: propsUserRemark,
    doNotDisturb: propsDoNotDisturb,
    onClearChat: propsOnClearChat,
    onCopyId: propsOnCopyId,
    onGroupParticipantRemark: propsOnGroupParticipantRemark,
    isContact: propsIsContact,
    onAddContact: propsOnAddContact,
    onSendMessage: propsOnSendMessage,
    onAudioCall: propsOnAudioCall,
    onVideoCall: propsOnVideoCall,
  } = props;
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

  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          setIsContact(im.isContact({ userId }));
          setIsSelf(im.userId === userId);
        }
      },
      [im, userId]
    )
  );

  const onDoNotDisturb = (value: boolean) => {
    im.setConversationSilentMode({
      convId: userId,
      convType: ChatConversationType.PeerChat,
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
    }
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
  };
}
