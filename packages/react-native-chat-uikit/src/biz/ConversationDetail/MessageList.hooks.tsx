import * as React from 'react';
import {
  ChatCustomMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageDirection,
  ChatMessageStatus,
  ChatMessageType,
  ChatVoiceMessageBody,
} from 'react-native-chat-sdk';

import {
  gCustomMessageCardEventType,
  gCustomMessageRecallEventType,
  gMessageAttributeQuote,
  useChatContext,
} from '../../chat';
import type { MessageManagerListener } from '../../chat/messageManager.types';
import { g_not_existed_url } from '../../const';
import { useI18nContext } from '../../i18n';
import { Services } from '../../services';
import type { AlertRef } from '../../ui/Alert';
import { localUrlEscape, playUrl, timeoutTask } from '../../utils';
import type { BottomSheetNameMenuRef } from '../BottomSheetMenu';
import { gReportMessageList } from '../const';
import { useCloseMenu } from '../hooks/useCloseMenu';
import { useMessageLongPressActions } from '../hooks/useMessageLongPressActions';
import { useFlatList } from '../List';
import type {
  BottomSheetMessageReportRef,
  ReportItemModel,
} from '../MessageReport';
import type { UseFlatListReturn } from '../types';
import { MessageListItemMemo } from './MessageListItem';
import { getQuoteAttribute } from './MessageListItem.hooks';
import type {
  MessageAddPosition,
  MessageListItemComponentType,
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
  UseMessageListReturn,
} from './types';

