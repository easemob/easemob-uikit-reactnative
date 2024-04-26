import type { InfoProps } from '../../rename.uikit';

/**
 * User State.
 */
export type UserState = 'online' | 'offline' | 'busy' | 'leave' | 'no-disturb';

export type MineInfoProps = InfoProps & {
  userId: string;
  userName?: string;
  userAvatar?: string;
  onClickedLogout?: () => void;
  onClickedCommon?: () => void;
  onClickedMessageNotification?: () => void;
  onClickedPrivacy?: () => void;
  onClickedPersonInfo?: () => void;
  onClickedAbout?: () => void;
};
export type CommonInfoProps = InfoProps & {
  onBack?: () => void;
};
