import * as React from 'react';
import { ListRenderItemInfo, Pressable, View } from 'react-native';

import { FlatListFactory } from '../../ui/FlatList';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import { TopNavigationBar } from '../TopNavigationBar';
import { useGroupParticipantList } from './GroupParticipantList.hooks';
import { GroupParticipantListItemMemo } from './GroupParticipantList.item';
import type {
  GroupParticipantListItemProps,
  GroupParticipantListProps,
} from './types';

const FlatList = FlatListFactory<GroupParticipantListItemProps>();

export function GroupParticipantList(props: GroupParticipantListProps) {
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
  } = useGroupParticipantList(props);

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
          contentContainerStyle={{
            flexGrow: 1,
            // height: '100%',
            // height: 400,
            // backgroundColor: 'yellow',
          }}
          data={data}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={(
            info: ListRenderItemInfo<GroupParticipantListItemProps>
          ) => {
            const { item } = info;
            return (
              <GroupParticipantListItemMemo {...item} onClicked={onClicked} />
            );
          }}
          keyExtractor={(item: GroupParticipantListItemProps) => {
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
