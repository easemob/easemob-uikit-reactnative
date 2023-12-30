import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { FlatListFactory } from '../../ui/FlatList';
import { Avatar } from '../Avatar';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import {
  TopNavigationBar,
  TopNavigationBarRight,
  TopNavigationBarTitle,
} from '../TopNavigationBar';
import { useConversationList } from './ConversationList.hooks';
import { ConversationListItemMemo } from './ConversationList.item';
import type { ConversationListItemProps, ConversationListProps } from './types';

const FlatList = FlatListFactory<ConversationListItemProps>();

export function ConversationList(props: ConversationListProps) {
  const {
    containerStyle,
    onSearch,
    enableSearch,
    enableNavigationBar,
    NavigationBar: propsNavigationBar,
  } = props;
  const {
    data,
    refreshing,
    onRefresh,
    ref,
    onMore,
    viewabilityConfig,
    onViewableItemsChanged,
    listState,
    menuRef,
    onRequestModalClose,
    alertRef,
    avatarUrl,
    tr,
    onShowConversationListMoreActions,
  } = useConversationList(props);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });

  return (
    <View
      style={[
        {
          backgroundColor: getColor('bg'),
        },
        containerStyle,
      ]}
    >
      {enableNavigationBar !== false ? (
        propsNavigationBar ? (
          <>{propsNavigationBar}</>
        ) : (
          <TopNavigationBar
            Left={<Avatar url={avatarUrl} size={32} />}
            Right={TopNavigationBarRight}
            RightProps={{
              onClicked: onShowConversationListMoreActions,
              iconName: 'plus_in_circle',
            }}
            Title={TopNavigationBarTitle({ text: 'Chat' })}
            containerStyle={{ paddingHorizontal: 12 }}
          />
        )
      ) : null}
      {enableSearch !== false ? (
        <SearchStyle
          title={tr('search')}
          onPress={() => {
            if (listState === 'normal') {
              onSearch?.();
            }
          }}
        />
      ) : null}
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          ref={ref}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
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
          ListLoadingComponent={
            listState === 'loading' ? <LoadingPlaceholder /> : null
          }
        />
      </View>

      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={onRequestModalClose}
      />
      <Alert ref={alertRef} />
    </View>
  );
}
