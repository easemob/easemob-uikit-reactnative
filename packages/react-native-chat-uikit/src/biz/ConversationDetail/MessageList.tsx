import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { FlatListFactory } from '../../ui/FlatList';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import { useMessageList } from './MessageList.hooks';
import { MessageListItemMemo } from './MessageListItem';
import type {
  MessageListItemProps,
  MessageListProps,
  MessageListRef,
} from './types';

export const MessageList = React.forwardRef<MessageListRef, MessageListProps>(
  function (props: MessageListProps, ref?: React.ForwardedRef<MessageListRef>) {
    const FlatList = React.useMemo(
      () => FlatListFactory<MessageListItemProps>(),
      []
    );
    const { containerStyle, onClicked } = props;
    const {
      ref: flatListRef,
      data,
      refreshing,
      onRefresh,
      onMore,
      viewabilityConfig,
      onViewableItemsChanged,
      listState,
      menuRef,
      alertRef,
      onRequestModalClose,
      onClickedItem,
      onLongPressItem,
      inverted,
      maxListHeight,
      setMaxListHeight,
      reachedThreshold,
    } = useMessageList(props, ref);
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
            // flexGrow: 1,
            // flexShrink: 1,
            flex: 1,
            // backgroundColor: 'blue',
          },
          containerStyle,
        ]}
        onTouchEnd={onClicked}
        onLayout={(e) => {
          setMaxListHeight(e.nativeEvent.layout.height);
        }}
      >
        <View
          style={{
            // flexGrow: 1,
            // flexShrink: 1,
            // flex: 1,
            // maxListHeight: '80%',
            maxHeight: maxListHeight,
            // backgroundColor: 'red',
          }}
        >
          <FlatList
            ref={flatListRef}
            // style={{ flexGrow: 1 }}
            // contentContainerStyle={{ flexGrow: 1 }}
            data={data}
            refreshing={refreshing}
            onRefresh={onRefresh}
            inverted={inverted}
            renderItem={(info: ListRenderItemInfo<MessageListItemProps>) => {
              const { item } = info;
              return (
                <MessageListItemMemo
                  {...item}
                  onClicked={onClickedItem}
                  onLongPress={onLongPressItem}
                />
              );
            }}
            keyExtractor={(item: MessageListItemProps) => {
              return item.id;
            }}
            onEndReached={onMore}
            onEndReachedThreshold={reachedThreshold}
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
);

export const MessageListMemo = React.memo(MessageList);
