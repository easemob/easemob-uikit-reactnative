import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { FlatListFactory } from '../../ui/FlatList';
import { EmptyPlaceholder } from '../Placeholder';
import { Search } from '../Search';
import { useSearchNewRequestApi } from './SearchNewRequest.hooks';
import {
  SearchNewRequestItemMemo,
  SearchNewRequestItemProps,
} from './SearchNewRequest.item';
import type { SearchNewRequestProps } from './types';

const FlatList = FlatListFactory<SearchNewRequestItemProps>();

export function SearchNewRequest<DataT extends {} = any>(
  props: SearchNewRequestProps<DataT>
) {
  const { onCancel, containerStyle } = props;
  const [value, setValue] = React.useState('');
  const { ref, data, deferSearch } = useSearchNewRequestApi(props);

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
        renderItem={(info: ListRenderItemInfo<SearchNewRequestItemProps>) => {
          const { item } = info;
          return <SearchNewRequestItemMemo {...item} />;
        }}
        keyExtractor={(item: SearchNewRequestItemProps) => {
          return item.id;
        }}
        ListEmptyComponent={EmptyPlaceholder}
      />
    </View>
  );
}
