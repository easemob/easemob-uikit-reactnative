import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { FlatListFactory } from '../../ui/FlatList';
import { EmptyPlaceholder } from '../Placeholder';
import { Search } from '../Search';
import { useSearchGroupParticipantApi } from './SearchGroupParticipant.hooks';
import {
  SearchGroupParticipantItemMemo,
  SearchGroupParticipantItemProps,
} from './SearchGroupParticipant.item';
import type { SearchGroupParticipantProps } from './types';

const FlatList = FlatListFactory<SearchGroupParticipantItemProps>();

export function SearchGroupParticipant<DataT extends {} = any>(
  props: SearchGroupParticipantProps<DataT>
) {
  const { onCancel, containerStyle } = props;
  const [value, setValue] = React.useState('');
  const { ref, data, deferSearch } = useSearchGroupParticipantApi(props);

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
        renderItem={(
          info: ListRenderItemInfo<SearchGroupParticipantItemProps>
        ) => {
          const { item } = info;
          return <SearchGroupParticipantItemMemo {...item} />;
        }}
        keyExtractor={(item: SearchGroupParticipantItemProps) => {
          return item.id;
        }}
        ListEmptyComponent={EmptyPlaceholder}
      />
    </View>
  );
}
