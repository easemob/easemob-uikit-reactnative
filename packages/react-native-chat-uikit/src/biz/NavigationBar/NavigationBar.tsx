import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { getElement } from 'react-native-chat-uikit';

type NavigationBarProps<LeftProps, RightProps> = {
  Title?: React.ReactElement;
  Left?: React.ComponentType<LeftProps> | React.ReactElement | null | undefined;
  LeftProps?: LeftProps;
  Right?:
    | React.ComponentType<RightProps>
    | React.ReactElement
    | null
    | undefined;
  RightProps?: RightProps;
  containerStyle?: StyleProp<ViewStyle>;
};
export function NavigationBar<LeftProps = any, RightProps = any>(
  props: NavigationBarProps<LeftProps, RightProps>
) {
  const { containerStyle, Title, Left, Right, LeftProps, RightProps } = props;

  return (
    <View
      style={[
        containerStyle,
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
      ]}
    >
      {getElement(Left, LeftProps)}
      {Title}
      {getElement(Right, RightProps)}
    </View>
  );
}
