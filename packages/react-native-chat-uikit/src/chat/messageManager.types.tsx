import type { ChatConversationType, ChatMessage } from 'react-native-chat-sdk';

import type { CommonManager } from './commonManager.types';
import type { ConversationModel } from './types.ui';

/**
 * Message Manager Listener.
 */
export type MessageManagerListener = {
  /**
   * Callback notification of the status of the sent message. Message updates will be triggered when the message is sent successfully, the message has been read, and the message receipt is received.
   */
  onSendMessageChanged?: (msg: ChatMessage) => void;
  /**
   * Sending a message of attachment type will trigger a progress callback notification.
   */
  onSendMessageProgressChanged?: (msg: ChatMessage) => void;
  /**
   * Callback notification before sending message.
   */
  onSendMessageBefore?: (msg: ChatMessage) => void;
  /**
   * Callback notification before recalling message.
   */
  onRecallMessageBefore?: (msg: ChatMessage) => void;
  /**
   * Callback notification for recalling message result.
   */
  onRecallMessageResult?: (params: {
    isOk: boolean;
    orgMsg?: ChatMessage;
    tipMsg?: ChatMessage;
  }) => void;
  /**
   * Callback notification of received message.
   */
  onRecvMessage?: (msg: ChatMessage) => void;
  /**
   * Callback notification of received message status change.
   */
  onRecvMessageStatusChanged?: (msg: ChatMessage) => void;
  /**
   * Callback notification of received message content change.
   */
  onRecvMessageContentChanged?: (msg: ChatMessage, byUserId: string) => void;
  /**
   * Callback notification of received message attachment change.
   */
  onMessageAttachmentChanged?: (msg: ChatMessage) => void;
  /**
   * Callback notification of received message attachment progress change.
   */
  onMessageAttachmentProgressChanged?: (msg: ChatMessage) => void;
  /**
   * Callback notification of recalled message.
   *
   * @param orgMsg Recall original message.
   * @param tipMsg Recall tip message.
   */
  onRecvRecallMessage?: (orgMsg: ChatMessage, tipMsg: ChatMessage) => void;
  onAllConversationUnreadCountChanged?: (count: number) => void;
};

/**
 * Global message manager. Used when the component is not loaded and new messages are received and need to be processed.
 */
export interface MessageCacheManager
  extends CommonManager<MessageManagerListener> {
  /**
   * Set current conversation.
   */
  setCurrentConv(conv?: ConversationModel): void;
  /**
   * Get current conversation.
   */
  getCurrentConv(): ConversationModel | undefined;
  /**
   * Send changed message.
   */
  emitSendMessageChanged(msg: ChatMessage): void;
  /**
   * Send changed attachment message.
   */
  emitAttachmentChanged(msg: ChatMessage): void;
  /**
   * Send message.
   *
   * This method encapsulates `sendMessage` of `ChatService`. Added event notification for message status changes.
   */
  sendMessage(msg: ChatMessage): Promise<void>;
  /**
   * Resend message.
   *
   * This method encapsulates `resendMessage` of `ChatService`. Added event notification for message status changes.
   */
  resendMessage(msg: ChatMessage): Promise<void>;
  /**
   * Recall message.
   *
   * This method encapsulates `recallMessage` of `ChatService`. Added event notification for message status changes.
   */
  recallMessage(msg: ChatMessage): Promise<void>;
  /**
   * Download attachment.
   *
   * This method encapsulates `downloadAttachment` of `ChatService`. Added event notification for message status changes.
   */
  downloadAttachment(msg: ChatMessage): Promise<void>;
  /**
   * Get history messages.
   */
  loadHistoryMessage(params: {
    convId: string;
    convType: ChatConversationType;
    startMsgId: string;
    loadCount: number;
    onResult: (msgs: ChatMessage[]) => void;
  }): void;
  /**
   * Send message read ack for received message.
   */
  sendMessageReadAck(params: { message: ChatMessage }): void;
  /**
   * Set message read status for received message.
   */
  setMessageRead(params: {
    convId: string;
    convType: ChatConversationType;
    message: ChatMessage;
  }): void;
  /**
   * Create recall message tip.
   */
  createRecallMessageTip(msg: ChatMessage): ChatMessage;
  /**
   * Set recall message timeout.
   */
  setRecallMessageTimeout(recallTimeout?: number): void;
  /**
   * send conversation unread count change.
   */
  emitConversationUnreadCountChanged(): void;
}
