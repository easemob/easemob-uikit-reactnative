import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { FlatListFactory } from '../../ui/FlatList';
import { EmptyPlaceholder } from '../Placeholder';
import { Search } from '../Search';
import { useListSearch } from './ListSearch.hooks';
import { ListSearchItem } from './ListSearch.item';
import type {
  DefaultComponentModel,
  ListSearchItemProps,
  ListSearchProps,
} from './types';

export function ListSearch<
  ComponentModel extends DefaultComponentModel = DefaultComponentModel
>(props: ListSearchProps<ComponentModel>) {
  const { onCancel, containerStyle, ItemRender, searchType } = props;
  const FlatList = React.useMemo(
    () => FlatListFactory<ListSearchItemProps<ComponentModel>>(),
    []
  );
  const ListSearchItemMemo = React.useMemo(
    () =>
      ItemRender
        ? React.memo(ItemRender)
        : React.memo(ListSearchItem<ComponentModel>),
    [ItemRender]
  );
  const [value, setValue] = React.useState('');
  const { ref, data, deferSearch, onClicked } = useListSearch(props);

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
        onChangeText={(v) => {
          setValue(v);
          deferSearch?.(v);
        }}
        value={value}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          ref={ref}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          data={data}
          renderItem={(
            info: ListRenderItemInfo<ListSearchItemProps<ComponentModel>>
          ) => {
            const { item } = info;
            return (
              <ListSearchItemMemo
                {...item}
                onClicked={onClicked}
                searchType={searchType}
              />
            );
          }}
          keyExtractor={(item: ListSearchItemProps<ComponentModel>) => {
            return item.id;
          }}
          ListEmptyComponent={EmptyPlaceholder}
        />
      </View>
    </View>
  );
}
