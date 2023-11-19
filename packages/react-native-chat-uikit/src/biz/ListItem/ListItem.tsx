import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { getElement } from '../../hook';

type ListItemProps<LeftNameProps, RightTextProps, RightIconProps> = {
  LeftName?: React.ReactElement<LeftNameProps>;
  LeftNameProps?: LeftNameProps;
  RightText?: React.ReactElement<RightTextProps>;
  RightTextProps?: RightTextProps;
  RightIcon?:
    | React.ReactElement<RightIconProps>
    | React.ComponentType<RightIconProps>;
  RightIconProps?: RightIconProps;
  containerStyle?: StyleProp<ViewStyle>;
  onClicked?: () => void;
};
export function ListItem<
  LeftNameProps = any,
  RightTextProps = any,
  RightIconProps = any
>(props: ListItemProps<LeftNameProps, RightTextProps, RightIconProps>) {
  const {
    containerStyle,
    LeftName,
    RightText,
    RightIcon,
    LeftNameProps,
    RightTextProps,
    RightIconProps,
    onClicked,
  } = props;

  return (
    <View
      style={[
        {
          height: 54,
          flexDirection: 'row',
          alignItems: 'center',
        },
        containerStyle,
      ]}
      onTouchEnd={onClicked}
    >
      {getElement(LeftName, LeftNameProps)}
      <View style={{ flexGrow: 1 }} />
      {getElement(RightText, RightTextProps)}
      {getElement(RightIcon, RightIconProps)}
    </View>
  );
}
