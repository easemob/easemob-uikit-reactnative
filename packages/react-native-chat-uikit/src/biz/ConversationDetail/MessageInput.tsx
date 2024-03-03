import * as React from 'react';
import { Platform, View } from 'react-native';

import { useConfigContext } from '../../config';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext, useThemeContext } from '../../theme';
import { CmnButton, IconButton, IconButtonMemo } from '../../ui/Button';
import { KeyboardAvoidingView } from '../../ui/Keyboard';
import { TextInput } from '../../ui/TextInput';
import { BottomSheetNameMenu } from '../BottomSheetMenu';
import { EmojiListMemo } from '../EmojiList';
import { BottomVoiceBar } from '../VoiceBar';
import { useMessageInput } from './MessageInput.hooks';
import { MessageInputEditMessage } from './MessageInputEditMessage';
import { MessageInputQuoteView } from './MessageInputQuoteView';
import type { MessageInputProps, MessageInputRef } from './types';

/**
 * Message Input Component.
 *
 * This component can send text, send emoticons, send files, send pictures, send voice, send files, etc. You can customize the sending menu and add a UI for sending custom messages. Usually this component is used in conjunction with the `MessageList` component.
 */
export const MessageInput = React.forwardRef<
  MessageInputRef,
  MessageInputProps
