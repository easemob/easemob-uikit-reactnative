import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { FlatListFactory } from '../../ui/FlatList';
import { EmptyPlaceholder } from '../Placeholder';
import { Search } from '../Search';
import { useSearchConversation } from './SearchConversation.hooks';
import { SearchConversationItemMemo } from './SearchConversation.item';
import type {
  SearchConversationItemProps,
  SearchConversationProps,
} from './types';

const FlatList = FlatListFactory<SearchConversationItemProps>();

export function SearchConversation(props: SearchConversationProps) {
  const { onCancel, containerStyle } = props;
  const [value, setValue] = React.useState('');
  const { ref, data, deferSearch } = useSearchConversation(props);

  return (
    <View
      style={[
        {
          flexGrow: 1,
        },
        containerStyle,
      ]}
    >
      <Search
        onCancel={onCancel}
        // onBack={() => {}}
        onChangeText={(v) => {
          setValue(v);
          deferSearch?.(v);
        }}
        value={value}
      />
      <FlatList
        ref={ref}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        data={data}
        renderItem={(info: ListRenderItemInfo<SearchConversationItemProps>) => {
          const { item } = info;
          return <SearchConversationItemMemo {...item} />;
        }}
        keyExtractor={(item: SearchConversationItemProps) => {
          return item.id;
        }}
        ListEmptyComponent={EmptyPlaceholder}
      />
    </View>
  );
}
