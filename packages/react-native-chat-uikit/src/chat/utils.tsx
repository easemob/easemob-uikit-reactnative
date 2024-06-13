import {
  ChatConversationType,
  ChatCustomMessageBody,
  ChatFileMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageType,
  ChatPresence,
  ChatTextMessageBody,
  ChatVoiceMessageBody,
} from '../rename.chat';
import { emoji } from '../utils';
import {
  gCustomMessageCardEventType,
  gCustomMessageCreateGroupEventType,
  gCustomMessageRecallEventType,
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
  const isExisted = msg.attributes?.[gMessageAttributeUserInfo] !== undefined;
  if (!isExisted) {
    msg.attributes = {
      ...msg.attributes,
      [gMessageAttributeUserInfo]: {
        nickname: user.userName,
        avatarURL: user.avatarURL,
      } as UserServiceDataFromMessage,
    };
  }
}

/**
 * Get message snapshot.
 */
export function getMessageSnapshot(msg?: ChatMessage): string {
  if (msg === undefined) {
    return '';
  }
  let ret = '';
  switch (msg.body.type) {
    case ChatMessageType.TXT: {
      const content = emoji.toCodePointText(
        (msg.body as ChatTextMessageBody).content
      );
      ret = content;
      break;
    }

    case ChatMessageType.IMAGE:
      ret = '[image]';
      break;
    case ChatMessageType.VIDEO:
      ret = '[video]';
      break;
    case ChatMessageType.FILE:
      ret = '[file]';
      break;
    case ChatMessageType.LOCATION:
      ret = '[location]';
      break;
    case ChatMessageType.VOICE:
      ret = '[voice]';
      break;
    case ChatMessageType.CUSTOM:
      const body = msg.body as ChatCustomMessageBody;
      if (body.event === gCustomMessageCardEventType) {
        ret = '[contact]';
      } else if (body.event === gCustomMessageRecallEventType) {
        ret = body.params?.text ?? '';
      } else if (body.event === gCustomMessageCreateGroupEventType) {
        ret = body.params?.text ?? '';
      } else {
        ret = '[custom]';
      }
      break;
    case ChatMessageType.COMBINE:
      ret = '[combine]';
      break;

    default:
      ret = '[unknown]';
  }

  return ret;
}

export function getMessageSnapshotParams(msg?: ChatMessage): any[] {
  if (msg === undefined) {
    return [''];
  }
  switch (msg.body.type) {
    case ChatMessageType.VOICE: {
      const body = msg.body as ChatVoiceMessageBody;
      return [body.duration];
    }

    case ChatMessageType.FILE: {
      const body = msg.body as ChatFileMessageBody;
      return [body.displayName];
    }

    case ChatMessageType.CUSTOM: {
      const body = msg.body as ChatCustomMessageBody;
      if (body.event === gCustomMessageCardEventType) {
        return [body.params?.nickname ?? body.params?.userId];
      } else if (body.event === gCustomMessageRecallEventType) {
        return [body.params?.self === body.params?.from, body.params?.fromName];
      }
      return [''];
    }

    default:
      return [''];
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

export function createForwardMessage(params: {
  msgs: ChatMessage[];
  targetId: string;
  targetType: ChatConversationType;
  getSummary: (msgs: ChatMessage[]) => string;
}): ChatMessage | undefined {
  const { msgs, targetId, targetType, getSummary } = params;
  if (msgs.length === 1) {
    const msg = msgs[0]!;
    const newMsg = ChatMessage.createSendMessage({
      body: msg.body,
      targetId: targetId,
      chatType: targetType as number,
      // isChatThread: msg.isChatThread,
      isOnline: msg.isOnline,
      deliverOnlineOnly: msg.deliverOnlineOnly,
      receiverList: msg.receiverList,
    });
    if (msg.body.type === ChatMessageType.TXT) {
    } else if (msg.body.type === ChatMessageType.IMAGE) {
    } else if (msg.body.type === ChatMessageType.VOICE) {
    } else if (msg.body.type === ChatMessageType.VIDEO) {
    } else if (msg.body.type === ChatMessageType.FILE) {
    } else if (msg.body.type === ChatMessageType.LOCATION) {
    } else if (msg.body.type === ChatMessageType.COMBINE) {
    } else if (msg.body.type === ChatMessageType.CUSTOM) {
    }
    return newMsg;
  } else if (msgs.length > 1) {
    const msg = msgs[0]!;
    const msgIds = msgs.map((msg) => msg.msgId);
    const newMsg = ChatMessage.createCombineMessage(
      targetId,
      msgIds,
      targetType as number,
      {
        summary: getSummary(msgs),
        // isChatThread: msg.isChatThread,
        isOnline: msg.isOnline,
        deliverOnlineOnly: msg.deliverOnlineOnly,
        receiverList: msg.receiverList,
      }
    );
    return newMsg;
  }
  return undefined;
}

export class PresenceUtil {
  public static convertToProtocol = (status: string) => {
    if (status === 'online') {
      return '';
    } else if (status === 'busy') {
      return 'Busy';
    } else if (status === 'leave') {
      return 'Away';
    } else if (status === 'no-disturb') {
      return 'Do Not Disturb';
    } else {
      return status;
    }
  };
  public static convertFromProtocol = (status?: ChatPresence) => {
    if (status === undefined || status === null) {
      return 'offline';
    }
    let isOnline = false;
    let description = '';
    for (const detail of status.statusDetails) {
      if (detail[1] === 1) {
        isOnline = true;
        description = status.statusDescription;
        break;
      }
    }
    if (isOnline === true) {
      if (description === '') {
        return 'online';
      } else if (description === 'Busy') {
        return 'busy';
      } else if (description === 'Away') {
        return 'leave';
      } else if (description === 'Do Not Disturb') {
        return 'no-disturb';
      } else {
        return description;
      }
    } else {
      return 'offline';
    }
  };
}
