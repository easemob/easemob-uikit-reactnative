import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { useDelayExecTask } from '../../hook';
import { FlatListFactory, FlatListRef } from '../../ui/FlatList';
import { EmptyPlaceholder } from '../Placeholder';
import { Search } from '../Search';
import { useSearchConversationApi } from './SearchConversation.hooks';
import {
  SearchConversationItemMemo,
  SearchConversationItemProps,
} from './SearchConversation.item';
import type { SearchConversationProps } from './types';

const FlatList = FlatListFactory();

export function SearchConversation<DataT extends {} = any>(
  props: SearchConversationProps<DataT>
) {
  const { onCancel, containerStyle } = props;
  const ref = React.useRef<FlatListRef<SearchConversationItemProps<DataT>>>(
    {} as any
  );
  const [value, setValue] = React.useState('');
  const { data, onSearch } = useSearchConversationApi(props);

  const { delayExecTask: deferSearch } = useDelayExecTask(
    500,
    React.useCallback(
      (key: string) => {
        onSearch(key);
      },
      [onSearch]
    )
  );

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
          deferSearch(v);
        }}
        value={value}
      />
      <FlatList
        ref={ref}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        data={data}
        renderItem={(
          info: ListRenderItemInfo<SearchConversationItemProps<DataT>>
        ) => {
          const { item } = info;
          return <SearchConversationItemMemo {...item} />;
        }}
        keyExtractor={(item: SearchConversationItemProps<DataT>) => {
          return item.id;
        }}
        ListEmptyComponent={EmptyPlaceholder}
      />
    </View>
  );
}
