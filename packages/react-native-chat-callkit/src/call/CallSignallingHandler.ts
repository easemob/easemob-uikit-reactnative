import { CallErrorCode, CallType } from '../enums';
import {
  ChatClient,
  ChatError,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageEventListener,
  ChatMessageStatusCallback,
} from '../rename.chat';
import { timestamp } from '../utils/utils';
import * as K from './CallConst';
import { calllog } from './CallConst';
import { CallError } from './CallError';

/**
 * The event monitoring interface of the signaling manager.
 */
export interface CallSignallingListener {
  /**
   * The inviter initiates the invitation and the invitee receives the notice.
   */
  onInvite: (params: {
    callId: string;
    callType: CallType;
    inviterId: string;
    inviterDeviceToken: string;
    channelId: string;
    ts: number;
  }) => void;
  /**
   * The invitee confirms the invitation and the inviter receives the notice.
   */
  onAlert: (params: {
    callId: string;
    callType?: CallType;
    inviteeId: string;
    inviterDeviceToken: string;
    inviteeDeviceToken: string;
    channelId: string;
    ts: number;
  }) => void;
  /**
   * The inviter confirms that the invitee confirms that the invitee receives the notice.
   */
  onAlertConfirm: (params: {
    callId: string;
    callType?: CallType;
    isValid: boolean;
    inviterId: string;
    inviteeDeviceToken: string;
    inviterDeviceToken: string;
    channelId: string;
    ts: number;
  }) => void;
  /**
   * The inviter cancels the invitation, and the invitee receives the notice.
   */
  onInviteCancel: (params: {
    callId: string;
    callType?: CallType;
    inviterId: string;
    inviterDeviceToken: string;
    channelId: string;
    ts: number;
  }) => void;
  /**
   * The invitee `busy/accept/refuse` the invitation, and the inviter receives the notice.
   */
  onInviteReply: (params: {
    callId: string;
    callType?: CallType;
    inviteeId: string;
    reply:
      | typeof K.KeyBusyResult
      | typeof K.KeyAcceptResult
      | typeof K.KeyRefuseResult;
    inviteeDeviceToken: string;
    inviterDeviceToken: string;
    channelId: string;
    ts: number;
  }) => void;
  /**
   * The inviter arbitrates the invitee's reply, gives the final choice, and the invitee receives the notice.
   */
  onInviteReplyConfirm: (params: {
    callId: string;
    callType?: CallType;
    inviterId: string;
    reply:
      | typeof K.KeyBusyResult
      | typeof K.KeyAcceptResult
      | typeof K.KeyRefuseResult;
    inviterDeviceToken: string;
    inviteeDeviceToken: string;
    channelId: string;
    ts: number;
  }) => void;
  /**
   * The notification is received when someone initiates a video conversion to audio mode.
   */
  onVideoToAudio: () => void;
}

/**
 * Signaling manager.
 */
export class CallSignallingHandler implements ChatMessageEventListener {
  private _listener?: CallSignallingListener | undefined;
  private _inviteContentHandler: ((callType: CallType) => string) | undefined;

  public init(params: {
    listener: CallSignallingListener;
    inviteContentHandler?: (callType: CallType) => string;
  }): void {
    calllog.log('CallSignallingHandler:init:');
    this._listener = params.listener;
    this._inviteContentHandler = params.inviteContentHandler;
  }

  public unInit(): void {
    calllog.log('CallSignallingHandler:unInit:');
    this._listener = undefined;
  }

  protected parseCallType(
    callType: string | number | undefined
  ): CallType | undefined {
    let ret;
    if (callType && Number.isNaN(callType) === false) {
      let c: number = NaN;
      if (typeof callType === 'number') {
        if (Number.isInteger(callType) === false) {
          c = Math.round(callType);
        } else {
          c = callType;
        }
      } else {
        c = parseInt(callType, 10);
      }

      switch (c) {
        case 0:
          ret = CallType.Audio1v1;
          break;
        case 1:
          ret = CallType.Video1v1;
          break;
        case 2:
          ret = CallType.VideoMulti;
          break;
        case 3:
          ret = CallType.AudioMulti;
          break;

        default:
          break;
      }
    }

    return ret;
  }

