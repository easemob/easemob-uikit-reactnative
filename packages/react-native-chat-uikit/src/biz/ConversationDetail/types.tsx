import type { StyleProp, ViewStyle } from 'react-native';

import type { DataModel } from '../../chat';
import type {
  ChatConversationType,
  ChatMessage,
  ChatMessageReaction,
  ChatMessageThread,
} from '../../rename.chat';
import type { InitMenuItemsType } from '../BottomSheetMenu';
import type { TopNavigationBarElementType } from '../TopNavigationBar';
import type {
  ListActions,
  MessageLayoutType,
  PropsWithBack,
  PropsWithCancel,
  PropsWithError,
  PropsWithNavigationBar,
  PropsWithRef,
  PropsWithSearch,
  PropsWithTest,
} from '../types';
import type {
  MessageBubbleRender,
  MessageContentRender,
  MessageQuoteBubbleRender,
  MessageReactionRender,
  MessageThreadRender,
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

  /**
   * Show the multi select component.
   */
  showMultiSelect: () => void;

  /**
   * Hide the multi select component.
   */
  hideMultiSelect: () => void;

  /**
   * Show the mask component.
   */
  showMask: () => void;
  /**
   * Hide the mask component.
   */
  hideMask: () => void;
};

/**
 * Message input component properties.
 */
export type MessageInputProps = PropsWithError &
  PropsWithTest & {
    /**
     * The type of the conversation details component.
     *
     * This component can be reused on chat pages, chat search page, thread pages, and thread creation pages.
     *
     * Load historical messages, send and receive messages in `chat` mode. In `search` mode, search message result positioning is added based on `chat` mode. Load historical messages, send and receive thread messages in `thread` mode. The `create thread` mode mainly creates threads. See detail {@link ConversationDetailModelType}.
     */
    type: ConversationDetailModelType;
    /**
     * The type of the conversation selection mode.
     *
     * Supports normal mode and multi-selection mode.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    selectType?: ConversationSelectModeType;
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
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
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
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    onHeightChange?: (height: number) => void;
    /**
     * Callback notification when editing message is completed.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
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

    /**
     * The multi select message count properties.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    multiSelectCount?: number;

    /**
     * Callback notification when click multi select delete message button.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    onClickedMultiSelectDeleteButton?: () => void;

    /**
     * Callback notification when click multi select share message button.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    onClickedMultiSelectShareButton?: () => void;

    /**
     * The message unread count.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    unreadCount?: number;

    /**
     * Callback notification when click unread count button for clear unread message.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    onClickedUnreadCount?: () => void;

    /**
     * Callback notification when change text.
     */
    onChangeValue?: (text: string) => void;
  };

/**
 * Message input component state.
 */
export type MessageInputState =
  | 'normal'
  | 'emoji'
  | 'voice'
  | 'keyboard'
  | 'multi-select';

/**
 * Conversation detail component type.
 */
export type ConversationDetailModelType =
  | 'chat'
  | 'create_thread'
  | 'thread'
  | 'search';

export type ConversationSelectModeType = 'common' | 'multi';

export type ConversationDetailRef = {
  sendCardMessage: (props: SendCardProps) => void;
  changeSelectType: (type: ConversationSelectModeType) => void;
};

/**
 * Conversation detail component properties.
 *
 * The session details component will be reused in various scenarios. For example: open conversation detail, create thread, open thread.
 */
