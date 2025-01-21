import * as React from 'react';
import {
  Dimensions,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';

import { useConfigContext } from '../../config';
import { useDispatchContext } from '../../dispatch';
import { useColors } from '../../hook';
import { ChatMessage, ChatTextMessageBody } from '../../rename.chat';
import { useRoomContext } from '../../room';
import { usePaletteContext } from '../../theme';
import { Stack } from '../../utils';
import { BottomSheetNameMenuRef, InitMenuItemsType } from '../BottomSheetMenu';
import { MESSAGE_PIN_PADDING_VERTICAL } from './MessagePin.const';
import { MessagePinProps, MessagePinTask } from './types';
import { MessagePinItemProps } from './types';

export function useMessagePin(props: MessagePinProps) {
  const {} = props;

  const tasks: Stack<MessagePinTask> = React.useRef(
    new Stack<MessagePinTask>()
  ).current;
  const curTask = React.useRef<MessagePinTask | undefined>(undefined);

  const [isShow, setIsShow] = React.useState(false);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const avatarRef = React.useRef<string>();
  const msgRef = React.useRef<ChatMessage>();
  const idRef = React.useRef<string>('');
  const tagRef = React.useRef<string>('');
  const nicknameRef = React.useRef<string>();
  const im = useRoomContext();

  const execTask = React.useCallback(() => {
    const task = tasks.top();
    if (task && task.msg) {
      curTask.current = task;
      setIsShow(true);
      avatarRef.current = task.avatar;
      idRef.current = task.msg.msgId;
      nicknameRef.current = task.nickname;
      tagRef.current = task.tag ?? '';
      msgRef.current = task.msg;
      // setId((_) => undefined);
      // setTimeout(() => {
      //   setId(task.msg?.msgId);
      // }, 1000);
      setId(task.msg?.msgId);
    } else {
      setIsShow(false);
    }
  }, [tasks]);

  const pushTask = React.useCallback(
    (task: MessagePinTask) => {
      tasks.push(task);
      execTask();
    },
    [execTask, tasks]
  );

  const popTask = React.useCallback(() => {
    tasks.pop();
    execTask();
  }, [execTask, tasks]);

  const init = React.useCallback(() => {
    if (im?.roomId) {
      im?.fetchPinnedMessages({
        convId: im?.roomId,
        forceRequest: true,
        onResult: (params) => {
          im?.sendFinished({
            event: 'fetch_pin_message',
            extra: params,
          });
          if (params.isOk && params.msgs) {
            const msg = params.msgs[0];
            if (msg) {
              const user = im?.userInfoFromMessage(msg);
              const nickname = user?.nickname ?? user?.userId ?? 'unknown';
              pushTask?.({
                id: msg.msgId,
                msg: msg,
                tag: 'pin2',
                avatar: user?.avatarURL,
                nickname: nickname,
              });
            }
          }
        },
      });
    }
  }, [im, pushTask]);

  return {
    pushTask,
    popTask,
    isShow,
    avatarRef,
    idRef,
    nicknameRef,
    id,
    msgRef,
    init,
    tagRef,
  };
}

export function useMessagePinItem(props: MessagePinItemProps) {
  const {} = props;
  const {
    maxWidth = Dimensions.get('window').width * 0.75,
    containerStyle,
    msg,
    tag,
    avatar,
    nickname,
    commonStateMaxLine = 2,
    extendStateMaxLine = 5,
    showFullContent = false,
    onLongPress: propsOnLongPress,
  } = props;
  const im = useRoomContext();
  const { emitSync } = useDispatchContext();
  const { roomOption, fontFamily } = useConfigContext();
  const { fonts } = usePaletteContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.barrage.onLight[2],
      dark: colors.barrage.onDark[2],
    },
    time: {
      light: colors.secondary[8],
      dark: colors.secondary[8],
    },
    name: {
      light: colors.primary[8],
      dark: colors.primary[8],
    },
    content: {
      light: colors.neutral[98],
      dark: colors.neutral[2],
    },
  });

  const {
    messagePin: { isVisibleAvatar, isVisibleName, isVisibleTag },
  } = roomOption;
  const menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
  const maxWidthRef = React.useRef(maxWidth);
  const headerWidth = React.useRef(0);
  const width = React.useRef(0);
  const rawContent = (msg?.body as ChatTextMessageBody)?.content ?? '';
  const displayContentWidthRef = React.useRef(0);
  const realContentWidthRef = React.useRef(0);
  const realContentRef = React.useRef('');
  const [unitTextHeight, setUnitTextHeight] = React.useState(10);
  const [isTruncated, setIsTruncated] = React.useState(false);
  const [showExtensionButton, setShowExtensionButton] = React.useState(false);
  const [numberOfLines, setNumberOfLines] = React.useState<number | undefined>(
    showFullContent === true ? undefined : commonStateMaxLine
  );
  const [maxHeight, setMaxHeight] = React.useState<number | undefined>(
    showFullContent === true
      ? extendStateMaxLine * unitTextHeight + MESSAGE_PIN_PADDING_VERTICAL * 2
      : undefined
  );

  const isShowExtensionButton = React.useCallback(
    (maxWidth: number, realContentWidth: number) => {
      if (realContentWidth > maxWidth) {
        setShowExtensionButton(true);
      } else {
        setShowExtensionButton(false);
      }
    },
    []
  );

  const compareWidth = React.useCallback(
    (realWidth: number, displayWidth: number) => {
      if (realWidth === 0 || displayWidth === 0) {
        return;
      }
      if (realWidth > displayWidth) {
        // setShowExtensionButton(true);
        if (numberOfLines === undefined) {
          setIsTruncated(false);
        } else {
          setIsTruncated(true);
        }
      } else {
        setIsTruncated(false);
      }
      // setIsTruncated((pre) => !pre);
    },
    [numberOfLines]
  );

  const onIndentedText = React.useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      const length = event.nativeEvent.lines.length;
      if (length > 0) {
        setUnitTextHeight(event.nativeEvent.lines[0]?.height ?? 10);
        displayContentWidthRef.current = 0;
        event.nativeEvent.lines.forEach((line) => {
          displayContentWidthRef.current += line.width;
        });
        compareWidth(
          realContentWidthRef.current,
          displayContentWidthRef.current
        );
      }
    },
    [compareWidth]
  );

  const onRealContentWidth = React.useCallback(
    (realContentWidth: number, realContent?: string) => {
      realContentWidthRef.current = realContentWidth;
      realContentRef.current = realContent ?? '';
      isShowExtensionButton(maxWidth * 2, realContentWidth);
      compareWidth(realContentWidthRef.current, displayContentWidthRef.current);
    },
    [compareWidth, isShowExtensionButton, maxWidth]
  );

  const onPressExtension = React.useCallback(() => {
    setNumberOfLines(undefined);
    setMaxHeight(
      extendStateMaxLine * unitTextHeight + MESSAGE_PIN_PADDING_VERTICAL * 2
    );
  }, [extendStateMaxLine, unitTextHeight]);
  const onPressShrink = React.useCallback(() => {
    setNumberOfLines(commonStateMaxLine);
    setMaxHeight(undefined);
  }, [commonStateMaxLine]);

  const onUnpinMessage = React.useCallback(() => {
    if (im.ownerId === im.userId) {
      im.unPinMessage({ msgId: msg?.msgId ?? '' });
    }
  }, [im, msg?.msgId]);

  const onShowMenu = React.useCallback(() => {
    const initItems: InitMenuItemsType[] = [];
    if (im.ownerId === im.userId) {
      initItems.push({
        name: 'Unpin',
        isHigh: false,
        onClicked: () => {
          onUnpinMessage();
          menuRef?.current?.startHide?.();
        },
      });
      menuRef?.current?.startShowWithInit?.(initItems);
    }
  }, [im.ownerId, im.userId, onUnpinMessage]);

  const onClicked = React.useCallback(() => {
    if (showExtensionButton === true) {
      if (isTruncated === true) {
        onPressExtension();
      } else {
        onPressShrink();
      }
    }
  }, [isTruncated, onPressExtension, onPressShrink, showExtensionButton]);
  const onLongPress = React.useCallback(() => {
    if (msg) {
      if (propsOnLongPress) {
        propsOnLongPress?.(msg);
      } else {
        onShowMenu();
      }
    }
  }, [msg, onShowMenu, propsOnLongPress]);

  React.useLayoutEffect(() => {
    if (rawContent && rawContent.length > 0) {
      maxWidthRef.current = maxWidth;
      displayContentWidthRef.current = 0;
      realContentWidthRef.current = 0;
      setShowExtensionButton(false);
      setIsTruncated(false);
      setNumberOfLines(
        showFullContent === true ? undefined : commonStateMaxLine
      );
    }
  }, [commonStateMaxLine, rawContent, showFullContent, msg, maxWidth]);

  return {
    onLongPress,
    onClicked,
    onRealContentWidth,
    onIndentedText,
    maxWidth,
    containerStyle,
    tag,
    avatar,
    nickname,
    emitSync,
    fontFamily,
    fonts,
    getColor,
    isVisibleAvatar,
    isVisibleName,
    isVisibleTag,
    headerWidth,
    width,
    numberOfLines,
    maxHeight,
    showExtensionButton,
    msg,
    rawContent,
    isTruncated,
    menuRef,
  };
}