  protected parseTs(ts: string | number): number | undefined {
    let ret;
    if (Number.isNaN(ts) === false) {
      if (typeof ts === 'number') {
        ret = parseFloat(ts.toString());
      } else {
        ret = parseFloat(ts);
      }
    }
    return ret;
  }

  protected send(
    callId: string,
    msg: ChatMessage,
    onResult: (params: {
      callId: string;
      error?: any;
      msg?: ChatMessage;
    }) => void
  ): void {
    ChatClient.getInstance()
      .chatManager.sendMessage(msg, {
        onError: (localMsgId: string, error: ChatError): void => {
          calllog.log('send:onError:', localMsgId, error);
          onResult({
            callId,
            error: new CallError({
              code: CallErrorCode.ExceptionState,
              description: 'Failed to send signaling.',
            }),
            msg: msg,
          });
        },
        onSuccess: (_: ChatMessage): void => {
          onResult({ callId, error: undefined, msg });
        },
      } as ChatMessageStatusCallback)
      .then()
      .catch((error) => {
        calllog.warn('send:error:', error);
      });
  }

  protected inviteContent(callType: CallType): string {
    if (this._inviteContentHandler) {
      return this._inviteContentHandler(callType);
    }
    let ret = '';
    if (callType === CallType.Audio1v1) {
      ret = 'voice';
    } else if (callType === CallType.Video1v1) {
      ret = 'video';
    } else {
      ret = 'conference';
    }
    return ret;
  }

