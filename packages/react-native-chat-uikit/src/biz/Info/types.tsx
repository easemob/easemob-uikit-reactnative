import type { StyleProp, ViewStyle } from 'react-native';
import type { ChatGroupStyle } from 'react-native-chat-sdk';

import type { BlockButtonProps } from '../../ui/Button';
import type { InitMenuItemsType } from '../BottomSheetMenu';
import type { PropsWithBack, PropsWithNavigationBar } from '../types';

export type UserState = 'online' | 'offline' | 'busy' | 'leave' | 'no-disturb';

export type InfoProps = PropsWithBack &
  PropsWithNavigationBar & {
    onMore?: () => void;
    hasSendMessage?: boolean;
    hasAudioCall?: boolean;
    hasVideoCall?: boolean;
    onClearChat?: () => void;
    doNotDisturb?: boolean;
    onDoNotDisturb?: (isDisturb: boolean) => void;
    containerStyle?: StyleProp<ViewStyle>;
    onSendMessage?: (id: string) => void;
    onAudioCall?: (id: string) => void;
    onVideoCall?: (id: string) => void;
    onCopyId?: (id: string) => void;
    onInitMenu?: (initItems: InitMenuItemsType[]) => InitMenuItemsType[];
    onInitButton?: (
      initButtons: React.ReactElement<BlockButtonProps>[]
    ) => React.ReactElement<BlockButtonProps>[];
  };

export type ContactInfoProps = InfoProps & {
  userId: string;
  userName?: string;
  userAvatar?: string;
  isContact?: boolean;
  onAddContact?: (id: string) => void;
};
export type GroupInfoRef = {
  setGroupName: (groupId: string, groupName?: string) => void;
  setGroupDescription: (groupId: string, desc?: string) => void;
  setGroupMyRemark: (groupId: string, remark?: string) => void;
};
export type GroupInfoProps = InfoProps & {
  groupId: string;
  ownerId?: string;
  groupName?: string;
  groupAvatar?: string;
  groupDescription?: string;
  groupMyRemark?: string;
  groupType?: ChatGroupStyle;
  onParticipant?: (groupId: string) => void;
  onGroupMyRemark?: (groupId: string, remark?: string) => void;
  onGroupName?: (groupId: string, groupName?: string) => void;
  onGroupDescription?: (groupId: string, desc?: string) => void;
  onGroupAvatar?: (groupId: string, avatar?: string) => void;
  onClickedChangeGroupOwner?: (groupId: string, ownerId: string) => void;
  onGroupDestroy?: (groupId: string) => void;
  onGroupQuit?: (groupId: string) => void;
  onGroupKicked?: (groupId: string) => void;
};
export type GroupParticipantInfoProps = InfoProps & {
  groupId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  isContact?: boolean;
  userRemark?: string;
  onGroupParticipantRemark?: (groupId: string, memberId: string) => void;
  onAddContact?: (id: string) => void;
};
export type MineInfoProps = InfoProps & {
  userId: string;
  userName?: string;
  userAvatar?: string;
  onClickedLogout?: () => void;
};

export type EditInfoProps = PropsWithBack &
  PropsWithNavigationBar & {
    backName: string;
    saveName: string;
    maxLength?: number;
    initialData: string;
    onSave?: (data: string) => void;
    containerStyle: StyleProp<ViewStyle>;
  };
