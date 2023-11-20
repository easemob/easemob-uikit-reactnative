import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { FlatListFactory } from '../../ui/FlatList';
import { EmptyPlaceholder } from '../Placeholder';
import { Search } from '../Search';
import { useSearchGroupApi } from './SearchGroup.hooks';
import { SearchGroupItemMemo, SearchGroupItemProps } from './SearchGroup.item';
import type { SearchGroupProps } from './types';

const FlatList = FlatListFactory<SearchGroupItemProps>();

export function SearchGroup<DataT extends {} = any>(
  props: SearchGroupProps<DataT>
) {
  const { onCancel, containerStyle } = props;
  const [value, setValue] = React.useState('');
  const { ref, data, deferSearch } = useSearchGroupApi(props);

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
        renderItem={(info: ListRenderItemInfo<SearchGroupItemProps>) => {
          const { item } = info;
          return <SearchGroupItemMemo {...item} />;
        }}
        keyExtractor={(item: SearchGroupItemProps) => {
          return item.id;
        }}
        ListEmptyComponent={EmptyPlaceholder}
      />
    </View>
  );
}
