import { ErrorCode, UIKitError } from '../../error';
import {
  ChatCustomMessageBody,
  ChatMessage,
  ChatMessagePinInfo,
  ChatMessageType,
  ChatTextMessageBody,
} from '../../rename.chat';
import {
  chatroom_uikit_gift,
  custom_msg_event_type_gift,
  DisconnectReasonType,
  GiftServiceData,
} from '../../room';
import { seqId } from '../../utils';
import { ChatroomBase, ChatroomProps } from './Chatroom';

/**
 * Component for chat room.
 *
 * The Chatroom component is mainly responsible for implementing relevant business logic.
 */
export class Chatroom extends ChatroomBase {
  constructor(props: ChatroomProps) {
    super(props);
  }
  componentDidMount?(): void {
    this.init();
  }
  componentWillUnmount?(): void {
    this.unInit();
  }
  componentDidCatch?(e: Error, info: React.ErrorInfo): void {
    this.im?.sendError({
      error: new UIKitError({
        code: ErrorCode.common,
        desc: JSON.stringify(e),
        extra: info.componentStack,
      }),
    });
  }

  async init() {
    this.listener = {
      onUserJoined: (roomId, user) => {
        if (user.userId === this.im?.userId) {
          this.im?.sendJoinCmd({
            roomId: roomId,
            result: ({ error, message }) => {
              if (error) {
                this.im?.sendError({ error });
              }
              if (message) {
                this.messageRef?.current?.addSendedMessage(message);
              }
            },
          });
        }
      },
      onMessageReceived: (roomId, message) => {
        if (this.im?.roomState === 'joined') {
          if (this.im?.roomId === roomId) {
            if (message.body.type === ChatMessageType.CUSTOM) {
              const body = message.body as ChatCustomMessageBody;
              if (body.event === custom_msg_event_type_gift) {
                this._onReceiveGift(message);
              }
            }
          }
        }
      },
      onGlobalNotifyReceived: (notifyMessage) => {
        if (this.im?.roomState === 'joined') {
          const body = notifyMessage.body as ChatTextMessageBody;
          this.getGlobalBroadcastRef?.()?.pushTask({
            model: {
              id: seqId('_mq').toString(),
              content: body.content,
            },
          });
        }
      },
      onMessagePinChanged: (params) => {
        if (this.im?.roomState === 'joined') {
          if (params.convId === this.im?.roomId) {
            this._onPinMessage({ ...params });
          }
        }
      },
      onUserBeKicked: (roomId) => {
        // Clean up resources. External notifications kicked. Typical: Re-entering the chat room, prompting that the room has been exited, etc.
        this.im?.resetRoom(roomId);
      },
      onDisconnected: (reason) => {
        if (
          reason === DisconnectReasonType.token_did_expire ||
          reason === DisconnectReasonType.app_active_number_reach_limit ||
          reason === DisconnectReasonType.user_did_login_from_other_device ||
          reason === DisconnectReasonType.user_did_remove_from_server ||
          reason === DisconnectReasonType.user_did_forbid_by_server ||
          reason === DisconnectReasonType.user_did_change_password ||
          reason === DisconnectReasonType.user_did_login_too_many_device ||
          reason === DisconnectReasonType.user_kicked_by_other_device ||
          reason === DisconnectReasonType.user_authentication_failed
        ) {
          if (
            this.im?.roomState === 'joined' ||
            this.im?.roomState === 'joining' ||
            this.im?.roomState === 'leaving'
          ) {
            if (this.im?.roomId) {
              this.im.resetRoom(this.im.roomId);
            }
          }
        }
      },
    };
    this.im?.addListener(this.listener);
    const r = await this.im?.loginState();
    console.log('test:init:', r);
    if (r === 'logged') {
      this?.joinRoom({
        roomId: this.props.roomId,
        ownerId: this.props.ownerId,
        result: (params) => {
          if (params.isOk) {
            this.im?.sendFinished({ event: 'join' });
          } else {
            this.im?.sendError({
              error: params.error!,
            });
          }
        },
      });
    } else {
      this.im?.sendError({
        error: new UIKitError({ code: ErrorCode.login_error }),
      });
    }
  }
  async unInit() {
    console.log('test:unInit:');
    if (this.listener) {
      this.im?.removeListener(this.listener);
    }
    const r = await this.im?.loginState();
    if (r === 'logged') {
      this.im
        ?.leaveRoom(this.props.roomId)
        .then(() => {
          this.im?.sendFinished({ event: 'leave' });
        })
        .catch((e) => {
          this.im?.sendError({
            error: e,
          });
        });
    } else {
      this.im?.sendError({
        error: new UIKitError({ code: ErrorCode.login_error }),
      });
    }
  }

  joinRoom(params: {
    roomId: string;
    ownerId: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): void {
    if (this.im?.roomState === 'joined') {
      params?.result({
        isOk: true,
        error: new UIKitError({
          code: ErrorCode.room_join_error,
          desc: 'Already joined the chat room.',
        }),
      });
      return;
    }
    this.im
      ?.joinRoom(params.roomId, { ownerId: params.ownerId })
      .then(() => {
        params.result({ isOk: true });
        this.messagePinRef?.current?.init();
      })
      .catch((e) => {
        params.result({
          isOk: false,
          error: e,
        });
      });
  }
  leaveRoom(params: {
    roomId: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): void {
    this.im
      ?.leaveRoom(params.roomId)
      .then(() => {
        params.result({ isOk: true });
      })
      .catch((e) => {
        params.result({
          isOk: false,
          error: e,
        });
      });
  }

  _onReceiveGift(message: ChatMessage) {
    const body = message.body as ChatCustomMessageBody;
    const jsonGift = (body.params as any)[chatroom_uikit_gift];

    if (jsonGift) {
      const gift = JSON.parse(jsonGift) as GiftServiceData;
      const user = this.im?.userInfoFromMessage(message);
      const nickname = user?.nickname ?? user?.userId ?? 'unknown';
      this.giftRef?.current?.pushTask?.({
        model: {
          id: seqId('_gf').toString(),
          avatar: user?.avatarURL,
          nickname: nickname,
          giftCount: gift.giftCount,
          giftIcon: gift.giftIcon,
          content: this.i18n?.tr("Sent '@${0}'", gift.giftName) ?? '',
        },
      });
    }
  }

  _onPinMessage(params: {
    messageId: string;
    pinOperation: number;
    pinInfo: ChatMessagePinInfo;
  }) {
    const { messageId, pinOperation } = params;
    if (pinOperation === 0) {
      this.im?.fetchPinnedMessages({
        convId: this.props.roomId,
        onResult: (params) => {
          if (params.isOk && params.msgs) {
            params.msgs.forEach((msg) => {
              if (msg.msgId === messageId) {
                const user = this.im?.userInfoFromMessage(msg);
                const nickname = user?.nickname ?? user?.userId ?? 'unknown';
                this.messagePinRef?.current?.pushTask?.({
                  id: msg.msgId,
                  tag: 'pin2',
                  msg: msg,
                  avatar: user?.avatarURL,
                  nickname: nickname,
                });
              }
            });
          }
        },
      });
    } else if (pinOperation === 1) {
      this.messagePinRef?.current?.popTask?.();
    }
  }
}
