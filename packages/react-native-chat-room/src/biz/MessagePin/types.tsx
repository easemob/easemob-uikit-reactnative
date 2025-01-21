import { StyleProp, ViewStyle } from 'react-native';

import { type IconNameType } from '../../assets';
import { type ChatMessage } from '../../rename.chat';

export type MessagePinTask = {
  /**
   * The message id.
   */
  id: string;
  /**
   * The chat message to be pinned
   */
  msg?: ChatMessage;
  /**
   * The nickname for pin message
   */
  tag?: IconNameType | string;
  /**
   * The avatar for pin message
   */
  avatar?: string;
  /**
   * The nickname for pin message
   */
  nickname?: string;
};

export type MessagePinRef = {
  init: () => void;
  pushTask: (task: MessagePinTask) => void;
  popTask: () => void;
};

export type MessagePinProps = {
  /**
   * Whether to display the component.
   *
   * Changing the display or hiding in this way usually does not trigger the loading and unloading of components.
   */
  visible?: boolean;
  /**
   * Common state max line.
   *
   * default: 2
   */
  commonStateMaxLine?: number;
  /**
   * Extend state max line.
   *
   * default: 5
   */
  extendStateMaxLine?: number;
  /**
   * MessagePin component max width.
   *
   * default: Three quarters of the screen width.
   */
  maxWidth?: number;
  /**
   * MessagePin component style.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Show full content.
   *
   * default: false
   */
  showFullContent?: boolean;

  /**
   * Callback function when the message is long pressed.
   */
  onLongPress?: (msg: ChatMessage) => void;
};

/**
 * MessagePin component props type definition
 */
export type MessagePinItemProps = MessagePinProps & MessagePinTask;
