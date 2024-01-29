import * as React from 'react';
import { ListRenderItemInfo, Pressable, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { FlatListFactory } from '../../ui/FlatList';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import { TopNavigationBar } from '../TopNavigationBar';
import { useGroupList } from './GroupList.hooks';
import type { GroupListItemProps, GroupListProps } from './types';

const FlatList = FlatListFactory<GroupListItemProps>();

/**
 * Group List Component.
 */
export function GroupList(props: GroupListProps) {
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
    onLongPress,
    tr,
    ListItemRender,
    menuRef,
    alertRef,
    closeMenu,
    flatListProps,
    groupCount,
  } = useGroupList(props);
  const {
    style,
    contentContainerStyle,
    refreshing: propsRefreshing,
    onRefresh: propsOnRefresh,
    onEndReached: propsOnEndReached,
    viewabilityConfig: propsViewabilityConfig,
    onViewableItemsChanged: propsOnViewableItemsChanged,
    ...others
  } = flatListProps ?? {};
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    icon: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
    text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
  });

  return (
    <View
      style={[
        {
          flexGrow: 1,
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
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={onBack}
              >
                <Icon
                  name={'chevron_left'}
                  style={{ width: 24, height: 24, tintColor: getColor('icon') }}
                />
                <Text
                  paletteType={'title'}
                  textType={'medium'}
                  style={{ color: getColor('text') }}
                >
                  {tr('_uikit_group_title', groupCount)}
                </Text>
              </Pressable>
            }
            Right={<View style={{ width: 32, height: 32 }} />}
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
          style={[{ flexGrow: 1 }, style]}
          contentContainerStyle={[
            {
              flexGrow: 1,
              // height: '100%',
              // height: 400,
              // backgroundColor: 'yellow',
            },
            contentContainerStyle,
          ]}
          data={data}
          refreshing={propsRefreshing ?? refreshing}
          onRefresh={propsOnRefresh ?? onRefresh}
          renderItem={(info: ListRenderItemInfo<GroupListItemProps>) => {
            const { item } = info;
            return (
              <ListItemRender
                {...item}
                onClicked={onClicked}
                onLongPressed={onLongPress}
              />
            );
          }}
          keyExtractor={(item: GroupListItemProps) => {
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

      <BottomSheetNameMenu ref={menuRef} onRequestModalClose={closeMenu} />
      <Alert ref={alertRef} />
    </View>
  );
}