  protected convertToInt(callType: CallType): number {
    let ret = 0;
    switch (callType) {
      case CallType.Audio1v1:
        ret = 0;
        break;
      case CallType.Video1v1:
        ret = 1;
        break;
      case CallType.AudioMulti:
        ret = 3;
        break;
      case CallType.VideoMulti:
        ret = 2;
        break;
      default:
        break;
    }
    return ret;
  }
  /**
   * The inviter sends an invitation message. The invitee receives the notification through {@link CallSignallingListener.onInvite}.
   */
  public sendInvite(params: {
    inviteeId: string;
    channelId: string;
    callType: CallType;
    inviterDeviceToken: string;
    callId: string;
    ext?: any;
    onResult: (params: {
      callId: string;
      error?: any;
      msg?: ChatMessage;
    }) => void;
  }): void {
    calllog.log('CallSignallingHandler:sendInvite:', params);
    const msg = ChatMessage.createTextMessage(
      params.inviteeId,
      this.inviteContent(params.callType),
      ChatMessageChatType.PeerChat
    );
    msg.attributes = {
      [K.KeyMsgType]: K.KeyMsgTypeValue,
      [K.KeyAction]: K.KeyInviteAction,
      [K.KeyCallId]: params.callId,
      [K.KeyCallType]: this.convertToInt(params.callType),
      [K.KeyCallerDevId]: params.inviterDeviceToken,
      [K.KeyChannelName]: params.channelId,
      [K.KeyTs]: timestamp(),
    };
    this.send(params.callId, msg, params.onResult);
  }
  /**
   * Invitee sends alert message. The inviter is notified by {@link CallSignallingListener.onAlert}.
   */
  public sendAlert(params: {
    callId: string;
    inviterId: string;
    inviterDeviceToken: string;
    inviteeDeviceToken: string;
    onResult: (params: {
      callId: string;
      error?: any;
      msg?: ChatMessage;
    }) => void;
  }): void {
    calllog.log('CallSignallingHandler:sendAlert:', params);
    const msg = ChatMessage.createCmdMessage(
      params.inviterId,
      K.KeyCmdAction,
      ChatMessageChatType.PeerChat,
      { deliverOnlineOnly: true }
    );
    msg.attributes = {
      [K.KeyMsgType]: K.KeyMsgTypeValue,
      [K.KeyAction]: K.KeyAlertAction,
      [K.KeyCallId]: params.callId,
      [K.KeyCallerDevId]: params.inviterDeviceToken,
      [K.KeyCalleeDevId]: params.inviteeDeviceToken,
      [K.KeyTs]: timestamp(),
    };
    this.send(params.callId, msg, params.onResult);
  }
  /**
   * The inviter sends a confirmation of the alert. The invitee receives the notification through {@link CallSignallingListener.onAlertConfirm}.
   */
  public sendAlertConfirm(params: {
    callId: string;
    inviteeId: string;
    inviterDeviceToken: string;
    inviteeDeviceToken: string;
    isValid: boolean;
    onResult: (params: {
      callId: string;
      error?: any;
      msg?: ChatMessage;
    }) => void;
  }): void {
    calllog.log('CallSignallingHandler:sendAlertConfirm:', params);
    const msg = ChatMessage.createCmdMessage(
      params.inviteeId,
      K.KeyCmdAction,
      ChatMessageChatType.PeerChat,
      { deliverOnlineOnly: true }
    );
    msg.attributes = {
      [K.KeyMsgType]: K.KeyMsgTypeValue,
      [K.KeyAction]: K.KeyConfirmRingAction,
      [K.KeyCallId]: params.callId,
      [K.KeyCallerDevId]: params.inviterDeviceToken,
      [K.KeyCalleeDevId]: params.inviteeDeviceToken,
      [K.KeyCallStatus]: params.isValid,
      [K.KeyTs]: timestamp(),
    };
    this.send(params.callId, msg, params.onResult);
  }
  /**
   * The inviter sends a message to cancel the invitation. The invitee receives the notification through {@link CallSignallingListener.onInviteCancel}.
   */
  public sendInviteCancel(params: {
    callId: string;
    inviteeId: string;
    inviterDeviceToken: string;
    onResult: (params: {
      callId: string;
      error?: any;
      msg?: ChatMessage;
    }) => void;
  }): void {
    calllog.log('CallSignallingHandler:sendInviteCancel:', params);
    const msg = ChatMessage.createCmdMessage(
      params.inviteeId,
      K.KeyCmdAction,
      ChatMessageChatType.PeerChat,
      { deliverOnlineOnly: true }
    );
    msg.attributes = {
      [K.KeyMsgType]: K.KeyMsgTypeValue,
      [K.KeyAction]: K.KeyCancelCallAction,
      [K.KeyCallId]: params.callId,
      [K.KeyCallerDevId]: params.inviterDeviceToken,
      [K.KeyTs]: timestamp(),
    };
    this.send(params.callId, msg, params.onResult);
  }
  /**
   * The invitee sends a confirmation of the invitation. The inviter receives the notification through {@link CallSignallingListener.onInviteReply}.
   */
  public sendInviteReply(params: {
    callId: string;
    inviterId: string;
    inviterDeviceToken: string;
    inviteeDeviceToken: string;
    reply:
      | typeof K.KeyBusyResult
      | typeof K.KeyAcceptResult
      | typeof K.KeyRefuseResult;
    onResult: (params: {
      callId: string;
      error?: any;
      msg?: ChatMessage;
    }) => void;
  }): void {
    calllog.log('CallSignallingHandler:sendInviteReply:', params);
    const msg = ChatMessage.createCmdMessage(
      params.inviterId,
      K.KeyCmdAction,
      ChatMessageChatType.PeerChat,
      { deliverOnlineOnly: true }
    );
    msg.attributes = {
      [K.KeyMsgType]: K.KeyMsgTypeValue,
      [K.KeyAction]: K.KeyAnswerCallAction,
      [K.KeyCallId]: params.callId,
      [K.KeyCallerDevId]: params.inviterDeviceToken,
      [K.KeyCalleeDevId]: params.inviteeDeviceToken,
      [K.KeyCallResult]: params.reply,
      [K.KeyTs]: timestamp(),
    };
    this.send(params.callId, msg, params.onResult);
  }
  /**
   * The inviter sends the final result of the invitation. The invitee receives the notification through {@link CallSignallingListener.onResult}.
   */
  public sendInviteReplyConfirm(params: {
    callId: string;
    inviteeId: string;
    inviterDeviceToken: string;
    inviteeDeviceToken: string;
    reply:
      | typeof K.KeyBusyResult
      | typeof K.KeyAcceptResult
      | typeof K.KeyRefuseResult;
    onResult: (params: {
      callId: string;
      error?: any;
      msg?: ChatMessage;
    }) => void;
  }): void {
    calllog.log('CallSignallingHandler:sendInviteReplyConfirm:', params);
    const msg = ChatMessage.createCmdMessage(
      params.inviteeId,
      K.KeyCmdAction,
      ChatMessageChatType.PeerChat,
      { deliverOnlineOnly: true }
    );
    msg.attributes = {
      [K.KeyMsgType]: K.KeyMsgTypeValue,
      [K.KeyAction]: K.KeyConfirmCalleeAction,
      [K.KeyCallId]: params.callId,
      [K.KeyCallerDevId]: params.inviterDeviceToken,
      [K.KeyCalleeDevId]: params.inviteeDeviceToken,
      [K.KeyCallResult]: params.reply,
      [K.KeyTs]: timestamp(),
    };
    this.send(params.callId, msg, params.onResult);
  }
  /**
   * Someone initiates a video to audio operation, others receive the notification through {@link CallSignallingListener.onVideoToAudio}.
   */
  public sendVideoToAudio(): void {}