>(function (
  props: React.PropsWithChildren<MessageInputProps>,
  ref?: React.ForwardedRef<MessageInputRef>
) {
  const {
    top,
    numberOfLines = 4,
    multiSelectCount,
    unreadCount,
    onClickedUnreadCount,
  } = props;

  const testRef = React.useRef<View>(null);
  const { fontFamily } = useConfigContext();
  const { tr } = useI18nContext();
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    input_bg: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    disable: {
      light: colors.neutral[7],
      dark: colors.neutral[3],
    },
    enable_trash: {
      light: colors.error[5],
      dark: colors.error[6],
    },
    enable_share: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    icon: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
  });

  const {
    value,
    setValue,
    onClickedFaceListItem,
    onClickedDelButton,
    onClickedEmojiButton,
    onClickedVoiceButton,
    inputRef,
    emojiHeight,
    emojiIconName,
    onFocus,
    onBlur,
    onCloseVoiceBar,
    voiceBarRef,
    onSelectSendVoice,
    onVoiceStateChange,
    menuRef,
    onRequestCloseMenu,
    sendIconName,
    onClickedSend,
    onVoiceFailed,
    showQuote,
    onHideQuoteMessage,
    onRequestCloseEdit,
    editRef,
    onEditMessageFinished,
    quoteMsg,
    onClickedEmojiSend,
    emojiList,
    multiSelectVisible,
    onClickedMultiSelectDeleteButton,
    onClickedMultiSelectShareButton,
  } = useMessageInput(props, ref);

  return (
    <>
      {multiSelectVisible === true ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            backgroundColor: getColor('bg'),
            borderTopWidth: 0.5,
            borderTopColor: '#E6E6E6',
          }}
        >
          <IconButton
            style={{
              width: 24,
              height: 24,
              tintColor: getColor(
                multiSelectCount !== undefined && multiSelectCount > 0
                  ? 'enable_trash'
                  : 'disable'
              ),
            }}
            containerStyle={{
              margin: 12,
            }}
            onPress={onClickedMultiSelectDeleteButton}
            iconName={'trash'}
          />
          <View style={{ flexGrow: 1 }} />
          <IconButton
            style={{
              width: 24,
              height: 24,
              tintColor: getColor(
                multiSelectCount !== undefined && multiSelectCount > 0
                  ? 'enable_share'
                  : 'disable'
              ),
            }}
            containerStyle={{
              margin: 12,
            }}
            onPress={onClickedMultiSelectShareButton}
            iconName={'arrowshape_right'}
          />
        </View>
      ) : (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={top}
          >
            {unreadCount && unreadCount > 0 ? (
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  top: -40,
                  alignItems: 'center',
                  left: 0,
                  right: 0,
                }}
              >
                <CmnButton
                  sizesType={'middle'}
                  radiusType={'extraSmall'}
                  contentType={'icon-text'}
                  icon={'arrow_down_thick'}
                  text={tr(
                    '_uikit_unread_count',
                    unreadCount > 99 ? '99+' : unreadCount
                  )}
                  style={{ backgroundColor: getColor('bg') }}
                  textStyle={{ color: getColor('enable_share') }}
                  onPress={onClickedUnreadCount}
                />
              </View>
            ) : null}
            {showQuote === true ? (
              <MessageInputQuoteView
                showQuote={showQuote}
                onDel={onHideQuoteMessage}
                msg={quoteMsg}
              />
            ) : null}

            <View
              ref={testRef}
              style={{
                backgroundColor: getColor('bg'),
                display: 'flex',
              }}
              onLayout={() => {
                // testRef.current?.measure(
                //   (
                //     _x: number,
                //     _y: number,
                //     _width: number,
                //     _height: number,
                //     _pageX: number,
                //     pageY: number
                //   ) => {
                //     console.log(
                //       'Sub:Sub:measure:',
                //       _x,
                //       _y,
                //       _width,
                //       _height,
                //       _pageX,
                //       pageY
                //     );
                //     // setPageY(pageY);
                //   }
                // );
                // testRef.current?.measureInWindow(
                //   (_x: number, _y: number, _width: number, _height: number) => {
                //     // console.log('Sub:Sub:measureInWindow:', _x, _y, _width, _height);
                //   }
                // );
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  margin: 8,
                }}
              >
                <IconButtonMemo
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: getColor('tintColor'),
                  }}
                  containerStyle={{
                    alignSelf: 'flex-end',
                    margin: 6,
                  }}
                  onPress={onClickedVoiceButton}
                  iconName={'wave_in_circle'}
                />
                <View
                  style={{
                    flexDirection: 'column',
                    flexGrow: 1,
                    justifyContent: 'center',
                    flexShrink: 1,
                    marginHorizontal: 6,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <TextInput
                      ref={inputRef}
                      numberOfLines={numberOfLines}
                      multiline={true}
                      unitHeight={Platform.OS === 'ios' ? 24 : 20}
                      style={{
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: '400',
                        // lineHeight: 22,
                        fontFamily: fontFamily,
                        flex: Platform.select({ ios: undefined, android: 1 }),
                      }}
                      containerStyle={{
                        width: '100%',
                        minHeight: 36,
                        paddingHorizontal: 8,
                        paddingVertical: 7,
                        maxHeight: Platform.OS === 'ios' ? 96 : 96,
                      }}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onChangeText={setValue}
                      value={value}
                      keyboardAppearance={style === 'light' ? 'light' : 'dark'}
                      placeholder={'Aa'}
                    />
                  </View>
                </View>
                <IconButtonMemo
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: getColor('icon'),
                  }}
                  containerStyle={{
                    alignSelf: 'flex-end',
                    margin: 6,
                  }}
                  onPress={onClickedEmojiButton}
                  iconName={emojiIconName}
                />
                <IconButtonMemo
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: getColor(
                      sendIconName === 'plus_in_circle' ? 'icon' : 'text_enable'
                    ),
                    backgroundColor: undefined,
                    borderRadius: 30,
                  }}
                  containerStyle={{
                    alignSelf: 'flex-end',
                    margin: 6,
                  }}
                  onPress={onClickedSend}
                  iconName={sendIconName}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
          <View
            style={{
              backgroundColor:
                emojiHeight === 0 ? undefined : getColor('backgroundColor'),
              height: emojiHeight,
              overflow: 'hidden',
            }}
          >
            <EmojiListMemo
              containerStyle={{
                flex: 1,
              }}
              onFace={onClickedFaceListItem}
              onDel={onClickedDelButton}
              onSend={onClickedEmojiSend}
              emojiList={emojiList}
            />
          </View>
        </>
      )}

      <BottomVoiceBar
        ref={voiceBarRef}
        onRequestModalClose={onCloseVoiceBar}
        onClickedSendButton={onSelectSendVoice}
        onState={onVoiceStateChange}
        onFailed={onVoiceFailed}
      />
      <BottomSheetNameMenu
        ref={menuRef}
        onRequestModalClose={onRequestCloseMenu}
      />
      <MessageInputEditMessage
        ref={editRef}
        top={top}
        onRequestModalClose={onRequestCloseEdit}
        onEditMessageFinished={onEditMessageFinished}
      />
    </>
  );
});

export type MessageInputComponent = typeof MessageInput;
