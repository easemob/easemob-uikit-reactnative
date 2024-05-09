import * as React from 'react';
import { View } from 'react-native';

import { MessageContextProvider } from '../Context';
import { useConversationDetail } from './ConversationDetail.hooks';
import { ConversationDetailNavigationBar } from './ConversationDetail.navi';
import type { ConversationDetailProps } from './types';

/**
 * Conversation Detail Component.
 *
 * This component displays the chat content of individual chats and group chats. This component mainly includes a message bubble list component and a message sending component, as well as a bottom menu component and a warning component.
 */
export function ConversationDetail(props: ConversationDetailProps) {
  const {
    containerStyle,
    onBack,
    convId,
    convType,
    enableNavigationBar = true,
    NavigationBar: propsNavigationBar,
    type: comType,
    onClickedThread,
    onClickedVideo,
    onClickedVoice,
  } = props;

  const {
    onClickedSend,
    _messageInputRef,
    _MessageInput,
    messageInputProps,
    _messageListRef,
    _MessageList,
    messageListProps,
    onQuoteMessageForInput,
    onEditMessageForInput,
    onEditMessageFinished,
    getNickName,
    convAvatar,
    onClickedAvatar,
    doNotDisturb,
    onClickedThreadMore,
    threadName,
    onClickedMultiSelected,
    onCancelMultiSelected,
    selectMode,
    onClickedMultiSelectDeleteButton,
    onClickedMultiSelectShareButton,
    multiSelectCount,
    onChangeMultiItems,
    onClickedSingleSelect,
    onChangeUnreadCount,
    unreadCount,
    onClickedUnreadCount,
    parentName,
    messageTyping,
  } = useConversationDetail(props);

  const getContent = () => (
    <View style={[{ flexGrow: 1 }, containerStyle]}>
      {enableNavigationBar === true ? (
        <ConversationDetailNavigationBar
          convId={convId}
          convType={convType}
          convName={getNickName()}
          convAvatar={convAvatar}
          onBack={onBack}
          onClickedAvatar={onClickedAvatar}
          NavigationBar={propsNavigationBar}
          doNotDisturb={doNotDisturb}
          type={comType}
          newThreadName={threadName}
          onClickedThread={onClickedThread}
          onClickedVideo={onClickedVideo}
          onClickedVoice={onClickedVoice}
          onClickedThreadMore={onClickedThreadMore}
          selectMode={selectMode}
          onCancelMultiSelected={onCancelMultiSelected}
          parentName={parentName}
          messageTyping={messageTyping}
        />
      ) : null}
      <_MessageList
        onClicked={() => {
          _messageInputRef?.current?.close?.();
        }}
        onQuoteMessageForInput={onQuoteMessageForInput}
        onEditMessageForInput={onEditMessageForInput}
        onClickedMultiSelected={onClickedMultiSelected}
        onChangeMultiItems={onChangeMultiItems}
        onClickedSingleSelect={onClickedSingleSelect}
        selectType={selectMode}
        onChangeUnreadCount={onChangeUnreadCount}
        ref={_messageListRef}
        {...messageListProps}
      />
      <_MessageInput
        ref={_messageInputRef}
        onClickedSend={onClickedSend}
        onEditMessageFinished={onEditMessageFinished}
        selectType={selectMode}
        multiSelectCount={multiSelectCount}
        onClickedMultiSelectDeleteButton={onClickedMultiSelectDeleteButton}
        onClickedMultiSelectShareButton={onClickedMultiSelectShareButton}
        onClickedUnreadCount={onClickedUnreadCount}
        onHeightChange={(height) => {
          _messageListRef?.current?.onInputHeightChange?.(height);
        }}
        unreadCount={unreadCount}
        {...messageInputProps}
      />
    </View>
  );

  return (
    <MessageContextProvider value={{}}>{getContent()}</MessageContextProvider>
  );
}
