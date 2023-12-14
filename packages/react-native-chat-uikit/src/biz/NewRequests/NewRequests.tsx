import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { FlatListFactory } from '../../ui/FlatList';
import { Text } from '../../ui/Text';
import { EmptyPlaceholder, ErrorPlaceholder } from '../Placeholder';
import { SearchStyle } from '../SearchStyle';
import {
  TopNavigationBar,
  TopNavigationBarRight,
  TopNavigationBarTitle,
} from '../TopNavigationBar';
import { useNewRequests } from './NewRequests.hooks';
import { NewRequestsItemMemo } from './NewRequests.item';
import type { NewRequestsItemProps, NewRequestsProps } from './types';

const FlatList = FlatListFactory<NewRequestsItemProps>();

export function NewRequests(props: NewRequestsProps) {
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
    onClicked,
    onButtonClicked,
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
      <TopNavigationBar
        Left={
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              iconName={'chevron_left'}
              style={{ width: 24, height: 24 }}
              onPress={() => {
                // todo: left
              }}
            />
            <Text
              paletteType={'title'}
              textType={'medium'}
              style={{ color: getColor('text') }}
            >
              {'new request'}
            </Text>
          </View>
        }
        Right={TopNavigationBarRight}
        RightProps={{
          onClicked: () => {
            // todo:
          },
          iconName: 'person_add',
        }}
        Title={TopNavigationBarTitle({ text: '' })}
        containerStyle={{ paddingHorizontal: 12 }}
      />
      <SearchStyle
        title={'Search'}
        onPress={() => {
          // todo: search
        }}
      />
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
              <NewRequestsItemMemo
                {...item}
                onClicked={onClicked}
                onButtonClicked={onButtonClicked}
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
    </View>
  );
}