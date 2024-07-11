import * as React from 'react';
import {
  Animated,
  ImageBackground,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';

import { useColors } from '../../hook';
import { ChatConversationType } from '../../rename.chat';
import { Alert } from '../../ui/Alert';
import { FlatListFactory } from '../../ui/FlatList';
import { BottomSheetEmojiList } from '../BottomSheetEmojiList/BottomSheetEmojiList';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import { BottomSheetReactionDetail } from '../BottomSheetReactionDetail';
import { BottomSheetMessageReport } from '../MessageReport';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import { useMessageList } from './MessageList.hooks';
import {
  AnimatedMessagePin,
  AnimatedMessagePinPlaceholder,
} from './MessagePin';
import { useMessagePin } from './MessagePin.hooks';
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
    const {
      containerStyle,
      onClicked,
      backgroundImage,
      convId,
      convType,
      onChangePinMaskHeight,
      type: comType,
      onRequestClosePinMessage,
    } = props;
    const {
      ref: flatListRef,
      data,
      onInit,
      viewabilityConfig,
      onViewableItemsChanged,
      listState,
      menuRef,
      alertRef,
      onRequestCloseMenu,
      onClickedItem,
      onLongPressItem,
      inverted,
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
      onTouchMove,
      onScrollBeginDrag,
      onScrollEndDrag,
      onLayout,
      bounces,
      onContentSizeChange,
      onRenderItem,
      emojiRef,
      emojiList,
      onRequestCloseEmoji,
      onClickedItemReaction,
      onClickedFaceListItem,
      reactionRef,
      onRequestCloseReaction,
      onClickedItemThread,
      onCheckedItem,
      onLongPressItemReaction,
      pinMsgListRef,
    } = useMessageList(props, ref);
    const {
      msgPinPlaceHolderCurrentHeight,
      msgPinPlaceHolderHeightAnimate,
      msgListMaxCurrentHeight,
      msgPinCurrentHeight,
      msgPinHeightRef,
      msgPinHeightAnimate,
      panHandlers,
      setMaxListHeight,
      msgPinLabelTranslateYRef,
      msgPinLabelTranslateYAnimate,
      msgPinLabelCurrentTranslateY,
      msgPinBackgroundCurrentOpacity,
      msgPinBackgroundOpacityAnimate,
    } = useMessagePin({});
    const { getColor } = useColors({});

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
        {backgroundImage ? (
          <ImageBackground
            style={[StyleSheet.absoluteFill, {}]}
            source={{ uri: backgroundImage }}
          />
        ) : null}

        {convType === ChatConversationType.GroupChat && comType === 'chat' ? (
          <AnimatedMessagePinPlaceholder
            style={{
              height: msgPinPlaceHolderCurrentHeight,
            }}
          />
        ) : null}

        <Animated.View
          style={{
            // flexGrow: 1,
            // flexShrink: 1,
            // flex: 1,
            // maxListHeight: '80%',
            // maxHeight: maxListHeight - 56,
            maxHeight: msgListMaxCurrentHeight,
            // backgroundColor: 'red',
          }}
        >
          <FlatList
            ref={flatListRef}
            onLayout={onLayout}
            onContentSizeChange={onContentSizeChange}
            // refreshControl={
            //   refreshing !== undefined ? (
            //     <RefreshControl
            //       refreshing={refreshing}
            //       onRefresh={onRefresh}
            //       // size={100}
            //       // enabled={false}
            //       colors={[getColor('bg') ?? 'white']}
            //       progressBackgroundColor={getColor('bg')}
            //       tintColor={getColor('bg')}
            //       style={
            //         {
            //           // height: 1,
            //           // width: 100,
            //           // backgroundColor: 'green',
            //         }
            //       }
            //     />
            //   ) : undefined
            // }
            // style={{ flexGrow: 1 }}
            // contentContainerStyle={{ flexGrow: 1 }}
            data={data}
            // refreshing={refreshing}
            // onRefresh={onRefresh}
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
                  onReactionClicked={onClickedItemReaction}
                  onReactionLongPress={onLongPressItemReaction}
                  onThreadClicked={onClickedItemThread}
                  onChecked={onCheckedItem}
                  {...listItemRenderProps}
                />
              );
            }}
            keyExtractor={(item: MessageListItemProps) => {
              return item.id;
            }}
            // onEndReached={onMore}
            onEndReachedThreshold={reachedThreshold}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScroll={onScroll}
            onScrollEndDrag={onScrollEndDrag}
            onScrollBeginDrag={onScrollBeginDrag}
            bounces={bounces}
            onTouchMove={onTouchMove}
            maintainVisibleContentPosition={{
              // !!! This effect does not work well when inserting the first element without scrolling.
              minIndexForVisible: 0,
              // autoscrollToTopThreshold: -(Dimensions.get('window').height * 2),
            }}
            // !!! https://github.com/facebook/react-native/issues/42967
            // !!! https://github.com/facebook/react-native/issues/36766
            initialNumToRender={9999}
            // renderScrollComponent={null}
            // maxToRenderPerBatch={50}
            // overScrollMode={'always'}
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
                    onInit?.();
                  }}
                />
              ) : null
            }
            ListLoadingComponent={
              listState === 'loading' ? <LoadingPlaceholder /> : null
            }
          />
        </Animated.View>

        {convType === ChatConversationType.GroupChat && comType === 'chat' ? (
          <AnimatedMessagePin
            ref={pinMsgListRef}
            convId={convId}
            convType={convType}
            msgPinHeightRef={msgPinHeightRef}
            msgPinHeightAnimate={msgPinHeightAnimate}
            msgPinLabelTranslateYRef={msgPinLabelTranslateYRef}
            msgPinLabelTranslateYAnimate={msgPinLabelTranslateYAnimate}
            msgPinLabelCurrentTranslateY={msgPinLabelCurrentTranslateY}
            msgPinBackgroundCurrentOpacity={msgPinBackgroundCurrentOpacity}
            msgPinBackgroundOpacityAnimate={msgPinBackgroundOpacityAnimate}
            msgPinPlaceHolderHeightAnimate={msgPinPlaceHolderHeightAnimate}
            onChangePinMaskHeight={onChangePinMaskHeight}
            msgPinCurrentHeight={msgPinCurrentHeight}
            panHandlers={panHandlers}
            onRequestClose={onRequestClosePinMessage}
            // style={{
            //   height: msgPinCurrentHeight,
            // }}
          />
        ) : null}

        <BottomSheetNameMenu
          ref={menuRef}
          onRequestModalClose={onRequestCloseMenu}
        />
        <BottomSheetEmojiList
          ref={emojiRef}
          emojiList={emojiList}
          onRequestModalClose={onRequestCloseEmoji}
          onFace={onClickedFaceListItem}
        />
        <BottomSheetReactionDetail
          ref={reactionRef}
          onRequestModalClose={onRequestCloseReaction}
          reactionList={[
            {
              reaction: 'like',
              count: 1,
              isAddedBySelf: false,
              userList: [{ id: 'xx', type: 'user' }],
            },
          ]}
          msgId={''}
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
