import * as React from 'react';

import { useChatContext } from '../../chat';
import { useLifecycle } from '../../hook';
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
  return {
    ...props,
    doNotDisturb,
    onDoNotDisturb,
    onClearChat,
    userName,
    userAvatar,
    userId,
    isContact,
  };
}
