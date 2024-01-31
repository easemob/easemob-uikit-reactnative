import * as React from 'react';
import { Platform, TextInput as RNTextInput, View } from 'react-native';
import {
  ChatMessage,
  ChatMessageType,
  ChatTextMessageBody,
} from 'react-native-chat-sdk';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useConfigContext } from '../../config';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext, useThemeContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { SlideModal, SlideModalRef } from '../../ui/Modal';
import { Text } from '../../ui/Text';
import { TextInput } from '../../ui/TextInput';

/**
 * Referencing Values of the `MessageInputEditMessage` component.
 */
export type MessageInputEditMessageRef = SlideModalRef & {
  /**
   * While displaying the component, the menu items will also be dynamically changed.
   */
  startShowWithInit: (msg: ChatMessage) => void;
};
/**
 * Properties of the `MessageInputEditMessage` component.
 */
export type MessageInputEditMessageProps = {
  /**
   * To request to close the component, you usually need to call the `startHide` method here.
   */
  onRequestModalClose: () => void;
  /**
   * The callback function when the send button is clicked.
   */
  onEditMessageFinished?: (msgId: string, text: string) => void;
  /**
   * Must be a text message.
   */
  initMsg?: ChatMessage;
  /**
   * Keyboard offset setting required. If safe area is used.
   */
  top?: number;
  bottom?: number;
  /**
   * The maximum number of lines in the input box.
   */
  numberOfLines?: number;
};

/**
 * The MessageInputEditMessage component provides menu functionality.
 *
 * @test {@link https://github.com/AsteriskZuo/react-native-chat-room/blob/192a6e98cf2f168dd3a5e0e5a306a6762cf5e0d6/example/src/__dev__/test_bottom_sheet_menu.tsx}
 *
 * @example
 *
 * ```tsx
 * const ref = React.useRef<MessageInputEditMessageRef>({} as any);
 * // ...
 *  <MessageInputEditMessage
 *   ref={ref}
 *   onRequestModalClose={() => {
 *     ref.current.startHide();
 *   }}
 *   initMsg={msg}
 * />
 * ```
 */
export const MessageInputEditMessage = React.forwardRef<
  MessageInputEditMessageRef,
  MessageInputEditMessageProps
