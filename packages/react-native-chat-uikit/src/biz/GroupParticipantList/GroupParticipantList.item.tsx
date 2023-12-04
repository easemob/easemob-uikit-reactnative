import * as React from 'react';
import { Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { SingleLineText } from '../../ui/Text';
import { Avatar } from '../Avatar';
import type { GroupParticipantListItemProps } from './types';

export function GroupParticipantListItem(props: GroupParticipantListItemProps) {
  const { data, onClicked } = props;
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
    <View
      style={{
        backgroundColor: getColor('bg'),
      }}
    >
      <Pressable
        style={{
          width: '100%',
          height: 59.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
        onPress={() => {
          onClicked?.(data);
        }}
      >
        <Avatar url={data.avatar} size={40} />
        <View style={{ flexGrow: 1, paddingLeft: 12, maxWidth: '80%' }}>
          <SingleLineText
            paletteType={'title'}
            textType={'medium'}
            style={{ color: getColor('t1') }}
          >
            {data.name ?? data.id}
          </SingleLineText>
        </View>
      </Pressable>
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: getColor('divider'),
          marginLeft: 68,
        }}
      />
    </View>
  );
}
export const GroupParticipantListItemMemo = React.memo(
  GroupParticipantListItem
);
