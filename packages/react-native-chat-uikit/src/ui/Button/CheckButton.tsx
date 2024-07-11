import * as React from 'react';
import type { ImageStyle, StyleProp } from 'react-native';

import { useColors } from '../../hook';
import { IconButton } from './IconButton';

export type CheckButtonProps = {
  checked: boolean;
  disable?: boolean;
  onClicked?: () => void;
  style?: StyleProp<ImageStyle>;
};

export function CheckButton(props: CheckButtonProps) {
  const { checked, disable = false, onClicked, style } = props;
  const { getColor } = useColors({});

  const name = (checked?: boolean) => {
    return checked !== false ? 'checked_rectangle' : 'unchecked_rectangle';
  };
  const color = (disable?: boolean) => {
    return disable !== true ? getColor('enable') : getColor('disable2');
  };

  return (
    <IconButton
      iconName={name(checked)}
      style={[
        {
          height: 28,
          width: 28,
          tintColor: color(disable),
        },
        style,
      ]}
      onPress={() => {
        if (disable !== true) {
          onClicked?.();
        }
      }}
    />
  );
}
