import {
  ChatConversationType,
  ChatDownloadStatus,
  ChatFileMessageBody,
  ChatGroupMessageAck,
  ChatMessage,
  ChatMessageStatus,
  ChatMessageStatusCallback,
  ChatMessageType,
  ChatSearchDirection,
} from 'react-native-chat-sdk';

import { ErrorCode, UIKitError } from '../error';
import { getCurTs } from '../utils';
import { gCustomMessageRecallEventType } from './const';
import type {
  MessageCacheManager,
  MessageManagerListener,
} from './messageManager.types';
import type {
  ChatService,
  ChatServiceListener,
  ConversationModel,
} from './types';

let gListener: ChatServiceListener | undefined;

export class MessageCacheManagerImpl implements MessageCacheManager {
  _client: ChatService;
  _listener?: ChatServiceListener;
  _userListener: Map<string, MessageManagerListener>;
  _sendList: Map<string, { msg: ChatMessage }>;
  _downloadList: Map<string, { msg: ChatMessage }>;
  _conv?: ConversationModel;
  _recallTimeout: number;
  constructor(client: ChatService) {
    console.log('dev:MessageCacheManager:constructor');
    this._client = client;
    this._userListener = new Map();
    this._sendList = new Map();
    this._downloadList = new Map();
    this._recallTimeout = 120000;
  }
  init() {
    this.unInit();
    console.log('dev:MessageCacheManager:init');
    gListener = {
      onMessagesReceived: this.bindOnMessagesReceived.bind(this),
      onMessagesRead: this.bindOnMessagesRead.bind(this),
      onGroupMessageRead: this.bindOnGroupMessageRead.bind(this),
      onMessagesDelivered: this.bindOnMessagesDelivered.bind(this),
      onMessagesRecalled: this.bindOnMessagesRecalled.bind(this),
      onMessageContentChanged: this.bindOnMessageContentChanged.bind(this),
    };
    this._client.addListener(gListener);
  }
  unInit() {
    this.reset();
    console.log('dev:MessageCacheManager:unInit');
    if (gListener) {
      this._client.removeListener(gListener);
      gListener = undefined;
    }
  }
  reset() {
    console.log('dev:MessageCacheManager:reset');
    this._userListener.clear();
    this._sendList.clear();
    this._downloadList.clear();
  }

  addListener(key: string, listener: MessageManagerListener) {
    console.log('dev:MessageCacheManager:addListener', key);
    this._userListener.set(key, listener);
  }
  removeListener(key: string) {
    console.log('dev:MessageCacheManager:removeListener');
    this._userListener.delete(key);
  }
  emitSendMessageChanged(msg: ChatMessage) {
    this._userListener.forEach((v) => {
      v.onSendMessageChanged?.(msg);
    });
  }
  emitSendMessageBefore(msg: ChatMessage) {
    this._userListener.forEach((v) => {
      v.onSendMessageBefore?.(msg);
    });
  }
  emitRecallMessageBefore(msg: ChatMessage) {
    this._userListener.forEach((v) => {
      v.onRecallMessageBefore?.(msg);
    });
  }
  emitRecallMessageChanged(params: {
    isOk: boolean;
    orgMsg?: ChatMessage;
    tipMsg?: ChatMessage;
  }) {
    this._userListener.forEach((v) => {
      v.onRecallMessageResult?.(params);
    });
  }
  emitRecvMessageStateChanged(msg: ChatMessage) {
    this._userListener.forEach((v) => {
      v.onRecvMessageStatusChanged?.(msg);
    });
  }
  emitAttachmentChanged(msg: ChatMessage) {
    this._userListener.forEach((v) => {
      v.onMessageAttachmentChanged?.(msg);
    });
  }
  bindOnMessagesReceived(messages: Array<ChatMessage>) {
    console.log(
      'dev:MessageCacheManager:bindOnMessagesReceived',
      messages.length,
      this._userListener?.size
    );
    messages.forEach((msg) => {
      this._userListener.forEach((v) => {
        v.onRecvMessage?.(msg);
      });
    });
  }
  bindOnMessagesRead(messages: Array<ChatMessage>) {
    messages.forEach((msg) => {
      this._userListener.forEach((v) => {
        v.onRecvMessageStatusChanged?.(msg);
      });
    });
  }
  bindOnGroupMessageRead(_groupMessageAcks: Array<ChatGroupMessageAck>): void {
    // todo: get message for group
    // groupMessageAcks.forEach((ack) => {
    //   this._userListener.forEach((v) => {
    //     v.onRecvMessageStatusChanged?.(ack.message);
    //   });
    // });
  }
  bindOnMessagesDelivered(messages: Array<ChatMessage>): void {
    messages.forEach((msg) => {
      this._userListener.forEach((v) => {
        v.onRecvMessageStatusChanged?.(msg);
      });
    });
  }
  bindOnMessagesRecalled(messages: Array<ChatMessage>): void {
    messages.forEach((msg) => {
      const tipMsg = this.createRecallMessageTip(msg);
      this._client.insertMessage({
        message: tipMsg,
        onResult: () => {
          this._userListener.forEach((v) => {
            v.onRecvRecallMessage?.(msg, tipMsg);
          });
        },
      });
    });
  }
  bindOnMessageContentChanged(
    message: ChatMessage,
    lastModifyOperatorId: string,
    _lastModifyTime: number
  ): void {
    this._userListener.forEach((v) => {
      v.onRecvMessageContentChanged?.(message, lastModifyOperatorId);
    });
  }

