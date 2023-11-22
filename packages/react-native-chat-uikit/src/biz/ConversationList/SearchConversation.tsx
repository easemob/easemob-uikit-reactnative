import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { FlatListFactory } from '../../ui/FlatList';
import { EmptyPlaceholder } from '../Placeholder';
import { Search } from '../Search';
import { useSearchConversationApi } from './SearchConversation.hooks';
import {
  SearchConversationItemMemo,
  SearchConversationItemProps,
} from './SearchConversation.item';
import type { SearchConversationProps } from './types';

const FlatList = FlatListFactory<SearchConversationItemProps>();

export function SearchConversation(props: SearchConversationProps) {
  const { onCancel, containerStyle } = props;
  const [value, setValue] = React.useState('');
  const { ref, data, deferSearch } = useSearchConversationApi(props);

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
