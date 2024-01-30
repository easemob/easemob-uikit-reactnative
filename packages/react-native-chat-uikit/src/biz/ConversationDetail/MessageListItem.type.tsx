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

/**
 * Message Basic Component properties.
 */
export type MessageBasicProps = {
  layoutType: MessageLayoutType;
  msg: ChatMessage;
  maxWidth?: number;
};

/**
 * Message Text Component properties.
 */
export type MessageTextProps = MessageBasicProps & {
  isSupport: boolean;
};
/**
 * Message Text component render type.
 */
export type MessageTextRender = React.FC<MessageTextProps>;

/**
 * Message Default Image Component properties.
 */
export type MessageDefaultImageProps = {
  url?: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
  iconName: IconNameType;
  onError?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
};
/**
 * Message Default Image component render type.
 */
export type MessageDefaultImageRender = React.FC<MessageDefaultImageProps>;

/**
 * Message Image Component properties.
 */
export type MessageImageProps = MessageBasicProps & {};
/**
 * Message Image component render type.
 */
export type MessageImageRender = React.FC<MessageImageProps>;

/**
 * Message Voice Component properties.
 */
export type MessageVoiceProps = MessageBasicProps & {
  isPlay?: boolean;
};
/**
 * Message Voice component render type.
 */
export type MessageVoiceRender = React.FC<MessageVoiceProps>;

/**
 * Message Video Component properties.
 */
export type MessageVideoProps = MessageBasicProps & {};
/**
 * Message Video component render type.
 */
export type MessageVideoRender = React.FC<MessageVideoProps>;

/**
 * Message File Component properties.
 */
export type MessageFileProps = MessageBasicProps & {};
/**
 * Message File component render type.
 */
export type MessageFileRender = React.FC<MessageFileProps>;

/**
 * Message Location Component properties.
 */
export type MessageCustomCardProps = MessageBasicProps & {};
/**
 * Message Location component render type.
 */
export type MessageCustomCardRender = React.FC<MessageCustomCardProps>;

/**
 * Message Location Component properties.
 */
export type MessageContentProps = {
  msg: ChatMessage;
  isSupport: boolean;
  layoutType: MessageLayoutType;
  contentMaxWidth?: number | undefined;
  isVoicePlaying?: boolean | undefined;
};
/**
 * Message Location component render type.
 */
export type MessageContentRender = React.FC<MessageContentProps>;

/**
 * Message Bubble Component properties.
 */
export type MessageBubbleProps = MessageListItemRenders &
  MessageListItemActionsProps & {
    hasTriangle?: boolean;
    model: MessageModel;
    containerStyle?: StyleProp<ViewStyle>;
    maxWidth?: number;
  };
/**
 * Message Bubble component render type.
 */
export type MessageBubbleRender = React.FC<MessageBubbleProps>;

/**
 * Message Avatar Component properties.
 */
export type AvatarViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  avatar?: string;
  onAvatarClicked?: () => void;
};
/**
 * Message Avatar component render type.
 */
export type AvatarViewRender = React.FC<AvatarViewProps>;

/**
 * Message Name Component properties.
 */
export type NameViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  name: string;
  hasAvatar: boolean;
  hasTriangle: boolean;
};
/**
 * Message Name component render type.
 */
export type NameViewRender = React.FC<NameViewProps>;

/**
 * Message Time Component properties.
 */
export type TimeViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  timestamp: number;
  hasAvatar: boolean;
  hasTriangle: boolean;
};
/**
 * Message Time component render type.
 */
export type TimeViewRender = React.FC<TimeViewProps>;

/**
 * Message State Component properties.
 */
export type StateViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
  state: MessageStateType;
  onClicked?: () => void;
};
/**
 * Message State component render type.
 */
export type StateViewRender = React.FC<StateViewProps>;

/**
 * Message Check Component properties.
 */
export type CheckViewProps = {
  isVisible?: boolean;
  layoutType: MessageLayoutType;
};
/**
 * Message Check component render type.
 */
export type CheckViewRender = React.FC<CheckViewProps>;

/**
 * Message Quote Bubble Component properties.
 */
export type MessageQuoteBubbleProps = MessageListItemActionsProps & {
  hasAvatar: boolean;
  hasTriangle: boolean;
  model: MessageModel;
  containerStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
};
/**
 * Message Quote Bubble component render type.
 */
export type MessageQuoteBubbleRender = React.FC<MessageQuoteBubbleProps>;

/**
 * Message Quote Content Component properties.
 */
export type MessageViewProps = MessageListItemRenders &
  MessageListItemActionsProps & {
    isVisible?: boolean;
    model: MessageModel;
    avatarIsVisible?: boolean;
    nameIsVisible?: boolean;
    timeIsVisible?: boolean;
  };
/**
 * Message Quote Content component render type.
 */
export type MessageViewRender = React.FC<MessageViewProps>;

/**
 * Message System Tip Component properties.
 */
export type SystemTipViewProps = {
  isVisible?: boolean;
  model: SystemMessageModel;
};
/**
 * Message System Tip component render type.
 */
export type SystemTipViewRender = React.FC<SystemTipViewProps>;

/**
 * Message Time Tip Component properties.
 */
export type TimeTipViewProps = {
  isVisible?: boolean;
  model: TimeMessageModel;
};
/**
 * Message Time Tip component render type.
 */
export type TimeTipViewRender = React.FC<TimeTipViewProps>;
