import type { StyleProp, ViewStyle } from 'react-native';

import type { BlockButtonProps } from '../../ui/Button';
import type { InitMenuItemsType } from '../BottomSheetMenu';
import type { PropsWithBack, PropsWithNavigationBar } from '../types';

/**
 * Info Component properties.
 */
export type InfoProps = PropsWithBack &
  PropsWithNavigationBar & {
    /**
     * Callback notification when the navigation bar button is clicked.
     */
    onClickedNavigationBarButton?: () => void;
    /**
     * Whether to display the send message button.
     */
    hasSendMessage?: boolean;
    /**
     * Whether to display the audio call button.
     */
    hasAudioCall?: boolean;
    /**
     * Whether to display the video call button.
     */
    hasVideoCall?: boolean;
    /**
     * Callback notifications for removing sessions and clearing messages. If customized then the behavior is determined by the user.
     */
    onClearChat?: () => void;
    /**
     * Do not disturb or not.
     */
    doNotDisturb?: boolean;
    /**
     * Do not disturb callback notification. Used with `doNotDisturb`. This is a feature of the `CommonSwitch` component.
     */
    onDoNotDisturb?: (isDisturb: boolean) => void;
    /**
     * Container style for the info component.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Callback notification when the send message button is clicked.
     */
    onSendMessage?: (id: string) => void;
    /**
     * Callback notification when the audio call button is clicked.
     */
    onAudioCall?: (id: string) => void;
    /**
     * Callback notification when the video call button is clicked.
     */
    onVideoCall?: (id: string) => void;
    /**
     * Callback notification of copy ID. If set it is up to the user to determine the behavior.
     */
    onCopyId?: (id: string) => void;
    /**
     * Registrar. If set a default menu is provided and the user provides a new menu.
     */
    onInitMenu?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
    /**
     * Registrar. If set then provides the default button array component and the user provides a new button array component.
     */
    onInitButton?: (
      initButtons: React.ReactElement<BlockButtonProps>[]
    ) => React.ReactElement<BlockButtonProps>[];
  };

/**
 * ContactInfo Component properties.
 */
export type UserInfoProps = InfoProps & {
  /**
   * User ID.
   */
  userId: string;
  /**
   * User name.
   */
  userName?: string;
  /**
   * User avatar.
   */
  userAvatar?: string;
  /**
   * Whether to display the add contact button.
   */
  isContact?: boolean;
  /**
   * Add contact callback notification.
   */
  onAddContact?: (id: string) => void;
};

/**
 * ContactInfo Component properties.
 */
export type ContactInfoProps = UserInfoProps;

/**
 * GroupInfo Component reference.
 */
export type GroupInfoRef = {
  /**
   * Set the group name.
   */
  setGroupName: (groupId: string, groupName?: string) => void;
  /**
   * Set the group description.
   */
  setGroupDescription: (groupId: string, desc?: string) => void;
  /**
   * Set the group remark.
   */
  setGroupMyRemark: (groupId: string, remark?: string) => void;
};

/**
 * GroupInfo Component properties.
 */
export type GroupInfoProps = InfoProps & {
  /**
   * Group ID.
   */
  groupId: string;
  /**
   * Group owner ID.
   */
  ownerId?: string;
  /**
   * Group name.
   */
  groupName?: string;
  /**
   * Group avatar.
   */
  groupAvatar?: string;
  /**
   * Group description.
   */
  groupDescription?: string;
  /**
   * Group remark.
   */
  groupMyRemark?: string;
  /**
   * Callback notification when group member button is clicked.
   */
  onParticipant?: (groupId: string) => void;
  /**
   * Callback notification when group remark button is clicked.
   */
  onGroupMyRemark?: (groupId: string, remark?: string) => void;
  /**
   * Callback notification when group name button is clicked.
   */
  onGroupName?: (groupId: string, groupName?: string) => void;
  /**
   * Callback notification when group description button is clicked.
   */
  onGroupDescription?: (groupId: string, desc?: string) => void;
  /**
   * Callback notification when group avatar button is clicked.
   */
  onGroupAvatar?: (groupId: string, avatar?: string) => void;
  /**
   * Callback notification when change group owner button is clicked.
   */
  onClickedChangeGroupOwner?: (groupId: string, ownerId: string) => void;
  /**
   * Callback notification that the group has been disbanded.
   *
   * Often routing is required to return to the previous page.
   */
  onGroupDestroy?: (groupId: string) => void;
  /**
   * Callback notification that the group has been quit.
   *
   * Often routing is required to return to the previous page.
   */
  onGroupQuit?: (groupId: string) => void;
  /**
   * Callback notification that the group has been kicked.
   *
   * Often routing is required to return to the previous page.
   */
  onGroupKicked?: (groupId: string) => void;
};

/**
 * GroupParticipantInfo Component properties.
 */
export type GroupParticipantInfoProps = UserInfoProps & {
  /**
   * Group ID.
   */
  groupId: string;
  /**
   * Group member remark.
   */
  userRemark?: string;
  /**
   * Callback notification when change group member remark button is clicked.
   */
  onGroupParticipantRemark?: (groupId: string, memberId: string) => void;
};

/**
 * EditInfo Component properties.
 */
export type EditInfoProps = PropsWithBack &
  PropsWithNavigationBar & {
    /**
     * The name of the returned button.
     */
    backName: string;
    /**
     * The name of the saved button.
     */
    saveName: string;
    /**
     * The maximum length of the input box.
     */
    maxLength?: number;
    /**
     * The preset content of the input box component.
     */
    initialData: string;
    /**
     * Callback notification when the save button is clicked.
     */
    onSave?: (data: string) => void;
    /**
     * Container style for the edit info component.
     */
    containerStyle: StyleProp<ViewStyle>;
  };
