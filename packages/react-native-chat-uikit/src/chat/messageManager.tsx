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

import type { MessageCacheManager } from './messageManager.types';
import type {
  ChatService,
  ChatServiceListener,
  ConversationModel,
} from './types';

export type MessageManagerListener = {
  onSendMessageChanged?: (msg: ChatMessage) => void;
  onRecvMessage?: (msg: ChatMessage) => void;
  onRecvMessageStatusChanged?: (msg: ChatMessage) => void;
  onRecvMessageContentChanged?: (msg: ChatMessage, byUserId: string) => void;
  onRecallMessage?: (msg: ChatMessage, byUserId: string) => void;
};

export class MessageCacheManagerImpl implements MessageCacheManager {
  _client: ChatService;
  _listener?: ChatServiceListener;
  _userListener: Map<string, MessageManagerListener>;
  _sendList: Map<string, { msg: ChatMessage }>;
  _downloadList: Map<string, { msg: ChatMessage }>;
  _conv?: ConversationModel;
  constructor(client: ChatService) {
    this._client = client;
    this._userListener = new Map();
    this._sendList = new Map();
    this._downloadList = new Map();
    this.init();
  }
  destructor() {
    this.unInit();
  }

  addListener(key: string, listener: MessageManagerListener) {
    this._userListener.set(key, listener);
  }
  removeListener(key: string) {
    this._userListener.delete(key);
  }
  emitSendMessageChanged(msg: ChatMessage) {
    this._userListener.forEach((v) => {
      console.log('test:zouyu:emitSendMessageChanged:', msg);
      v.onSendMessageChanged?.(msg);
    });
  }
  emitAttachmentChanged(msg: ChatMessage) {
    this._userListener.forEach((v) => {
      v.onSendMessageChanged?.(msg);
    });
  }
  init() {
    this._listener = {
      onMessagesReceived: (messages: Array<ChatMessage>) => {
        messages.forEach((msg) => {
          this._userListener.forEach((v) => {
            v.onRecvMessage?.(msg);
          });
        });
      },

      onMessagesRead: (messages: Array<ChatMessage>) => {
        messages.forEach((msg) => {
          this._userListener.forEach((v) => {
            v.onRecvMessageStatusChanged?.(msg);
          });
        });
      },

      onGroupMessageRead: (_groupMessageAcks: Array<ChatGroupMessageAck>) => {
        // todo: get message for group
        // groupMessageAcks.forEach((ack) => {
        //   this._userListener.forEach((v) => {
        //     v.onRecvMessageStatusChanged?.(ack.message);
        //   });
        // });
      },

      onMessagesDelivered: (messages: Array<ChatMessage>) => {
        messages.forEach((msg) => {
          this._userListener.forEach((v) => {
            v.onRecvMessageStatusChanged?.(msg);
          });
        });
      },

      onMessagesRecalled: (messages: Array<ChatMessage>) => {
        messages.forEach((msg) => {
          this._userListener.forEach((v) => {
            v.onRecallMessage?.(msg, msg.from);
          });
        });
      },

      onMessageContentChanged: (
        message: ChatMessage,
        lastModifyOperatorId: string,
        _lastModifyTime: number
      ) => {
        this._userListener.forEach((v) => {
          v.onRecvMessageContentChanged?.(message, lastModifyOperatorId);
        });
      },
    };
    this._client.addListener(this._listener);
  }
  unInit() {
    if (this._listener) {
      this._client.removeListener(this._listener);
      this._listener = undefined;
    }
    this._client = undefined as any;
    this._userListener.clear();
    this._sendList.clear();
    this._downloadList.clear();
  }
  setCurrentConvId(conv: ConversationModel): void {
    this._conv = conv;
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
    this._client.sendMessage({ message: msg, callback: callback });
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
}
