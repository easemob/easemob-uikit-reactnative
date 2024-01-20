import type {
  ChatContact,
  ChatConversation,
  ChatConversationType,
  ChatGroup,
  ChatMessage,
} from 'react-native-chat-sdk';

import type { PartialUndefinable } from '../types';

export enum UIListenerType {
  Conversation = 'ConversationModel',
  Contact = 'ContactModel',
  Group = 'GroupModel',
  GroupParticipant = 'GroupParticipantModel',
  NewRequest = 'NewRequestModel',
}

/**
 * The state of the new request.
 */
export type NewRequestStateType = 'pending' | 'accepted' | 'declined';

/**
 * Used when making multiple or single selections.
 */
export type StateModel = {
  /**
   * Check or not
   */
  checked?: boolean;
  /**
   * Whether to disable.
   */
  disable?: boolean;
};

type _ConversationModel = PartialUndefinable<ChatConversation>;
/**
 * ConversationModel: The data model of the conversation list UI component.
 */
export type ConversationModel = Pick<
  _ConversationModel,
  'ext' | 'isPinned' | 'pinnedTime'
> & {
  /**
   * The conversation ID.
   */
  convId: string;
  /**
   * The conversation type.
   */
  convType: ChatConversationType;
  /**
   * The message unread count.
   */
  unreadMessageCount?: number;
  /**
   * The conversation name.
   */
  convName?: string;
  /**
   * The conversation avatar URL.
   */
  convAvatar?: string;
  /**
   * Whether the conversation is silent.
   */
  doNotDisturb?: boolean;
  /**
   * The last message.
   */
  lastMessage?: ChatMessage;
};
type _ContactModel = PartialUndefinable<ChatContact>;
/**
 * ContactModel: The data model of the contact list UI component.
 */
export type ContactModel = _ContactModel &
  StateModel & {
    userId: string;
    userName?: string;
    userAvatar?: string;
  };

type _GroupModel = Omit<
  PartialUndefinable<ChatGroup>,
  'memberList' | 'adminList' | 'blockList' | 'muteList'
>;
/**
 * GroupModel: The data model of the group list UI component.
 */
export type GroupModel = _GroupModel & {
  /**
   * The group ID.
   */
  groupId: string;
  /**
   * The group name.
   */
  groupName: string;
  /**
   * The group owner ID.
   */
  owner: string;
  /**
   * The group avatar url.
   */
  groupAvatar?: string;
  /**
   * The group my remark.
   */
  myRemark?: string;
};

/**
 * GroupParticipantModel: The data model of the group member list UI component.
 */
export type GroupParticipantModel = StateModel & {
  memberId: string;
  memberName?: string;
  memberAvatar?: string;
  isOwner?: boolean;
};

/**
 * NewRequestModel: The data model of the new request notification list UI component.
 */
export type NewRequestModel = {
  requestId: string;
  name: string;
  avatar?: string;
  tip?: string;
  state?: NewRequestStateType;
  msg?: ChatMessage;
};

/**
 * The UI component will pay attention to the listener and refresh the UI when the data changes. For example: conversation list, contact list, group list, group member list, new request notification list, etc.
 *
 * DataModel: The data model of the UI component. For example: ConversationModel, ContactModel, GroupModel, etc. {@link ConversationModel} {@link ContactModel} {@link GroupModel} {@link GroupParticipantModel} {@link NewRequestModel}
 */
export type UIListener<DataModel> = {
  /**
   * Callback notification when data added.
   *
   * For example: create a group, add contacts, add group members, create new conversations, receive contact requests, etc.
   */
  onAddedEvent?: (data: DataModel) => void;
  /**
   * Callback notification when data changes.
   *
   * For example: new messages received in the conversation list, messages read, conversations read, unread changes, contact notes changes, group member notes changes, etc.
   */
  onUpdatedEvent?: (data: DataModel) => void;
  /**
   * Callback notification when data is deleted.
   *
   * For example: deleting conversations, exiting groups, being kicked out of groups, deleting contacts, etc.
   */
  onDeletedEvent?: (data: DataModel) => void;
  /**
   * After receiving this notification, the list should be refreshed, and the data source does not need to change. Usually when the UI changes but the data does not change, the callback notification needs to be issued.
   *
   * Usually, modifying the data source will not refresh automatically, and you need to actively call the refresh method.
   */
  onRequestRefreshEvent?: (id?: string) => void;
  /**
   * Data needs to be requested again and refreshed.
   *
   * For example: initialization page.
   */
  onRequestReloadEvent?: (id?: string) => void;

  /**
   * The type of listener.
   */
  readonly type: UIListenerType;
};

export type UIConversationListListener = UIListener<ConversationModel>;
export type UIContactListListener = UIListener<ContactModel>;
export type UIGroupListListener = UIListener<GroupModel>;
export type UIGroupParticipantListListener = UIListener<GroupParticipantModel>;
export type UINewRequestListListener = UIListener<NewRequestModel>;
