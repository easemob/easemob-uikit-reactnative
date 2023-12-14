import type { StyleProp, ViewStyle } from 'react-native';
import type { ChatConversationType, ChatMessage } from 'react-native-chat-sdk';

import type { PropsWithError, PropsWithTest } from '../types';

export type MessageInputRef = {
  close: () => void;
};
export type MessageInputProps = PropsWithError &
  PropsWithTest & {
    top?: number | undefined;
    bottom?: number | undefined;
    numberOfLines?: number | undefined;
    onClickedSend?: (
      value:
        | SendTextProps
        | SendFileProps
        | SendImageProps
        | SendVideoProps
        | SendVoiceProps
    ) => void;
    closeAfterSend?: boolean;
    onHeightChange?: (height: number) => void;
  };
export type MessageInputState = 'normal' | 'emoji' | 'voice' | 'keyboard';

export type ConversationDetailProps = PropsWithError &
  PropsWithTest & {
    convId: string;
    convType: ChatConversationType;
    input?: {
      props?: MessageInputProps & { convId?: string };
      render?: React.ForwardRefExoticComponent<
        MessageInputProps & React.RefAttributes<MessageInputRef>
      >;
      ref?: React.RefObject<MessageInputRef>;
    };
    list?: {
      props?: MessageListProps & {
        convId?: string;
        convType?: ChatConversationType;
      };
      render?: React.ForwardRefExoticComponent<
        MessageListProps & React.RefAttributes<MessageListRef>
      >;
      ref?: React.RefObject<MessageListRef>;
    };
  };

export type SendType =
  | 'text'
  | 'file'
  | 'image'
  | 'voice'
  | 'video'
  | 'time'
  | 'system';
export type SendBasicProps = {
  type: SendType;
};
export type SendTextProps = SendBasicProps & {
  content: string;
};
export type SendFileProps = SendBasicProps & {
  localPath: string;
  fileSize?: number;
  displayName?: string;
  fileExtension?: string;
};
export type SendImageProps = SendBasicProps &
  SendFileProps & {
    imageWidth: number;
    imageHeight: number;
  };
export type SendVoiceProps = SendBasicProps &
  SendFileProps & {
    duration: number;
  };
export type SendVideoProps = SendBasicProps &
  SendFileProps & {
    thumbLocalPath: string;
    videoWidth: number;
    videoHeight: number;
    duration?: number;
  };
export type SendTimeProps = SendBasicProps & {
  timestamp: number;
};

export type SendSystemProps = SendBasicProps & {
  msg: ChatMessage;
};

export type MessageBubbleType = 'system' | 'time' | 'message';
export type MessageLayoutType = 'left' | 'right';
export type MessageRecvStateType = 'no-play' | 'loading-attachment';
export type MessageSendStateType =
  | 'sending'
  | 'send-success'
  | 'send-fail'
  | 'send-to-peer'
  | 'peer-read';
export type MessageStateType =
  | MessageRecvStateType
  | MessageSendStateType
  | 'none';

type BasicModel = {
  modelType: MessageBubbleType;
  layoutType: MessageLayoutType;
  userId: string;
  userName?: string;
  userAvatar?: string;
};
export type SystemMessageModel = BasicModel & {
  contents: string[];
};
export type TimeMessageModel = BasicModel & {
  timestamp: number;
};
export type MessageModel = BasicModel & {
  msg: ChatMessage;
};

export type MessageListItemProps = {
  /**
   * @description: message id. If it is a message, use the message time, otherwise use the millisecond message timestamp.
   */
  id: string;
  model: SystemMessageModel | TimeMessageModel | MessageModel;
  onClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  containerStyle?: StyleProp<ViewStyle>;
};
export type MessageAddPosition = 'top' | 'bottom';
export type MessageListRef = {
  addSendMessage: (
    value:
      | SendFileProps
      | SendImageProps
      | SendTextProps
      | SendVideoProps
      | SendVoiceProps
      | SendTimeProps
      | SendSystemProps
  ) => void; // todo:
  removeMessage: (msg: ChatMessage) => void;
  recallMessage: (msg: ChatMessage) => void;
  updateMessage: (updatedMsg: ChatMessage) => void;
  loadHistoryMessage: (msgs: ChatMessage[], pos: MessageAddPosition) => void;
  onInputHeightChange: (height: number) => void;
};
export type MessageListProps = PropsWithError &
  PropsWithTest & {
    convId: string;
    convType: ChatConversationType;
    onClicked?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
  };
