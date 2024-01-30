import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Alert } from '../../ui/Alert';
import { FlatListFactory } from '../../ui/FlatList';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import { BottomSheetMessageReport } from '../MessageReport';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import { useMessageList } from './MessageList.hooks';
import type {
  MessageListItemProps,
  MessageListProps,
  MessageListRef,
} from './types';

/**
 * Message List Component.
 *
 * This component can display sent and received messages, display historical messages, play language messages, preview pictures, video messages, download files, and customize behaviors and styles such as previewing pictures, previewing videos, and downloading documents. Custom messages can be added and more. Usually used in conjunction with the `MessageInput` component.
 */
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
      onRequestCloseMenu,
      onClickedItem,
      onLongPressItem,
      inverted,
      maxListHeight,
      setMaxListHeight,
      reachedThreshold,
      reportRef,
      reportMessage,
      reportData,
      onClickedItemAvatar,
      onClickedItemQuote,
      onClickedItemState,
      ListItemRender,
      listItemRenderProps,
      scrollEventThrottle,
      onMomentumScrollEnd,
      onScroll,
      onScrollBeginDrag,
      onScrollEndDrag,
      onLayout,
      bounces,
      onContentSizeChange,
      onRenderItem,
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
            onLayout={onLayout}
            onContentSizeChange={onContentSizeChange}
            // style={{ flexGrow: 1 }}
            // contentContainerStyle={{ flexGrow: 1 }}
            data={data}
            refreshing={refreshing}
            onRefresh={onRefresh}
            inverted={inverted}
            scrollEventThrottle={scrollEventThrottle}
            renderItem={(info: ListRenderItemInfo<MessageListItemProps>) => {
              const { item, index } = info;
              onRenderItem(info);
              return (
                <ListItemRender
                  {...item}
                  index={index}
                  onClicked={onClickedItem}
                  onLongPress={onLongPressItem}
                  onAvatarClicked={onClickedItemAvatar}
                  onQuoteClicked={onClickedItemQuote}
                  onStateClicked={onClickedItemState}
                  {...listItemRenderProps}
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
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScroll={onScroll}
            onScrollEndDrag={onScrollEndDrag}
            onScrollBeginDrag={onScrollBeginDrag}
            bounces={bounces}
            // !!! This effect does not work well when inserting the first element without scrolling.
            // maintainVisibleContentPosition={{
            //   minIndexForVisible: 0,
            //   autoscrollToTopThreshold: 10,
            // }}
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
          onRequestModalClose={onRequestCloseMenu}
        />
        <Alert ref={alertRef} />
        <BottomSheetMessageReport
          ref={reportRef}
          data={reportData}
          onReport={reportMessage}
        />
      </View>
    );
  }
);

export const MessageListMemo = React.memo(MessageList);
