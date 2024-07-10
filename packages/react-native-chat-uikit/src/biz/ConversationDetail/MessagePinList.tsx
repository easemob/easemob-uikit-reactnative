import * as React from 'react';
import { ListRenderItemInfo, Pressable, View } from 'react-native';

import {
  getMessageSnapshot,
  getMessageSnapshotParams,
  MessageManagerListener,
  useChatContext,
} from '../../chat';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { ChatMessage, ChatMessagePinInfo } from '../../rename.chat';
import { usePaletteContext } from '../../theme';
import { FlatListFactory } from '../../ui/FlatList';
import { PressableHighlight } from '../../ui/Pressable';
import { SingleLineText } from '../../ui/Text';
import { formatTsForConvList } from '../../utils';
import { useDataPriority } from '../hooks';
import { useFlatList } from '../List';

type DeleteButtonStatus = 'request' | 'confirm';

export type MessagePinListRef = {
  addPinMessage: (msg: ChatMessage) => void;
  registerCallback: (onClickedItem: (msg: ChatMessage) => void) => void;
};
export type MessagePinListProps = {
  convId: string;
  convType: number;
  onClickedItem?: (msg: ChatMessage) => void;
  onCountChanged?: (count: number) => void;
  propsRef?:
    | React.RefObject<MessagePinListRef>
    | ((ref: React.RefObject<MessagePinListRef>) => void);
  onRequestClose?: () => void;
};
export function MessagePinList(props: MessagePinListProps) {
  const {} = props;
  const FlatList = React.useMemo(
    () => FlatListFactory<MessagePinListItemProps>(),
    []
  );
  const { data, onClickedItemCallback, onClickedItemDeleteButtonCallback } =
    useMessagePinList(props);

  return (
    <View
      style={{
        flex: 1,
        // flexGrow: 1,
        width: '100%',
      }}
    >
      <FlatList
        data={data}
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={(info: ListRenderItemInfo<MessagePinListItemProps>) => {
          const { item } = info;
          return (
            <MessagePinListItemMemo
              onClickedItem={onClickedItemCallback}
              onClickedItemDeleteButton={onClickedItemDeleteButtonCallback}
              {...item}
            />
          );
        }}
        keyExtractor={(item) => `${item.id}`}
      />
    </View>
  );
}
export type MessagePinListItemProps = {
  id: string;
  msg: ChatMessage;
  pinInfo?: ChatMessagePinInfo;
  buttonStatus?: DeleteButtonStatus;
  onClickedItem?: (msg: ChatMessage) => void;
  onClickedItemDeleteButton?: (
    buttonStatus: DeleteButtonStatus,
    msg: ChatMessage
  ) => void;
};
export function MessagePinListItem(props: MessagePinListItemProps) {
  const { tr } = useI18nContext();
  const { getMsgInfo, getContactInfo } = useDataPriority({});
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    fg: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    btn: {
      light: colors.neutralSpecial[5],
      dark: colors.neutralSpecial[6],
    },
    time: {
      light: colors?.neutral[7],
      dark: colors?.neutral[7],
    },
    content: {
      light: colors?.neutral[4],
      dark: colors?.neutral[6],
    },
  });
  const {
    msg,
    pinInfo,
    buttonStatus,
    onClickedItem,
    onClickedItemDeleteButton,
  } = props;
  return (
    <View
      style={{
        backgroundColor: getColor('bg'),
        marginHorizontal: 12,
        marginBottom: 8,
        borderRadius: 8,
      }}
    >
      <PressableHighlight
        style={{
          width: '100%',
          height: 52,
          alignItems: 'center',
          paddingVertical: 6,
          paddingHorizontal: 12,
        }}
        onPress={() => {
          onClickedItem?.(msg);
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <SingleLineText
            style={{
              maxWidth: '80%',
            }}
          >
            <SingleLineText
              style={{ color: getColor('fg'), fontWeight: '500' }}
              paletteType={'label'}
              textType={'small'}
            >
              {pinInfo?.operatorId
                ? getContactInfo(pinInfo?.operatorId).name ??
                  pinInfo?.operatorId
                : pinInfo?.operatorId}
            </SingleLineText>
            <SingleLineText
              style={{ color: getColor('fg'), fontWeight: '400' }}
              paletteType={'label'}
              textType={'small'}
            >
              {tr('_uikit_pin_content_1')}
            </SingleLineText>
            <SingleLineText
              style={{ color: getColor('fg'), fontWeight: '500' }}
              paletteType={'label'}
              textType={'small'}
            >
              {getMsgInfo(msg).name ?? msg.from}
            </SingleLineText>
            <SingleLineText
              style={{ color: getColor('fg'), fontWeight: '400' }}
              paletteType={'label'}
              textType={'small'}
            >
              {tr('_uikit_pin_content_2')}
            </SingleLineText>
          </SingleLineText>
          <View style={{ flex: 1 }} />
          <SingleLineText
            paletteType={'body'}
            textType={'small'}
            style={{ color: getColor('time') }}
          >
            {formatTsForConvList(pinInfo?.pinTime ?? msg.serverTime)}
          </SingleLineText>
        </View>
        <View style={{ flex: 1 }} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <SingleLineText
            paletteType={'body'}
            textType={'small'}
            style={{
              color: getColor('content'),
              maxWidth: '80%',
            }}
          >
            {tr(getMessageSnapshot(msg), ...getMessageSnapshotParams(msg))}
          </SingleLineText>
          <View style={{ flex: 1 }} />
          <Pressable
            onPress={() => {
              onClickedItemDeleteButton?.(buttonStatus ?? 'request', msg);
            }}
          >
            <SingleLineText
              paletteType={'label'}
              textType={'medium'}
              style={{
                color: getColor(buttonStatus === 'request' ? 'btn' : 'fg'),
              }}
            >
              {buttonStatus === 'request'
                ? tr('_uikit_pin_message_button_request_delete')
                : tr('_uikit_pin_message_button_confirm_delete')}
            </SingleLineText>
          </Pressable>
        </View>
      </PressableHighlight>
    </View>
  );
}

export const MessagePinListItemMemo = React.memo(MessagePinListItem);

export function useMessagePinList(props: MessagePinListProps) {
  const { onClickedItem, convId, convType, propsRef, onCountChanged } = props;
  const flatListProps = useFlatList<MessagePinListItemProps>({
    listState: 'loading',
  });
  const { setData, dataRef } = flatListProps;
  const im = useChatContext();
  const onClickedItemRef = React.useRef<(msg: ChatMessage) => void>();

  const removeDuplicateData = React.useCallback(
    (list: MessagePinListItemProps[]) => {
      const uniqueList = list.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );
      return uniqueList;
    },
    []
  );

  const refreshToUI = React.useCallback(
    (list: MessagePinListItemProps[]) => {
      dataRef.current = removeDuplicateData(list);
      setData([...dataRef.current]);
    },
    [dataRef, removeDuplicateData, setData]
  );

  const addItemToUI = React.useCallback(
    async (list: ChatMessage[], pos: 'before' | 'after') => {
      const promise = Promise.all(
        list.map(async (v) => {
          const p = await v.getPinInfo;
          return {
            id: v.msgId,
            msg: v,
            pinInfo: p,
            buttonStatus: 'request',
          } as MessagePinListItemProps;
        })
      );
      const propsList = await promise;
      if (pos === 'before') {
        dataRef.current = [...propsList, ...dataRef.current];
      } else {
        dataRef.current = [...dataRef.current, ...propsList];
      }
      refreshToUI(dataRef.current);
      onCountChanged?.(dataRef.current.length);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataRef, refreshToUI]
  );

  const updateItemToUI = React.useCallback(
    (data: MessagePinListItemProps) => {
      dataRef.current = dataRef.current.map((item) => {
        if (item.msg.msgId === data.msg.msgId) {
          item.msg = { ...item.msg, ...data.msg } as ChatMessage;
          item.buttonStatus = data.buttonStatus;
        }
        return item;
      });
      refreshToUI(dataRef.current);
    },
    [dataRef, refreshToUI]
  );

  const removeItemToUI = React.useCallback(
    (msgId: string) => {
      dataRef.current = dataRef.current.filter((item) => item.id !== msgId);
      refreshToUI(dataRef.current);
      onCountChanged?.(dataRef.current.length);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataRef, refreshToUI]
  );

  const onClickedItemCallback = React.useCallback(
    (data: ChatMessage) => {
      if (data) {
        if (onClickedItem) {
          onClickedItem(data);
        } else if (onClickedItemRef.current) {
          onClickedItemRef.current(data);
        }
      }
    },
    [onClickedItem]
  );

  const onClickedItemDeleteButtonCallback = React.useCallback(
    (buttonStatus: DeleteButtonStatus, msg: ChatMessage) => {
      if (buttonStatus === 'request') {
        updateItemToUI({
          msg: msg,
          buttonStatus: 'confirm',
        } as MessagePinListItemProps);
      } else if (buttonStatus === 'confirm') {
        im.unPinMessage({
          msgId: msg.msgId,
          onResult: (res) => {
            if (res.isOk) {
              removeItemToUI(msg.msgId);
            }
          },
        });
      }
    },
    [im, removeItemToUI, updateItemToUI]
  );

  const addPinMessage = React.useCallback(
    (msg: ChatMessage) => {
      im.pinMessage({
        msgId: msg.msgId,
        onResult: (res) => {
          if (res.isOk) {
            addItemToUI([msg], 'before');
          }
        },
      });
    },
    [addItemToUI, im]
  );
  const registerCallback = React.useCallback(
    (onClickedItem: (msg: ChatMessage) => void) => {
      onClickedItemRef.current = onClickedItem;
    },
    []
  );

  const maybePropsRef = React.useRef<MessagePinListRef>({
    addPinMessage: addPinMessage,
    registerCallback: registerCallback,
  });

  const requestList = React.useCallback(
    (forceRequest?: boolean) => {
      im.fetchPinnedMessages({
        convId: convId,
        convType: convType,
        forceRequest: forceRequest,
        onResult: (res) => {
          if (res.isOk && res.value) {
            const list = res.value;
            addItemToUI(list, 'before');
          }
        },
      });
    },
    [addItemToUI, convId, convType, im]
  );

  const onRecvRecallMessage = React.useCallback(
    (_orgMsg: ChatMessage, _tipMsg: ChatMessage) => {
      dataRef.current = [];
      requestList(true);
    },
    [dataRef, requestList]
  );

  React.useEffect(() => {
    requestList();
  }, [requestList]);

  React.useEffect(() => {
    if (propsRef) {
      if (typeof propsRef === 'function') {
        propsRef(maybePropsRef);
      } else {
        if (propsRef.current) {
          propsRef.current.addPinMessage = addPinMessage;
          propsRef.current.registerCallback = registerCallback;
        }
      }
    }
  }, [addPinMessage, propsRef, registerCallback]);

  React.useEffect(() => {
    const listener: MessageManagerListener = {
      onPinMessageChanged: (msg: ChatMessage, pinOperation: number) => {
        if (pinOperation === 0) {
          addItemToUI([msg], 'before');
        } else if (pinOperation === 1) {
          removeItemToUI(msg.msgId);
        }
      },
      onRecvRecallMessage: (orgMsg: ChatMessage, tipMsg: ChatMessage) => {
        if (orgMsg.conversationId === convId) {
          onRecvRecallMessage(orgMsg, tipMsg);
        }
      },
      onRecallMessageResult: (params: {
        isOk: boolean;
        orgMsg?: ChatMessage;
        tipMsg?: ChatMessage;
      }) => {
        if (params.isOk === true) {
          if (params.orgMsg && params.tipMsg) {
            if (params.orgMsg.conversationId === convId) {
              onRecvRecallMessage(params.orgMsg, params.tipMsg);
            }
          }
        }
      },
    };
    im.messageManager.addListener('MessagePinList', listener);
    return () => {
      im.messageManager.removeListener('MessagePinList');
    };
  }, [
    addItemToUI,
    convId,
    im.messageManager,
    onRecvRecallMessage,
    removeItemToUI,
  ]);

  return {
    ...flatListProps,
    onClickedItemCallback,
    onClickedItemDeleteButtonCallback,
  };
}
