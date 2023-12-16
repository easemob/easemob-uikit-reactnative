import * as React from 'react';
import {
  Keyboard,
  LayoutAnimation,
  Platform,
  TextInput as RNTextInput,
} from 'react-native';
import emoji from 'twemoji';

import type { IconNameType } from '../../assets';
// import { useDispatchContext } from '../../dispatch';
import { useDelayExecTask, useKeyboardHeight } from '../../hook';
import { timeoutTask } from '../../utils';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
// import { gVoiceBarHeight } from '../const';
import { FACE_ASSETS_UTF16 } from '../EmojiList';
import type { BottomVoiceBarRef, VoiceBarState } from '../VoiceBar';
import type {
  MessageInputProps,
  MessageInputState,
  SendFileProps,
  SendImageProps,
  SendVideoProps,
  SendVoiceProps,
} from './types';
import {
  selectCamera,
  selectFile,
  selectOnePicture,
  selectOneShortVideo,
} from './useSelectFile';

export function useMessageInput(props: MessageInputProps) {
  const {
    bottom,
    onClickedSend: propsOnClickedSend,
    closeAfterSend,
    onHeightChange,
    convId,
  } = props;
  const { keyboardHeight, keyboardCurrentHeight } = useKeyboardHeight();
  const inputRef = React.useRef<RNTextInput>({} as any);
  const [_value, _setValue] = React.useState('');
  const [emojiHeight, _setEmojiHeight] = React.useState(0);
  const [voiceHeight, _setVoiceHeight] = React.useState(0);
  const isClosedEmoji = React.useRef(true);
  const isClosedKeyboard = React.useRef(true);
  const isClosedVoiceBar = React.useRef(true);
  const [emojiIconName, setEmojiIconName] =
    React.useState<IconNameType>('face');
  const [sendIconName, setSendIconName] =
    React.useState<IconNameType>('plus_in_circle');
  const valueRef = React.useRef('');
  const rawValue = React.useRef('');
  const [inputBarState, setInputBarState] =
    React.useState<MessageInputState>('normal');
  const hasLayoutAnimation = React.useRef(false);
  const voiceBarRef = React.useRef<BottomVoiceBarRef>({} as any);
  const voiceBarStateRef = React.useRef<VoiceBarState>('idle');
  const menuRef = React.useRef<BottomSheetNameMenuRef>(null);

  const _onValue = (v: string) => {
    if (v.length > 0 && inputBarState === 'keyboard') {
      setSendIconName('airplane');
    } else {
      setSendIconName('plus_in_circle');
    }
    _setValue(v);
  };

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
      showEmojiList();
    } else if (nextState === 'voice') {
      isClosedEmoji.current = true;
      isClosedKeyboard.current = true;
      isClosedVoiceBar.current = false;
      setInputBarState('voice');
      setEmojiIconName('face');
      closeKeyboard();
      closeEmojiList();
      showVoiceBar();
    } else if (nextState === 'keyboard') {
      isClosedKeyboard.current = false;
      setInputBarState('keyboard');
      setEmojiIconName('face');
      if (Platform.OS !== 'ios') {
        isClosedEmoji.current = true;
        isClosedVoiceBar.current = true;
        closeEmojiList();
        closeVoiceBar();
      }
    }
  };

  const onFocus = () => {
    changeInputBarState('keyboard');
  };
  const onBlur = () => {
    setLayoutAnimation();

    if (isClosedEmoji.current === true) {
      setEmojiIconName('face');
      closeEmojiList();
    } else {
      setEmojiIconName('keyboard2');
      showEmojiList();
    }
    if (isClosedVoiceBar.current === true) {
      closeVoiceBar();
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
        _onValue(valueRef.current);
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
        _onValue(valueRef.current);
      } else if (op === 'del_c') {
        rawValue.current = rawValue.current.substring(
          0,
          rawValue.current.length - 1
        );
        valueRef.current = valueRef.current.substring(
          0,
          valueRef.current.length - 1
        );
        _onValue(valueRef.current);
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
      _onValue(valueRef.current);
    }
  };
  const onClickedFaceListItem = (face: string) => {
    setInputValue(valueRef.current, 'add_face', face);
  };

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
    _onValue(valueRef.current);
  };

  const onClickedEmojiButton = () => {
    if (emojiIconName === 'face') {
      changeInputBarState('emoji');
    } else {
      isClosedKeyboard.current = false;
      inputRef.current?.focus();
    }
  };

  const onClickedVoiceButton = () => {
    changeInputBarState('voice');
  };

  const { delayExecTask: resetLayoutAnimation } = useDelayExecTask(
    175,
    React.useCallback(() => {
      if (hasLayoutAnimation.current === true) {
        hasLayoutAnimation.current = false;
      }
    }, [])
  );

  const setLayoutAnimation = React.useCallback(() => {
    if (hasLayoutAnimation.current === false) {
      hasLayoutAnimation.current = true;
      LayoutAnimation.configureNext({
        duration: 250, // from keyboard event
        update: {
          duration: 250,
          type: Platform.OS === 'ios' ? 'keyboard' : 'linear',
        },
      });
    }
    resetLayoutAnimation();
  }, [resetLayoutAnimation]);

  const setEmojiHeight = React.useCallback(
    (h: number) => {
      setLayoutAnimation();
      _setEmojiHeight(h);
    },
    [setLayoutAnimation]
  );
  // const setVoiceHeight = React.useCallback(
  //   (h: number) => {
  //     setLayoutAnimation();
  //     _setVoiceHeight(h);
  //   },
  //   [setLayoutAnimation]
  // );

  const closeKeyboard = React.useCallback(() => {
    Keyboard.dismiss();
  }, []);
  const closeEmojiList = React.useCallback(() => {
    setEmojiHeight(0);
  }, [setEmojiHeight]);
  const closeVoiceBar = React.useCallback(() => {
    // setVoiceHeight(0);
    voiceBarRef.current?.startHide?.();
  }, []);

  const showEmojiList = React.useCallback(() => {
    const tmp = keyboardHeight === 0 ? 300 : keyboardHeight;
    setEmojiHeight(tmp - (bottom ?? 0));
  }, [bottom, keyboardHeight, setEmojiHeight]);

  const showVoiceBar = React.useCallback(() => {
    // setVoiceHeight(gVoiceBarHeight + (bottom ?? 0));
    voiceBarRef.current?.startShow?.();
  }, []);

  const onRequestModalClose = () => {
    if (voiceBarStateRef.current === 'recording') {
      return;
    }
    voiceBarRef.current?.startHide?.();
  };

  const onVoiceStateChange = (state: VoiceBarState) => {
    voiceBarStateRef.current = state;
  };

  const onRequestModalCloseMenu = () => {
    menuRef.current?.startHide?.();
  };

  const onClickedSend = () => {
    if (sendIconName === 'airplane') {
      const content = valueRef.current;
      propsOnClickedSend?.({
        type: 'text',
        content: content,
      });
      onClickedClearButton();
      if (closeAfterSend === true) {
        timeoutTask(0, closeKeyboard);
      }
    } else {
      console.log('test:zuoyu:onClickedSend');
      onShowMenu();
    }
  };

  const onSelectSendImage = (props: SendImageProps) => {
    propsOnClickedSend?.(props);
  };
  const onSelectSendVoice = (props: SendVoiceProps) => {
    console.log('test:zuoyu:onSelectSendVoice', props);
    propsOnClickedSend?.(props);
    changeInputBarState('normal');
  };
  const onSelectSendVideo = (props: SendVideoProps) => {
    propsOnClickedSend?.(props);
  };
  const onSelectSendFile = (props: SendFileProps) => {
    propsOnClickedSend?.(props);
  };

  console.log('test:zuoyu:onShowMenu');
  const onShowMenu = () => {
    menuRef.current?.startShowWithProps?.({
      initItems: [
        {
          name: 'Select Picture',
          isHigh: false,
          icon: 'img',
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
              console.log('test:zuoyu:selectOnePicture');
              selectOnePicture({
                onResult: (params) => {
                  console.log('test:zuoyu:selectOnePicture', params);
                  onSelectSendImage(params);
                },
              });
            });
          },
        },
        {
          name: 'Select Video',
          isHigh: false,
          icon: 'triangle_in_rectangle',
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
              selectOneShortVideo({
                convId: convId,
                onResult: (params) => {
                  console.log('test:zuoyu:selectOneShortVideo', params);
                  onSelectSendVideo(params);
                },
              });
            });
          },
        },
        {
          name: 'Select Camera',
          isHigh: false,
          icon: 'camera_fill',
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
              selectCamera({
                onResult: (params) => {
                  console.log('test:zuoyu:selectCamera', params);
                  onSelectSendImage(params);
                },
              });
            });
          },
        },
        {
          name: 'Select File',
          isHigh: false,
          icon: 'folder',
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
              selectFile({
                onResult: (params) => {
                  console.log('test:zuoyu:selectFile', params);
                  onSelectSendFile(params);
                },
              });
            });
          },
        },
        {
          name: 'Select Card',
          isHigh: false,
          icon: 'person_single_fill',
          onClicked: () => {
            menuRef.current?.startHide?.(() => {});
          },
        },
      ],
      onRequestModalClose: onRequestModalClose,
      layoutType: 'left',
      hasCancel: true,
    });
  };

  const onVoiceFailed = React.useCallback(
    (error: { reason: string; error: any }) => {
      console.warn('test:zuoyu:voice:failed:', error);
    },
    []
  );

  React.useEffect(() => {
    console.log('test:zuoyu:height:', keyboardCurrentHeight, emojiHeight);
    if (
      (keyboardCurrentHeight > 0 && emojiHeight === 0) ||
      (emojiHeight > 0 && keyboardCurrentHeight === 0) ||
      (emojiHeight === 0 && keyboardCurrentHeight === 0)
    ) {
      // todo: height is pseudo.
      onHeightChange?.(
        emojiHeight === 0 && keyboardCurrentHeight === 0 ? 0 : 1
      );
    }
  }, [keyboardCurrentHeight, emojiHeight, onHeightChange]);

  console.log(
    'test:zuoyu:showVoiceBar:outer',
    voiceHeight,
    emojiHeight,
    keyboardHeight,
    inputBarState
  );

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
    voiceHeight,
    emojiHeight,
    isClosedEmoji,
    isClosedKeyboard,
    emojiIconName,
    setIconName: setEmojiIconName,
    onFocus,
    onBlur,
    inputBarState,
    changeInputBarState,
    voiceBarRef,
    onRequestModalClose,
    onVoiceStateChange,
    onSelectSendVoice,
    onRequestModalCloseMenu,
    menuRef,
    sendIconName,
    onClickedSend,
    onVoiceFailed,
  };
}
