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
  } = props;
  const alertRef = React.useRef<AlertRef>({} as any);
  const toastRef = React.useRef<SimpleToastRef>({} as any);
  const [doNotDisturb, setDoNotDisturb] = React.useState(propsDoNotDisturb);
  const [userName, _setUserName] = React.useState(propsUserName);
  const [userAvatar, _setUserAvatar] = React.useState(propsUserAvatar);
  const [userRemark, _setUserRemark] = React.useState(propsUserRemark);
  const [isContact, setIsContact] = React.useState(propsIsContact);
  const im = useChatContext();
  const { tr } = useI18nContext();

  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          // todo: get user info
          im.getUserInfo({
            userId,
            onResult: (value) => {
              if (value) {
                _setUserAvatar(value.value?.avatarURL);
                _setUserName(value.value?.userName);
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
      title: tr('clear_chat'),
      message: tr('clear_chat_confirm'),
      buttons: [
        {
          text: tr('Cancel'),
          onPress: () => {
            alertRef.current.close();
          },
        },
        {
          text: tr('Confirm'),
          isPreferred: true,
          onPress: () => {
            alertRef.current.close();
            im.removeConversation({ convId: userId })
              .then(() => {})
              .catch((e) => {
                im.sendError({ error: e });
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
    } else {
      // todo: add remark
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
  };
}
