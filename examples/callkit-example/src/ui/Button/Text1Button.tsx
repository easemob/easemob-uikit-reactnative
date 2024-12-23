import * as React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  Text,
  ViewStyle,
} from 'react-native';

export type Text1ButtonProps = {
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
  text?: string;
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
    | undefined;
};
export function Text1Button(props: Text1ButtonProps) {
  const { onPress, text, style } = props;
  return (
    <Pressable
      style={[
        style as StyleProp<ViewStyle>,
        {
          backgroundColor: 'gold',
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
      onPress={onPress}
    >
      <Text style={{ fontSize: 18 }}>{text}</Text>
    </Pressable>
  );
}
