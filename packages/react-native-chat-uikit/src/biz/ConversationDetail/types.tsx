import type { StyleProp, ViewStyle } from 'react-native';
import type { ChatConversationType, ChatMessage } from 'react-native-chat-sdk';

import type { InitMenuItemsType } from '../BottomSheetMenu';
import type { TopNavigationBarElementType } from '../TopNavigationBar';
import type {
  PropsWithBack,
  PropsWithError,
  PropsWithSearch,
  PropsWithTest,
} from '../types';
import type {
  MessageBubbleRender,
  MessageContentRender,
  MessageQuoteBubbleRender,
  MessageViewRender,
  SystemTipViewRender,
  TimeTipViewRender,
} from './MessageListItem.type';

/**
 * Message input component reference.
 */
export type MessageInputRef = {
  /**
   * Close the keyboard and switch to non-input state.
   */
  close: () => void;
  /**
   * Reply message.
   */
  quoteMessage: (model: MessageModel) => void;
  /**
   * Edit message.
   */
  editMessage: (model: MessageModel) => void;
  /**
   * Mention selected user.
   */
  // mentionSelected: (list: { id: string; name: string }[]) => void;
};

/**
 * Message input component properties.
 */
export type MessageInputProps = PropsWithError &
  PropsWithTest & {
    /**
     * Conversation ID.
     */
    convId: string;
    /**
     * Conversation type.
     */
    convType: ChatConversationType;
    /**
     * The top position of the input box.
     *
     * If `SafeAreaView` is used, you may need to adjust the layout of the component and set.
     */
    top?: number | undefined;
    /**
     * The bottom position of the input box.
     *
     * If `SafeAreaView` is used, you may need to adjust the layout of the component and set.
     */
    bottom?: number | undefined;
    /**
     * Enter the maximum number of rows for the component.
     */
    numberOfLines?: number | undefined;
    /**
     * Callback notification when the send button is clicked.
     */
    onClickedSend?: (
      value:
        | SendTextProps
        | SendFileProps
        | SendImageProps
        | SendVideoProps
        | SendVoiceProps
        | SendCardProps
    ) => void;
    /**
     * Whether to close the keyboard after sending the message.
     */
    closeAfterSend?: boolean;
    /**
     * Callback notification for height changes.
     */
    onHeightChange?: (height: number) => void;
    /**
     * Callback notification when editing message is completed.
     */
    onEditMessageFinished?: (model: MessageModel) => void;
    /**
     * Only groups are available.
     */
    onInputMention?: (groupId: string) => void;
    /**
     * Click the callback notification of the card message.
     */
    onClickedCardMenu?: () => void;
    /**
     * Callback notification for initializing the menu. Provides a default menu and returns a new menu.
     */
    onInitMenu?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
    /**
     * The list of emoji expressions. The default is {@link FACE_ASSETS}.
     *
     * The format needs to be followed. For example: `U+1F641` {@link FACE_ASSETS}. It will replace the built-in emoji  list.
     */
    emojiList?: string[];
  };

/**
 * Message input component state.
 */
export type MessageInputState = 'normal' | 'emoji' | 'voice' | 'keyboard';

/**
 * Conversation detail component properties.
 */