  //////////////////////////////////////////////////////////////////////////////
  //// CHAT SDK Message Listener ///////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  onMessagesReceived(msgs: ChatMessage[]): void {
    calllog.log('CallSignallingHandler:onMessagesReceived:', msgs.length);
    for (const msg of msgs) {
      this._parseMessage(msg);
    }
  }
  onCmdMessagesReceived(msgs: ChatMessage[]): void {
    calllog.log('CallSignallingHandler:onCmdMessagesReceived:', msgs.length);
    for (const msg of msgs) {
      this._parseMessage(msg);
    }
  }

  private _parseMessage(msg: ChatMessage): void {
    // const from = msg.from;
    if (msg.attributes) {
      const attr = msg.attributes as {
        [K.KeyMsgType]: string;
        [K.KeyAction]: string;
        [K.KeyCallId]: string;
        [K.KeyCallType]: number;
        [K.KeyCallerDevId]: string;
        [K.KeyCalleeDevId]: string;
        [K.KeyChannelName]: string;
        [K.KeyCallStatus]: boolean;
        [K.KeyCallResult]:
          | typeof K.KeyBusyResult
          | typeof K.KeyAcceptResult
          | typeof K.KeyRefuseResult;
        [K.KeyTs]: number;
      };
      const callType = this.parseCallType(attr.type);
      const ts = this.parseTs(attr.ts) ?? 0;
      if (attr[K.KeyMsgType] === K.KeyMsgTypeValue) {
        if (attr[K.KeyAction] === K.KeyInviteAction) {
          // const inviteAttr = msg.attributes as {};
          this._listener?.onInvite({
            callId: attr.callId,
            callType: callType ?? 0,
            inviterId: msg.from,
            inviterDeviceToken: attr.callerDevId,
            channelId: attr.channelName,
            ts: ts,
          });
        } else if (attr[K.KeyAction] === K.KeyAlertAction) {
          this._listener?.onAlert({
            callId: attr.callId,
            callType: callType,
            inviteeId: msg.from,
            inviterDeviceToken: attr.callerDevId,
            inviteeDeviceToken: attr.calleeDevId,
            channelId: attr.channelName,
            ts: ts,
          });
        } else if (attr[K.KeyAction] === K.KeyConfirmRingAction) {
          this._listener?.onAlertConfirm({
            callId: attr.callId,
            callType: callType,
            isValid: attr.status,
            inviterId: msg.from,
            inviterDeviceToken: attr.callerDevId,
            inviteeDeviceToken: attr.calleeDevId,
            channelId: attr.channelName,
            ts: ts,
          });
        } else if (attr[K.KeyAction] === K.KeyCancelCallAction) {
          this._listener?.onInviteCancel({
            callId: attr.callId,
            callType: callType,
            inviterId: msg.from,
            inviterDeviceToken: attr.callerDevId,
            channelId: attr.channelName,
            ts: ts,
          });
        } else if (attr[K.KeyAction] === K.KeyAnswerCallAction) {
          this._listener?.onInviteReply({
            callId: attr.callId,
            callType: callType,
            inviteeId: msg.from,
            reply: attr.result,
            inviterDeviceToken: attr.callerDevId,
            inviteeDeviceToken: attr.calleeDevId,
            channelId: attr.channelName,
            ts: ts,
          });
        } else if (attr[K.KeyAction] === K.KeyConfirmCalleeAction) {
          this._listener?.onInviteReplyConfirm({
            callId: attr.callId,
            callType: callType,
            inviterId: msg.from,
            reply: attr.result,
            inviterDeviceToken: attr.callerDevId,
            inviteeDeviceToken: attr.calleeDevId,
            channelId: attr.channelName,
            ts: ts,
          });
        }
      }
    }
  }
}
