import type { StyleProp, ViewStyle } from 'react-native';
import type { ChatMessage } from 'react-native-chat-sdk';

import type { IconNameType } from '../../assets';
import type {
  MessageLayoutType,
  MessageListItemActionsProps,
  MessageListItemRenders,
  MessageModel,
  MessageStateType,
  SystemMessageModel,
  TimeMessageModel,
} from './types';

export type MessageBasicProps = {
  layoutType: MessageLayoutType;
  msg: ChatMessage;
  maxWidth?: number;
};

export type MessageTextProps = MessageBasicProps & {
  isSupport: boolean;
};
export type MessageTextRender = React.FC<MessageTextProps>;

export type MessageDefaultImageProps = {
  url?: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
  iconName: IconNameType;
  onError?: () => void;
};
export type MessageDefaultImageRender = React.FC<MessageDefaultImageProps>;

export type MessageImageProps = MessageBasicProps & {};
export type MessageImageRender = React.FC<MessageImageProps>;

export type MessageVoiceProps = MessageBasicProps & {
  isPlay?: boolean;
};
export type MessageVoiceRender = React.FC<MessageVoiceProps>;

export type MessageVideoProps = MessageBasicProps & {};
export type MessageVideoRender = React.FC<MessageVideoProps>;

export type MessageFileProps = MessageBasicProps & {};
export type MessageFileRender = React.FC<MessageFileProps>;

export type MessageCustomCardProps = MessageBasicProps & {};
export type MessageCustomCardRender = React.FC<MessageCustomCardProps>;

export type MessageContentProps = {
  msg: ChatMessage;
  isSupport: boolean;
  layoutType: MessageLayoutType;
  contentMaxWidth?: number | undefined;
  isVoicePlaying?: boolean | undefined;
};
export type MessageContentRender = React.FC<MessageContentProps>;

export type MessageBubbleProps = MessageListItemRenders &
  MessageListItemActionsProps & {
    hasTriangle?: boolean;
    model: MessageModel;
    containerStyle?: StyleProp<ViewStyle>;
    maxWidth?: number;
  };
export type MessageBubbleRender = React.FC<MessageBubbleProps>;

export type AvatarViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  avatar?: string;
  onAvatarClicked?: () => void;
};
export type AvatarViewRender = React.FC<AvatarViewProps>;

export type NameViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  name: string;
  hasAvatar: boolean;
  hasTriangle: boolean;
};
export type NameViewRender = React.FC<NameViewProps>;

export type TimeViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  timestamp: number;
  hasAvatar: boolean;
  hasTriangle: boolean;
};
export type TimeViewRender = React.FC<TimeViewProps>;

export type StateViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  state: MessageStateType;
  onClicked?: () => void;
};
export type StateViewRender = React.FC<StateViewProps>;

export type CheckViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
};
export type CheckViewRender = React.FC<CheckViewProps>;

export type MessageQuoteBubbleProps = MessageListItemActionsProps & {
  hasAvatar: boolean;
  hasTriangle: boolean;
  model: MessageModel;
  containerStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
};
export type MessageQuoteBubbleRender = React.FC<MessageQuoteBubbleProps>;

export type MessageViewProps = MessageListItemRenders &
  MessageListItemActionsProps & {
    isVisible?: boolean;
    model: MessageModel;
    avatarIsVisible?: boolean;
    nameIsVisible?: boolean;
    timeIsVisible?: boolean;
  };
export type MessageViewRender = React.FC<MessageViewProps>;

export type SystemTipViewProps = {
  isVisible?: boolean;
  model: SystemMessageModel;
};
export type SystemTipViewRender = React.FC<SystemTipViewProps>;

export type TimeTipViewProps = {
  isVisible?: boolean;
  model: TimeMessageModel;
};
export type TimeTipViewRender = React.FC<TimeTipViewProps>;
