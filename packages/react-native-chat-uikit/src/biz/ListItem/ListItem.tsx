import * as React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';

import { getElement, useColors } from '../../hook';
import { usePaletteContext } from '../../theme';

/**
 * List Item Component properties.
 */
type ListItemProps<LeftNameProps, RightTextProps, RightIconProps> = {
  /**
   * Header element.
   */
  header?: React.ReactElement;
  /**
   * Left element.
   */
  tail?: React.ReactElement;
  /**
   * Left element.
   */
  LeftName?: React.ReactElement<LeftNameProps>;
  /**
   * Left element properties.
   */
  LeftNameProps?: LeftNameProps;
  /**
   * Right element.
   */
  RightText?: React.ReactElement<RightTextProps>;
  /**
   * Right element properties.
   */
  RightTextProps?: RightTextProps;
  /**
   * Right element.
   */
  RightIcon?:
    | React.ReactElement<RightIconProps>
    | React.ComponentType<RightIconProps>;
  /**
   * Right element properties.
   */
  RightIconProps?: RightIconProps;
  /**
   * Container style for the list item component.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Callback notification when the list item is clicked.
   */
  onClicked?: () => void;
  /**
   * Whether to display the divider.
   */
  enableDivider?: boolean;
};

/**
 * Common list Item Component.
 *
 * The component is laid out left, center and right.
 *
 */
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
    enableDivider = true,
    header,
    tail,
  } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    t1: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[2],
    },
  });

  return (
    <View>
      {getElement(header, {})}
      <Pressable
        style={[
          {
            height: 53.5,
            flexDirection: 'row',
            alignItems: 'center',
          },
          containerStyle,
        ]}
        onPress={onClicked}
      >
        {getElement(LeftName, LeftNameProps)}
        <View style={{ flexGrow: 1 }} />
        {getElement(RightText, RightTextProps)}
        {getElement(RightIcon, RightIconProps)}
      </Pressable>
      {enableDivider === true ? (
        <View
          style={{
            width: '100%',
            borderBottomWidth: 0.5,
            borderBottomColor: getColor('divider'),
            marginLeft: 16,
          }}
        />
      ) : null}
      {getElement(tail, {})}
    </View>
  );
}
