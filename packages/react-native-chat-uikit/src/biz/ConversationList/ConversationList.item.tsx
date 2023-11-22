import * as React from 'react';
import { Pressable, View } from 'react-native';

import { g_not_existed_url } from '../../const';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { Badges } from '../Badges';
import type { ConversationListItemProps } from './types';

export function ConversationListItem(props: ConversationListItemProps) {
  const { onClicked, onLongPressed, data } = props;
  return (
    <Pressable
      style={{
        width: '100%',
        height: 76,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
      }}
      onPress={() => {
        onClicked?.(data);
      }}
      onLongPress={() => {
        onLongPressed?.(data);
      }}
    >
      <Avatar url={g_not_existed_url} size={50} />
      <View style={{ flexDirection: 'column', flexGrow: 1, paddingLeft: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text paletteType={'title'} textType={'medium'}>
            {'用户昵称'}
          </Text>
          {data.doNotDisturb === true ? (
            <Icon name={'bell_slash'} style={{ height: 20, width: 20 }} />
          ) : null}
        </View>
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
          <View
            style={{
              height: 20,
              justifyContent: 'center',
            }}
          >
            <Badges
              count={
                data.doNotDisturb === true ? undefined : data.unreadMessageCount
              }
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
export const ConversationListItemMemo = React.memo(ConversationListItem);
