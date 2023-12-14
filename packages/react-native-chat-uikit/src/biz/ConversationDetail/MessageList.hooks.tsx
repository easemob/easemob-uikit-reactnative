import * as React from 'react';
import { ChatMessage, ChatMessageChatType } from 'react-native-chat-sdk';

import { ChatServiceListener, useChatListener } from '../../chat';
import type { AlertRef } from '../../ui/Alert';
import { getCurTs } from '../../utils';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { useFlatList } from '../List';
import type { UseFlatListReturn } from '../types';
import type {
  MessageAddPosition,
  MessageListItemProps,
  MessageListProps,
  MessageListRef,
  MessageModel,
  SendFileProps,
  SendImageProps,
  SendSystemProps,
  SendTextProps,
  SendTimeProps,
  SendVideoProps,
  SendVoiceProps,
  SystemMessageModel,
  TimeMessageModel,
} from './types';

export function useMessageList(
  props: MessageListProps,
  ref?: React.ForwardedRef<MessageListRef>
): UseFlatListReturn<MessageListItemProps> & {
  onRequestModalClose: () => void;
  menuRef: React.RefObject<BottomSheetNameMenuRef>;
  alertRef: React.RefObject<AlertRef>;
  onClickedItem: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
} {
  const { convId, convType, testMode } = props;
  const flatListProps = useFlatList<MessageListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'loading',
    onInit: () => init(),
  });
  const { data, dataRef, setData, isAutoLoad, listState, listType } =
    flatListProps;

  const init = async () => {
    if (testMode === 'only-ui') {
      dataRef.current = [
        {
          id: '1',
          model: {
            userId: 'xxx',
            modelType: 'message',
            layoutType: 'right',
            msg: ChatMessage.createTextMessage(
              'xxx',
              'fjeinsdlkjsdlksjdfiosjelfijse lfeijselfsjefisejlfijsslkdjflsefl',
              0
            ),
          },
        } as MessageListItemProps,
        {
          id: '2',
          model: {
            userId: 'xxx',
            modelType: 'system',
            contents: [
              'this is a system message.this is a system message.this is a system message.this is a system message.',
            ],
          },
        } as MessageListItemProps,
        {
          id: '3',
          model: {
            userId: 'xxx',
            modelType: 'time',
            timestamp: getCurTs(),
          },
        } as MessageListItemProps,
        {
          id: '4',
          model: {
            userId: 'xxx',
            modelType: 'message',
            layoutType: 'left',
            msg: ChatMessage.createCmdMessage('xxx', 'test', 0),
          },
        } as MessageListItemProps,
      ];
      setData(dataRef.current);
      return;
    }
    if (isAutoLoad === true) {
    }
  };

  const menuRef = React.useRef<BottomSheetNameMenuRef>(null);
  const onRequestModalClose = () => {
    menuRef.current?.startHide?.();
  };
  const alertRef = React.useRef<AlertRef>(null);

  const listenerRef = React.useRef<ChatServiceListener>({
    onMessagesReceived: () => {},
    onMessagesRecalled: async () => {},
    onMessageContentChanged: () => {
      // todo:
    },
  });
  useChatListener(listenerRef.current);

  const onClickedItem = React.useCallback(
    (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      console.log('test:zuoyu:', id, model);
    },
    []
  );

  const getStyle = () => {
    return undefined;
  };

  const onAddData = React.useCallback(
    (d: MessageListItemProps, pos: MessageAddPosition) => {
      if (pos === 'bottom') {
        dataRef.current = [...dataRef.current, d];
      } else {
        dataRef.current = [d, ...dataRef.current];
      }

      setData(dataRef.current);
    },
    [dataRef, setData]
  );

  React.useImperativeHandle(
    ref,
    () => {
      return {
        addSendMessage: (
          value:
            | SendFileProps
            | SendImageProps
            | SendTextProps
            | SendVideoProps
            | SendVoiceProps
            | SendTimeProps
            | SendSystemProps
        ) => {
          if (value.type === 'text') {
            const v = value as SendTextProps;
            const msg = ChatMessage.createTextMessage(
              convId,
              v.content,
              convType as number as ChatMessageChatType
            );
            onAddData(
              {
                id: msg.localTime.toString(),
                model: {
                  userId: msg.from,
                  modelType: 'message',
                  layoutType: 'right',
                  msg: msg,
                },
                containerStyle: getStyle(),
              },
              'bottom'
            );
          } else if (value.type === 'image') {
            const v = value as SendImageProps;
            const msg = ChatMessage.createImageMessage(
              convId,
              v.localPath,
              convType as number as ChatMessageChatType,
              {
                width: v.imageWidth,
                height: v.imageHeight,
                fileSize: v.fileSize,
                displayName: v.displayName ?? '',
              }
            );
            onAddData(
              {
                id: msg.localTime.toString(),
                model: {
                  userId: msg.from,
                  modelType: 'message',
                  layoutType: 'right',
                  msg: msg,
                },
                containerStyle: getStyle(),
              },
              'bottom'
            );
          }
        },
        removeMessage: (_msg: ChatMessage) => {},
        recallMessage: (_msg: ChatMessage) => {},
        updateMessage: (_updatedMsg: ChatMessage) => {},
        loadHistoryMessage: (
          _msgs: ChatMessage[],
          _pos: MessageAddPosition
        ) => {},
      };
    },
    [convId, convType, onAddData]
  );

  return {
    listType,
    listState,
    data,
    onRequestModalClose,
    menuRef,
    alertRef,
    onClickedItem,
  };
}
