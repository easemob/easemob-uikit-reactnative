import type { ChatConversationType, ChatMessage } from 'react-native-chat-sdk';

import type { CommonManager } from './commonManager.types';
import type { ConversationModel } from './types.ui';

export type MessageManagerListener = {
  onSendMessageChanged?: (msg: ChatMessage) => void;
  onSendMessageProgressChanged?: (msg: ChatMessage) => void;
  onSendMessageBefore?: (msg: ChatMessage) => void;
  onRecallMessageBefore?: (msg: ChatMessage) => void;
  onRecallMessageResult?: (params: {
    isOk: boolean;
    orgMsg?: ChatMessage;
    tipMsg?: ChatMessage;
  }) => void;
  onRecvMessage?: (msg: ChatMessage) => void;
  onRecvMessageStatusChanged?: (msg: ChatMessage) => void;
  onRecvMessageContentChanged?: (msg: ChatMessage, byUserId: string) => void;
  onMessageAttachmentChanged?: (msg: ChatMessage) => void;
  onMessageAttachmentProgressChanged?: (msg: ChatMessage) => void;
  onRecvRecallMessage?: (orgMsg: ChatMessage, tipMsg: ChatMessage) => void;
  onAllConversationUnreadCountChanged?: (count: number) => void;
};

export interface MessageCacheManager
  extends CommonManager<MessageManagerListener> {
  setCurrentConvId(conv: ConversationModel): void;
  emitSendMessageChanged(msg: ChatMessage): void;
  emitAttachmentChanged(msg: ChatMessage): void;
  sendMessage(msg: ChatMessage): Promise<void>;
  resendMessage(msg: ChatMessage): Promise<void>;
  recallMessage(msg: ChatMessage): Promise<void>;
  downloadAttachment(msg: ChatMessage): Promise<void>;
  loadHistoryMessage(params: {
    convId: string;
    convType: ChatConversationType;
    startMsgId: string;
    loadCount: number;
    onResult: (msgs: ChatMessage[]) => void;
  }): void;
  sendMessageReadAck(params: { message: ChatMessage }): void;
  setMessageRead(params: {
    convId: string;
    convType: ChatConversationType;
    message: ChatMessage;
  }): void;
  createRecallMessageTip(msg: ChatMessage): ChatMessage;
  setRecallMessageTimeout(recallTimeout?: number): void;
  emitConversationUnreadCountChanged(): void;
}
