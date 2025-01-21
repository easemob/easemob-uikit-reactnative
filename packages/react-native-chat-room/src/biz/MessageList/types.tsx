import type { IconNameType } from '../../assets';
import type { ChatMessage } from '../../rename.chat';

export type TextContent = {
  text: string;
};
export type GiftContent = {
  gift: string;
  text: string;
};
export type VoiceContent = {
  icon: IconNameType;
  length: number;
};

export type MessageListItemContent = TextContent | GiftContent | VoiceContent;

export type MessageListItemBasic = {
  timestamp: number;
  avatar?: string;
  tag?: IconNameType | string;
  nickname: string;
};

export type MessageListItemOp = {
  /**
   * When starting to press, scrolling needs to stop.
   * When scrolling to the bottom through gestures, or sending a message, start scrolling to the bottom.
   */
  onStartPress?: (data: MessageListItemModel) => void;
  onLongPress?: (data: MessageListItemModel) => void;
  onPress?: (data: MessageListItemModel) => void;
};

export type MessageListItemProps = {
  id: string;
  type: 'voice' | 'text' | 'gift' | 'tip';
  basic: MessageListItemBasic;
  content: MessageListItemContent;
  action?: MessageListItemOp;
  msg?: ChatMessage;
};
export type MessageListItemModel = Omit<MessageListItemProps, 'action'>;
