import * as React from 'react';
import {
  ChatMessage,
  ChatMessageChatType,
  ChatMessageStatus,
  ChatMessageType,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';

import {
  ChatServiceListener,
  gCustomMessageCardEventType,
  gMessageAttributeQuote,
  useChatListener,
} from '../../chat';
import { Services } from '../../services';
import type { AlertRef } from '../../ui/Alert';
import { getCurTs, localUrlEscape, playUrl, timeoutTask } from '../../utils';
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
  const {
    data,
    dataRef,
    setData,
    isAutoLoad,
    listState,
    listType,
    ref: listRef,
  } = flatListProps;

  const isNeedScrollToEndRef = React.useRef(false);
  const currentVoicePlayingRef = React.useRef<MessageModel | undefined>();

  const init = async () => {
    if (testMode === 'only-ui') {
      const textMsg = ChatMessage.createTextMessage(
        'xxx',
        'you are welcome. 1',
        0
      );
      const textMsg2 = ChatMessage.createTextMessage(
        'xxx',
        'you are welcome. 2',
        0
      );
      const textMsg3 = ChatMessage.createTextMessage(
        'xxx',
        'you are welcome. 1',
        0
      );
      const voiceMsg = ChatMessage.createVoiceMessage(
        'xxx',
        '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-15757929042.aac',
        0,
        {
          duration: 60000,
        }
      );
      textMsg.attributes = {
        [gMessageAttributeQuote]: textMsg2.msgId,
      };
      textMsg3.attributes = {
        [gMessageAttributeQuote]: voiceMsg.msgId,
      };
      const textMsg4 = ChatMessage.createTextMessage(
        'xxx',
        'you are welcome. 1',
        0
      );
      const fileMsg = ChatMessage.createFileMessage(
        'xxx',
        '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-1575792904.jpeg',
        0,
        {
          displayName: 'sdf',
          fileSize: 300,
        }
      );
      textMsg4.attributes = {
        [gMessageAttributeQuote]: fileMsg.msgId,
      };
      const textMsg5 = ChatMessage.createTextMessage(
        'xxx',
        'you are welcome. 1',
        0
      );
      const imageMsg = ChatMessage.createImageMessage(
        'xxx',
        '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-15757929042.jpeg',
        0,
        {
          displayName: 'sdf',
          thumbnailLocalPath:
            '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-1575792904.jpeg',
          width: 300,
          height: 300,
          fileSize: 200,
        }
      );
      textMsg5.attributes = {
        [gMessageAttributeQuote]: imageMsg.msgId,
      };
      const textMsg6 = ChatMessage.createTextMessage(
        'xxx',
        'you are welcome. 1',
        0
      );
      const videoMsg = ChatMessage.createVideoMessage(
        'xxx',
        '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-15757929042.mp4',
        0,
        {
          displayName: 'sdf',
          thumbnailLocalPath:
            '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-1575792904.jpeg',
          duration: 3000,
          width: 300,
          height: 300,
        }
      );
      textMsg6.attributes = {
        [gMessageAttributeQuote]: videoMsg.msgId,
      };
      dataRef.current = [
        {
          id: '1',
          model: {
            userId: 'xxx',
            userAvatar:
              'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
            modelType: 'message',
            layoutType: 'right',
            msg: ChatMessage.createTextMessage('xxx', 'you are welcome. ', 0),
          },
        } as MessageListItemProps,
        // {
        //   id: '13',
        //   model: {
        //     userId: 'xxx',
        //     userAvatar:
        //       'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
        //     modelType: 'message',
        //     layoutType: 'right',
        //     msg: textMsg,
        //     msgQuote: textMsg2,
        //   },
        // } as MessageListItemProps,
        // {
        //   id: '14',
        //   model: {
        //     userId: 'xxx',
        //     userAvatar:
        //       'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
        //     modelType: 'message',
        //     layoutType: 'left',
        //     msg: textMsg,
        //     msgQuote: textMsg2,
        //   },
        // } as MessageListItemProps,
        // {
        //   id: '15',
        //   model: {
        //     userId: 'xxx',
        //     userAvatar:
        //       'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
        //     modelType: 'message',
        //     layoutType: 'right',
        //     msg: textMsg3,
        //     msgQuote: voiceMsg,
        //   },
        // } as MessageListItemProps,
        // {
        //   id: '16',
        //   model: {
        //     userId: 'xxx',
        //     userAvatar:
        //       'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
        //     modelType: 'message',
        //     layoutType: 'left',
        //     msg: textMsg4,
        //     msgQuote: fileMsg,
        //   },
        // } as MessageListItemProps,
        // {
        //   id: '17',
        //   model: {
        //     userId: 'xxx',
        //     userAvatar:
        //       'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
        //     modelType: 'message',
        //     layoutType: 'left',
        //     msg: textMsg5,
        //     msgQuote: imageMsg,
        //   },
        // } as MessageListItemProps,
        {
          id: '18',
          model: {
            userId: 'xxx',
            userAvatar:
              'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
            modelType: 'message',
            layoutType: 'right',
            msg: textMsg6,
            msgQuote: videoMsg,
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
        {
          id: '5',
          model: {
            userId: 'xxx',
            modelType: 'message',
            layoutType: 'left',
            msg: ChatMessage.createVoiceMessage(
              'xxx',
              '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-15757929042.aac',
              0,
              {
                duration: 60000,
              }
            ),
            isVoicePlaying: false,
          },
        } as MessageListItemProps,
        {
          id: '6',
          model: {
            userId: 'xxx',
            modelType: 'message',
            layoutType: 'right',
            msg: ChatMessage.createVoiceMessage(
              'xxx',
              '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-15757929042.aac',
              0,
              {
                duration: 1000,
              }
            ),
            isVoicePlaying: false,
          },
        } as MessageListItemProps,
        // {
        //   id: '7',
        //   model: {
        //     userId: 'xxx',
        //     modelType: 'message',
        //     layoutType: 'right',
        //     msg: ChatMessage.createImageMessage(
        //       'xxx',
        //       '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-15757929042.jpeg',
        //       0,
        //       {
        //         displayName: 'sdf',
        //         thumbnailLocalPath:
        //           '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-1575792904.jpeg',
        //         width: 300,
        //         height: 300,
        //         fileSize: 200,
        //       }
        //     ),
        //   },
        // } as MessageListItemProps,
        // {
        //   id: '8',
        //   model: {
        //     userId: 'xxx',
        //     modelType: 'message',
        //     layoutType: 'left',
        //     msg: ChatMessage.createVideoMessage(
        //       'xxx',
        //       '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-15757929042.mp4',
        //       0,
        //       {
        //         displayName: 'sdf',
        //         thumbnailLocalPath:
        //           '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-1575792904.jpeg',
        //         duration: 3000,
        //         width: 300,
        //         height: 300,
        //       }
        //     ),
        //   },
        // } as MessageListItemProps,
        {
          id: '9',
          model: {
            userId: 'xxx',
            modelType: 'message',
            layoutType: 'left',
            msg: ChatMessage.createFileMessage(
              'xxx',
              '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-1575792904.jpeg',
              0,
              {
                displayName: 'sdf',
                fileSize: 300,
              }
            ),
          },
        } as MessageListItemProps,
        {
          id: '10',
          model: {
            userId: 'xxx',
            userAvatar:
              'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
            modelType: 'message',
            layoutType: 'right',
            msg: ChatMessage.createFileMessage(
              'xxx',
              '/var/mobile/Containers/Data/Application/FD16F232-7D26-4A6B-8472-9A2C06BEE4DC/Library/Caches/thumbnails/thumb-1575792904.jpeg',
              0,
              {
                displayName: 'sdf',
                fileSize: 300,
              }
            ),
          },
        } as MessageListItemProps,
        {
          id: '11',
          model: {
            userId: 'xxx',
            userAvatar:
              'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
            modelType: 'message',
            layoutType: 'left',
            msg: ChatMessage.createCustomMessage(
              'xxx',
              gCustomMessageCardEventType,
              0,
              {
                params: {
                  userId: 'userId',
                  nickname: 'nickname',
                  avatar:
                    'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
                },
              }
            ),
          },
        } as MessageListItemProps,
        {
          id: '12',
          model: {
            userId: 'xxx',
            userAvatar:
              'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
            modelType: 'message',
            layoutType: 'right',
            msg: ChatMessage.createCustomMessage(
              'xxx',
              gCustomMessageCardEventType,
              0,
              {
                params: {
                  userId: 'userId',
                  nickname: 'nickname',
                  avatar:
                    'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
                },
              }
            ),
          },
        } as MessageListItemProps,
      ];
      dataRef.current.map((d) => {
        if (d.model.modelType === 'message') {
          const msgModel = d.model as MessageModel;
          msgModel.msg.status = ChatMessageStatus.SUCCESS;
        }
      });
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

  const updateMessageVoiceUIState = React.useCallback(
    (model: MessageModel) => {
      const msgId = model.msg.msgId;
      // const msgs = dataRef.current
      //   .filter((d) => d.model.modelType === 'message')
      //   .filter((d) => {
      //     return (
      //       (d.model as MessageModel).msg.body.type === ChatMessageType.VOICE
      //     );
      //   });
      // msgs.forEach((d) => {
      //   const msgModel = d.model as MessageModel;
      //   if (msgId === msgModel.msg.msgId) {
      //     msgModel.isVoicePlaying = !msgModel.isVoicePlaying;
      //   } else {
      //     msgModel.isVoicePlaying = false;
      //   }
      // });
      dataRef.current.map((d) => {
        if (d.model.modelType === 'message') {
          const msgModel = d.model as MessageModel;
          if (msgModel.msg.body.type === ChatMessageType.VOICE) {
            if (msgModel.msg.msgId === msgId) {
              msgModel.isVoicePlaying = !msgModel.isVoicePlaying;
            } else {
              msgModel.isVoicePlaying = false;
            }
            d.model = { ...msgModel };
          }
        }
      });
      setData([...dataRef.current]);
    },
    [dataRef, setData]
  );

  const startVoicePlay = React.useCallback(
    async (msgModel: MessageModel) => {
      const isSame =
        msgModel.msg.msgId === currentVoicePlayingRef.current?.msg.msgId;
      if (currentVoicePlayingRef.current) {
        const tmp = currentVoicePlayingRef.current;
        try {
          await Services.ms.stopAudio();
          tmp.isVoicePlaying = true;
          currentVoicePlayingRef.current = undefined;
          updateMessageVoiceUIState(tmp);
        } catch (error) {
          tmp.isVoicePlaying = true;
          currentVoicePlayingRef.current = undefined;
          updateMessageVoiceUIState(tmp);
        }
      }

      if (isSame === true) {
        return;
      }

      currentVoicePlayingRef.current = msgModel;
      const tmp = currentVoicePlayingRef.current;
      updateMessageVoiceUIState(msgModel);
      const localPath = (msgModel.msg.body as ChatVoiceMessageBody).localPath;
      try {
        const isExisted = await Services.dcs.isExistedFile(localPath);
        if (isExisted !== true) {
          currentVoicePlayingRef.current = undefined;
          updateMessageVoiceUIState(msgModel);
          return;
        }
        await Services.ms.playAudio({
          url: localUrlEscape(playUrl(localPath)),
          onPlay({ currentPosition, duration }) {
            if (currentPosition === duration) {
              tmp.isVoicePlaying = true;
              currentVoicePlayingRef.current = undefined;
              updateMessageVoiceUIState(msgModel);
            }
          },
        });
      } catch (error) {
        tmp.isVoicePlaying = true;
        currentVoicePlayingRef.current = undefined;
        updateMessageVoiceUIState(msgModel);
      }
    },
    [updateMessageVoiceUIState]
  );

  const onClickedItem = React.useCallback(
    (
      _id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      if (model.modelType === 'message') {
        const msgModel = model as MessageModel;
        if (msgModel.msg.body.type === 'voice') {
          startVoicePlay(msgModel);
        }
      }
    },
    [startVoicePlay]
  );

  const getStyle = () => {
    return undefined;
  };

  const scrollToEnd = React.useCallback(() => {
    if (isNeedScrollToEndRef.current === true) {
      timeoutTask(0, () => {
        listRef?.current?.scrollToEnd?.();
      });
    }
  }, [listRef]);

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
                id: msg.msgId.toString(),
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
            console.log('test:zuoyu:image:', msg);
            onAddData(
              {
                id: msg.msgId.toString(),
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
          } else if (value.type === 'voice') {
            const v = value as SendVoiceProps;
            const msg = ChatMessage.createVoiceMessage(
              convId,
              v.localPath,
              convType as number as ChatMessageChatType,
              {
                duration: v.duration,
                fileSize: v.fileSize,
                displayName: v.displayName ?? '',
              }
            );
            console.log('test:zuoyu:voice:', msg);
            onAddData(
              {
                id: msg.msgId.toString(),
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
          } else if (value.type === 'video') {
            const v = value as SendVideoProps;
            const msg = ChatMessage.createVideoMessage(
              convId,
              v.localPath,
              convType as number as ChatMessageChatType,
              {
                duration: v.duration ?? 0,
                fileSize: v.fileSize,
                displayName: v.displayName ?? '',
                thumbnailLocalPath: v.thumbLocalPath,
                width: v.videoHeight,
                height: v.videoHeight,
              }
            );
            console.log('test:zuoyu:video:', msg);
            onAddData(
              {
                id: msg.msgId.toString(),
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
          } else if (value.type === 'file') {
            const v = value as SendFileProps;
            const msg = ChatMessage.createFileMessage(
              convId,
              v.localPath,
              convType as number as ChatMessageChatType,
              {
                fileSize: v.fileSize,
                displayName: v.displayName ?? '',
              }
            );
            console.log('test:zuoyu:video:', msg);
            onAddData(
              {
                id: msg.msgId.toString(),
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
          } else if (value.type === 'card') {
            const msg = ChatMessage.createCustomMessage(
              convId,
              gCustomMessageCardEventType,
              convType as number as ChatMessageChatType,
              {
                params: {
                  userId: convId,
                  nickname: convId,
                  avatar:
                    'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
                },
              }
            );
            console.log('test:zuoyu:card:', msg);
            onAddData(
              {
                id: msg.msgId.toString(),
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
          isNeedScrollToEndRef.current = true;
          scrollToEnd();
        },
        removeMessage: (_msg: ChatMessage) => {},
        recallMessage: (_msg: ChatMessage) => {},
        updateMessage: (_updatedMsg: ChatMessage) => {},
        loadHistoryMessage: (
          _msgs: ChatMessage[],
          _pos: MessageAddPosition
        ) => {},
        onInputHeightChange: (height: number) => {
          if (height > 0) {
            listRef?.current?.scrollToEnd?.();
          }
        },
      };
    },
    [convId, convType, listRef, onAddData, scrollToEnd]
  );

  return {
    ...flatListProps,
    listType,
    listState,
    data,
    onRequestModalClose,
    menuRef,
    alertRef,
    onClickedItem,
  };
}
