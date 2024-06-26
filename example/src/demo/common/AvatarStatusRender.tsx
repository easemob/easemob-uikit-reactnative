import * as React from 'react';
import { ImageStyle, StyleProp, View, ViewStyle } from 'react-native';

import {
  Icon,
  StatusType,
  useColors,
  usePaletteContext,
} from '../../rename.uikit';
// import { getDeviceName, getSystemName, getSystemVersion, getModel, getVersion } from 'react-native-device-info';
import {
  avatar_status_custom,
  avatar_status_leave,
  avatar_status_no_disturb,
} from '../common/assets';
export function AvatarStatusRender(props: {
  status: StatusType;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const { status, style } = props;
  if (status === 'online') {
    return <View style={style} />;
  } else if (status === 'offline') {
    return <View style={style} />;
  } else if (status === 'busy') {
    return <View style={style} />;
  } else if (status === 'leave') {
    return (
      <Icon
        name={avatar_status_leave}
        style={[style as ImageStyle, { backgroundColor: getColor('bg') }]}
      />
    );
  } else if (status === 'not disturb') {
    return (
      <Icon
        name={avatar_status_no_disturb}
        style={[style as ImageStyle, { backgroundColor: getColor('bg') }]}
      />
    );
  } else {
    return (
      <Icon
        name={avatar_status_custom}
        style={[style as ImageStyle, { backgroundColor: getColor('bg') }]}
      />
    );
  }
}

export const AvatarStatusRenderMemo = React.memo(AvatarStatusRender);