>(function (
  props: MessageInputEditMessageProps,
  ref?: React.ForwardedRef<MessageInputEditMessageRef>
) {
  const {
    onRequestModalClose,
    initMsg,
    numberOfLines = 2,
    bottom: propsBottom,
    onEditMessageFinished,
  } = props;
  const { style } = useThemeContext();
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { bottom } = useSafeAreaInsets();
  const _bottom = propsBottom ?? bottom;
  const { fontFamily } = useConfigContext();
  const modalRef = React.useRef<SlideModalRef>({} as any);
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg2: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    state: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[6],
    },
    text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    btn_disable: {
      light: colors.neutral[7],
      dark: colors.neutral[4],
    },
    btn_enable: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });
  const isShow = React.useRef(false);
  // !!! needs improvement
  const pseudoMsg = React.useMemo(() => {
    return ChatMessage.createTextMessage('xxx', '', 0);
  }, []);
  const {
    updateMsg,
    msg: updatedMsg,
    inputRef,
    value,
    setValue,
    onBlur,
    onFocus,
    disable,
    onEdited,
  } = useMessageInputEditMessage({
    msg: initMsg ?? pseudoMsg,
    onEditMessageFinished,
  });

  React.useImperativeHandle(
    ref,
    () => {
      return {
        startHide: (onFinished?: () => void) => {
          isShow.current = false;
          modalRef?.current?.startHide?.(onFinished);
        },
        startShow: () => {
          isShow.current = true;
          modalRef?.current?.startShow?.();
        },
        startShowWithInit: (msg: ChatMessage) => {
          isShow.current = true;
          updateMsg(msg);
          // if (updatedMsg !== msg) {
          //   isShow.current = true;
          //   updateMsg(msg);
          // } else {
          //   isShow.current = true;
          //   modalRef?.current?.startShow?.();
          // }
        },
      };
    },
    [updateMsg]
  );

  React.useEffect(() => {
    if (isShow.current === true) {
      modalRef?.current?.startShow?.();
    }
  }, [updatedMsg]);

  return (
    <SlideModal
      propsRef={modalRef}
      modalAnimationType={'slide'}
      onRequestModalClose={onRequestModalClose}
      enabledKeyboardAdjust={true}
      enableSlideComponent={false}
      keyboardVerticalOffset={-_bottom}
    >
      <SafeAreaView
        style={{
          // height: 56 * 6 + 36 + 80,
          backgroundColor: getColor('bg'),
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={propsTop ?? top}
        ></KeyboardAvoidingView> */}
        <View style={{ width: '100%' }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: getColor('bg2'),
              paddingHorizontal: 12,
              paddingVertical: 7,
            }}
          >
            <Icon
              name={'slash_in_rectangle'}
              style={{ width: 16, height: 16, tintColor: getColor('state') }}
            />
            <Text
              textType={'small'}
              paletteType={'label'}
              style={{ color: getColor('state') }}
            >
              {tr('editing')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: getColor('bg'),
              width: '100%',
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <View
              style={{
                flexGrow: 1,
                paddingHorizontal: 8,
                paddingVertical: 7,
              }}
            >
              <TextInput
                ref={inputRef}
                numberOfLines={numberOfLines}
                multiline={true}
                unitHeight={Platform.OS === 'ios' ? 29 : 20}
                style={{
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: '400',
                  // lineHeight: 22,
                  fontFamily: fontFamily,
                  color: getColor('input_text'),
                }}
                containerStyle={{
                  // width: '100%',
                  backgroundColor: getColor('bg2'),
                  minHeight: 36,
                  paddingHorizontal: 8,
                  paddingVertical: 7,
                  // !!! ios: maxHeight = single * 3 + 1
                  maxHeight: Platform.OS === 'ios' ? 58 : 54,
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={setValue}
                value={value}
                keyboardAppearance={style === 'light' ? 'light' : 'dark'}
                autoFocus={true}
              />
            </View>
            <View style={{ paddingVertical: 7 }}>
              <View style={{ flexGrow: 1 }} />
              <IconButton
                iconName={'checked_ellipse'}
                disabled={disable}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: getColor(
                    disable === true ? 'btn_disable' : 'btn_enable'
                  ),
                  alignSelf: 'flex-end',
                }}
                onPress={onEdited}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            height: _bottom,
            backgroundColor: getColor('bg1'),
          }}
        />
      </SafeAreaView>
    </SlideModal>
  );
});

export function useMessageInputEditMessage({
  msg,
  onEditMessageFinished,
}: {
  msg: ChatMessage;
  onEditMessageFinished?: (msgId: string, text: string) => void;
}) {
  const [_msg, _setMsg] = React.useState(msg);
  const valueRef = React.useRef((msg.body as ChatTextMessageBody).content);
  const [value, _setValue] = React.useState(
    (msg.body as ChatTextMessageBody).content
  );
  const inputRef = React.useRef<RNTextInput>(null);
  const [disable, setDisable] = React.useState(true);
  const _updateMsg = (msg: ChatMessage) => {
    if (msg.body.type !== ChatMessageType.TXT) {
      return;
    }
    const body = msg.body as ChatTextMessageBody;
    valueRef.current = body.content;
    _setMsg({ ...msg } as ChatMessage);
    onChangeValue(body.content);
  };
  const onFocus = () => {};
  const onBlur = () => {};
  const onChangeValue = (t: string) => {
    if (valueRef.current !== t) {
      setDisable(false);
    } else {
      setDisable(true);
    }
    _setValue(t);
  };
  const onEdited = () => {
    onEditMessageFinished?.(_msg.msgId, value);
  };

  return {
    msg: _msg,
    updateMsg: _updateMsg,
    value,
    setValue: onChangeValue,
    inputRef,
    onFocus,
    onBlur,
    disable,
    onEdited,
  };
}
