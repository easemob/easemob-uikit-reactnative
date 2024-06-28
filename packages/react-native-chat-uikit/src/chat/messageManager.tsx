import { UseUrlPreview } from '../biz/hooks';
import { uilog } from '../const';
import { ErrorCode, UIKitError } from '../error';
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
  ChatTextMessageBody,
} from '../rename.chat';
import { asyncTask, getCurTs } from '../utils';
import {
  gCustomMessageRecallEventType,
  gMessageAttributeFileProgress,
  gMessageAttributeUrlPreview,
} from './const';
import type {
  MessageCacheManager,
  MessageManagerListener,
} from './messageManager.types';
import type { ChatService, ChatServiceListener } from './types';
import type { ConversationModel } from './types.ui';
import { userInfoFromMessage } from './utils';

let gListener: ChatServiceListener | undefined;
const gUserListener: Map<string, MessageManagerListener> = new Map();
const gSendList: Map<string, { msg: ChatMessage }> = new Map();
const gDownloadList: Map<string, { msg: ChatMessage }> = new Map();

/**
 * Message Cache Manager Implementation.
 */
export class MessageCacheManagerImpl implements MessageCacheManager {
  _client: ChatService;
  _listener?: ChatServiceListener;
  _userListener: Map<string, MessageManagerListener>;
  _sendList: Map<string, { msg: ChatMessage }>;
  _downloadList: Map<string, { msg: ChatMessage }>;
  _recallTimeout: number;
  constructor(client: ChatService) {
    uilog.log('MessageCacheManager:constructor');
    this._client = client;
    this._userListener = gUserListener;
    this._sendList = gSendList;
    this._downloadList = gDownloadList;
    this._recallTimeout = 120000;
  }
  init() {
    this.unInit();
    uilog.log('MessageCacheManager:init');
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
    uilog.log('MessageCacheManager:unInit');
    if (gListener) {
      this._client.removeListener(gListener);
      gListener = undefined;
    }
  }
  reset() {
    uilog.log('MessageCacheManager:reset');
    this._userListener.clear();
    this._sendList.clear();
    this._downloadList.clear();
  }

