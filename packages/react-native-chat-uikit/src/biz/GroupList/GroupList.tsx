import * as React from 'react';
import { ListRenderItemInfo, Pressable, View } from 'react-native';

import { FlatListFactory } from '../../ui/FlatList';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import { TopNavigationBar } from '../TopNavigationBar';
import { useGroupList } from './GroupList.hooks';
import { GroupListItemMemo } from './GroupList.item';
import type { GroupListItemProps, GroupListProps } from './types';

const FlatList = FlatListFactory<GroupListItemProps>();

export function GroupList(props: GroupListProps) {
  const { containerStyle, onBack, onSearch } = props;
  const {
    data,
    refreshing,
    onRefresh,
    ref,
    onMore,
    viewabilityConfig,
    onViewableItemsChanged,
    listState,
    onClicked,
  } = useGroupList(props);

  return (
    <View style={[{ flexGrow: 1 }, containerStyle]}>
      <TopNavigationBar
        Left={
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={onBack}
          >
            <Icon name={'chevron_left'} style={{ width: 24, height: 24 }} />
            <Text>{'Group ${count}'}</Text>
          </Pressable>
        }
        Right={<View style={{ width: 32, height: 32 }} />}
        containerStyle={{ paddingHorizontal: 12 }}
      />
      <SearchStyle
        title={'Search'}
        onPress={() => {
          onSearch?.();
        }}
      />

      <View style={{ flex: 1 }}>
        <FlatList
          ref={ref}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            // height: '100%',
            // height: 400,
            // backgroundColor: 'yellow',
          }}
          data={data}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={(info: ListRenderItemInfo<GroupListItemProps>) => {
            const { item } = info;
            return <GroupListItemMemo {...item} onClicked={onClicked} />;
          }}
          keyExtractor={(item: GroupListItemProps) => {
            return item.id;
          }}
          onEndReached={onMore}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          ListEmptyComponent={EmptyPlaceholder}
          ListErrorComponent={
            listState === 'error' ? (
              <ErrorPlaceholder
                onClicked={() => {
                  onRefresh?.();
                }}
              />
            ) : null
          }
        />
      </View>
    </View>
  );
}
