import type { ChatConversationType, ChatMessage } from 'react-native-chat-sdk';

import type { CommonManager } from './commonManager.types';
import type { ConversationModel } from './types';

export type MessageManagerListener = {
  onSendMessageChanged?: (msg: ChatMessage) => void;
  onRecvMessage?: (msg: ChatMessage) => void;
  onRecvMessageStatusChanged?: (msg: ChatMessage) => void;
  onRecvMessageContentChanged?: (msg: ChatMessage, byUserId: string) => void;
  onRecallMessage?: (msg: ChatMessage, byUserId: string) => void;
};

export interface MessageCacheManager
  extends CommonManager<MessageManagerListener> {
  setCurrentConvId(conv: ConversationModel): void;
  emitSendMessageChanged(msg: ChatMessage): void;
  emitAttachmentChanged(msg: ChatMessage): void;
  sendMessage(msg: ChatMessage): Promise<void>;
  downloadAttachment(msg: ChatMessage): Promise<void>;
  loadHistoryMessage(params: {
    convId: string;
    convType: ChatConversationType;
    startMsgId: string;
    onResult: (msgs: ChatMessage[]) => void;
  }): void;
  sendMessageReadAck(params: { message: ChatMessage }): void;
}
