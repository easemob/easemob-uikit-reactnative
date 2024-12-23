import * as React from 'react';
import { type ImageStyle, Pressable, type StyleProp } from 'react-native';
import { View } from 'react-native';

export type CheckButtonProps = {
  checked: boolean;
  disable?: boolean;
  onClicked?: () => void;
  style?: StyleProp<ImageStyle>;
};

export function CheckButton(props: CheckButtonProps) {
  const { checked, disable = false, onClicked, style } = props;

  return (
    <Pressable
      onPress={() => {
        if (disable !== true) {
          onClicked?.();
        }
      }}
    >
      <View
        style={[
          {
            height: 28,
            width: 28,
            backgroundColor: checked ? 'dodgerblue' : 'gainsboro',
          },
          style,
        ]}
      />
    </Pressable>
  );
}
