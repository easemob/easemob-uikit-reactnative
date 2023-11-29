import {
  ChatCustomMessageBody,
  ChatMessage,
  ChatMessageType,
  ChatTextMessageBody,
} from 'react-native-chat-sdk';

import { formatTs2 } from '../utils';
import {
  gNewRequestConversationMsgEventType,
  gNewRequestConversationState,
  gNewRequestConversationTip,
  gNewRequestConversationUserAvatar,
  gNewRequestConversationUserId,
  gNewRequestConversationUserName,
} from './const';
import type { NewRequestModel } from './types';

export function getMessageSnapshot(msg?: ChatMessage): string {
  if (msg === undefined) {
    return '';
  }
  switch (msg.body.type) {
    case ChatMessageType.TXT:
      return (msg.body as ChatTextMessageBody).content;
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
export function getMessageFormatTime(
  msg?: ChatMessage,
  timestamp?: number
): string {
  if (msg === undefined && timestamp) {
    return formatTs2(timestamp);
  } else if (msg) {
    return formatTs2(msg.localTime);
  } else {
    return '';
  }
}

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
    id: msg.attributes[gNewRequestConversationUserId] as string,
    avatar: msg.attributes[gNewRequestConversationUserAvatar] as string,
    name: msg.attributes[gNewRequestConversationUserName] as string,
    tip: msg.attributes[gNewRequestConversationTip] as string,
    state: msg.attributes[gNewRequestConversationState],
    msg: msg,
  };
}
