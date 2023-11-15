import * as React from 'react';
import { ListRenderItemInfo, View, ViewToken } from 'react-native';

import { g_not_existed_url } from '../../const';
import type { UIKitError } from '../../error';
import { useDelayExecTask } from '../../hook';
import { FlatListFactory, FlatListRef } from '../../ui/FlatList';
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

const FlatList = FlatListFactory();

export function ConversationList<DataT = any>(
  props: ConversationListProps<DataT>
) {
  const { onRequestData, containerStyle } = props;
  const ref = React.useRef<FlatListRef<ConversationListItemProps<DataT>>>(
    {} as any
  );

  const [refreshing, setRefreshing] = React.useState(false);
  const viewabilityConfigRef = React.useRef({
    // minimumViewTime: 1000,
    viewAreaCoveragePercentThreshold: 50,
    viewablePercentThreshold: 50,
    waitForInteraction: false,
  });
  const {
    data,
    pageState,
    onRefresh: _onRefresh,
    onData,
    onMore,
  } = useConversationListApi<DataT>(props);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      _onRefresh();
      setRefreshing(false);
    }, 1000);
  };
  const onEndReached = () => {
    onMore();
  };
  const { delayExecTask: onViewableItemsChanged } = useDelayExecTask(
    500,
    React.useCallback(
      (info: {
        viewableItems: Array<ViewToken>;
        changed: Array<ViewToken>;
      }) => {
        const ids = info.viewableItems.map((v) => {
          return (v.item as ConversationListItemProps<DataT>).id;
        });
        onRequestData?.({
          ids,
          result: (
            data?: DataT[] | undefined,
            error?: UIKitError | undefined
          ) => {
            if (data) {
              onData(data);
            } else if (error) {
              console.warn(error);
            }
          },
        });
      },
      [onData, onRequestData]
    )
  );

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
        renderItem={(
          info: ListRenderItemInfo<ConversationListItemProps<DataT>>
        ) => {
          const { item } = info;
          return <ConversationListItemMemo {...item} />;
        }}
        keyExtractor={(item: ConversationListItemProps<DataT>) => {
          return item.id;
        }}
        onEndReached={onEndReached}
        viewabilityConfig={viewabilityConfigRef.current}
        onViewableItemsChanged={onViewableItemsChanged}
        ListEmptyComponent={EmptyPlaceholder}
        ListErrorComponent={
          pageState === 'error' ? (
            <ErrorPlaceholder
              onClicked={() => {
                onRefresh();
              }}
            />
          ) : null
        }
      />
    </View>
  );
}
