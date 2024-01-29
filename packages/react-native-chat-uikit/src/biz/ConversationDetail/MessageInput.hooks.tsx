import * as React from 'react';
import {
  Keyboard,
  LayoutAnimation,
  Platform,
  TextInput as RNTextInput,
} from 'react-native';
import type { ChatTextMessageBody } from 'react-native-chat-sdk';
import emoji from 'twemoji';

import type { IconNameType } from '../../assets';
// import { useDispatchContext } from '../../dispatch';
import { useDelayExecTask, useKeyboardHeight } from '../../hook';
import type { AlertRef } from '../../ui/Alert';
import { timeoutTask } from '../../utils';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
// import { gVoiceBarHeight } from '../const';
import { FACE_ASSETS_UTF16 } from '../EmojiList';
import { useMessageInputExtendActions } from '../hooks/useMessageInputExtendActions';
import {
  selectCamera,
  selectFile,
  selectOnePicture,
  selectOneShortVideo,
} from '../hooks/useSelectFile';
import type { BottomVoiceBarRef, VoiceBarState } from '../VoiceBar';
import type { MessageInputEditMessageRef } from './MessageInputEditMessage';
import type {
  MessageInputProps,
  MessageInputRef,
  MessageInputState,
  MessageModel,
  SendFileProps,
  SendImageProps,
  SendVideoProps,
  SendVoiceProps,
} from './types';

