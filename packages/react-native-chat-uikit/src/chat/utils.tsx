import {
  ChatMessage,
  ChatMessageType,
  ChatTextMessageBody,
} from 'react-native-chat-sdk';

import { formatTs2 } from '../utils';

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
