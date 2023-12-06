import type { StyleProp, ViewStyle } from 'react-native';
import type { ChatGroupStyle } from 'react-native-chat-sdk';

export type InfoProps = {
  onBack?: () => void;
  onMore?: () => void;
  hasSendMessage?: boolean;
  hasAudioCall?: boolean;
  hasVideoCall?: boolean;
  onClearChat?: () => void;
  doNotDisturb?: boolean;
  onDoNotDisturb?: (isDisturb: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
  onSendMessage?: (userId: string) => void;
  onAudioCall?: (userId: string) => void;
  onVideoCall?: (userId: string) => void;
  onCopyId?: (userId: string) => void;
};

export type ContactInfoProps = InfoProps & {
  userId: string;
  userName?: string;
  userAvatar?: string;
  isContact?: boolean;
};
export type GroupInfoProps = InfoProps & {
  groupId: string;
  ownerId?: string;
  groupName?: string;
  groupAvatar?: string;
  groupDescription?: string;
  groupType?: ChatGroupStyle;
  onParticipant?: (groupId: string) => void;
  onGroupMyRemark?: (groupId: string) => void;
  onGroupName?: (groupId: string) => void;
  onGroupDescription?: (groupId: string) => void;
  onGroupAvatar?: (groupId: string) => void;
  onClickedChangeGroupOwner?: (groupId: string, ownerId: string) => void;
  onGroupDestroy?: (groupId: string) => void;
  onGroupQuit?: (groupId: string) => void;
  onGroupUpdateMyRemark?: (groupId: string) => void;
};
export type GroupParticipantInfoProps = InfoProps & {
  groupId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  isContact?: boolean;
  userRemark?: string;
  onGroupParticipantRemark?: (groupId: string, memberId: string) => void;
};
