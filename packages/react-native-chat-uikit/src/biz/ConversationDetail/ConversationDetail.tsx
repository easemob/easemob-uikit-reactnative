import { ImageBackground } from 'react-native';

import { BottomSheetNameMenu } from '../BottomSheetMenu/BottomSheetNameMenu';
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
    backgroundImageStyle,
    backgroundImage,
  } = props;

  const {
    onClickedSend,
    _messageInputRef,
    MessageInputWrapper,
    messageInputProps,
    _messageListRef,
    MessageListWrapper,
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
    onChangePinMaskHeight,
    menuRef,
    onRequestCloseMenu,
    onClickedAV,
    onClickedPinMessage,
    onRequestClosePinMessage,
  } = useConversationDetail(props);

  console.log('test:zuoyu:MessageListWrapper', MessageListWrapper);
  console.log('test:zuoyu:messageListProps', messageListProps);

  const getContent = () => (
    <ImageBackground
      style={[{ flexGrow: 1 }, containerStyle]}
      imageStyle={backgroundImageStyle}
      source={backgroundImage}
    >
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
          onClickedAV={onClickedAV}
          onClickedThreadMore={onClickedThreadMore}
          selectMode={selectMode}
          onCancelMultiSelected={onCancelMultiSelected}
          onClickedPinMessage={onClickedPinMessage}
          parentName={parentName}
          messageTyping={messageTyping}
        />
      ) : null}
      <MessageListWrapper
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
        onChangePinMaskHeight={onChangePinMaskHeight}
        onRequestClosePinMessage={onRequestClosePinMessage}
        ref={_messageListRef}
        {...messageListProps}
      />
      <MessageInputWrapper
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

      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={onRequestCloseMenu}
      />
    </ImageBackground>
  );

  return (
    <MessageContextProvider value={{}}>{getContent()}</MessageContextProvider>
  );
}
