import * as React from 'react';
import { LayoutAnimation } from 'react-native';
import { Platform, TextInput as RNTextInput, View } from 'react-native';

import type { IconNameType } from '../../assets';
import { useConfigContext } from '../../config';
import { useColors, useKeyboardHeight } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext, useThemeContext } from '../../theme';
import { IconButtonMemo } from '../../ui/Button';
import { KeyboardAvoidingView } from '../../ui/Keyboard';
import { TextInput } from '../../ui/TextInput';
import { timeoutTask } from '../../utils';
import { EmojiListMemo } from '../EmojiList';
import { DelButtonMemo } from './DelButton';
import { useMessageTextInput } from './MessageInput.hooks';

export type MessageInputRef = {
  close: () => void;
};
export type MessageInputProps = {
  top?: number | undefined;
  bottom?: number | undefined;
  numberOfLines?: number | undefined;
  onClickedSend?: (text: string) => void;
  closeAfterSend?: boolean;
};
export const MessageInput = React.forwardRef<
  MessageInputRef,
  MessageInputProps
>(function (
  props: React.PropsWithChildren<MessageInputProps>,
  ref?: React.ForwardedRef<MessageInputRef>
) {
  const { top, bottom, numberOfLines, closeAfterSend, onClickedSend } = props;

  const [isStyle, _setIsStyle] = React.useState(false);
  const inputRef = React.useRef<RNTextInput>({} as any);

  const isClosedEmoji = React.useRef(true);
  const isClosedKeyboard = React.useRef(true);
  const [emojiHeight, _setEmojiHeight] = React.useState(0);
  const [iconName, setIconName] = React.useState<IconNameType>('face');

  const testRef = React.useRef<View>(null);
  const keyboardHeight = useKeyboardHeight();
  console.log('test:zuoyu:MessageInput', keyboardHeight);
  const { fontFamily } = useConfigContext();
  const {} = useI18nContext();
  const { style } = useThemeContext();
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
    text_disable: {
      light: colors.neutral[7],
      dark: colors.neutral[3],
    },
    text_enable: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });

  const { value, valueRef, setValue, onFace, onDel, closeKeyboard } =
    useMessageTextInput();

  const setEmojiHeight = (h: number) => {
    console.log('test:zuoyu:setEmojiHeight', h);
    // if (h === 0) {
    //   LayoutAnimation.configureNext({
    //     duration: 250, // from keyboard event
    //     update: {
    //       duration: 10,
    //       type: Platform.OS === 'ios' ? 'keyboard' : 'easeIn',
    //     },
    //   });
    // }
    _setEmojiHeight(h);
  };

  const onSend = () => {
    const content = valueRef.current;
    if (content.length > 0) {
      onClickedSend?.(content);
    }

    if (closeAfterSend === true) {
      timeoutTask(0, closeKeyboard);
    }
  };

  React.useImperativeHandle(ref, () => {
    return {
      close: () => {
        console.log('test:zuoyu:close:', isClosedEmoji.current);
        isClosedEmoji.current = true;
        isClosedKeyboard.current = true;
        setEmojiHeight(0);
        closeKeyboard();
      },
    };
  });

  console.log('test:zuoyu:MessageInput:', top, bottom);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={top}
      >
        <View
          ref={testRef}
          style={{
            backgroundColor: getColor('backgroundColor'),
            display: 'flex',
          }}
          onLayout={() => {
            testRef.current?.measure(
              (
                _x: number,
                _y: number,
                _width: number,
                _height: number,
                _pageX: number,
                pageY: number
              ) => {
                console.log(
                  'Sub:Sub:measure:',
                  _x,
                  _y,
                  _width,
                  _height,
                  _pageX,
                  pageY
                );
                // setPageY(pageY);
              }
            );
            testRef.current?.measureInWindow(
              (_x: number, _y: number, _width: number, _height: number) => {
                // console.log('Sub:Sub:measureInWindow:', _x, _y, _width, _height);
              }
            );
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              margin: 8,
            }}
          >
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
                  paddingHorizontal: 16,
                  paddingVertical: 7,
                  backgroundColor: getColor('backgroundColor2'),
                  borderRadius: 18,
                }}
              >
                <TextInput
                  ref={inputRef}
                  numberOfLines={numberOfLines}
                  multiline={true}
                  unitHeight={Platform.OS === 'ios' ? 22 : 22}
                  style={{
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 22,
                    fontFamily: fontFamily,
                    color: getColor('input_text'),
                  }}
                  containerStyle={{
                    width: '100%',
                    minHeight: 22,
                  }}
                  onFocus={() => {
                    setIconName('face');
                    if (Platform.OS !== 'ios') {
                      setEmojiHeight(0);
                    }
                  }}
                  onBlur={() => {
                    setIconName('keyboard2');
                    if (isStyle === false) {
                      LayoutAnimation.configureNext({
                        duration: 250, // from keyboard event
                        update: {
                          duration: 250,
                          type: Platform.OS === 'ios' ? 'keyboard' : 'linear',
                        },
                      });
                    }

                    if (isClosedEmoji.current === true) {
                      setEmojiHeight(0);
                    } else {
                      setEmojiHeight(keyboardHeight - (bottom ?? 0));
                    }
                  }}
                  onChangeText={setValue}
                  value={value}
                  keyboardAppearance={style === 'light' ? 'light' : 'dark'}
                />
              </View>
            </View>
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
              onPress={() => {
                if (iconName === 'face') {
                  isClosedEmoji.current = false;
                  isClosedKeyboard.current = true;
                  closeKeyboard();
                } else {
                  isClosedKeyboard.current = false;
                  inputRef.current?.focus();
                }
              }}
              iconName={iconName}
            />
            <IconButtonMemo
              style={{
                width: 30,
                height: 30,
                tintColor: getColor('tintColor2'),
                backgroundColor: undefined,
                borderRadius: 30,
              }}
              containerStyle={{
                alignSelf: 'flex-end',
                margin: 6,
              }}
              onPress={onSend}
              iconName={'airplane'}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      <View
        style={{
          backgroundColor:
            emojiHeight === 0 ? undefined : getColor('backgroundColor'),
          height: emojiHeight,
          // overflow: 'hidden',
          // paddingBottom: bottom,
          // display: isStyle === false ? 'flex' : 'none',
        }}
      >
        <EmojiListMemo
          containerStyle={{
            flex: 1,
            // marginBottom: 8,
          }}
          onFace={onFace}
        />
        <DelButtonMemo
          getColor={getColor}
          emojiHeight={emojiHeight}
          onClicked={onDel}
        />
      </View>
    </>
  );
});

export type MessageInputComponent = typeof MessageInput;
