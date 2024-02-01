import {
  ChatCustomMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageType,
  ChatTextMessageBody,
} from 'react-native-chat-sdk';

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

/**
 * Get user info from message.
 */
export function userInfoFromMessage(
  msg?: ChatMessage | undefined | null
): UserData | undefined {
  if (msg === undefined || msg === null) {
    return undefined;
  }
  const jsonUserInfo = (msg.attributes as any)[gMessageAttributeUserInfo];
  if (jsonUserInfo) {
    const userInfo = jsonUserInfo as UserServiceDataFromMessage;
    const ret = {
      userId: msg.from,
      userName: userInfo.nickname,
      avatarURL: userInfo.avatarURL,
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

/**
 * Set user info to message.
 */
export function setUserInfoToMessage(params: {
  msg: ChatMessage;
  user?: UserData;
}): void {
  const { msg, user } = params;
  if (
    user === undefined ||
    user === null ||
    (user.userName === undefined && user.avatarURL === undefined)
  ) {
    return;
  }
  msg.attributes = {
    ...msg.attributes,
    [gMessageAttributeUserInfo]: {
      nickname: user.userName,
      avatarURL: user.avatarURL,
    } as UserServiceDataFromMessage,
  };
}

/**
 * Get message snapshot.
 */
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

/**
 * Get new request from message.
 */
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
