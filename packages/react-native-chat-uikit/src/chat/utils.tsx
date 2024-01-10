import {
  ChatCustomMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageType,
  ChatTextMessageBody,
} from 'react-native-chat-sdk';

import { g_not_existed_url } from '../const';
import { emoji } from '../utils';
import {
  gMessageAttributeUserInfo,
  gNewRequestConversationMsgEventType,
  gNewRequestConversationState,
  gNewRequestConversationTip,
  gNewRequestConversationUserAvatar,
  gNewRequestConversationUserId,
  gNewRequestConversationUserName,
} from './const';
import type { UserData, UserServiceDataFromMessage } from './types';
import type { NewRequestModel } from './types.ui';

export function userInfoFromMessage(msg?: ChatMessage): UserData | undefined {
  if (msg === undefined || msg === null) {
    return undefined;
  }
  const jsonUserInfo = (msg.attributes as any)[gMessageAttributeUserInfo];
  if (jsonUserInfo) {
    const userInfo = jsonUserInfo as UserServiceDataFromMessage;
    const ret = {
      userId: msg.from,
      userName: userInfo.nickname,
      avatarURL: userInfo.avatarURL ?? g_not_existed_url,
      from: {
        type: msg.chatType === ChatMessageChatType.GroupChat ? 'group' : 'user',
        groupId:
          msg.chatType === ChatMessageChatType.GroupChat
            ? msg.conversationId
            : undefined,
      },
    } as UserData;
    return ret;
  }

  return undefined;
}

export function setUserInfoToMessage(params: {
  msg: ChatMessage;
  user?: UserData;
}): void {
  const { msg, user } = params;
  if (user === undefined || user === null) {
    return;
  }
  msg.attributes = {
    ...msg.attributes,
    [gMessageAttributeUserInfo]: {
      nickname: user.userName,
      avatarURL: user.avatarURL ?? g_not_existed_url,
    } as UserServiceDataFromMessage,
  };
}

export function getMessageSnapshot(msg?: ChatMessage): string {
  if (msg === undefined) {
    return '';
  }
  switch (msg.body.type) {
    case ChatMessageType.TXT: {
      const content = emoji.toCodePointText(
        (msg.body as ChatTextMessageBody).content
      );
      if (msg.chatType === ChatMessageChatType.GroupChat) {
        const user = userInfoFromMessage(msg);
        return `${user?.userName ?? user?.userId ?? msg.from}: ${content}`;
      } else {
        return content;
      }
    }

    case ChatMessageType.IMAGE:
      return '[image]';
    case ChatMessageType.VIDEO:
      return '[video]';
    case ChatMessageType.FILE:
      return '[file]';
    case ChatMessageType.LOCATION:
      return '[location]';
    case ChatMessageType.VOICE:
      return '[voice]';
    case ChatMessageType.CUSTOM:
      return '[custom]';

    default:
      return '[unknown]';
  }
}
// export function getMessageFormatTime(
//   msg?: ChatMessage,
//   timestamp?: number
// ): string {
//   if (msg === undefined && timestamp) {
//     return formatTsForConvList(timestamp);
//   } else if (msg) {
//     return formatTsForConvList(msg.localTime);
//   } else {
//     return '';
//   }
// }

export function getNewRequest(msg?: ChatMessage): NewRequestModel | undefined {
  if (msg === undefined) {
    return undefined;
  }
  if (msg.body.type !== ChatMessageType.CUSTOM) {
    return undefined;
  } else if (msg.body.type === ChatMessageType.CUSTOM) {
    if (
      (msg.body as ChatCustomMessageBody).event !==
      gNewRequestConversationMsgEventType
    ) {
      return undefined;
    }
  }
  return {
    requestId: msg.attributes[gNewRequestConversationUserId] as string,
    avatar: msg.attributes[gNewRequestConversationUserAvatar] as string,
    name: msg.attributes[gNewRequestConversationUserName] as string,
    tip: msg.attributes[gNewRequestConversationTip] as string,
    state: msg.attributes[gNewRequestConversationState],
    msg: msg,
  };
}