  addListener(key: string, listener: MessageManagerListener) {
    uilog.log('MessageCacheManager:addListener', key);
    this._userListener.set(key, listener);
  }
  removeListener(key: string) {
    uilog.log('MessageCacheManager:removeListener');
    this._userListener.delete(key);
  }
  emitSendMessageChanged(msg: ChatMessage) {
    this._userListener.forEach((v) => {
      v.onSendMessageChanged?.(msg);
    });
  }
  emitSendMessageProgressChanged(msg: ChatMessage) {
    this._userListener.forEach((v) => {
      v.onSendMessageProgressChanged?.(msg);
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
  emitAttachmentProgressChanged(msg: ChatMessage) {
    this._userListener.forEach((v) => {
      v.onMessageAttachmentProgressChanged?.(msg);
    });
  }
  emitConversationUnreadCountChanged(): void {
    this._client.client.chatManager
      .getUnreadCount()
      .then((count) => {
        this._userListener.forEach((v) => {
          v.onAllConversationUnreadCountChanged?.(count);
        });
      })
      .catch();
  }
  bindOnMessagesReceived(messages: Array<ChatMessage>) {
    asyncTask(this.emitConversationUnreadCountChanged.bind(this));
    messages.forEach((msg) => {
      this.parseUrlPreview(msg, false, (newMsg) => {
        this._userListener.forEach((v) => {
          v.onRecvMessage?.(newMsg);
        });
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

  setCurrentConv(conv?: ConversationModel): void {
    this._client.setCurrentConversation({ conv });
  }
  getCurrentConv(): ConversationModel | undefined {
    return this._client.getCurrentConversation();
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
  setMessageRead(params: {
    convId: string;
    convType: ChatConversationType;
    message: ChatMessage;
  }): void {
    this._client.setMessageRead({
      convId: params.convId,
      convType: params.convType,
      msgId: params.message.msgId,
      onResult: (result) => {
        if (result.isOk === true) {
          const hasRead = params.message.hasRead;
          if (hasRead !== true) {
            const tmp = { ...params.message, hasRead: true } as ChatMessage;
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
          this.parseUrlPreview(message, false, (newMsg) => {
            this.emitSendMessageChanged(newMsg);
          });
          this._sendList.delete(message.localMsgId);
        }
      },
      onProgress: (localMsgId, progress) => {
        const isExisted = this._sendList.get(localMsgId);
        if (isExisted) {
          const msg = { ...isExisted.msg } as ChatMessage;
          const p = { [gMessageAttributeFileProgress]: progress };
          msg.attributes = { ...msg.attributes, ...p };
          this.emitSendMessageProgressChanged(msg);
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
    const userInfo = userInfoFromMessage(msg);
    const tip = ChatMessage.createCustomMessage(
      msg.conversationId,
      gCustomMessageRecallEventType,
      msg.chatType,
      {
        params: {
          text: '_uikit_msg_tip_recall',
          self: this._client.userId ?? '',
          from: msg.from,
          fromName: userInfo?.remark ?? userInfo?.userName ?? msg.from,
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
          code: ErrorCode.msg_recall_error,
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
      onProgress: (localMsgId, progress) => {
        const isExisted = this._downloadList.get(localMsgId);
        if (isExisted) {
          const msg = { ...isExisted.msg } as ChatMessage;
          const p = { [gMessageAttributeFileProgress]: progress };
          msg.attributes = { ...msg.attributes, ...p };
          this.emitAttachmentProgressChanged(msg);
        }
      },
      onError: (localMsgId, error) => {
        if (error) {
          uilog.warn('downloadAttachment:error', error);
        }
        const isExisted = this._downloadList.get(localMsgId);
        if (isExisted) {
          const msg = { ...isExisted.msg } as ChatMessage;
          msg.body = {
            ...msg.body,
            fileStatus: ChatDownloadStatus.FAILED,
          } as ChatFileMessageBody;
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

  async downloadAttachmentForThread(msg: ChatMessage) {
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
      onProgress: (localMsgId, progress) => {
        const isExisted = this._downloadList.get(localMsgId);
        if (isExisted) {
          const msg = { ...isExisted.msg } as ChatMessage;
          const p = { [gMessageAttributeFileProgress]: progress };
          msg.attributes = { ...msg.attributes, ...p };
          this.emitAttachmentProgressChanged(msg);
        }
      },
      onError: (localMsgId, error) => {
        if (error) {
          uilog.warn('downloadAttachment:error', error);
        }
        const isExisted = this._downloadList.get(localMsgId);
        if (isExisted) {
          const msg = { ...isExisted.msg } as ChatMessage;
          msg.body = {
            ...msg.body,
            fileStatus: ChatDownloadStatus.FAILED,
          } as ChatFileMessageBody;
          this.emitAttachmentChanged(msg);
          this._downloadList.delete(localMsgId);
        }
      },
    };
    this._downloadList.set(msg.localMsgId, { msg });
    this._client.downloadMessageAttachmentForThread({
      message: msg,
      callback: callback,
    });
  }

  loadHistoryMessage(params: {
    convId: string;
    convType: ChatConversationType;
    startMsgId: string;
    loadCount: number;
    direction?: ChatSearchDirection;
    isChatThread?: boolean;
  }): Promise<ChatMessage[]> {
    const { convId, convType, startMsgId, loadCount, direction, isChatThread } =
      params;
    return this._client.getHistoryMessage({
      convId,
      convType,
      startMsgId,
      direction: direction ?? ChatSearchDirection.UP,
      loadCount: loadCount,
      isChatThread: isChatThread,
    });
  }

  setRecallMessageTimeout(recallTimeout?: number): void {
    if (recallTimeout) {
      this._recallTimeout = recallTimeout;
    }
  }

  parseUrlPreview(
    msg: ChatMessage,
    isForce: boolean,
    onResult: (msg: ChatMessage) => void
  ): void {
    if (msg.body.type !== ChatMessageType.TXT) {
      onResult(msg);
      return;
    }
    const body = msg.body as ChatTextMessageBody;
    if (
      msg.attributes?.[gMessageAttributeUrlPreview] !== undefined &&
      isForce !== true
    ) {
      onResult(msg);
      return;
    }
    const urls = UseUrlPreview.getUrlListFromText(body.content);
    if (!urls || urls.length === 0 || urls.length > 1) {
      onResult(msg);
      return;
    }
    UseUrlPreview.fetchUrlPreview(urls[0]!).then((data) => {
      if (data) {
        const newMsg = { ...msg } as ChatMessage;
        newMsg.attributes = {
          ...msg.attributes,
          [gMessageAttributeUrlPreview]: data,
        };
        onResult(newMsg);
        this._client.updateMessage({
          message: newMsg,
        });
      } else {
        msg.attributes = {
          ...msg.attributes,
          [gMessageAttributeUrlPreview]: { url: urls[0]!, title: undefined },
        };
        onResult(msg);
        this._client.updateMessage({
          message: msg,
        });
      }
    });
  }
}
