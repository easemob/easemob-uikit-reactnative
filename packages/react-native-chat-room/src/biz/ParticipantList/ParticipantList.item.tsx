import * as React from 'react';
import { View } from 'react-native';

import { g_flatlist_border_bottom_width } from '../../const';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Image } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { gParticipantListItemHeight } from './ParticipantList.const';
import type { ParticipantListIteModel } from './types';

export type ParticipantListItemActions = {
  onClicked?: () => void;
};
export type ParticipantListItemProps = {
  id: string;
  userInfo: ParticipantListIteModel;
  actions?: ParticipantListItemActions;
};

export function ParticipantListItem(props: ParticipantListItemProps) {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    color: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    color2: {
      light: colors.neutral[9],
      dark: colors.neutral[2],
    },
    color3: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  const { id, userInfo, actions } = props;
  const identify = undefined;
  return (
    <View
      key={id}
      style={{
        backgroundColor: getColor('backgroundColor'),
        width: '100%',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          height: gParticipantListItemHeight - g_flatlist_border_bottom_width,
        }}
      >
        {identify ? (
          <>
            <Image
              style={{
                width: 22,
                height: 22,
                // tintColor: 'orange',
                margin: 4,
              }}
              source={{ uri: userInfo.identify, cache: 'default' }}
            />
            <View style={{ width: 12 }} />
          </>
        ) : null}

        <Avatar url={userInfo.avatarURL} size={40} />
        <View style={{ width: 12 }} />
        <View style={{ marginVertical: 10 }}>
          <Text
            textType={'medium'}
            paletteType={'title'}
            style={{
              color: getColor('color'),
            }}
          >
            {userInfo.nickname === undefined ||
            userInfo.nickname.trim().length === 0
              ? userInfo.userId
              : userInfo.nickname}
          </Text>
          {/* <Text
            textType={'medium'}
            paletteType={'body'}
            style={{
              color: getColor('color2'),
            }}
          >
            {'Role'}
          </Text> */}
        </View>
        <View style={{ flex: 1 }} />
        {userInfo.hasMenu === true ? (
          <IconButton
            iconName={'ellipsis_vertical'}
            style={{
              tintColor: getColor('color3'),
              width: 24,
              height: 24,
              margin: 4,
            }}
            onPress={actions?.onClicked}
          />
        ) : null}
      </View>
      <View
        style={{
          // width: '100%',
          borderBottomWidth: g_flatlist_border_bottom_width,
          borderBottomColor: getColor('color2'),
          marginLeft: identify ? 102 : 63,
        }}
      />
    </View>
  );
}

export const ParticipantListItemMemo = React.memo(ParticipantListItem);
