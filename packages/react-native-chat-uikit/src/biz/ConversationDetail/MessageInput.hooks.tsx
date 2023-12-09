import * as React from 'react';
import {
  Keyboard,
  LayoutAnimation,
  Platform,
  TextInput as RNTextInput,
} from 'react-native';
import emoji from 'twemoji';

import type { IconNameType } from '../../assets';
import { useKeyboardHeight } from '../../hook';
import { FACE_ASSETS_UTF16 } from '../EmojiList';
import type { MessageInputProps, MessageInputState } from './types';

export function useMessageInput(props: MessageInputProps) {
  const { bottom } = props;
  const keyboardHeight = useKeyboardHeight();
  const inputRef = React.useRef<RNTextInput>({} as any);
  const [_value, _setValue] = React.useState('');
  const [emojiHeight, _setEmojiHeight] = React.useState(0);
  const isClosedEmoji = React.useRef(true);
  const isClosedKeyboard = React.useRef(true);
  const isClosedVoiceBar = React.useRef(true);
  const [emojiIconName, setEmojiIconName] =
    React.useState<IconNameType>('face');
  const valueRef = React.useRef('');
  const rawValue = React.useRef('');
  const [inputBarState, setInputBarState] =
    React.useState<MessageInputState>('normal');

  const changeInputBarState = (nextState: MessageInputState) => {
    if (nextState === 'normal') {
      isClosedEmoji.current = true;
      isClosedKeyboard.current = true;
      isClosedVoiceBar.current = true;
      setInputBarState('normal');
      setEmojiIconName('face');
      closeEmojiList();
      closeVoiceBar();
      closeKeyboard();
    } else if (nextState === 'emoji') {
      isClosedEmoji.current = false;
      isClosedKeyboard.current = true;
      isClosedVoiceBar.current = true;
      setInputBarState('emoji');
      setEmojiIconName('keyboard2');
      closeKeyboard();
      closeVoiceBar();
      setEmojiHeight(keyboardHeight - (bottom ?? 0));
    } else if (nextState === 'voice') {
      isClosedEmoji.current = true;
      isClosedKeyboard.current = true;
      isClosedVoiceBar.current = false;
      setInputBarState('voice');
      setEmojiIconName('face');
      closeKeyboard();
      closeEmojiList();
    } else if (nextState === 'keyboard') {
      console.log('dev:keyboard');
    }
  };

  const onFocus = () => {
    changeInputBarState('keyboard');
    setEmojiIconName('face');
    if (Platform.OS !== 'ios') {
      setEmojiHeight(0);
    }
  };
  const onBlur = () => {
    LayoutAnimation.configureNext({
      duration: 250, // from keyboard event
      update: {
        duration: 250,
        type: Platform.OS === 'ios' ? 'keyboard' : 'linear',
      },
    });

    if (isClosedEmoji.current === true) {
      setEmojiIconName('face');
      setEmojiHeight(0);
    } else {
      setEmojiIconName('keyboard2');
      setEmojiHeight(keyboardHeight - (bottom ?? 0));
    }
  };

  const setInputValue = (
    text: string,
    op?: 'add_face' | 'del_face' | 'del_c',
    face?: string
  ) => {
    if (op) {
      if (op === 'add_face') {
        rawValue.current += face;
        valueRef.current =
          valueRef.current + emoji.convert.fromCodePoint(face!.substring(2));
        _setValue(valueRef.current);
      } else if (op === 'del_face') {
        const rawFace = emoji.convert.toCodePoint(face!);
        rawValue.current = rawValue.current.substring(
          0,
          rawValue.current.length - rawFace.length - 2
        );
        valueRef.current = valueRef.current.substring(
          0,
          valueRef.current.length - 2
        );
        _setValue(valueRef.current);
      } else if (op === 'del_c') {
        rawValue.current = rawValue.current.substring(
          0,
          rawValue.current.length - 1
        );
        valueRef.current = valueRef.current.substring(
          0,
          valueRef.current.length - 1
        );
        _setValue(valueRef.current);
      }
    } else {
      if (valueRef.current !== text) {
        if (valueRef.current.length > text.length) {
          rawValue.current = rawValue.current.substring(
            0,
            rawValue.current.length - (valueRef.current.length - text.length)
          );
        } else {
          rawValue.current += text.substring(valueRef.current.length);
        }
      }
      valueRef.current = text;
      _setValue(valueRef.current);
    }
  };
  const onClickedFaceListItem = React.useCallback((face: string) => {
    setInputValue(valueRef.current, 'add_face', face);
  }, []);

  const onClickedDelButton = () => {
    if (valueRef.current.length >= 2) {
      const face = valueRef.current.substring(valueRef.current.length - 2);
      let lastIsFace = false;
      FACE_ASSETS_UTF16.forEach((v) => {
        if (face === v) {
          lastIsFace = true;
          setInputValue(valueRef.current, 'del_face', face);
        }
      });
      if (lastIsFace === false) {
        setInputValue(valueRef.current, 'del_c');
      }
    } else if (valueRef.current.length > 0) {
      setInputValue(valueRef.current, 'del_c');
    }
  };
  const onClickedClearButton = () => {
    valueRef.current = '';
    rawValue.current = '';
    _setValue(valueRef.current);
  };

  const onClickedEmojiButton = () => {
    if (emojiIconName === 'face') {
      // isClosedEmoji.current = false;
      // isClosedKeyboard.current = true;
      // closeKeyboard();
      changeInputBarState('emoji');
    } else {
      isClosedKeyboard.current = false;
      inputRef.current?.focus();
    }
  };

  const onClickedVoiceButton = () => {
    changeInputBarState('voice');
  };

  const closeKeyboard = React.useCallback(() => {
    Keyboard.dismiss();
  }, []);
  const closeEmojiList = React.useCallback(() => {
    setEmojiHeight(0);
  }, []);
  const closeVoiceBar = React.useCallback(() => {}, []);

  const setEmojiHeight = (h: number) => {
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

  return {
    value: _value,
    setValue: setInputValue,
    valueRef: valueRef,
    onClickedFaceListItem,
    onClickedDelButton,
    onClickedClearButton,
    onClickedEmojiButton,
    onClickedVoiceButton,
    closeKeyboard,
    inputRef,
    setEmojiHeight,
    emojiHeight,
    isClosedEmoji,
    isClosedKeyboard,
    emojiIconName,
    setIconName: setEmojiIconName,
    onFocus,
    onBlur,
    inputBarState,
    changeInputBarState,
  };
}
