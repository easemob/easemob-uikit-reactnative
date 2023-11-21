import * as React from 'react';
import { View } from 'react-native';

import type { DataModel } from '../../chat';
import { g_not_existed_url } from '../../const';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import type { ListItemProps, ListItemRequestProps } from '../types';

export type SearchConversationItemProps = ListItemProps &
  ListItemRequestProps<DataModel> & {};
export function SearchConversationItem(props: SearchConversationItemProps) {
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
      <View style={{ flexDirection: 'row', flexGrow: 1, paddingLeft: 12 }}>
        <Text
          paletteType={'title'}
          textType={'medium'}
          style={{ color: 'red' }}
        >
          {'安娜'}
        </Text>
        <Text
          paletteType={'title'}
          textType={'medium'}
          style={{ color: 'orange' }}
        >
          {'的杜密'}
        </Text>
      </View>
    </View>
  );
}
export const SearchConversationItemMemo = React.memo(SearchConversationItem);
