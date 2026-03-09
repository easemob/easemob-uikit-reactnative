import * as React from 'react';
import type { GestureResponderEvent } from 'react-native';

import { IconButton } from './IconButton';
import type { IconName } from './LocalIcon';

export type BottomMenuButtonType =
  | 'video'
  | 'mute-video'
  | 'speaker'
  | 'mute-speaker'
  | 'microphone'
  | 'mute-microphone'
  | 'hangup'
  | 'recall'
  | 'close'
  | 'accept'
  | 'accepting';
type BottomMenuButtonProps = {
  name: BottomMenuButtonType;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  backgroundColor?: string;
  disabled?: boolean;
};

function getButtonBackgroundColor(name: BottomMenuButtonType): string {
  switch (name) {
    case 'accept':
      return '#00CE76';

    case 'accepting':
      return '#00CE76';

    case 'hangup':
      return '#F6324D';

    default:
      break;
  }
  return 'rgba(255, 255, 255, 0.2)';
}

function buttonNameConvertToIconName(name: BottomMenuButtonType): IconName {
  switch (name) {
    case 'accept':
      return 'phone_answer';

    case 'accepting':
      return 'loading';

    case 'close':
      return 'xmark';

    case 'hangup':
      return 'phone_hang_up';

    case 'microphone':
      return 'mic';

    case 'mute-microphone':
      return 'mic_slash';

    case 'mute-speaker':
      return 'speaker_wave1';

    case 'mute-video':
      return 'video_slash';

    case 'recall':
      return 'phone_answer';

    case 'speaker':
      return 'speaker_wave2';

    case 'video':
      return 'video';

    default:
      break;
  }
  return 'default_avatar';
}

export function BottomMenuButton(
  props: BottomMenuButtonProps
): React.ReactElement {
  const { name, onPress, backgroundColor, disabled } = props;
  const isLoading = name === 'accepting' ? true : false;
  return (
    <IconButton
      iconName={buttonNameConvertToIconName(name)}
      onPress={onPress}
      size={42}
      containerSize={64}
      backgroundColor={getButtonBackgroundColor(name) ?? backgroundColor}
      disabled={disabled}
      isLoading={isLoading}
    />
  );
}