export function useMessageList(
  props: MessageListProps,
  ref?: React.ForwardedRef<MessageListRef>
): UseFlatListReturn<MessageListItemProps> & UseMessageListReturn {
  const {
    convId,
    convType,
    testMode,
    onClickedItem: propsOnClicked,
    onLongPressItem: propsOnLongPress,
    onQuoteMessageForInput: propsOnQuoteMessageForInput,
    onEditMessageForInput: propsOnEditMessageForInput,
    reportMessageCustomList = gReportMessageList,
    onClickedItemAvatar: propsOnClickedItemAvatar,
    onClickedItemQuote: propsOnClickedItemQuote,
    ListItemRender: propsListItemRender,
  } = props;
  const { tr } = useI18nContext();
  const flatListProps = useFlatList<MessageListItemProps>({
    listState: testMode === 'only-ui' ? 'normal' : 'normal',
    // onInit: () => init(),
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
  const [reachedThreshold] = React.useState(0.5);
  const reportDataRef = React.useRef<ReportItemModel[]>(
    reportMessageCustomList.map((d, i) => {
      return {
        id: i.toString(),
        tag: d.key,
        title: tr(d.value),
        checked: false,
      };
    })
  );
  const menuRef = React.useRef<BottomSheetNameMenuRef>(null);
  const reportRef = React.useRef<BottomSheetMessageReportRef>(null);
  const alertRef = React.useRef<AlertRef>(null);
  const inverted = React.useRef(true).current;
  const currentReportMessageRef = React.useRef<MessageModel>();
  const { closeMenu } = useCloseMenu({ menuRef });
  const MessageListItemRef = React.useRef<MessageListItemComponentType>(
    propsListItemRender ?? MessageListItemMemo
  );

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
      onShowMessageLongPressActions(id, model);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [propsOnLongPress]
  );

  const onClickedItemAvatar = React.useCallback(
    (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      propsOnClickedItemAvatar?.(id, model);
    },
    [propsOnClickedItemAvatar]
  );

  const onClickedItemQuote = React.useCallback(
    (
      id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      propsOnClickedItemQuote?.(id, model);
    },
    [propsOnClickedItemQuote]
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

  const onAddMessageListToUI = React.useCallback(
    async (
      msgs: ChatMessage[],
      position: MessageAddPosition,
      onFinished?: (items: MessageListItemProps[]) => void
    ) => {
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
              quoteMsg: quoteMsg,
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
      onFinished?.(l as MessageListItemProps[]);
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

  const deleteMessageCallback = React.useCallback(
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

  const showReportMessageCallback = React.useCallback((model: MessageModel) => {
    currentReportMessageRef.current = model;
    reportRef.current?.startShow?.();
  }, []);

  const reportMessageCallback = React.useCallback(
    (result?: ReportItemModel) => {
      if (result) {
        const msg = currentReportMessageRef.current?.msg;
        if (msg) {
          im.reportMessage({
            messageId: msg.msgId,
            tag: result.tag,
            reason: tr(result.title),
            onResult: () => {
              currentReportMessageRef.current = undefined;
              reportRef.current?.startHide?.();
            },
          });
        }
      }
    },
    [im, tr]
  );

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

  const resendMessageCallback = React.useCallback(
    (msg: ChatMessage) => {
      if (msg.direction !== ChatMessageDirection.SEND) {
        return;
      }
      const tmp = { ...msg } as ChatMessage;
      tmp.status = ChatMessageStatus.CREATE;
      onUpdateMessageToUI(tmp, 'send');
      im.messageManager.resendMessage(tmp);
    },
    [im.messageManager, onUpdateMessageToUI]
  );

  const onClickedItemState = React.useCallback(
    (
      _id: string,
      model: SystemMessageModel | TimeMessageModel | MessageModel
    ) => {
      if (model.modelType !== 'message') {
        return;
      }
      const msgModel = model as MessageModel;
      if (msgModel.msg.status === ChatMessageStatus.FAIL) {
        resendMessageCallback(msgModel.msg);
      }
    },
    [resendMessageCallback]
  );

  const editMessageCallback = React.useCallback(
    (msg: ChatMessage) => {
      im.editMessage({
        message: msg,
        onResult: (result) => {
          if (result.isOk === true && result.value) {
            onUpdateMessageToUI(result.value, 'recv');
          }
        },
      });
    },
    [im, onUpdateMessageToUI]
  );

  const onAddMessageToUI = React.useCallback(
    (msg: ChatMessage, quoteMsg?: ChatMessage) => {
      onAddData(
        {
          id: msg.msgId.toString(),
          model: {
            userId: msg.from,
            modelType: 'message',
            layoutType: msg.from === im.userId ? 'right' : 'left',
            msg: msg,
            quoteMsg: quoteMsg,
          },
          containerStyle: getStyle(),
        },
        'bottom'
      );
    },
    [im.userId, onAddData]
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
              text: '_uikit_msg_tip_recall',
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

  const recallMessageCallback = React.useCallback(
    (msg: ChatMessage, fromType: 'send' | 'recv') => {
      const newMsg = createRecallMessageTip(msg);
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
              // todo: recall failed.
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

  const { onShowMessageLongPressActions } = useMessageLongPressActions({
    menuRef,
    alertRef,
    onQuoteMessageForInput: propsOnQuoteMessageForInput,
    onEditMessageForInput: propsOnEditMessageForInput,
    showReportMessage: showReportMessageCallback,
    deleteMessage: deleteMessageCallback,
    recallMessage: recallMessageCallback,
  });

  const sendRecvMessageReadAckCallback = React.useCallback(
    (msg: ChatMessage) => {
      if (
        msg.chatType === ChatMessageChatType.PeerChat &&
        msg.direction === ChatMessageDirection.RECEIVE &&
        msg.hasReadAck === false
      ) {
        im.messageManager.sendMessageReadAck({
          message: msg,
        });
      }
    },
    [im]
  );

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
      let msg: ChatMessage | undefined;
      if (value.type === 'text') {
        const v = value as SendTextProps;
        msg = ChatMessage.createTextMessage(
          convId,
          v.content,
          convType as number as ChatMessageChatType
        );
        const quoteMsg = value.quote?.msg;
        if (quoteMsg) {
          msg.attributes = {
            [gMessageAttributeQuote]: {
              msgID: quoteMsg.msgId,
              msgPreview: 'rn',
              msgSender: quoteMsg.from,
              msgType: quoteMsg.body.type,
            },
          };
        }
        onAddData(
          {
            id: msg.msgId.toString(),
            model: {
              userId: msg.from,
              modelType: 'message',
              layoutType: 'right',
              msg: msg,
              quoteMsg: quoteMsg,
            },
            containerStyle: getStyle(),
          },
          'bottom'
        );
      } else if (value.type === 'image') {
        const v = value as SendImageProps;
        msg = ChatMessage.createImageMessage(
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
        msg = ChatMessage.createVoiceMessage(
          convId,
          v.localPath,
          convType as number as ChatMessageChatType,
          {
            duration: Math.round((v.duration ?? 0) / 1000),
            fileSize: v.fileSize,
            displayName: v.displayName ?? '',
          }
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
      } else if (value.type === 'video') {
        const v = value as SendVideoProps;
        msg = ChatMessage.createVideoMessage(
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
        msg = ChatMessage.createFileMessage(
          convId,
          v.localPath,
          convType as number as ChatMessageChatType,
          {
            fileSize: v.fileSize,
            displayName: v.displayName ?? '',
          }
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
      } else if (value.type === 'card') {
        const card = value as SendCardProps;
        msg = ChatMessage.createCustomMessage(
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
      if (msg) {
        onFinished?.(msg);
        scrollToEnd();
      }
    },
    [convId, convType, onAddData, scrollToEnd]
  );

  const sendMessageToServer = React.useCallback(
    (msg: ChatMessage) => {
      im.messageManager.sendMessage(msg);
    },
    [im]
  );

  const init = React.useCallback(async () => {
    if (testMode === 'only-ui') {
      return;
    }
    if (isAutoLoad === true) {
      isNeedScrollToEndRef.current = false;
      currentVoicePlayingRef.current = undefined;
      startMsgIdRef.current = '';
      dataRef.current = [];
      setData([...dataRef.current]);
    }
  }, [dataRef, isAutoLoad, setData, testMode]);

  const onRequestHistoryMessage = React.useCallback(() => {
    im.messageManager.loadHistoryMessage({
      convId,
      convType,
      startMsgId: startMsgIdRef.current,
      onResult: (msgs) => {
        if (msgs.length > 0) {
          const newStartMsgId = msgs[0]!.msgId.toString();
          if (newStartMsgId === startMsgIdRef.current) {
            return;
          }
          startMsgIdRef.current = msgs[0]!.msgId.toString();
          onAddMessageListToUI(msgs, 'top', (list) => {
            list.map((v) => {
              if (v.model.modelType === 'message') {
                const msgModel = v.model as MessageModel;
                sendRecvMessageReadAckCallback(msgModel.msg);
              }
            });
          });
        }
        isNeedScrollToEndRef.current = false;
      },
    });
  }, [
    convId,
    convType,
    im.messageManager,
    onAddMessageListToUI,
    sendRecvMessageReadAckCallback,
  ]);

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
          addSendMessageToUI(value, (msg) => {
            sendMessageToServer(msg);
          });
        },
        removeMessage: (msg: ChatMessage) => {
          deleteMessageCallback(msg);
        },
        recallMessage: (msg: ChatMessage) => {
          recallMessageCallback(msg, 'send');
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
          onAddMessageListToUI(msgs, pos, (list) => {
            list.map((v) => {
              if (v.model.modelType === 'message') {
                const msgModel = v.model as MessageModel;
                sendRecvMessageReadAckCallback(msgModel.msg);
              }
            });
          });
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
          editMessageCallback(model.msg);
        },
      };
    },
    [
      addSendMessageToUI,
      onAddMessageListToUI,
      deleteMessageCallback,
      editMessageCallback,
      recallMessageCallback,
      sendRecvMessageReadAckCallback,
      onUpdateMessageToUI,
      scrollToEnd,
      sendMessageToServer,
    ]
  );

  React.useEffect(() => {
    const listener = {
      onSendMessageChanged: (msg: ChatMessage) => {
        onUpdateMessageToUI(msg, 'send');
      },
      onRecvMessage: async (msg: ChatMessage) => {
        if (msg.conversationId === convId) {
          const quoteAttributes = getQuoteAttribute(msg);
          if (quoteAttributes) {
            const quoteMsg = await im.getMessage({
              messageId: quoteAttributes.msgID,
            });
            onAddMessageToUI(msg, quoteMsg);
          } else {
            onAddMessageToUI(msg);
          }

          sendRecvMessageReadAckCallback(msg);
          scrollToEnd();
        }
      },
      onRecvMessageStatusChanged: (msg: ChatMessage) => {
        onUpdateMessageToUI(msg, 'recv');
      },
      onRecvMessageContentChanged: (msg: ChatMessage, _byUserId: string) => {
        onUpdateMessageToUI(msg, 'recv');
      },
      onRecallMessage: (msg: ChatMessage, _byUserId: string) => {
        if (msg.conversationId === convId) {
          recallMessageCallback(msg, 'recv');
        }
      },
    } as MessageManagerListener;
    im.messageManager.addListener(convId, listener);
    return () => {
      im.messageManager.removeListener(convId);
    };
  }, [
    convId,
    im,
    im.messageManager,
    onAddMessageToUI,
    recallMessageCallback,
    onRecallMessageToUI,
    sendRecvMessageReadAckCallback,
    onUpdateMessageToUI,
    scrollToEnd,
  ]);

  React.useEffect(() => {
    init();
    onRequestHistoryMessage();
  }, [
    convId,
    convType,
    im.messageManager,
    init,
    onAddMessageListToUI,
    onRequestHistoryMessage,
  ]);

  return {
    ...flatListProps,
    listType,
    listState,
    data,
    onRequestCloseMenu: closeMenu,
    menuRef,
    alertRef,
    onClickedItem,
    onLongPressItem,
    inverted,
    maxListHeight,
    setMaxListHeight,
    reachedThreshold,
    onMore: onRequestHistoryMessage,
    reportMessage: reportMessageCallback,
    showReportMessage: showReportMessageCallback,
    reportData: reportDataRef.current,
    reportRef,
    onClickedItemAvatar,
    onClickedItemQuote,
    onClickedItemState,
    ListItemRender: MessageListItemRef.current,
  };
}