export type ConversationDetailProps = PropsWithError &
  PropsWithTest &
  PropsWithBack &
  PropsWithSearch & {
    /**
     * Conversation ID.
     */
    convId: string;
    /**
     * Conversation type.
     */
    convType: ChatConversationType;
    /**
     * A collection of properties for the input component. As an internal component of conversation details, settings are provided directly through collections.
     */
    input?: {
      /**
       * The input component properties.
       */
      props?: Omit<MessageInputProps, 'convId' | 'convType'> & {
        convId?: string;
        convType?: ChatConversationType;
      };
      /**
       * The input component.
       */
      render?: React.ForwardRefExoticComponent<
        MessageInputProps & React.RefAttributes<MessageInputRef>
      >;
      /**
       * The input component reference.
       */
      ref?: React.RefObject<MessageInputRef>;
    };
    /**
     * A collection of properties for the message list component. As an internal component of conversation details, settings are provided directly through collections.
     */
    list?: {
      /**
       * The message list component properties.
       */
      props?: Omit<MessageListProps, 'convId' | 'convType'> & {
        convId?: string;
        convType?: ChatConversationType;
      };
      /**
       * The message list item component render.
       */
      render?: React.ForwardRefExoticComponent<
        MessageListProps & React.RefAttributes<MessageListRef>
      >;
      /**
       * The message list item component reference.
       */
      ref?: React.RefObject<MessageListRef>;
    };
    /**
     * The container style of the conversation details component.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Callback notification when the avatar is clicked.
     */
    onClickedAvatar?: (params: {
      convId: string;
      convType: ChatConversationType;
      ownerId?: string;
    }) => void;
    /**
     * Custom navigation bar component.
     */
    NavigationBar?: TopNavigationBarElementType<any, any>;
    /**
     * Whether to enable the navigation bar.
     *
     * Default is true.
     */
    enableNavigationBar?: boolean;
  };

/**
 * Message input component send type.
 */
export type SendType =
  | 'text'
  | 'file'
  | 'image'
  | 'voice'
  | 'video'
  | 'time'
  | 'system'
  | 'card'
  | 'custom';

/**
 * Message input component send properties.
 */
export type SendBasicProps = {
  type: SendType;
  quote?: MessageModel;
};
/**
 * Message input component send text message properties.
 */
export type SendTextProps = SendBasicProps & {
  content: string;
};
/**
 * Message input component send file message properties.
 */
export type SendFileProps = SendBasicProps & {
  localPath: string;
  fileSize?: number;
  displayName?: string;
  fileExtension?: string;
};
/**
 * Message input component send image message properties.
 */
export type SendImageProps = SendBasicProps &
  SendFileProps & {
    imageWidth: number;
    imageHeight: number;
  };
/**
 * Message input component send voice message properties.
 */
export type SendVoiceProps = SendBasicProps &
  SendFileProps & {
    duration: number;
  };
/**
 * Message input component send video message properties.
 */
export type SendVideoProps = SendBasicProps &
  SendFileProps & {
    thumbLocalPath: string;
    videoWidth: number;
    videoHeight: number;
    duration?: number;
  };
/**
 * Message input component send time message properties.
 */
export type SendTimeProps = SendBasicProps & {
  timestamp: number;
};
/**
 * Message input component send system message properties.
 */
export type SendSystemProps = SendBasicProps & {
  msg: ChatMessage;
};
/**
 * Message input component send card message properties.
 */
export type SendCardProps = SendBasicProps & {
  userId: string;
  userName?: string;
  userAvatar?: string;
};
/**
 * Message input component send custom message properties.
 */
export type SendCustomProps = SendBasicProps & {
  msg: ChatMessage;
};

/**
 * Message bubble type.
 */
export type MessageBubbleType = 'system' | 'time' | 'message';
/**
 * Message layout type.
 *
 * This layout type is only valid for messages of type `mesage`. `time` and `system` messages are displayed in the center.
 */
export type MessageLayoutType = 'left' | 'right';
/**
 * Received message state type.
 */
export type MessageRecvStateType = 'no-play' | 'loading-attachment';
/**
 * Send message state type.
 */
export type MessageSendStateType =
  | 'sending'
  | 'send-success'
  | 'send-fail'
  | 'send-to-peer'
  | 'peer-read';
/**
 * Message state type.
 */
export type MessageStateType =
  | MessageRecvStateType
  | MessageSendStateType
  | 'none';
/**
 * Message editable state type.
 */
export type MessageEditableStateType = 'no-editable' | 'editable' | 'edited';
/**
 * Message list item basic model.
 */
