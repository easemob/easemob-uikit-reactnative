import * as React from 'react';
import { View } from 'react-native';

import type { DataModel } from '../../chat';
import { g_not_existed_url } from '../../const';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { Badges } from '../Badges';
import type { ListItemProps, ListItemRequestProps } from '../types';

export type GroupParticipantListItemProps = ListItemProps &
  ListItemRequestProps<DataModel> & {};
export function GroupParticipantListItem(props: GroupParticipantListItemProps) {
  const {} = props;
  return (
    <View
      style={{
        width: '100%',
        height: 76,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
      }}
    >
      <Avatar url={g_not_existed_url} size={50} />
      <View style={{ flexDirection: 'column', flexGrow: 1, paddingLeft: 12 }}>
        <Text paletteType={'title'} textType={'medium'}>
          {'用户昵称'}
        </Text>
        <Text paletteType={'body'} textType={'medium'}>
          {'最新消息'}
        </Text>
      </View>
      <View style={{ flexDirection: 'column' }}>
        <Text paletteType={'body'} textType={'small'}>
          {'HH:MM'}
        </Text>
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <View style={{ flexGrow: 1 }} />
          <Badges count={8} />
        </View>
      </View>
    </View>
  );
}
export const GroupParticipantListItemMemo = React.memo(
  GroupParticipantListItem
);
