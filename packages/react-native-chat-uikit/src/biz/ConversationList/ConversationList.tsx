import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { g_not_existed_url } from '../../const';
import { FlatListFactory } from '../../ui/FlatList';
import { Avatar } from '../Avatar';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import {
  TopNavigationBar,
  TopNavigationBarRight,
  TopNavigationBarTitle,
} from '../TopNavigationBar';
import { useConversationListApi } from './ConversationList.hooks';
import {
  ConversationListItemMemo,
  ConversationListItemProps,
} from './ConversationList.item';
import type { ConversationListProps } from './types';

const FlatList = FlatListFactory<ConversationListItemProps>();

export function ConversationList(props: ConversationListProps) {
  const { containerStyle } = props;
  const {
    data,
    refreshing,
    onRefresh,
    ref,
    onMore,
    viewabilityConfig,
    onViewableItemsChanged,
    listState,
  } = useConversationListApi({});

  return (
    <View
      style={[
        {
          // height: '100%',
          flexGrow: 1,
        },
        containerStyle,
      ]}
    >
      <TopNavigationBar
        Left={<Avatar url={g_not_existed_url} size={24} />}
        Right={TopNavigationBarRight}
        RightProps={{
          onClicked: () => {
            // todo: right
          },
          iconName: 'plus_in_circle',
        }}
        Title={TopNavigationBarTitle({ text: 'Chat' })}
        containerStyle={{ marginHorizontal: 12 }}
      />
      <SearchStyle
        title={'Search'}
        onPress={() => {
          // todo: search
        }}
      />
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
        renderItem={(info: ListRenderItemInfo<ConversationListItemProps>) => {
          const { item } = info;
          return <ConversationListItemMemo {...item} />;
        }}
        keyExtractor={(item: ConversationListItemProps) => {
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
  );
}
