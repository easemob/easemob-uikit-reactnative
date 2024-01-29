import * as React from 'react';
import { ListRenderItemInfo, Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { IconButton } from '../../ui/Button';
import { FlatListFactory } from '../../ui/FlatList';
import { Text } from '../../ui/Text';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import {
  TopNavigationBar,
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
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    icon: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
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
            Left={
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 40,
                }}
                onPress={onBack}
              >
                <IconButton
                  iconName={'chevron_left'}
                  style={{ width: 24, height: 24, tintColor: getColor('icon') }}
                />
                <Text
                  paletteType={'title'}
                  textType={'medium'}
                  style={{ color: getColor('text') }}
                >
                  {tr('_uikit_new_quest_title')}
                </Text>
              </Pressable>
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
