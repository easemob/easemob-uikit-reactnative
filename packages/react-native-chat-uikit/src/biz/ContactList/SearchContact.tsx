import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { FlatListFactory } from '../../ui/FlatList';
import { EmptyPlaceholder } from '../Placeholder';
import { Search } from '../Search';
import { useSearchContactApi } from './SearchContact.hooks';
import {
  SearchContactItemMemo,
  SearchContactItemProps,
} from './SearchContact.item';
import type { SearchContactProps } from './types';

const FlatList = FlatListFactory<SearchContactItemProps>();

export function SearchContact<DataT extends {} = any>(
  props: SearchContactProps<DataT>
) {
  const { onCancel, containerStyle } = props;
  const [value, setValue] = React.useState('');
  const { ref, data, deferSearch } = useSearchContactApi(props);

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
        renderItem={(info: ListRenderItemInfo<SearchContactItemProps>) => {
          const { item } = info;
          return <SearchContactItemMemo {...item} />;
        }}
        keyExtractor={(item: SearchContactItemProps) => {
          return item.id;
        }}
        ListEmptyComponent={EmptyPlaceholder}
      />
    </View>
  );
}
