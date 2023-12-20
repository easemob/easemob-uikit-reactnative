import type { StyleProp, ViewStyle } from 'react-native';
import type { ChatConversationType, ChatMessage } from 'react-native-chat-sdk';

import type {
  PropsWithBack,
  PropsWithError,
  PropsWithInit,
  PropsWithSearch,
  PropsWithTest,
} from '../types';

export type MessageInputRef = {
  close: () => void;
  quoteMessage: (model: MessageModel) => void;
  editMessage: (model: MessageModel) => void;
};
export type MessageInputProps = PropsWithError &
  PropsWithTest & {
    convId: string;
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
        | SendCardProps
        | SendQuoteProps
    ) => void;
    closeAfterSend?: boolean;
    onHeightChange?: (height: number) => void;
    onEditMessageFinished: (model: MessageModel) => void;
  };
export type MessageInputState = 'normal' | 'emoji' | 'voice' | 'keyboard';

export type ConversationDetailProps = PropsWithError &
  PropsWithTest &
  PropsWithInit &
  PropsWithBack &
  PropsWithSearch & {
    convId: string;
    convType: ChatConversationType;
    convName?: string;
    input?: {
      props?: Omit<MessageInputProps, 'convId' | 'convType'> & {
        convId?: string;
        convType?: ChatConversationType;
      };
      render?: React.ForwardRefExoticComponent<
        MessageInputProps & React.RefAttributes<MessageInputRef>
      >;
      ref?: React.RefObject<MessageInputRef>;
    };
    list?: {
      props?: Omit<MessageListProps, 'convId' | 'convType'> & {
        convId?: string;
        convType?: ChatConversationType;
      };
      render?: React.ForwardRefExoticComponent<
        MessageListProps & React.RefAttributes<MessageListRef>
      >;
      ref?: React.RefObject<MessageListRef>;
    };
    containerStyle?: StyleProp<ViewStyle>;
  };

export type SendType =
  | 'text'
  | 'file'
  | 'image'
  | 'voice'
  | 'video'
  | 'time'
  | 'system'
  | 'card'
  | 'quote';
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

export type SendCardProps = SendBasicProps & {};
export type SendQuoteProps = SendBasicProps & {
  content: string;
  quote: MessageModel;
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
export type MessageEditableStateType = 'no-editable' | 'editable' | 'edited';

type BasicModel = {
  modelType: MessageBubbleType;
  layoutType: MessageLayoutType;
  userId: string;
  userName?: string;
  userAvatar?: string;
};
type VoiceModel = {
  isVoicePlaying?: boolean;
};
export type SystemMessageModel = BasicModel & {
  msg: ChatMessage;
};
export type TimeMessageModel = BasicModel & {
  timestamp: number;
};
export type MessageModel = BasicModel &
  VoiceModel & {
    msg: ChatMessage;
    msgQuote?: ChatMessage;
  };

export type MessageListItemActionsProps = {
  onClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  onLongPress?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  onAvatarClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  onQuoteClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
};
export type MessageListItemProps = MessageListItemActionsProps & {
  /**
   * @description: message id. If it is a message, use the message msgId, otherwise use the millisecond message timestamp.
   */
  id: string;
  model: SystemMessageModel | TimeMessageModel | MessageModel;
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
      | SendCardProps
      | SendQuoteProps
  ) => void; // todo:
  removeMessage: (msg: ChatMessage) => void;
  recallMessage: (msg: ChatMessage) => void;
  updateMessage: (updatedMsg: ChatMessage, fromType: 'send' | 'recv') => void;
  loadHistoryMessage: (msgs: ChatMessage[], pos: MessageAddPosition) => void;
  onInputHeightChange: (height: number) => void;
  editMessageFinished: (model: MessageModel) => void;
};
export type MessageListProps = PropsWithError &
  PropsWithTest & {
    convId: string;
    convType: ChatConversationType;
    onClicked?: () => void;
    onClickedItem?: (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => void;
    onLongPressItem?: (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => void;
    onQuoteMessageForInput?: (model: MessageModel) => void;
    onEditMessageForInput?: (model: MessageModel) => void;
    containerStyle?: StyleProp<ViewStyle>;
  };