  setCurrentConvId(conv: ConversationModel): void {
    console.log('dev:MessageCacheManager:', conv);
    this._conv = conv;
  }
  sendMessageReadAck(params: { message: ChatMessage }): void {
    this._client.sendMessageReadAck({
      message: params.message,
      onResult: (result) => {
        if (result.isOk === true) {
          const hasReadAck = params.message.hasReadAck;
          if (hasReadAck !== true) {
            const tmp = { ...params.message, hasReadAck: true } as ChatMessage;
            this.emitRecvMessageStateChanged(tmp);
          }
        }
      },
    });
  }
  async sendMessage(msg: ChatMessage): Promise<void> {
    const callback: ChatMessageStatusCallback = {
      onSuccess: (message) => {
        const isExisted = this._sendList.get(message.localMsgId);
        if (isExisted) {
          this.emitSendMessageChanged(message);
          this._sendList.delete(message.localMsgId);
        }
      },
      onError: (localMsgId, _error) => {
        const isExisted = this._sendList.get(localMsgId);
        if (isExisted) {
          const msg = { ...isExisted.msg } as ChatMessage;
          msg.status = ChatMessageStatus.FAIL;
          this.emitSendMessageChanged(msg);
          this._sendList.delete(localMsgId);
        }
      },
    };
    this._sendList.set(msg.localMsgId, { msg });
    this.emitSendMessageBefore(msg);
    this._client.sendMessage({ message: msg, callback: callback });
  }
  async resendMessage(msg: ChatMessage): Promise<void> {
    const callback: ChatMessageStatusCallback = {
      onSuccess: (message) => {
        const isExisted = this._sendList.get(message.localMsgId);
        if (isExisted) {
          this.emitSendMessageChanged(message);
          this._sendList.delete(message.localMsgId);
        }
      },
      onError: (localMsgId, _error) => {
        const isExisted = this._sendList.get(localMsgId);
        if (isExisted) {
          const msg = { ...isExisted.msg } as ChatMessage;
          msg.status = ChatMessageStatus.FAIL;
          this.emitSendMessageChanged(msg);
          this._sendList.delete(localMsgId);
        }
      },
    };
    this._sendList.set(msg.localMsgId, { msg: msg });
    this.emitSendMessageBefore(msg);
    this._client.resendMessage({ message: msg, callback: callback });
  }

  createRecallMessageTip(msg: ChatMessage): ChatMessage {
    const tip = ChatMessage.createCustomMessage(
      msg.conversationId,
      gCustomMessageRecallEventType,
      msg.chatType,
      {
        params: {
          recall: JSON.stringify({
            text: '_uikit_msg_tip_recall',
            self: this._client.userId,
            from: msg.from,
            fromName: msg.from,
          }),
        },
      }
    );
    // tip.localTime = msg.localTime;
    // tip.serverTime = msg.serverTime;
    return tip;
  }

  async recallMessage(msg: ChatMessage): Promise<void> {
    this.emitRecallMessageBefore(msg);
    const currentTimestamp = getCurTs();
    if (msg.localTime + this._recallTimeout < currentTimestamp) {
      this.emitRecallMessageChanged({ isOk: false });
      this._client.sendError({
        error: new UIKitError({
          code: ErrorCode.common,
          desc: 'recallMessage',
        }),
      });
      return;
    }
    this._client.recallMessage({
      message: msg,
      onResult: (value) => {
        if (value.isOk === true) {
          const tipMsg = this.createRecallMessageTip(msg);
          this._client.insertMessage({
            message: tipMsg,
            onResult: (result) => {
              this.emitRecallMessageChanged({
                isOk: result.isOk,
                orgMsg: msg,
                tipMsg: tipMsg,
              });
            },
          });
        } else {
          this.emitRecallMessageChanged({ isOk: false });
          this._client.sendError({ error: value.error! });
        }
      },
    });
  }

  async downloadAttachment(msg: ChatMessage) {
    if (
      msg.body.type !== ChatMessageType.IMAGE &&
      msg.body.type !== ChatMessageType.VIDEO &&
      msg.body.type !== ChatMessageType.FILE &&
      msg.body.type !== ChatMessageType.VOICE
    ) {
      return;
    }
    const callback: ChatMessageStatusCallback = {
      onSuccess: (message) => {
        const isExisted = this._downloadList.get(message.localMsgId);
        if (isExisted) {
          this.emitAttachmentChanged(message);
          this._downloadList.delete(message.localMsgId);
        }
      },
      onError: (localMsgId, _error) => {
        const isExisted = this._downloadList.get(localMsgId);
        if (isExisted) {
          const msg = isExisted.msg;
          const body = msg.body as ChatFileMessageBody;
          body.fileStatus = ChatDownloadStatus.FAILED;
          this.emitAttachmentChanged(msg);
          this._downloadList.delete(localMsgId);
        }
      },
    };
    this._downloadList.set(msg.localMsgId, { msg });
    this._client.downloadMessageAttachment({
      message: msg,
      callback: callback,
    });
  }

  loadHistoryMessage(params: {
    convId: string;
    convType: ChatConversationType;
    startMsgId: string;
    onResult: (msgs: ChatMessage[]) => void;
  }): void {
    const { convId, convType, startMsgId } = params;
    return this._client.getHistoryMessage({
      convId,
      convType,
      startMsgId,
      direction: ChatSearchDirection.UP,
      loadCount: 10,
      onResult: (result) => {
        if (result.isOk && result.value) {
          // todo: try download failed attachment. dispatch download result.
          params.onResult(result.value);
        } else {
          params.onResult([]);
        }
      },
    });
  }

  setRecallMessageTimeout(recallTimeout?: number): void {
    if (recallTimeout) {
      this._recallTimeout = recallTimeout;
    }
  }
}