export function useMessageInput(
  props: MessageInputProps,
  ref?: React.ForwardedRef<MessageInputRef>
) {
  const {
    bottom,
    onClickedSend: propsOnClickedSend,
    closeAfterSend,
    onHeightChange,
    convId,
    onEditMessageFinished: propsOnEditMessageFinished,
    // onInputMention: propsOnInputMention,
    onClickedCardMenu: propsOnClickedCardMenu,
    onInitMenu,
  } = props;
  const { keyboardHeight, keyboardCurrentHeight } = useKeyboardHeight();
  const inputRef = React.useRef<RNTextInput>({} as any);
  const [_value, _setValue] = React.useState('');
  const [emojiHeight, _setEmojiHeight] = React.useState(0);
  const isClosedEmoji = React.useRef(true);
  const isClosedKeyboard = React.useRef(true);
  const isClosedVoiceBar = React.useRef(true);
  const [emojiIconName, setEmojiIconName] =
    React.useState<IconNameType>('face');
  const [sendIconName, setSendIconName] =
    React.useState<IconNameType>('plus_in_circle');
  const valueRef = React.useRef('');
  const rawValue = React.useRef('');
  /// !!! tell me why? inputBarState
  const [inputBarState, setInputBarState] =
    React.useState<MessageInputState>('normal');
  const inputBarStateRef = React.useRef<MessageInputState>('normal');
  const hasLayoutAnimation = React.useRef(false);
  const voiceBarRef = React.useRef<BottomVoiceBarRef>({} as any);
  const voiceBarStateRef = React.useRef<VoiceBarState>('idle');
  const menuRef = React.useRef<BottomSheetNameMenuRef>(null);
  const quoteMessageRef = React.useRef<MessageModel | undefined>(undefined);
  const [showQuote, setShowQuote] = React.useState(false);
  const editRef = React.useRef<MessageInputEditMessageRef>({} as any);
  const msgModelRef = React.useRef<MessageModel>();
  const mentionListRef = React.useRef<{ id: string; name: string }[]>([]);
  const alertRef = React.useRef<AlertRef>(null);

  const onSetInputBarState = (state: MessageInputState) => {
    inputBarStateRef.current = state;
    setInputBarState(state);
  };

  const _onValue = (v: string) => {
    if (
      v.length > 0 &&
      (inputBarStateRef.current === 'keyboard' ||
        inputBarStateRef.current === 'emoji')
    ) {
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
      onSetInputBarState('normal');
      setEmojiIconName('face');
      closeEmojiList();
      closeVoiceBar();
      closeKeyboard();
    } else if (nextState === 'emoji') {
      isClosedEmoji.current = false;
      isClosedKeyboard.current = true;
      isClosedVoiceBar.current = true;
      onSetInputBarState('emoji');
      setEmojiIconName('keyboard2');
      closeKeyboard();
      closeVoiceBar();
      showEmojiList();
    } else if (nextState === 'voice') {
      isClosedEmoji.current = true;
      isClosedKeyboard.current = true;
      isClosedVoiceBar.current = false;
      onSetInputBarState('voice');
      setEmojiIconName('face');
      closeKeyboard();
      closeEmojiList();
      showVoiceBar();
    } else if (nextState === 'keyboard') {
      isClosedKeyboard.current = false;
      onSetInputBarState('keyboard');
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
          // const tmp = findLastMention(valueRef.current);
          // if (tmp) {
          //   text = tmp;
          // }
          rawValue.current = rawValue.current.substring(
            0,
            rawValue.current.length - (valueRef.current.length - text.length)
          );
        } else {
          // if (convType === ChatConversationType.GroupChat) {
          //   if (text.length > 0 && text[text.length - 1] === '@') {
          //     propsOnInputMention?.(convId);
          //   }
          // }
          rawValue.current += text.substring(valueRef.current.length);
        }
      }
      if (text.length === 0) {
        clearMentionList();
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
    // !!! https://github.com/facebook/react-native/issues/37979
    // !!! https://github.com/facebook/react-native/commit/a804c0f22b4b11b3d9632dc59a6da14f6c4325e3
    valueRef.current = '';
    rawValue.current = '';
    // inputRef.current?.clear();
    setInputValue(valueRef.current);
    clearMentionList();
    // _onValue(valueRef.current);
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

  const onCloseVoiceBar = () => {
    if (voiceBarStateRef.current === 'recording') {
      return;
    }
    voiceBarRef.current?.startHide?.();
  };

  const onVoiceStateChange = (state: VoiceBarState) => {
    voiceBarStateRef.current = state;
  };

  const onRequestCloseMenu = () => {
    menuRef.current?.startHide?.();
  };

  const onClickedEmojiSend = React.useCallback(() => {
    // !!! warning: valueRef.current is not the latest value
    const content = valueRef.current;
    propsOnClickedSend?.({
      type: 'text',
      content: content,
    });
    onClickedClearButton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickedSend = () => {
    if (sendIconName === 'airplane') {
      const content = valueRef.current;
      if (quoteMessageRef.current !== undefined) {
        // !!! only support text message for quote
        propsOnClickedSend?.({
          type: 'text',
          content: content,
          quote: quoteMessageRef.current,
        });
        onHideQuoteMessage();
      } else {
        propsOnClickedSend?.({
          type: 'text',
          content: content,
        });
      }

      onClickedClearButton();

      if (closeAfterSend === true) {
        timeoutTask(0, closeKeyboard);
      }
    } else {
      onShowMessageInputExtendActions();
    }
  };

  const onSelectSendImage = (props: SendImageProps) => {
    propsOnClickedSend?.(props);
  };
  const onSelectSendVoice = (props: SendVoiceProps) => {
    propsOnClickedSend?.(props);
    changeInputBarState('normal');
  };
  const onSelectSendVideo = (props: SendVideoProps) => {
    propsOnClickedSend?.(props);
  };
  const onSelectSendFile = (props: SendFileProps) => {
    propsOnClickedSend?.(props);
  };
  const onSelectSendCard = () => {
    propsOnClickedCardMenu?.();
  };

  const { onShowMessageInputExtendActions } = useMessageInputExtendActions({
    menuRef,
    convId,
    alertRef,
    onSelectOnePicture: selectOnePicture,
    onSelectOnePictureFromCamera: selectCamera,
    onSelectFile: selectFile,
    onSelectOneShortVideo: selectOneShortVideo,
    onSelectSendCard,
    onSelectFileResult: onSelectSendFile,
    onSelectOnePictureResult: onSelectSendImage,
    onSelectOneShortVideoResult: onSelectSendVideo,
    onInit: onInitMenu,
  });

  const onVoiceFailed = React.useCallback(
    (error: { reason: string; error: any }) => {
      let e = error;
      try {
        e.error = JSON.stringify(error);
      } catch {}
      console.warn('dev:voice:failed:', e);
    },
    []
  );

  const onShowQuoteMessage = React.useCallback((model: MessageModel) => {
    quoteMessageRef.current = model;
    isClosedKeyboard.current = false;
    inputRef.current?.focus();
    setShowQuote(true);
  }, []);
  const onHideQuoteMessage = React.useCallback(() => {
    quoteMessageRef.current = undefined;
    setShowQuote(false);
  }, []);

  const onRequestCloseEdit = React.useCallback(() => {
    editRef.current?.startHide?.();
  }, []);

  const onShowEditMessage = React.useCallback((model: MessageModel) => {
    msgModelRef.current = model;
    editRef.current?.startShowWithInit?.(model.msg);
  }, []);

  const onEditMessageFinished = React.useCallback(
    (msgId: string, text: string) => {
      editRef.current?.startHide?.(() => {
        if (msgModelRef.current?.msg.msgId === msgId) {
          const body = msgModelRef.current.msg.body as ChatTextMessageBody;
          body.content = text;
          propsOnEditMessageFinished?.(msgModelRef.current);
        }
      });
    },
    [propsOnEditMessageFinished]
  );

  React.useEffect(() => {
    if (
      (keyboardCurrentHeight > 0 && emojiHeight === 0) ||
      (emojiHeight > 0 && keyboardCurrentHeight === 0) ||
      (emojiHeight === 0 && keyboardCurrentHeight === 0)
    ) {
      // !!! height is pseudo.
      onHeightChange?.(
        emojiHeight === 0 && keyboardCurrentHeight === 0 ? 0 : 1
      );
    }
  }, [keyboardCurrentHeight, emojiHeight, onHeightChange]);

  React.useImperativeHandle(ref, () => {
    return {
      close: () => {
        changeInputBarState('normal');
      },
      quoteMessage: (model) => {
        onShowQuoteMessage(model);
      },
      editMessage: (model) => {
        onShowEditMessage(model);
      },
      // mentionSelected: (list: { id: string; name: string }[]) => {
      //   mentionListRef.current.push(...list);
      //   // !!! only support one mention
      //   const text = valueRef.current;
      //   const index = text.lastIndexOf('@');
      //   if (index !== -1) {
      //     const pre = text.substring(0, index);
      //     const post = text.substring(index + 1);
      //     const mention = list[0];
      //     const mentionText = `@${mention!.name} `;
      //     const newText = `${pre}${mentionText}${post}`;
      //     setInputValue(newText);
      //   }
      // },
    };
  });

  // const deleteLastMentionFromList = React.useCallback((name: string) => {
  //   const index = mentionListRef.current
  //     .reverse()
  //     .findIndex((v) => v.name === name);
  //   if (index !== -1) {
  //     mentionListRef.current.splice(index, 1);
  //   }
  // }, []);

  // const findLastMention = React.useCallback(
  //   (text: string) => {
  //     if (mentionListRef.current.length > 0) {
  //       const last = mentionListRef.current[mentionListRef.current.length - 1];
  //       if (last) {
  //         // const index = text.lastIndexOf(`@${last.name} `);
  //         const key = `@${last.name}`;
  //         const index = text.lastIndexOf(key);
  //         if (index !== -1) {
  //           const start = index;
  //           const end = index + last.name.length + 1;
  //           if (end + 1 === text.length) {
  //             deleteLastMentionFromList(last.name);
  //             return text.replace(text.substring(start, end), '');
  //           }
  //         }
  //       }
  //     }
  //     return undefined;
  //   },
  //   [deleteLastMentionFromList]
  // );

  const clearMentionList = React.useCallback(() => {
    if (mentionListRef.current.length > 0) {
      mentionListRef.current = [];
    }
  }, []);

  return {
    value: _value,
    setValue: setInputValue,
    onClickedFaceListItem,
    onClickedDelButton,
    onClickedClearButton,
    onClickedEmojiButton,
    onClickedVoiceButton,
    inputRef,
    emojiHeight,
    emojiIconName,
    onFocus,
    onBlur,
    inputBarState,
    changeInputBarState,
    voiceBarRef,
    onCloseVoiceBar,
    onVoiceStateChange,
    onSelectSendVoice,
    onRequestCloseMenu,
    menuRef,
    sendIconName,
    onClickedSend,
    onVoiceFailed,
    showQuote,
    onHideQuoteMessage,
    onRequestCloseEdit,
    editRef,
    onEditMessageFinished,
    quoteMsg: quoteMessageRef.current?.msg,
    onClickedEmojiSend,
  };
}
