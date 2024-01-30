import * as React from 'react';
import { ChatMessage, ChatMessageChatType } from 'react-native-chat-sdk';

import {
  ContactModel,
  gCustomMessageCreateGroupEventType,
  GroupModel,
  useChatContext,
} from '../../chat';
import { setUserInfoToMessage } from '../../chat/utils';
import { useConfigContext } from '../../config';
import { ErrorCode, UIKitError } from '../../error';
import { useI18nContext } from '../../i18n';
import type { CreateGroupProps } from './types';

export function useCreateGroup(props: CreateGroupProps) {
  const { onCreateGroupResult: propsOnCreateGroupResult, onGetGroupName } =
    props;
  const im = useChatContext();
  const { group: groupConfig } = useConfigContext();
  const { tr } = useI18nContext();

  React.useEffect(() => {
    if (onGetGroupName) {
      im.setGroupNameOnCreateGroup(onGetGroupName);
    }
  }, [im, onGetGroupName]);

  const createMessageTip = React.useCallback(
    (_data: ContactModel[], group: GroupModel): ChatMessage => {
      const groupId = group.groupId;
      // const groupName = group.groupName;
      // const groupAvatar = group.groupAvatar;
      const tipMsg = ChatMessage.createCustomMessage(
        groupId,
        gCustomMessageCreateGroupEventType,
        ChatMessageChatType.GroupChat,
        {
          params: {
            create_group: JSON.stringify({
              text: '_uikit_msg_tip_create_group_success_with_params',
              self: im.userId,
            }),
          },
        }
      );
      const s = im.user(im.userId);
      setUserInfoToMessage({ msg: tipMsg, user: s });
      return tipMsg;
    },
    [im]
  );

  const generateGroupName = React.useCallback(
    (data: ContactModel[]): string => {
      const callback = im.getCreateGroupCustomNameCallback();
      if (callback) {
        return callback({ selected: data });
      } else {
        const s = data
          .map((item) => item.userName ?? item.userId)
          .filter((_v, i) => i < 3)
          .join(',');
        return tr('_uikit_group_create_name', `${s}`);
      }
    },
    [im, tr]
  );
  const onCreateGroupResultValue = React.useCallback(
    (data?: ContactModel[]) => {
      if (data && data.length > 0) {
        const newGroupName = generateGroupName(data);
        if (
          groupConfig.createGroupMemberLimit &&
          data.length > groupConfig.createGroupMemberLimit
        ) {
          propsOnCreateGroupResult?.({
            isOk: false,
            error: new UIKitError({
              code: ErrorCode.chat_uikit,
              desc: 'The number of selected members exceeds the limit. ',
            }),
          });
          return;
        }
        im.createGroup({
          groupName: newGroupName,
          inviteMembers: data.map((item) => item.userId),
          onResult: (result) => {
            if (result.isOk === true && result.value) {
              const msg = createMessageTip(data, result.value);
              im.insertMessage({
                message: msg,
                onResult: () => {
                  propsOnCreateGroupResult?.(result);
                },
              });
            }
          },
        });
      }
    },
    [
      createMessageTip,
      generateGroupName,
      groupConfig.createGroupMemberLimit,
      im,
      propsOnCreateGroupResult,
    ]
  );
  return {
    onCreateGroupResultValue,
  };
}
