import * as React from 'react';
import {
  ChatCustomMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageDirection,
  ChatMessageStatus,
  ChatMessageType,
  ChatTextMessageBody,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';

import {
  ChatServiceListener,
  gCustomMessageCardEventType,
  gCustomMessageRecallEventType,
  gMessageAttributeQuote,
  useChatContext,
  useChatListener,
} from '../../chat';
import type { MessageManagerListener } from '../../chat/messageManager.types';
import { g_not_existed_url } from '../../const';
import { useI18nContext } from '../../i18n';
import { Services } from '../../services';
import type { AlertRef } from '../../ui/Alert';
import { getCurTs, localUrlEscape, playUrl, timeoutTask } from '../../utils';
import type {
  BottomSheetNameMenuRef,
  InitMenuItemsType,
} from '../BottomSheetMenu';
import { useFlatList } from '../List';
import type { UseFlatListReturn } from '../types';
import type {
  MessageAddPosition,
  MessageListItemProps,
  MessageListProps,
  MessageListRef,
  MessageModel,
  SendCardProps,
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
  onLongPressItem?: (
    id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => void;
  inverted: boolean;
  maxListHeight: number;
  setMaxListHeight: React.Dispatch<React.SetStateAction<number>>;
  reachedThreshold: number;
} {
  const {
    convId,
    convType,
    testMode,
    onClickedItem: propsOnClicked,
    onLongPressItem: propsOnLongPress,
    onQuoteMessageForInput: propsOnQuoteMessageForInput,
    onEditMessageForInput: propsOnEditMessageForInput,
  } = props;
  const { tr } = useI18nContext();
  const flatListProps = useFlatList<MessageListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'normal',
    onInit: () => init(),
    // onLoadMore: () => onRequestHistoryMessage(),
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
  const im = useChatContext();
  const startMsgIdRef = React.useRef('');
  const [maxListHeight, setMaxListHeight] = React.useState<number>(0);
  // !!! https://github.com/facebook/react-native/issues/36529
  // !!! https://github.com/facebook/react-native/issues/14312
  // !!! only android, FlatList onEndReached no work android
  const [reachedThreshold] = React.useState(100);

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
            msg: ChatMessage.createCustomMessage(
              'xxx',
              gCustomMessageRecallEventType,
              0,
              {
                params: {
                  recall: JSON.stringify({
                    text: '${0} recalled a message.',
                    self: 'im.userId',
                    from: 'msg.from',
                    fromName: 'msg.from',
                  }),
                },
              }
            ),
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
  const inverted = React.useRef(true).current;

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
      const body = msgModel.msg.body as ChatVoiceMessageBody;
      const localPath = body.localPath;
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
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      if (model.modelType === 'message') {
        console.log('test:zuoyu:clicked:', model);
        const msgModel = model as MessageModel;
        if (msgModel.msg.body.type === ChatMessageType.VOICE) {
          startVoicePlay(msgModel);
        } else if (msgModel.msg.body.type === ChatMessageType.IMAGE) {
          propsOnClicked?.(id, model);
        } else if (msgModel.msg.body.type === ChatMessageType.VIDEO) {
          propsOnClicked?.(id, model);
        } else if (msgModel.msg.body.type === ChatMessageType.FILE) {
          propsOnClicked?.(id, model);
        }
      }
    },
    [propsOnClicked, startVoicePlay]
  );

  const onLongPressItem = React.useCallback(
    (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      propsOnLongPress?.(id, model);
      onShowLongPressMenu(id, model);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [propsOnLongPress]
  );

  const getStyle = () => {
    return undefined;
  };

  const scrollToEnd = React.useCallback(() => {
    if (isNeedScrollToEndRef.current === true) {
      timeoutTask(0, () => {
        listRef?.current?.scrollToIndex?.({ index: 0 });
      });
    }
  }, [listRef]);

  const onAddData = React.useCallback(
    (d: MessageListItemProps, pos: MessageAddPosition) => {
      if (pos === 'bottom') {
        dataRef.current = [d, ...dataRef.current];
      } else {
        dataRef.current = [...dataRef.current, d];
      }

      setData(dataRef.current);
    },
    [dataRef, setData]
  );

  const onAddMessageList = React.useCallback(
    async (msgs: ChatMessage[], position: MessageAddPosition) => {
      const list = msgs.reverse().map(async (msg) => {
        const getModel = async () => {
          let modelType = 'message';
          if (msg.body.type === ChatMessageType.CUSTOM) {
            const body = msg.body as ChatCustomMessageBody;
            if (body.event === gCustomMessageCardEventType) {
              modelType = 'message';
            } else {
              modelType = 'system';
            }
          }
          if (modelType === 'system') {
            return {
              userId: msg.from,
              modelType: 'system',
              msg: msg,
            } as SystemMessageModel;
          } else {
            const quote = msg.attributes?.[gMessageAttributeQuote];
            let quoteMsg: ChatMessage | undefined;
            if (quote) {
              quoteMsg = await im.getMessage({
                messageId: quote.msgID,
              });
            }
            return {
              userId: msg.from,
              modelType: 'message',
              layoutType: msg.from === im.userId ? 'right' : 'left',
              msg: msg,
              msgQuote: quoteMsg,
            } as MessageModel;
          }
        };
        return {
          id: msg.msgId.toString(),
          model: await getModel(),
          containerStyle: getStyle(),
        } as MessageListItemProps;
      });
      const l = await Promise.all(list);
      if (position === 'bottom') {
        dataRef.current = [...l, ...dataRef.current];
      } else {
        dataRef.current = [...dataRef.current, ...l];
      }
      setData([...dataRef.current]);
    },
    [dataRef, im, setData]
  );

  const onDelMessageToUI = React.useCallback(
    (msg: ChatMessage) => {
      const index = dataRef.current.findIndex((d) => {
        if (d.model.modelType === 'message') {
          const msgModel = d.model as MessageModel;
          if (msg.status === ChatMessageStatus.SUCCESS) {
            if (msgModel.msg.msgId === msg.msgId) {
              return true;
            }
          } else {
            if (msgModel.msg.localMsgId === msg.localMsgId) {
              return true;
            }
          }
        }
        return false;
      });
      if (index !== -1) {
        dataRef.current.splice(index, 1);
        setData([...dataRef.current]);
      }
    },
    [dataRef, setData]
  );

  const onDelMessage = React.useCallback(
    (msg: ChatMessage) => {
      im.removeMessage({
        message: msg,
        onResult: () => {
          onDelMessageToUI(msg);
        },
      });
    },
    [im, onDelMessageToUI]
  );

  const onShowLongPressMenu = (
    _id: string,
    model: SystemMessageModel | TimeMessageModel | MessageModel
  ) => {
    console.log('test:zuoyu:longpress:', model.modelType);
    if (model.modelType !== 'message') {
      return;
    }
    const initItems = [] as InitMenuItemsType[];
    const msgModel = model as MessageModel;
    if (model.modelType === 'message') {
      if (msgModel.msg.body.type === ChatMessageType.TXT) {
        initItems.push({
          name: tr('Copy Text Message'),
          isHigh: false,
          icon: 'doc_on_doc',
          onClicked: () => {
            menuRef.current?.startHide?.(() => {
              const body = msgModel.msg.body as ChatTextMessageBody;
              Services.cbs.setString(body.content);
              // todo: toast
            });
          },
        });
      }
      if (
        msgModel.msg.body.type === ChatMessageType.TXT ||
        msgModel.msg.body.type === ChatMessageType.VOICE ||
        msgModel.msg.body.type === ChatMessageType.IMAGE ||
        msgModel.msg.body.type === ChatMessageType.VIDEO ||
        msgModel.msg.body.type === ChatMessageType.FILE
      ) {
        if (msgModel.msg.status === ChatMessageStatus.SUCCESS) {
          initItems.push({
            name: tr('Quote Message'),
            isHigh: false,
            icon: 'arrowshape_left',
            onClicked: () => {
              menuRef.current?.startHide?.(() => {
                propsOnQuoteMessageForInput?.(model as MessageModel);
              });
            },
          });
        }
      }
      if (msgModel.msg.status === ChatMessageStatus.SUCCESS) {
        if (
          msgModel.msg.body.type === ChatMessageType.TXT &&
          msgModel.msg.from === im.userId
        ) {
          const textBody = msgModel.msg.body as ChatTextMessageBody;
          if (textBody.modifyCount === undefined || textBody.modifyCount <= 5) {
            initItems.push({
              name: tr('Edit Text Message'),
              isHigh: false,
              icon: 'img',
              onClicked: () => {
                menuRef.current?.startHide?.(() => {
                  propsOnEditMessageForInput?.(model as MessageModel);
                });
              },
            });
          }
        }
      }
      if (msgModel.msg.status === ChatMessageStatus.SUCCESS) {
        initItems.push({
          name: tr('Report Message'),
          isHigh: false,
          icon: 'envelope',
          onClicked: () => {
            menuRef.current?.startHide?.(() => {});
          },
        });
      }
      initItems.push({
        name: tr('Delete Message'),
        isHigh: false,
        icon: 'trash',
        onClicked: () => {
          menuRef.current?.startHide?.(() => {
            onDelMessage(msgModel.msg);
          });
        },
      });
      if (
        msgModel.msg.body.type === ChatMessageType.TXT ||
        msgModel.msg.body.type === ChatMessageType.VOICE ||
        msgModel.msg.body.type === ChatMessageType.IMAGE ||
        msgModel.msg.body.type === ChatMessageType.VIDEO ||
        msgModel.msg.body.type === ChatMessageType.FILE
      ) {
        // todo: max time limit
        if (
          msgModel.msg.status === ChatMessageStatus.SUCCESS &&
          msgModel.msg.from === im.userId
        ) {
          initItems.push({
            name: tr('Recall Message'),
            isHigh: false,
            icon: 'arrow_Uturn_anti_clockwise',
            onClicked: () => {
              menuRef.current?.startHide?.(() => {
                const msgModel = model as MessageModel;
                onRecallMessage(msgModel.msg, 'send');
              });
            },
          });
        }
      }
    }
    if (initItems.length === 0) {
      return;
    }
    menuRef.current?.startShowWithProps?.({
      initItems: initItems,
      onRequestModalClose: onRequestModalClose,
      layoutType: 'left',
      hasCancel: true,
    });
  };

  const onUpdateMessageToUI = React.useCallback(
    (msg: ChatMessage, fromType: 'send' | 'recv') => {
      const isExisted = dataRef.current.find((d) => {
        if (d.model.modelType === 'message') {
          const msgModel = d.model as MessageModel;
          if (fromType === 'send') {
            if (msgModel.msg.localMsgId === msg.localMsgId) {
              msgModel.msg = msg;
              d.model = { ...msgModel };
              return true;
            }
          } else {
            if (msgModel.msg.msgId === msg.msgId) {
              msgModel.msg = msg;
              d.model = { ...msgModel };
              return true;
            }
          }
        }
        return false;
      });
      if (isExisted) {
        setData([...dataRef.current]);
      }
    },
    [dataRef, setData]
  );

  const onEditMessage = React.useCallback(
    (msg: ChatMessage) => {
      im.editMessage({
        message: msg,
        onResult: () => {
          onUpdateMessageToUI(msg, 'recv');
        },
      });
    },
    [im, onUpdateMessageToUI]
  );

  const onAddMessageToUI = React.useCallback(
    (msg: ChatMessage) => {
      onAddData(
        {
          id: msg.msgId.toString(),
          model: {
            userId: msg.from,
            modelType: 'message',
            layoutType: msg.from === im.userId ? 'right' : 'left',
            msg: msg,
          },
          containerStyle: getStyle(),
        },
        'bottom'
      );
      scrollToEnd();
    },
    [im.userId, onAddData, scrollToEnd]
  );

  const createRecallMessageTip = React.useCallback(
    (msg: ChatMessage) => {
      const tip = ChatMessage.createCustomMessage(
        msg.conversationId,
        gCustomMessageRecallEventType,
        msg.chatType,
        {
          params: {
            recall: JSON.stringify({
              text: '${0} recalled a message.',
              self: im.userId,
              from: msg.from,
              fromName: msg.from,
            }),
          },
        }
      );
      // tip.localTime = msg.localTime;
      // tip.serverTime = msg.serverTime;
      return tip;
    },
    [im.userId]
  );

  const onRecallMessageToUI = React.useCallback(
    (newMsg: ChatMessage) => {
      // let isExisted = false;
      // for (const v of dataRef.current) {
      //   if (v.model.modelType === 'message') {
      //     const msgModel = v.model as MessageModel;
      //     if (newMsg.msgId === msgModel.msg.msgId) {
      //       v.model = { modelType: 'system', msg: newMsg } as MessageModel;
      //       v.onClicked = undefined;
      //       v.onLongPress = undefined;
      //       v.containerStyle = undefined;
      //       isExisted = true;
      //       break;
      //     }
      //   }
      // }
      // if (isExisted === true) {
      //   setData([...dataRef.current]);
      // }

      onAddData(
        {
          id: newMsg.msgId.toString(),
          model: {
            userId: newMsg.from,
            modelType: 'system',
            msg: newMsg,
          } as SystemMessageModel,
          containerStyle: getStyle(),
        },
        'bottom'
      );
    },
    [onAddData]
  );

  const onRecallMessage = React.useCallback(
    (msg: ChatMessage, fromType: 'send' | 'recv') => {
      const newMsg = createRecallMessageTip(msg);
      console.log('test:zuoyu:msgId:', newMsg.msgId, msg.msgId);
      if (fromType === 'send') {
        im.recallMessage({
          message: msg,
          onResult: (value) => {
            if (value.isOk === true) {
              onDelMessageToUI(msg);
              im.insertMessage({
                message: newMsg,
                onResult: () => {
                  onRecallMessageToUI(newMsg);
                },
              });
            } else {
              console.log('test:zuoyu:error:', value.error);
            }
          },
        });
      } else {
        onDelMessageToUI(msg);
        im.insertMessage({
          message: newMsg,
          onResult: () => {
            onRecallMessageToUI(newMsg);
          },
        });
      }
    },
    [createRecallMessageTip, im, onDelMessageToUI, onRecallMessageToUI]
  );

  const onSetMessageRead = React.useCallback(
    (msg: ChatMessage) => {
      if (
        msg.chatType === ChatMessageChatType.PeerChat &&
        msg.direction === ChatMessageDirection.RECEIVE &&
        msg.hasReadAck === true &&
        msg.hasRead === false
      ) {
        im.setMessageRead({
          convId,
          convType,
          msgId: msg.msgId,
        });
      }
    },
    [convId, convType, im]
  );

  React.useEffect(() => {
    console.log('test:zuoyu:useEffect');
    const listener = {
      onSendMessageChanged: (msg: ChatMessage) => {
        onUpdateMessageToUI(msg, 'send');
      },
      onRecvMessage: (msg: ChatMessage) => {
        if (msg.conversationId === convId) {
          onAddMessageToUI(msg);
          onSetMessageRead(msg);
        }
      },
      onRecvMessageStatusChanged: (msg: ChatMessage) => {
        onUpdateMessageToUI(msg, 'recv');
      },
      onRecvMessageContentChanged: (msg: ChatMessage, _byUserId: string) => {
        onUpdateMessageToUI(msg, 'recv');
      },
      onRecallMessage: (msg: ChatMessage, _byUserId: string) => {
        console.log('test:zuoyu:msg:', msg.msgId);
        if (msg.conversationId === convId) {
          onRecallMessage(msg, 'recv');
        }
      },
    } as MessageManagerListener;
    console.log('test:zuoyu:addlistener:22222', convId);
    im.messageManager.addListener(convId, listener);
    return () => {
      console.log('test:zuoyu:addlistener:33333', convId);
      im.messageManager.removeListener(convId);
    };
  }, [
    convId,
    im.messageManager,
    onAddMessageToUI,
    onRecallMessage,
    onRecallMessageToUI,
    onSetMessageRead,
    onUpdateMessageToUI,
  ]);

  const addSendMessageToUI = React.useCallback(
    (
      value:
        | SendFileProps
        | SendImageProps
        | SendTextProps
        | SendVideoProps
        | SendVoiceProps
        | SendTimeProps
        | SendSystemProps
        | SendCardProps,

      onFinished?: (msg: ChatMessage) => void
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
        onFinished?.(msg);
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
        onFinished?.(msg);
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
        onFinished?.(msg);
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
            width: v.videoWidth,
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
        onFinished?.(msg);
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
        onFinished?.(msg);
      } else if (value.type === 'card') {
        const card = value as SendCardProps;
        const msg = ChatMessage.createCustomMessage(
          convId,
          gCustomMessageCardEventType,
          convType as number as ChatMessageChatType,
          {
            params: {
              userId: card.userId,
              nickname: card.userName ?? card.userId,
              avatar: card.userAvatar ?? g_not_existed_url,
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
        onFinished?.(msg);
      } else if (value.type === 'quote') {
        // !!! only support text quote message.
        const quote = value as SendTextProps;
        if (quote.quote === undefined || quote.quote === null) {
          return;
        }
        const quoteMsg = quote.quote.msg;
        const msg = ChatMessage.createTextMessage(
          convId,
          quote.content,
          convType as number as ChatMessageChatType
        );
        msg.attributes = {
          [gMessageAttributeQuote]: {
            msgID: quoteMsg.msgId,
            msgPreview: 'rn',
            msgSender: quoteMsg.from,
            msgType: quoteMsg.body.type,
          },
        };
        console.log('test:zuoyu:quote:', msg);
        onAddData(
          {
            id: msg.msgId.toString(),
            model: {
              userId: msg.from,
              modelType: 'message',
              layoutType: 'right',
              msg: msg,
              msgQuote: quote.quote.msg,
            },
            containerStyle: getStyle(),
          },
          'bottom'
        );
        onFinished?.(msg);
      }
      scrollToEnd();
    },
    [convId, convType, onAddData, scrollToEnd]
  );

  const sendMessageToServer = React.useCallback(
    (msg: ChatMessage) => {
      im.messageManager.sendMessage(msg);
    },
    [im]
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
            | SendCardProps
        ) => {
          isNeedScrollToEndRef.current = true;
          console.log('test:zuoyu:addSendMessage', value);
          addSendMessageToUI(value, (msg) => {
            sendMessageToServer(msg);
          });
        },
        removeMessage: (msg: ChatMessage) => {
          onDelMessage(msg);
        },
        recallMessage: (msg: ChatMessage) => {
          onRecallMessage(msg, 'send');
        },
        updateMessage: (updatedMsg: ChatMessage, fromType: 'send' | 'recv') => {
          onUpdateMessageToUI(updatedMsg, fromType);
        },
        loadHistoryMessage: (msgs: ChatMessage[], pos: MessageAddPosition) => {
          if (pos === 'top') {
            if (msgs.length > 0) {
              if (startMsgIdRef.current === msgs[0]?.msgId) {
                return;
              }
              startMsgIdRef.current = msgs[0]!.msgId.toString();
            }
          }
          onAddMessageList(msgs, pos);
          if (pos === 'top') {
            isNeedScrollToEndRef.current = false;
          }
        },
        onInputHeightChange: (height: number) => {
          if (height > 0) {
            scrollToEnd();
          }
        },
        editMessageFinished: (model) => {
          onEditMessage(model.msg);
        },
      };
    },
    [
      addSendMessageToUI,
      onAddMessageList,
      onDelMessage,
      onEditMessage,
      onRecallMessage,
      onUpdateMessageToUI,
      scrollToEnd,
      sendMessageToServer,
    ]
  );

  const onRequestHistoryMessage = React.useCallback(() => {
    console.log('test:zuoyu:first:', startMsgIdRef.current);
    im.messageManager.loadHistoryMessage({
      convId,
      convType,
      startMsgId: startMsgIdRef.current,
      onResult: (msgs) => {
        console.log('test:zuoyu:first:result:', startMsgIdRef.current);
        if (msgs.length > 0) {
          const newStartMsgId = msgs[0]!.msgId.toString();
          console.log();
          if (newStartMsgId === startMsgIdRef.current) {
            return;
          }
          startMsgIdRef.current = msgs[0]!.msgId.toString();
          onAddMessageList(msgs, 'top');
        }
        isNeedScrollToEndRef.current = false;
      },
    });
  }, [convId, convType, im.messageManager, onAddMessageList]);

  React.useEffect(() => {
    onRequestHistoryMessage();
  }, [
    convId,
    convType,
    im.messageManager,
    onAddMessageList,
    onRequestHistoryMessage,
  ]);

  React.useEffect(() => {
    im.setConversationRead({ convId, convType });
  }, [convId, convType, im]);

  return {
    ...flatListProps,
    listType,
    listState,
    data,
    onRequestModalClose,
    menuRef,
    alertRef,
    onClickedItem,
    onLongPressItem,
    inverted,
    maxListHeight,
    setMaxListHeight,
    reachedThreshold,
    onMore: onRequestHistoryMessage,
  };
}