type BasicModel = {
  /**
   * Model type.
   */
  modelType: MessageBubbleType;
  /**
   * Message sender ID.
   */
  userId: string;
  /**
   * Message sender name.
   */
  userName?: string;
  /**
   * Message sender avatar.
   */
  userAvatar?: string;
};
/**
 * Message list item voice model.
 */
type VoiceModel = {
  /**
   * Whether the voice is playing.
   */
  isVoicePlaying?: boolean;
};
/**
 * Message list item system message model.
 */
export type SystemMessageModel = BasicModel & {
  msg: ChatMessage;
};
/**
 * Message list item time message model.
 */
export type TimeMessageModel = BasicModel & {
  timestamp: number;
};
/**
 * Message list item message model.
 */
export type MessageModel = BasicModel &
  VoiceModel & {
    layoutType: MessageLayoutType;
    /**
     * Message object.
     */
    msg: ChatMessage;
    /**
     * Message quote object. (optional)
     */
    quoteMsg?: ChatMessage;
  };
/**
 * Message list item actions properties.
 */
export type MessageListItemActionsProps = {
  /**
   * Callback notification when a list item is clicked.
   * @param id Message ID or timestamp.
   * @param model Message model. See detail {@link MessageModel} {@link TimeMessageModel} {@link MessageModel}.
   */
  onClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  /**
   * Callback notification when a list item is long pressed.
   * @param id Message ID or timestamp.
   * @param model Message model. See detail {@link MessageModel} {@link TimeMessageModel} {@link MessageModel}.
   */
  onLongPress?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  /**
   * Callback notification when the avatar of a list item is clicked.
   * @param id Message ID or timestamp.
   * @param model Message model. See detail {@link MessageModel} {@link TimeMessageModel} {@link MessageModel}.
   */
  onAvatarClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  /**
   * Callback notification when the quote of a list item is clicked.
   * @param id Message ID or timestamp.
   * @param model Message model. See detail {@link MessageModel} {@link TimeMessageModel} {@link MessageModel}.
   */
  onQuoteClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  /**
   * Callback notification when the state of a list item is clicked.
   * @param id Message ID or timestamp.
   * @param model Message model. See detail {@link MessageModel} {@link TimeMessageModel} {@link MessageModel}.
   */
  onStateClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
};

/**
 * Message list item render component.
 *
 * The message bubble component is composed of nested basic components. In order to facilitate user customization, important internal sub-components are also exposed.
 */
export type MessageListItemRenders = {
  /**
   * Message view component.
   */
  MessageView?: MessageViewRender;
  /**
   * Message quote bubble component.
   *
   * It is in `MessageView`.
   */
  MessageQuoteBubble?: MessageQuoteBubbleRender;
  /**
   * Message bubble component.
   *
   * It is in `MessageView`.
   */
  MessageBubble?: MessageBubbleRender;
  /**
   * Message content component.
   *
   * It is in `MessageBubble`.
   */
  MessageContent?: MessageContentRender;
  /**
   * System tip component.
   *
   * It is in `MessageView`.
   */
  SystemTipView?: SystemTipViewRender;
  /**
   * Time tip component.
   *
   * It is in `MessageView`.
   */
  TimeTipView?: TimeTipViewRender;
};

/**
 * Message list item component properties.
 */
export type MessageListItemProps = MessageListItemRenders &
  MessageListItemActionsProps & {
    /**
     * @description: message id. If it is a message, use the message msgId, otherwise use the millisecond message timestamp.
     */
    id: string;
    /**
     * @description: message model.
     */
    model: SystemMessageModel | TimeMessageModel | MessageModel;
    /**
     * Component style properties.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * The index of the message in the list.
     */
    index?: number;
  };

/**
 * Message list item component type.
 */
export type MessageListItemComponentType =
  | React.ComponentType<MessageListItemProps>
  | React.ExoticComponent<MessageListItemProps>;

/**
 * Adds a message to the message list at the insertion position.
 */
export type MessageAddPosition = 'top' | 'bottom';
/**
 * Message list component reference.
 */
