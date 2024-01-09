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
import type { CreateGroupProps } from './types';

export function useCreateGroup(props: CreateGroupProps) {
  const { onCreateGroupResult: propsOnCreateGroupResult } = props;
  const im = useChatContext();
  const { group: groupConfig } = useConfigContext();

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
              text: '_uikit_msg_tip_create_group',
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
      const s = data
        .map((item) => item.nickName ?? item.userId)
        .filter((_v, i) => i < 3)
        .join(',');
      return `${s}的群聊`;
    },
    []
  );
  const onCreateGroupResultValue = React.useCallback(
    (data?: ContactModel[]) => {
      if (data && data.length > 0) {
        const groupName = generateGroupName(data);
        if (
          groupConfig.createGroupMemberLimit &&
          data.length > groupConfig.createGroupMemberLimit
        ) {
          propsOnCreateGroupResult?.({
            isOk: false,
            error: new UIKitError({
              code: ErrorCode.common,
              desc: 'The number of selected members exceeds the limit. ',
            }),
          });
          return;
        }
        im.createGroup({
          groupName: groupName,
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
