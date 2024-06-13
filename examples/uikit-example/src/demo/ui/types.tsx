import type { InfoProps, StatusType } from 'react-native-chat-uikit';

/**
 * User State.
 */
export type UserState = StatusType;

export type MineInfoProps = InfoProps & {
  userId: string;
  userName?: string;
  userAvatar?: string;
  onClickedLogout?: () => void;
  onClickedCommon?: () => void;
  onClickedMessageNotification?: () => void;
  onClickedPrivacy?: () => void;
};
export type CommonInfoProps = InfoProps & {
  onBack?: () => void;
};
