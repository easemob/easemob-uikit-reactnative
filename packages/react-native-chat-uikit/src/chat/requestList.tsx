import { ChatMessage, ChatSearchDirection } from 'react-native-chat-sdk';

import { timeoutTask } from '../utils';
import {
  gNewRequestConversationId,
  gNewRequestConversationMsgEventType,
  gNewRequestConversationState,
  gNewRequestConversationTip,
  gNewRequestConversationUserAvatar,
  gNewRequestConversationUserId,
  gNewRequestConversationUserName,
} from './const';
import type { RequestList } from './requestList.types';
import type {
  ChatService,
  ChatServiceListener,
  NewRequestModel,
  NewRequestStateType,
  ResultCallback,
} from './types';
import { getNewRequest } from './utils';

export type RequestListListener = {
  onNewRequestListChanged: (list: NewRequestModel[]) => void;
};

export class RequestListImpl implements RequestList {
  _client: ChatService;
  _listener?: ChatServiceListener;
  _newRequestList: NewRequestModel[] = [];
  _userList: Map<string, RequestListListener>;
  constructor(client: ChatService) {
    this._client = client;
    this._userList = new Map();
    this.init();
  }
  destructor() {
    this.unInit();
  }

  addListener(key: string, listener: RequestListListener) {
    this._userList.set(key, listener);
  }
  removeListener(key: string) {
    this._userList.delete(key);
  }
  emitNewRequestListChanged() {
    for (const listener of this._userList.values()) {
      timeoutTask(0, () =>
        listener.onNewRequestListChanged([...this._newRequestList])
      );
    }
  }
  init() {
    this._listener = {
      onContactInvited: (userId: string): void => {
        const newMsg = ChatMessage.createCustomMessage(
          gNewRequestConversationId,
          gNewRequestConversationMsgEventType
        );
        newMsg.attributes[gNewRequestConversationUserId] = userId;
        newMsg.attributes[gNewRequestConversationUserName] = userId;
        newMsg.attributes[gNewRequestConversationUserAvatar] = '';
        newMsg.attributes[gNewRequestConversationState] =
          'pending' as NewRequestStateType;
        newMsg.attributes[
          gNewRequestConversationTip
        ] = `requests to add you as a friend.`;

        const item = getNewRequest(newMsg);
        if (item) {
          this._newRequestList.unshift(item);
        }

        this._client.insertMessage({
          message: newMsg,
          onResult: () => {
            this.emitNewRequestListChanged();
          },
        });
      },

      onFriendRequestAccepted: (userId: string): void => {
        for (const request of this._newRequestList) {
          if (request.id === userId) {
            request.state = 'accepted';
            this.updateRequest(request);
            break;
          }
        }
      },

      onFriendRequestDeclined: (userId: string): void => {
        for (const request of this._newRequestList) {
          if (request.id === userId) {
            request.state = 'declined';
            this.updateRequest(request);
            break;
          }
        }
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
    this._newRequestList = [];
    this._userList.clear();
  }
  getRequestList(params: {
    onResult: ResultCallback<NewRequestModel[]>;
  }): void {
    if (this._newRequestList.length > 0) {
      params.onResult({ isOk: true, value: this._newRequestList });
      return;
    }
    this._client.getNewRequestList({
      convId: gNewRequestConversationId,
      convType: 0,
      pageSize: 200,
      direction: ChatSearchDirection.DOWN,
      onResult: (result) => {
        if (result.isOk) {
          if (result.value) {
            this._newRequestList = result.value
              .map((v) => {
                return getNewRequest(v);
              })
              .filter((v) => {
                return v !== undefined;
              }) as NewRequestModel[];
            params.onResult({ isOk: true, value: this._newRequestList });
          } else {
            params.onResult({
              isOk: true,
              value: [],
            });
          }
        }
      },
    });
  }
  updateRequest(request: NewRequestModel) {
    if (request.msg === undefined) {
      return;
    }

    // !!! why is isFrozen, see `Object.isFrozen()`
    request.msg = { ...request.msg } as ChatMessage;

    request.msg.attributes = {
      [gNewRequestConversationUserId]: request.id,
      [gNewRequestConversationUserName]: request.name,
      [gNewRequestConversationUserAvatar]: request.avatar,
      [gNewRequestConversationState]: request.state,
      [gNewRequestConversationTip]: request.tip,
    };

    for (let index = 0; index < this._newRequestList.length; index++) {
      const localRequest = this._newRequestList[index];
      if (
        localRequest?.id === request.id &&
        localRequest.state !== 'accepted' &&
        localRequest?.state !== 'declined'
      ) {
        this._newRequestList[index] = request;
      }
    }

    this._client.updateMessage({
      message: request.msg,
      onResult: () => {
        this.emitNewRequestListChanged();
      },
    });
  }

  removeRequest(request: NewRequestModel) {
    if (request.msg === undefined) {
      return;
    }
    for (let index = 0; index < this._newRequestList.length; index++) {
      const localRequest = this._newRequestList[index];
      if (localRequest?.id === request.id) {
        this._newRequestList.splice(index, 1);
        break;
      }
    }
    this._client.removeMessage({
      message: request.msg,
      onResult: () => {
        this.emitNewRequestListChanged();
      },
    });
  }
}
