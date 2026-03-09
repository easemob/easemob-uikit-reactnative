import * as React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';

import { IconName, LocalIcon } from './LocalIcon';

type MiniButtonProps = {
  disabled?: boolean;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  color?: string;
  backgroundColor?: string;
  iconName?: IconName;
  size?: number;
};

export function MiniButton(props: MiniButtonProps): React.ReactNode {
  const { disabled, onPress, color, backgroundColor, iconName, size } = props;
  const clickTimeoutRef = React.useRef(true);
  const onPressInternal = (event: GestureResponderEvent) => {
    if (clickTimeoutRef.current === true) {
      clickTimeoutRef.current = false;
      setTimeout(() => {
        clickTimeoutRef.current = true;
      }, 1000);
      onPress?.(event);
    }
  };
  return (
    <TouchableOpacity
      style={{
        height: size ?? 64,
        width: size ?? 64,
        backgroundColor: backgroundColor ?? 'white',
      }}
      disabled={disabled}
      onPress={onPressInternal}
    >
      <LocalIcon name={iconName ?? 'default_avatar'} color={color} />
    </TouchableOpacity>
  );
}
