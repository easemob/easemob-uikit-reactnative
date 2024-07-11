import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { useColors } from '../../hook';
import { Alert } from '../../ui/Alert';
import { FlatListFactory } from '../../ui/FlatList';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import {
  TopNavigationBar,
  TopNavigationBarLeft,
  TopNavigationBarRight,
  TopNavigationBarTitle,
} from '../TopNavigationBar';
import { useNewRequests } from './NewRequests.hooks';
import type { NewRequestsItemProps, NewRequestsProps } from './types';

const FlatList = FlatListFactory<NewRequestsItemProps>();

/**
 * New Requests Component.
 *
 * This component displays and manages contact requests.
 */
export function NewRequests(props: NewRequestsProps) {
  const {
    containerStyle,
    onBack,
    navigationBarVisible,
    customNavigationBar,
    searchStyleVisible = false,
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
    onClicked,
    onLongPressed,
    onButtonClicked,
    tr,
    ListItemRender,
    onAddContact,
    menuRef,
    alertRef,
    onRequestCloseMenu,
  } = useNewRequests(props);
  const { getColor } = useColors();

  return (
    <View
      style={[
        {
          backgroundColor: getColor('bg'),
          flexGrow: 1,
        },
        containerStyle,
      ]}
    >
      {navigationBarVisible !== false ? (
        customNavigationBar ? (
          <>{customNavigationBar}</>
        ) : (
          <TopNavigationBar
            Left={
              <TopNavigationBarLeft
                onBack={onBack}
                content={tr('_uikit_new_quest_title')}
              />
            }
            Right={TopNavigationBarRight}
            RightProps={{
              onClicked: () => {
                onAddContact();
              },
              iconName: 'person_add',
            }}
            Title={TopNavigationBarTitle({ text: '' })}
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
              onClickedSearch?.();
            }}
          />
        )
      ) : null}
      <View style={{ flex: 1 }}>
        <FlatList
          ref={ref}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          data={data}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={(info: ListRenderItemInfo<NewRequestsItemProps>) => {
            const { item } = info;
            return (
              <ListItemRender
                {...item}
                onClicked={onClicked}
                onButtonClicked={onButtonClicked}
                onLongPressed={onLongPressed}
              />
            );
          }}
          keyExtractor={(item: NewRequestsItemProps) => {
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

      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={onRequestCloseMenu}
      />
      <Alert ref={alertRef} />
    </View>
  );
}