export type MessageListRef = {
  /**
   * Add a message to the message list at the bottom position.
   * @param value send message props. See detail {@link SendTextProps} {@link SendFileProps} {@link SendImageProps} {@link SendVideoProps} {@link SendVoiceProps} {@link SendTimeProps} {@link SendSystemProps} {@link SendCardProps}.
   */
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
      | SendCustomProps
  ) => void;
  /**
   * Remove a message from the message list.
   */
  removeMessage: (msg: ChatMessage) => void;
  /**
   * Recall a message from the message list.
   */
  recallMessage: (msg: ChatMessage) => void;
  /**
   * Update a message from the message list.
   */
  updateMessage: (updatedMsg: ChatMessage, fromType: 'send' | 'recv') => void;
  /**
   * Add historical messages to the specified location.
   */
  loadHistoryMessage: (msgs: ChatMessage[], pos: MessageAddPosition) => void;
  /**
   * Callback notification when the height of the input component is changed.
   */
  onInputHeightChange: (height: number) => void;
  /**
   * Callback notification when message editing is completed.
   */
  editMessageFinished: (model: MessageModel) => void;
  /**
   * Scroll the list to the bottom.
   */
  scrollToBottom: () => void;
};

/**
 * Message list component properties.
 */
export type MessageListProps = PropsWithError &
  PropsWithTest & {
    /**
     * Conversation ID.
     */
    convId: string;
    /**
     * Conversation type.
     */
    convType: ChatConversationType;
    /**
     * The callback notification for clicking the list is not the callback notification for clicking the list item.
     */
    onClicked?: () => void;
    /**
     * Callback notification when a list item is clicked.
     *
     * If the return result is false, the default behavior is prevented.
     */
    onClickedItem?: (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => void | boolean | undefined;
    /**
     * Callback notification when a list item is long pressed.
     *
     * If the return result is false, the default behavior is prevented.
     */
    onLongPressItem?: (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => void | boolean | undefined;
    /**
     * Callback notification when the avatar of a list item is clicked.
     *
     * If the return result is false, the default behavior is prevented.
     */
    onClickedItemAvatar?: (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => void | boolean | undefined;
    /**
     * Callback notification when the quote of a list item is clicked.
     *
     * If the return result is false, the default behavior is prevented.
     */
    onClickedItemQuote?: (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => void | boolean | undefined;
    /**
     * Callback notification for replying to the message. By default, the input component pays attention to the callback notification. After receiving the callback notification, the reply message content is displayed in the input component.
     */
    onQuoteMessageForInput?: (model: MessageModel) => void;
    /**
     * Callback notification for editing the message. By default, the input component pays attention to the callback notification. After receiving the callback notification, the edit message content is displayed in the input component.
     */
    onEditMessageForInput?: (model: MessageModel) => void;
    /**
     * Component style properties.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * The message reporting function provides default reporting content, and users can customize the reporting content to replace the default content.
     */
    reportMessageCustomList?: { key: string; value: string }[];

    /**
     * Custom message list item rendering component. If not provided the default component `MessageListItemMemo` will be used. If you only want to modify part of the content, replace the content of `MessageListItemRenders`.
     */
    listItemRenderProps?: MessageListItemRenders & {
      ListItemRender?: MessageListItemComponentType;
    };
    /**
     * Whether to automatically scroll to the latest message when receiving a message.
     *
     * Default is false.
     */
    recvMessageAutoScroll?: boolean;
    /**
     * all messages are all on the left or right.
     */
    messageLayoutType?: MessageLayoutType;
    /**
     * During the initialization process, set the callback notification of the menu. Provides a default menu and returns a new menu.
     */
    onInitMenu?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
    /**
     * Callback notification when copying ID is completed.
     */
    onCopyFinished?: (content: string) => void;
    /**
     * Callback notification when there are no more messages.
     */
    onNoMoreMessage?: () => void;
  };