export type ConversationDetailProps = PropsWithError &
  PropsWithTest &
  PropsWithBack &
  PropsWithSearch &
  PropsWithRef<ConversationDetailRef> & {
    /**
     * The type of the conversation details component.
     *
     * This component can be reused on chat pages, chat search page, thread pages, and thread creation pages.
     *
     * Load historical messages, send and receive messages in `chat` mode. In `search` mode, search message result positioning is added based on `chat` mode. Load historical messages, send and receive thread messages in `thread` mode. The `create thread` mode mainly creates threads. See detail {@link ConversationDetailModelType}.
     */
    type: ConversationDetailModelType;

    /**
     * The type of the conversation selection mode.
     *
     * Supports normal mode and multi-selection mode.
     */
    selectType?: ConversationSelectModeType;
    /**
     * Conversation ID or thread ID.
     */
    convId: string;
    /**
     * Conversation type.
     *
     * In thread mode, this parameter is `ChatConversationType.GroupChat`.
     */
    convType: ChatConversationType;

    /**
     * The message thread. this parameter is required in thread mode.
     */
    thread?: ChatMessageThread;

    /**
     * The first message to be sent. This parameter is required in thread mode.
     */
    firstMessage?: SendMessageProps;

    /**
     * The message ID.
     *
     * this parameter is required in create thread mode or search mode.
     */
    msgId?: string;

    /**
     * The parent ID. this parameter is required in create thread mode.
     */
    parentId?: string;

    /**
     * The name of the new thread. this parameter is required in create thread mode.
     */
    newThreadName?: string;

    /**
     * A collection of properties for the input component. As an internal component of conversation details, settings are provided directly through collections.
     */
    input?: {
      /**
       * The input component properties.
       */
      props?: Omit<MessageInputProps, 'convId' | 'convType' | 'type'> & {
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
      props?: Omit<MessageListProps, 'convId' | 'convType' | 'type'> & {
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

    /**
     * Callback notification when open thread.
     */
    onClickedThread?: () => void;
    /**
     * Callback notification when start voice phone.
     */
    onClickedVoice?: () => void;
    /**
     * Callback notification when start video phone.
     */
    onClickedVideo?: () => void;

    /**
     * Callback notification when thread is destroyed.
     *
     * this parameter is options in thread mode.
     */
    onThreadDestroyed?: (thread: ChatMessageThread) => void;

    /**
     * Callback notification when current user is kicked by owner.
     *
     * this parameter is options in thread mode.
     */
    onThreadKicked?: (thread: ChatMessageThread) => void;

    /**
     * Callback notification when forward message.
     */
    onForwardMessage?: (msgs: ChatMessage[]) => void;

    /**
     * Callback notification when create thread is completed.
     *
     * If the return thread is not undefined, the thread will be created successfully.
     *
     * Normally modify the necessary parameters. For example: type, msgId, threadId, etc.
     */
    onCreateThreadResult?: (
      thread?: ChatMessageThread,
      firstMessage?: SendMessageProps
    ) => void;
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

export type SendMessageProps =
  | SendTextProps
  | SendFileProps
  | SendImageProps
  | SendVideoProps
  | SendVoiceProps
  | SendTimeProps
  | SendSystemProps
  | SendCardProps
  | SendCustomProps;
/**
 * Message bubble type.
 */
export type MessageViewType = 'system' | 'time' | 'message' | 'history';
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
  modelType: MessageViewType;
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
  /**
   * Whether the message is high background.
   */
  isHighBackground?: boolean;
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
    /**
     * Message reactions.
     */
    reactions?: ChatMessageReaction[];

    /**
     * Message thread. Only group chat is supported.
     */
    thread?: ChatMessageThread;

    /**
     * The item check state.
     *
     * true is checked.
     * false is uncheck.
     * undefined is hide.
     */
    checked?: boolean;
  };

export type MessageThreadModel = {
  id: string;
  title: string;
  count: number;
  thread: ChatMessageThread;
};

export type ThreadMemberModel = DataModel & {
  isOwner?: boolean;
};

export type MessageHistoryModel = BasicModel & {
  /**
   * Message object.
   */
  msg: ChatMessage;
};

export type MessageSearchModel = MessageHistoryModel & {
  /**
   * The search keyword.
   */
  keyword: string;
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

  /**
   * Callback notification when the message reaction is clicked.
   */
  onReactionClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel,
    face: string
  ) => void;

  /**
   * Callback notification when the message reaction is long pressed.
   */
  onReactionLongPress?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel,
    face: string
  ) => void;

  onThreadClicked?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;

  onChecked?: (
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
   * Message thread component.
   *
   * It is in `MessageView`.
   */
  MessageThreadBubble?: MessageThreadRender;
  /**
   * Message reaction component.
   */
  MessageReaction?: MessageReactionRender;
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
   * @param value send message props. See detail {@link SendTextProps} {@link SendFileProps} {@link SendImageProps} {@link SendVideoProps} {@link SendVoiceProps} {@link SendTimeProps} {@link SendSystemProps} {@link SendCardProps} {@link SendCustomProps}.
   */
  addSendMessage: (value: SendMessageProps) => void;

  addSendMessageToUI: (params: {
    value: SendMessageProps;

    onFinished?: (item: MessageListItemProps) => void;
    onBeforeCallback?: () => void | Promise<void>;
  }) => Promise<void>;

  sendMessageToServer: (msg: ChatMessage) => void;
  /**
   * Add a message to local database.
   */
  saveMessage: (msg: ChatMessage) => void;
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

  /**
   * Start the thread more menu.
   */
  startShowThreadMoreMenu: () => void;

  /**
   * Cancel multi message select mode.
   */
  cancelMultiSelected: () => void;

  /**
   * Remove multi selected message.
   */
  removeMultiSelected: (onResult: (confirmed: boolean) => void) => void;

  /**
   * Get multi selected messages.
   */
  getMultiSelectedMessages: () => ChatMessage[];

  /**
   * Show the pin message component.
   */
  showPinMessageComponent: () => void;

  /**
   * Hide the pin message component.
   */
  hidePinMessageComponent: () => void;

  /**
   * Request to show the pin message component.
   * @param onResult Request result callback. You can decide whether to display a component based on its quantity.
   */
  requestShowPinMessageComponent: (onResult: (count: number) => void) => void;
};

/**
 * Message list component properties.
 */
export type MessageListProps = PropsWithError &
  PropsWithTest & {
    /**
     * The type of the conversation details component.
     *
     * This component can be reused on chat pages, thread pages, and thread creation pages.
     */
    type: ConversationDetailModelType;

    /**
     * The type of the conversation selection mode.
     *
     * Supports normal mode and multi-selection mode.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    selectType?: ConversationSelectModeType;
    /**
     * Conversation ID.
     */
    convId: string;
    /**
     * Conversation type.
     */
    convType: ChatConversationType;

    /**
     * The message thread.
     */
    thread?: ChatMessageThread;

    /**
     * The message ID. this parameter is required in create thread mode.
     */
    msgId?: string;

    /**
     * The parent ID. this parameter is required in create thread mode.
     */
    parentId?: string;

    /**
     * The name of the new thread. this parameter is required in create thread mode.
     */
    newThreadName?: string;

    /**
     * The first message to be sent. This parameter is required in thread mode.
     */
    firstMessage?: SendMessageProps;

    /**
     * Background image.
     */
    backgroundImage?: string;

    /**
     * The callback notification for clicking the list is not the callback notification for clicking the list item.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
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
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    onQuoteMessageForInput?: (model: MessageModel) => void;
    /**
     * Callback notification for editing the message. By default, the input component pays attention to the callback notification. After receiving the callback notification, the edit message content is displayed in the input component.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
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

    /**
     * Callback notification when request create thread.
     * @returns
     */
    onCreateThread?: (params: {
      newName: string;
      parentId: string;
      messageId: string;
    }) => void;

    /**
     * Callback notification when open thread.
     */
    onOpenThread?: (thread: ChatMessageThread) => void;

    /**
     * Callback notification when create thread is completed.
     *
     * If the return thread is not undefined, the thread will be created successfully.
     *
     * Normally modify the necessary parameters. For example: type, msgId, threadId, etc.
     */
    onCreateThreadResult?: (
      thread?: ChatMessageThread,
      firstMessage?: SendMessageProps
    ) => void;

    /**
     * Callback notification when click edit thread name.
     *
     * this parameter is options in thread mode.
     */
    onClickedEditThreadName?: (thread: ChatMessageThread) => void;
    /**
     * Callback notification when click open thread member list.
     *
     * this parameter is options in thread mode.
     */
    onClickedOpenThreadMemberList?: (thread: ChatMessageThread) => void;
    /**
     * Callback notification when click leave thread.
     *
     * this parameter is options in thread mode.
     */
    onClickedLeaveThread?: (threadId: string) => void;
    /**
     * Callback notification when click destroy thread.
     *
     * this parameter is options in thread mode.
     */
    onClickedDestroyThread?: (threadId: string) => void;

    /**
     * Callback notification when change to multi select mode.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    onClickedMultiSelected?: () => void;

    /**
     * Callback notification when update select multi message.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    onChangeMultiItems?: (items: MessageModel[]) => void;

    /**
     * Callback notification when forward message.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    onClickedSingleSelect?: (item: MessageModel) => void;

    /**
     * Callback notification when click history message.
     */
    onClickedHistoryDetail?: (item: MessageModel) => void;

    /**
     * Callback notification when change unread count.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    onChangeUnreadCount?: (count: number) => void;

    /**
     * handler for generate thread name.
     */
    generateThreadName?: (msg: MessageModel) => string;

    /**
     * Callback notification when change pin message component height.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     *
     * @param height The pin message component height.
     */
    onChangePinMaskHeight?: (height: number) => void;

    /**
     * Callback notification when request close pin message component.
     *
     * **Note** This interface is mainly used between internal components. Users do not need to pay attention to it.
     */
    onRequestClosePinMessage?: () => void;
  };

export type MessageThreadListRef = {};
export type MessageThreadListProps = PropsWithError &
  PropsWithTest &
  PropsWithNavigationBar &
  PropsWithBack & {
    /**
     * The container style of the conversation details component.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * The thread parent ID. this parameter is group ID normally.
     */
    parentId: string;
    /**
     * The Callback notification when a list item is clicked.
     */
    onClickedItem?: (model: MessageThreadModel) => void | boolean | undefined;
  };
export type MessageThreadListItemProps = {
  model: MessageThreadModel;
  onClicked?: (model: MessageThreadModel) => void | boolean | undefined;
};

export type MessageThreadMemberListProps = PropsWithError &
  PropsWithTest &
  PropsWithNavigationBar &
  PropsWithBack & {
    /**
     * The container style of the conversation details component.
     */
    containerStyle?: StyleProp<ViewStyle>;

    /**
     * The thread object.
     */
    thread: ChatMessageThread;

    /**
     * The callback notification when a list item is clicked.
     */
    onClickedItem?: ((data?: ThreadMemberModel) => boolean | void) | undefined;
  };
export type MessageThreadMemberListItemProps = Omit<
  ListActions<ThreadMemberModel>,
  'onToRightSlideItem' | 'onToLeftSlideItem'
> & {
  model: ThreadMemberModel;
};

export type MessageHistoryListItemProps = {
  containerStyle?: StyleProp<ViewStyle>;
  model: MessageHistoryModel;
  onClicked?: (model: MessageHistoryModel) => void | boolean | undefined;
};

export type MessageHistoryListProps = PropsWithTest &
  PropsWithBack &
  PropsWithNavigationBar & {
    /**
     * The container style of the message history list component.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * The message object.
     *
     * This message is combine type message.
     */
    message: ChatMessage;

    /**
     * The Callback notification when a list item is clicked.
     */
    onClickedItem?: (model: MessageHistoryModel) => void | boolean | undefined;
  };

export type MessageSearchItemProps = {
  /**
   * The message search model.
   */
  model: MessageSearchModel;
  /**
   * Callback notification when a list item is clicked.
   */
  onClicked?: (model: MessageSearchModel) => void;
};
export type MessageSearchProps = PropsWithTest &
  PropsWithCancel<MessageSearchModel> & {
    /**
     * The container style of the message history list component.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * The conversation ID.
     */
    convId: string;
    /**
     * The conversation type.
     */
    convType: ChatConversationType;
    /**
     * Callback notification when a list item is clicked.
     */
    onClickedItem?: (model: MessageSearchModel) => void;
  };
