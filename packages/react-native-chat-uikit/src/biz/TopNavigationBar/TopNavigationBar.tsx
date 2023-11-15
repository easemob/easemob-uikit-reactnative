import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import type { IconNameType } from '../../assets';
import { getElement, useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Text } from '../../ui/Text';

type TopNavigationBarProps<LeftProps, RightProps> = {
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
export function TopNavigationBar<LeftProps = any, RightProps = any>(
  props: TopNavigationBarProps<LeftProps, RightProps>
) {
  const { containerStyle, Title, Left, Right, LeftProps, RightProps } = props;

  return (
    <View
      style={[
        {
          height: 52,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        containerStyle,
      ]}
    >
      {getElement(Left, LeftProps)}
      {Title}
      {getElement(Right, RightProps)}
    </View>
  );
}

export function TopNavigationBarRight({
  onClicked,
  iconName,
}: {
  onClicked: () => void;
  iconName: IconNameType;
}) {
  return (
    <View>
      <IconButton
        iconName={iconName}
        onPress={onClicked}
        style={{ height: 24, width: 24 }}
      />
    </View>
  );
}

export function TopNavigationBarTitle({ text }: { text: string }) {
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    title: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  return (
    <View style={{ justifyContent: 'center' }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: '400',
          lineHeight: 24,
          fontStyle: 'normal',
          alignSelf: 'center',
          color: getColor('title'),
        }}
      >
        {tr(text)}
      </Text>
    </View>
  );
}
