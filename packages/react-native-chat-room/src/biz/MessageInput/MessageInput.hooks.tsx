import * as React from 'react';
import emoji from 'twemoji';

import { ErrorCode, UIKitError } from '../../error';
import type { ChatMessage } from '../../rename.chat';
import { useRoomContext } from '../../room';
import { emoji as convert, FACE_ASSETS_UTF16 } from '../EmojiList';

export function useInputValue() {
  const [_value, _setValue] = React.useState('');
  const valueRef = React.useRef('');
  const rawValue = React.useRef('');
  const setValue = (
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
  const _onFace = React.useCallback((face: string) => {
    setValue(valueRef.current, 'add_face', face);
  }, []);

  const _onDel = () => {
    if (valueRef.current.length >= 2) {
      const face = valueRef.current.substring(valueRef.current.length - 2);
      let lastIsFace = false;
      FACE_ASSETS_UTF16.forEach((v) => {
        if (face === v) {
          lastIsFace = true;
          setValue(valueRef.current, 'del_face', face);
        }
      });
      if (lastIsFace === false) {
        setValue(valueRef.current, 'del_c');
      }
    } else if (valueRef.current.length > 0) {
      setValue(valueRef.current, 'del_c');
    }
  };
  const _clear = () => {
    valueRef.current = '';
    rawValue.current = '';
    _setValue(valueRef.current);
  };
  const _getRawValue = () => {
    return rawValue.current;
  };
  return {
    value: _value,
    setValue: setValue,
    valueRef: valueRef,
    onFace: _onFace,
    onDel: _onDel,
    clear: _clear,
    getRawValue: _getRawValue,
  };
}

export function useInputBarApi(params: {
  onSended: (msg: ChatMessage) => void;
}) {
  const { onSended } = params;
  const im = useRoomContext();
  const _sendText = (content: string) => {
    if (im.roomState === 'joined') {
      im.sendText({
        roomId: im.roomId!,
        // content: content, // !!! raw content, not ui content
        content: convert.fromCodePointText(content),
        result: ({ isOk, message, error }) => {
          if (isOk === true) {
            onSended?.(message!);
            im.sendFinished({ event: 'send_text' });
          } else {
            im.sendError({ error: error!, from: useInputBarApi?.caller?.name });
          }
        },
      });
    } else {
      im.sendError({
        error: new UIKitError({ code: ErrorCode.room_join_error }),
      });
    }
  };
  return {
    sendText: _sendText,
  };
}
