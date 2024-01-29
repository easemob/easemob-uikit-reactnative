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
import type { ConversationListItemProps, ConversationListProps } from './types';

const FlatList = FlatListFactory<ConversationListItemProps>();

/**
 * The conversation list component mainly consists of four parts, including navigation component, search style component, individual list item component, and list component. Supports displaying bottom menu components and warning components. The navigation bar component can be set to display or not, customize the style, or even replace it as a whole. The search style component supports whether to display and customize styles, and the individual list item component supports whether to display, add or replace any multiple components. List components support more property settings.
 */
export function ConversationList(props: ConversationListProps) {
  const {
    containerStyle,
    navigationBarVisible,
    customNavigationBar,
    searchStyleVisible,
    customSearch,
    onClickedSearch,
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
    onRequestCloseMenu,
    alertRef,
    avatarUrl,
    tr,
    onShowConversationListMoreActions,
    ListItemRender,
    propsFlatListProps,
  } = useConversationList(props);
  const {
    style,
    contentContainerStyle,
    refreshing: propsRefreshing,
    onRefresh: propsOnFresh,
    onEndReached: propsOnEndReached,
    viewabilityConfig: propsViewabilityConfig,
    onViewableItemsChanged: propsOnViewableItemsChanged,
    ...others
  } = propsFlatListProps ?? {};
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
      {navigationBarVisible !== false ? (
        customNavigationBar ? (
          <>{customNavigationBar}</>
        ) : (
          <TopNavigationBar
            Left={<Avatar url={avatarUrl} size={32} />}
            Right={TopNavigationBarRight}
            RightProps={{
              onClicked: onShowConversationListMoreActions,
              iconName: 'plus_in_circle',
            }}
            Title={TopNavigationBarTitle({ text: 'Chat' })}
          />
        )
      ) : null}
      {searchStyleVisible !== false ? (
        customSearch ? (
          <>{customSearch}</>
        ) : (
          <SearchStyle
            title={tr('search')}
            onPress={() => {
              if (listState === 'normal') {
                onClickedSearch?.();
              }
            }}
          />
        )
      ) : null}
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          ref={ref}
          style={[{ flexGrow: 1 }, style]}
          contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
          data={data}
          refreshing={propsRefreshing ?? refreshing}
          onRefresh={propsOnFresh ?? onRefresh}
          renderItem={(info: ListRenderItemInfo<ConversationListItemProps>) => {
            const { item } = info;
            return <ListItemRender {...item} />;
          }}
          keyExtractor={(item: ConversationListItemProps) => {
            return item.id;
          }}
          onEndReached={propsOnEndReached ?? onMore}
          viewabilityConfig={propsViewabilityConfig ?? viewabilityConfig}
          onViewableItemsChanged={
            propsOnViewableItemsChanged ?? onViewableItemsChanged
          }
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
          {...others}
        />
      </View>

      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={onRequestCloseMenu}
      />
      <Alert ref={alertRef} />
    </View>
  );
}
