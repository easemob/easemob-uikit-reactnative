import * as React from 'react';
import {
  Animated,
  // Button,
  // Button as RNButton,
  DeviceEventEmitter,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  AudioEncoderAndroidType,
  type AudioSet,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
} from 'react-native-audio-recorder-player';
import {
  ChatConversationType,
  ChatDownloadStatus,
  ChatError,
  ChatFileMessageBody,
  ChatGroupMessageAck,
  ChatImageMessageBody,
  ChatMessage,
  ChatMessageStatus,
  ChatMessageStatusCallback,
  ChatMessageType,
  ChatSearchDirection,
  ChatVideoMessageBody,
} from 'react-native-chat-sdk';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moji from 'twemoji';

import { FACE_ASSETS } from '../../assets/faces';
import { FaceList } from '../components/FaceList';
import { LocalIcon } from '../components/Icon';
import {
  useActionMenu,
  useBottomSheet,
  useChatSdkChatContext,
  useChatSdkContext,
  useContentStateContext,
  useI18nContext,
  useThemeContext,
} from '../contexts';
import {
  MessageChatSdkEvent,
  type MessageChatSdkEventType,
} from '../nativeEvents';
import { Services } from '../services';
import { getScaleFactor } from '../styles/createScaleFactor';
import { getFileExtension } from '../utils/file';
import { timeoutTask } from '../utils/function';
import { seqId, timestamp, uuid } from '../utils/generator';
import {
  localUrl,
  localUrlEscape,
  playUrl,
  removeFileHeader,
} from '../utils/platform';
import type { BaseProps } from './Chat';
import {
  convertFromMessage,
  convertToMessage,
  onMessageContextMenu,
  openInputExtension,
  showVoice,
} from './ChatContent.hooks';
import { ChatInput } from './ChatInput';
// import { useAppChatSdkContext } from '../contexts/AppImSdkContext';
// import { sendEvent, sendEventProps } from '../events/sendEvent';
import MessageBubbleList, {
  type CustomMessageItemType,
  FileMessageItemType,
  type ImageMessageItemType,
  LocationMessageItemType,
  type MessageBubbleListProps,
  type MessageBubbleListRef,
  type MessageItemType,
  type TextMessageItemType,
  updateMessageStateType,
  VideoMessageItemType,
  type VoiceMessageItemType,
} from './MessageBubbleList';

export type ChatContentRef = {
  insertMessage: (params: { msg: ChatMessage }) => void;
  sendImageMessage: (
    params: {
      name: string;
      localPath: string;
      fileSize: number;
      imageType: string;
      width: number;
      height: number;
      onResult?: (params: any) => void;
    }[]
  ) => void;
  sendVoiceMessage: (params: {
    localPath: string;
    fileSize?: number;
    duration?: number;
    onResult?: (params: any) => void;
  }) => void;
  sendTextMessage: (params: {
    content: string;
    onResult?: (params: any) => void;
  }) => void;
  sendCustomMessage: (params: {
    data: CustomMessageItemType;
    onResult?: (params: any) => void;
  }) => void;
  sendFileMessage: (params: {
    localPath: string;
    fileSize?: number;
    displayName?: string;
    onResult?: (params: any) => void;
  }) => void;
  sendVideoMessage: (params: {
    localPath: string;
    fileSize?: number;
    displayName?: string;
    duration: number;
    thumbnailLocalPath?: string;
    width?: number;
    height?: number;
    onResult?: (params: any) => void;
  }) => void;
  sendLocationMessage: (params: {
    address: string;
    latitude: string;
    longitude: string;
    onResult?: (params: any) => void;
  }) => void;
  loadHistoryMessage: (
    msgs: ChatMessage[],
    onResult?: (params: any) => void
  ) => void;
  deleteLocalMessage: (params: {
    convId: string;
    convType: ChatConversationType;
    msgId: string;
    key: string;
    onResult?: (params: any) => void;
  }) => void;
  recallMessage: (params: {
    msgId: string;
    key: string;
    onResult?: (params: any) => void;
  }) => void;
  resendMessage: (params: {
    msgId: string;
    key: string;
    onResult?: (params: any) => void;
  }) => void;
  downloadAttachment: (params: {
    msg: ChatMessage;
    onResult?: (params?: any) => void;
  }) => void;
};

type ChatContentProps = BaseProps & {
  propsRef?: React.RefObject<ChatContentRef>;
  messageBubbleList?: {
    bubbleList: React.ForwardRefExoticComponent<
      MessageBubbleListProps & React.RefAttributes<MessageBubbleListRef>
    >;
    bubbleListProps: MessageBubbleListProps;
    bubbleListRef: React.RefObject<MessageBubbleListRef>;
  };

  onUpdateReadCount?: (unreadCount: number) => void;
  onClickMessageBubble?: (data: MessageItemType) => void;
  onLongPressMessageBubble?: (data: MessageItemType) => void;
  onClickInputMoreButton?: () => void;
  onPressInInputVoiceButton?: () => void;
  onPressOutInputVoiceButton?: () => void;
  onSendMessage?: (message: ChatMessage) => void;
  onSendMessageEnd?: (message: ChatMessage) => void;
  onVoiceRecordEnd?: (params: { localPath: string; duration: number }) => void;
  keyboardVerticalOffset?: number;
};
export const ChatContent = React.memo(
  ({
    propsRef,
    messageBubbleList,
    onFace,
    inputRef,
    // customMessageBubble,
    // onUpdateReadCount,
    onClickMessageBubble,
    onLongPressMessageBubble,
    onClickInputMoreButton,
    onPressInInputVoiceButton,
    onPressOutInputVoiceButton,
    onSendMessage,
    onSendMessageEnd,
    onVoiceRecordEnd,
    keyboardVerticalOffset,
  }: ChatContentProps) => {
    const sf = getScaleFactor();
    const TextInputRef = React.useRef<RNTextInput>(null);
    const msgListRef = React.useRef<MessageBubbleListRef>(null);
    const [, setContent] = React.useState('');
    const getContentRef = React.useRef<() => string>(() => '');
    const setContentRef = React.useRef(setContent);
    const [, setIsInput] = React.useState(false);
    const setIsInputRef = React.useRef(setIsInput);
    const setTestRef = React.useRef(() => {});
    const faceHeight = sf(300);
    const faceHeightRef = React.useRef(new Animated.Value(0)).current;
    const { client, getCurrentId } = useChatSdkContext();
    const { bottom } = useSafeAreaInsets();
    const [faceDelVisible, setFaceDelVisible] = React.useState(false);
    // const convertToMessage = convertToMessage;
    const { chatId, chatType } = useChatSdkChatContext().getChat();
    const theme = useThemeContext();
    const { openSheet } = useBottomSheet();
    const { openMenu } = useActionMenu();
    const state = useContentStateContext();
    const i18n = useI18nContext();

    const getMsgListRef = React.useCallback(() => {
      if (messageBubbleList) {
        return messageBubbleList.bubbleListRef;
      } else {
        return msgListRef;
      }
    }, [messageBubbleList]);

    const getInputRef = React.useCallback(() => {
      if (inputRef) {
        return inputRef;
      } else {
        return TextInputRef;
      }
    }, [inputRef]);

    const createFaceTableAnimated = React.useMemo(() => {
      return {
        showFace: () => {
          Animated.timing(faceHeightRef, {
            toValue: faceHeight,
            duration: 250,
            useNativeDriver: false,
          }).start();
          setFaceDelVisible(true);
        },
        hideFace: () => {
          Animated.timing(faceHeightRef, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
          }).start();
          setFaceDelVisible(false);
        },
      };
    }, [faceHeight, faceHeightRef]);

    const { showFace, hideFace } = createFaceTableAnimated;

    const onClickMessageBubbleInternal = React.useCallback(
      (item: MessageItemType) => {
        const eventParams = item;
        if (eventParams.type === ChatMessageType.VOICE) {
          const voice = eventParams as VoiceMessageItemType;
          if (voice.localPath) {
            Services.ms
              .playAudio({
                url: localUrlEscape(playUrl(voice.localPath)),
                onPlay({ isMuted, currentPosition, duration }) {
                  console.log(
                    'test:onPlay',
                    isMuted,
                    currentPosition,
                    duration
                  );
                },
              })
              .then(() => {
                console.log('test:playAudio:finish:');
              })
              .catch((error) => {
                console.warn('test:error:', error);
              });
          }
        } else if (eventParams.type === ChatMessageType.IMAGE) {
          // TODO: The image preview is displayed.
        }
      },
      []
    );

    const onLongPressMessageBubbleInternal = React.useCallback(
      (data: MessageItemType) => {
        onMessageContextMenu({
          openMenu,
          data,
          onClicked: (params: {
            data: MessageItemType;
            action:
              | 'delete_local_message'
              | 'recall_message'
              | 'resend_message';
          }) => {
            DeviceEventEmitter.emit('ui_chat', params);
          },
        });
      },
      [openMenu]
    );

    const standardizedData = React.useCallback(
      (
        item: Omit<MessageItemType, 'onPress' | 'onLongPress'>
      ): MessageItemType => {
        const r = {
          ...item,
          onLongPress: (data: MessageItemType) => {
            if (onLongPressMessageBubble) {
              onLongPressMessageBubble(data);
            } else {
              onLongPressMessageBubbleInternal(data);
              // sendEventFromChat({
              //   eventType: 'ActionMenuEvent',
              //   action: 'long_press_message_bubble',
              //   params: data,
              // });
            }
          },
          onPress: (data: MessageItemType) => {
            if (onClickMessageBubble) {
              onClickMessageBubble(data);
            } else {
              onClickMessageBubbleInternal(data);
            }
          },
        } as MessageItemType;
        return r;
      },
      [
        onClickMessageBubble,
        onClickMessageBubbleInternal,
        onLongPressMessageBubble,
        onLongPressMessageBubbleInternal,
      ]
    );

    const updateMessageState = React.useCallback(
      (params: {
        localMsgId: string;
        type: updateMessageStateType;
        items: MessageItemType[];
      }) => {
        getMsgListRef().current?.updateMessageState(params);
      },
      [getMsgListRef]
    );

    const downloadThumbAttachment = React.useCallback(
      (msg: ChatMessage) => {
        if (
          msg.body.type === ChatMessageType.IMAGE ||
          msg.body.type === ChatMessageType.VIDEO
        ) {
          client.chatManager.downloadThumbnail(msg, {
            onProgress: (localMsgId: string, progress: number): void => {
              console.log(
                'test:downloadThumbnail:onProgress:',
                localMsgId,
                progress
              );
            },
            onError: (localMsgId: string, error: ChatError): void => {
              console.log('test:downloadThumbnail:onError:', localMsgId, error);
            },
            onSuccess: (msg: ChatMessage): void => {
              updateMessageState({
                localMsgId: msg.localMsgId,
                type: 'one-all',
                items: [standardizedData(convertFromMessage({ msg }))],
              });
            },
          } as ChatMessageStatusCallback);
        }
      },
      [client.chatManager, standardizedData, updateMessageState]
    );

    const checkThumbAttachment = React.useCallback(
      (msg: ChatMessage) => {
        const isExisted = async (msg: ChatMessage) => {
          let ret = false;
          if (msg.body.type === ChatMessageType.IMAGE) {
            const body = msg.body as ChatImageMessageBody;
            ret = await Services.dcs.isExistedFile(body.thumbnailLocalPath);
          } else if (msg.body.type === ChatMessageType.VIDEO) {
            const body = msg.body as ChatVideoMessageBody;
            ret = await Services.dcs.isExistedFile(body.thumbnailLocalPath);
          }
          return ret;
        };
        isExisted(msg)
          .then((result) => {
            if (result === false) {
              downloadThumbAttachment(msg);
            }
          })
          .catch((error) => {
            console.warn('test:checkThumbAttachment:error:', error);
          });
      },
      [downloadThumbAttachment]
    );

    const downloadAttachment = React.useCallback(
      (msg: ChatMessage, onResult?: (params?: { error?: any }) => void) => {
        if (
          msg.body.type === ChatMessageType.IMAGE ||
          msg.body.type === ChatMessageType.VOICE ||
          msg.body.type === ChatMessageType.VIDEO ||
          msg.body.type === ChatMessageType.FILE
        ) {
          client.chatManager.downloadAttachment(msg, {
            onProgress: (localMsgId: string, progress: number): void => {
              console.log(
                'test:downloadAttachment:onProgress:',
                localMsgId,
                progress
              );
            },
            onError: (_: string, error: ChatError): void => {
              onResult?.({ error });
            },
            onSuccess: (_: ChatMessage): void => {
              onResult?.();
            },
          } as ChatMessageStatusCallback);
        }
      },
      [client.chatManager]
    );

    const checkAttachment = React.useCallback(
      (msg: ChatMessage, onResult?: (params?: { error?: any }) => void) => {
        const isExisted = async (msg: ChatMessage) => {
          let ret = false;
          if (
            msg.body.type === ChatMessageType.IMAGE ||
            msg.body.type === ChatMessageType.VOICE ||
            msg.body.type === ChatMessageType.FILE ||
            msg.body.type === ChatMessageType.VIDEO
          ) {
            const body = msg.body as ChatFileMessageBody;
            ret = await Services.dcs.isExistedFile(body.localPath);
          }
          return ret;
        };
        isExisted(msg)
          .then((result) => {
            if (result === false) {
              downloadAttachment(msg, onResult);
            }
          })
          .catch((error) => {
            onResult?.({ error });
          });
      },
      [downloadAttachment]
    );

    const sendToServer = React.useCallback(
      (msg: ChatMessage, onResult?: (params: any) => void) => {
        onSendMessage?.(msg);
        client.chatManager
          .sendMessage(msg, {
            onProgress: (localMsgId: string, progress: number): void => {
              console.log('test:sendToServer:onProgress', localMsgId, progress);
            },
            onError: (localMsgId: string, error: ChatError): void => {
              console.log('test:sendToServer:onError', localMsgId);
              updateMessageState({
                localMsgId,
                type: 'one-state',
                items: [
                  standardizedData(
                    convertFromMessage({ msg, state: 'failed' })
                  ),
                ],
              });
              // msg.status = ChatMessageStatus.FAIL; // !!! Error: You attempted to set the key `status` with the value `3` on an object that is meant to be immutable and has been frozen.
              onSendMessageEnd?.({
                ...msg,
                status: ChatMessageStatus.FAIL,
              } as ChatMessage);
              onResult?.({
                localMsgId,
                error,
              });
            },
            onSuccess: (message: ChatMessage): void => {
              console.log('test:sendToServer:onSuccess', message.localMsgId);
              updateMessageState({
                localMsgId: message.localMsgId,
                type: 'one-all',
                items: [
                  standardizedData(
                    convertFromMessage({ msg: message, state: 'sended' })
                  ),
                ],
              });
              onSendMessageEnd?.(message);
              // onSendResult(message);
              onResult?.(undefined);
            },
          } as ChatMessageStatusCallback)
          .then(() => {})
          .catch((error) => {
            console.warn('test:sendToServer:error:', error);
            onResult?.(error);
          });
      },
      [
        client.chatManager,
        onSendMessage,
        onSendMessageEnd,
        standardizedData,
        updateMessageState,
      ]
    );

    const sendTextMessage = React.useCallback(
      (text: string, onResult?: (params: any) => void) => {
        if (text.length === 0) {
          return;
        }
        getInputRef().current?.clear();
        setContentRef.current?.('');
        const item = {
          sender: chatId,
          timestamp: timestamp(),
          isSender: true,
          // key: seqId('ml').toString(),
          text: text,
          type: ChatMessageType.TXT,
          state: 'sending',
        } as TextMessageItemType;

        const msg = convertToMessage({ item, chatId, chatType });
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [{ ...standardizedData(convertFromMessage({ msg })), ...item }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg, onResult);
      },
      [
        chatId,
        chatType,
        getInputRef,
        getMsgListRef,
        sendToServer,
        standardizedData,
      ]
    );

    const insertMessage = React.useCallback(
      (params: { msg: ChatMessage }) => {
        const { msg } = params;
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [{ ...standardizedData(convertFromMessage({ msg })) }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });

        client.chatManager.insertMessage(msg).then().catch();
      },
      [client.chatManager, getMsgListRef, standardizedData]
    );

    const sendImageMessage = React.useCallback(
      async ({
        name,
        localPath,
        fileSize,
        width,
        height,
        onResult,
      }: {
        name: string;
        localPath: string;
        fileSize?: number;
        imageType?: string;
        width?: number;
        height?: number;
        onResult?: (params: any) => void;
      }) => {
        if (localPath.length === 0) {
          return;
        }
        const targetPath = localUrl(Services.dcs.getFileDir(chatId, uuid()));
        await Services.ms.saveFromLocal({
          localPath,
          targetPath: targetPath,
        });
        if (__DEV__) {
          const test_existed = await Services.dcs.isExistedFile(targetPath);
          console.log(
            'test:test_existed:',
            test_existed,
            'target:',
            targetPath,
            'org:',
            localPath
          );
        }

        const modifiedTargetPath = removeFileHeader(targetPath);
        const item = {
          // key: seqId('ml').toString(),
          displayName: name,
          sender: chatId,
          isSender: true,
          type: ChatMessageType.IMAGE,
          state: 'sending',
          localPath: modifiedTargetPath,
          fileSize: fileSize,
          width: width,
          height: height,
        } as ImageMessageItemType;

        const msg = convertToMessage({ item, chatId, chatType });
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [{ ...standardizedData(convertFromMessage({ msg })), ...item }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg, onResult);
      },
      [chatId, chatType, getMsgListRef, sendToServer, standardizedData]
    );

    const sendFileMessage = React.useCallback(
      async (params: {
        localPath: string;
        fileSize?: number;
        displayName?: string;
        onResult?: ((params: any) => void) | undefined;
      }) => {
        if (params.localPath.length === 0) {
          return;
        }
        // const localPathD = decodeURIComponent(params.localPath);
        // if (Platform.OS === 'android') {
        //   // const r = await Services.ps.hasMediaLibraryPermission();
        //   // if (r === false) {
        //   // await Services.ps.requestMediaLibraryPermission();
        //   // }

        //   try {
        //     const result = await RNFS.stat(localPathD);
        //     console.log('test:123:', result);
        //   } catch (error) {
        //     console.warn('test:234:', error);
        //   }

        //   return;
        // }
        if (__DEV__) {
          const test_existed = await Services.dcs.isExistedFile(
            params.localPath
          );
          console.log('test:test_existed:', test_existed);
        }

        let modifiedTargetPath = removeFileHeader(params.localPath);
        if (Platform.OS === 'ios') {
          modifiedTargetPath = decodeURIComponent(modifiedTargetPath);
        }
        const item = {
          // key: seqId('ml').toString(),
          sender: chatId,
          isSender: true,
          type: ChatMessageType.FILE,
          state: 'sending',
          localPath: modifiedTargetPath,
          fileSize: params.fileSize,
          displayName: params.displayName,
          fileStatus: ChatDownloadStatus.PENDING,
        } as FileMessageItemType;

        const msg = convertToMessage({ item, chatId, chatType });
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [{ ...standardizedData(convertFromMessage({ msg })), ...item }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg, params.onResult);
      },
      [chatId, chatType, getMsgListRef, sendToServer, standardizedData]
    );
    const sendVideoMessage = React.useCallback(
      async (params: {
        localPath: string;
        fileSize?: number;
        displayName?: string;
        duration: number;
        thumbnailLocalPath?: string;
        width?: number;
        height?: number;
        onResult?: ((params: any) => void) | undefined;
      }) => {
        if (params.localPath.length === 0) {
          return;
        }
        if (__DEV__) {
          const test_existed = await Services.dcs.isExistedFile(
            params.localPath
          );
          console.log('test:test_existed:', test_existed);
        }

        // const modifiedTargetPath = removeFileHeader(params.localPath);
        const modifiedTargetPath = params.localPath;
        const item = {
          // key: seqId('ml').toString(),
          sender: chatId,
          isSender: true,
          type: ChatMessageType.VIDEO,
          state: 'sending',
          localPath: modifiedTargetPath,
          duration: params.duration,
          fileSize: params.fileSize,
          displayName: params.displayName,
          thumbnailLocalPath: params.thumbnailLocalPath,
          width: params.width,
          height: params.height,
          fileStatus: ChatDownloadStatus.PENDING,
        } as VideoMessageItemType;

        const msg = convertToMessage({ item, chatId, chatType });
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [{ ...standardizedData(convertFromMessage({ msg })), ...item }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg, params.onResult);
      },
      [chatId, chatType, getMsgListRef, sendToServer, standardizedData]
    );
    const sendLocationMessage = React.useCallback(
      (params: {
        address: string;
        latitude: string;
        longitude: string;
        onResult?: ((params: any) => void) | undefined;
      }) => {
        const item = {
          sender: chatId,
          timestamp: timestamp(),
          isSender: true,
          // key: seqId('ml').toString(),
          type: ChatMessageType.LOCATION,
          state: 'sending',
          address: params.address,
          latitude: params.latitude,
          longitude: params.longitude,
        } as LocationMessageItemType;

        const msg = convertToMessage({ item, chatId, chatType });
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [{ ...standardizedData(convertFromMessage({ msg })), ...item }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg, params.onResult);
      },
      [chatId, chatType, getMsgListRef, sendToServer, standardizedData]
    );

    const sendCustomMessage = React.useCallback(
      ({
        data,
        onResult,
      }: {
        data: CustomMessageItemType;
        onResult?: (params: any) => void;
      }) => {
        const msg = convertToMessage({ item: data, chatId, chatType });
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [
            {
              ...standardizedData(convertFromMessage({ msg })),
              state: 'sending',
            },
          ],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg, onResult);
      },
      [chatId, chatType, getMsgListRef, sendToServer, standardizedData]
    );

    const sendVoiceMessage = React.useCallback(
      async ({
        localPath,
        duration,
      }: {
        localPath: string;
        fileSize?: number;
        duration?: number;
      }) => {
        if (localPath.length === 0) {
          return;
        }
        if (__DEV__) {
          const test_existed = await Services.dcs.isExistedFile(localPath);
          console.log('test:test_existed:', test_existed);
        }

        const modifiedTargetPath = removeFileHeader(localPath);
        const item = {
          sender: chatId,
          isSender: true,
          type: ChatMessageType.VOICE,
          state: 'sending',
          localPath: modifiedTargetPath,
          duration: duration,
        } as VoiceMessageItemType;

        const msg = convertToMessage({ item, chatId, chatType });
        if (msg === undefined) {
          throw new Error('This is impossible.');
        }

        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: [{ ...standardizedData(convertFromMessage({ msg })), ...item }],
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
        sendToServer(msg);
      },
      [chatId, chatType, getMsgListRef, sendToServer, standardizedData]
    );

    const loadHistoryMessage = React.useCallback(
      (msgs: ChatMessage[], onResult?: (params: any) => void) => {
        const items = [] as MessageItemType[];
        for (const msg of msgs) {
          const item = standardizedData(convertFromMessage({ msg }));
          items.push(item);
          if (
            client.options?.isAutoDownload === false ||
            msg.from === getCurrentId()
          ) {
            checkThumbAttachment(msg);
          }
        }
        getMsgListRef().current?.addMessage({
          direction: 'before',
          msgs: items,
        });
        onResult?.(undefined);
      },
      [
        checkThumbAttachment,
        client.options?.isAutoDownload,
        getCurrentId,
        getMsgListRef,
        standardizedData,
      ]
    );

    const requestHistoryMessage = React.useCallback(
      (earliestId?: string) => {
        client.chatManager
          .getMessages(
            chatId,
            chatType as number as ChatConversationType,
            earliestId ?? '',
            ChatSearchDirection.UP,
            20
          )
          .then((result) => {
            if (result) {
              loadHistoryMessage(result);
            }
          })
          .catch((error) => {
            console.warn('test:error:', error);
          });
      },
      [chatId, chatType, client.chatManager, loadHistoryMessage]
    );

    const deleteLocalMessage = React.useCallback(
      (params: {
        convId: string;
        convType: ChatConversationType;
        msgId: string;
        key: string;
        onResult?: ((params: any) => void) | undefined;
      }) => {
        const { convId, convType, msgId, key } = params;
        client.chatManager
          .deleteMessage(convId, convType, msgId)
          .then(() => {
            getMsgListRef().current?.delMessage({ localMsgId: key, msgId });
            params.onResult?.(undefined);
          })
          .catch((error) => {
            params.onResult?.({ error });
          });
      },
      [client.chatManager, getMsgListRef]
    );

    const recallMessage = React.useCallback(
      (params: {
        msgId: string;
        key: string;
        onResult?: ((params: any) => void) | undefined;
      }): void => {
        const { msgId } = params;
        client.chatManager
          .getMessage(msgId)
          .then((msg) => {
            if (msg) {
              client.chatManager
                .recallMessage(msgId)
                .then(() => {
                  getMsgListRef().current?.delMessage({
                    localMsgId: params.key,
                    msgId,
                  });
                  params.onResult?.({ message: msg });
                })
                .catch((error) => {
                  params.onResult?.({ error });
                });
            }
          })
          .catch((error) => {
            params.onResult?.({ error });
          });
      },
      [client.chatManager, getMsgListRef]
    );
    const resendMessage = React.useCallback(
      (params: {
        msgId: string;
        key: string;
        onResult?: (params: any) => void;
      }): void => {
        const { msgId, key, onResult } = params;
        client.chatManager
          .getMessage(msgId)
          .then((msg) => {
            if (msg && msg?.status !== ChatMessageStatus.SUCCESS) {
              getMsgListRef().current?.resendMessage(key);
              client.chatManager
                .resendMessage(msg, {
                  onError(_: string, error: ChatError) {
                    onResult?.({ error });
                  },
                  onSuccess(msg: ChatMessage) {
                    updateMessageState({
                      localMsgId: msg.localMsgId,
                      type: 'one-all',
                      items: [standardizedData(convertFromMessage({ msg }))],
                    });
                    onResult?.({ msg });
                  },
                } as ChatMessageStatusCallback)
                .then()
                .catch((error) => {
                  onResult?.({ error });
                });
            }
          })
          .catch((error) => {
            onResult?.({ error });
          });
      },
      [client.chatManager, getMsgListRef, standardizedData, updateMessageState]
    );

    const loadMessage = React.useCallback(
      (msgs: ChatMessage[]) => {
        const items = [] as MessageItemType[];
        for (const msg of msgs) {
          const item = standardizedData(convertFromMessage({ msg }));
          items.push(item);
          if (
            client.options?.isAutoDownload === false ||
            msg.from === getCurrentId()
          ) {
            checkThumbAttachment(msg);
          }
        }
        getMsgListRef().current?.addMessage({
          direction: 'after',
          msgs: items,
        });
        timeoutTask(() => {
          getMsgListRef().current?.scrollToEnd();
        });
      },
      [
        checkThumbAttachment,
        client.options?.isAutoDownload,
        getCurrentId,
        getMsgListRef,
        standardizedData,
      ]
    );

    React.useCallback(() => {
      const sub = DeviceEventEmitter.addListener('ui_chat', (event) => {
        const { data, action } = event;
        if (action === 'delete_local_message') {
          deleteLocalMessage({
            convId: chatId,
            convType: chatType as number,
            msgId: data.msgId,
            key: data.key,
          });
        } else if (action === 'recall_message') {
          recallMessage({ msgId: data.msgId, key: data.key });
        } else if (action === 'resend_message') {
          resendMessage({ msgId: data.msgId, key: data.key });
        }
      });
      return () => {
        sub.remove();
      };
    }, [chatId, chatType, deleteLocalMessage, recallMessage, resendMessage]);

    const _onFace = (value?: 'face' | 'key') => {
      if (value === 'key') {
        showFace();
      } else if (value === 'face') {
        hideFace();
      } else {
        hideFace();
      }
      onFace?.(value);
    };

    // const createConversationIfNotExisted = React.useCallback(() => {
    //   sendEventFromChat({
    //     eventType: 'DataEvent',
    //     action: 'exec_create_conversation',
    //     params: {
    //       convId: chatId,
    //       convType: chatType as number as ChatConversationType,
    //     },
    //   });
    // }, [chatId, chatType]);

    // const updateAllUnreadCount = React.useCallback(() => {
    //   client.chatManager
    //     .getUnreadCount()
    //     .then((result) => {
    //       if (result !== undefined) {
    //         onUpdateReadCount?.(result);
    //       }
    //     })
    //     .catch((error) => {
    //       console.warn('test:error:', error);
    //     });
    // }, [client.chatManager, onUpdateReadCount]);

    // const clearRead = React.useCallback(() => {
    //   client.chatManager
    //     .markAllMessagesAsRead(
    //       chatId,
    //       chatType as number as ChatConversationType
    //     )
    //     .then(() => {
    //       sendEventFromChat({
    //         eventType: 'DataEvent',
    //         action: 'update_conversation_read_state',
    //         params: {
    //           convId: chatId,
    //           convType: chatType as number as ChatConversationType,
    //         },
    //       });

    //       updateAllUnreadCount();
    //     })
    //     .catch((error) => {
    //       console.warn('test:error', error);
    //     });
    // }, [chatId, chatType, client.chatManager, updateAllUnreadCount]);

    const onFaceInternal = React.useCallback((face: string) => {
      const content = getContentRef.current();
      const mj = moji.convert.fromCodePoint(face);
      const s = content + mj;
      setContentRef.current(s);
      setIsInputRef.current(true);
    }, []);

    const convertFace = React.useMemo(() => {
      return FACE_ASSETS.map((face) => {
        return moji.convert.fromCodePoint(face);
      });
    }, []);

    const onFaceRemove = React.useCallback(() => {
      const content = getContentRef.current();
      if (content.length >= 2) {
        const last = content.substring(content.length - 2);
        if (convertFace.includes(last)) {
          const s = content.substring(0, content.length - 2);
          setContentRef.current(s);
          setIsInputRef.current(true);
        }
      }
    }, [convertFace]);

    React.useEffect(() => {
      const subscription1 = Keyboard.addListener('keyboardWillHide', (_) => {
        setIsInputRef.current(false);
      });
      const subscription5 = Keyboard.addListener('keyboardDidHide', (_) => {
        setIsInputRef.current(false);
      });
      const subscription2 = Keyboard.addListener('keyboardWillShow', (_) => {
        setIsInputRef.current(true);
      });
      const subscription4 = Keyboard.addListener('keyboardDidShow', (_) => {
        setIsInputRef.current(true);
      });
      const subscription3 = DeviceEventEmitter.addListener('onFace', (face) => {
        const content = getContentRef.current();
        const s = content + moji.convert.fromCodePoint(face);
        setContentRef.current(s);
        setIsInputRef.current(true);
      });
      return () => {
        subscription1.remove();
        subscription2.remove();
        subscription3.remove();
        subscription4.remove();
        subscription5.remove();
      };
    }, []);

    if (propsRef?.current) {
      propsRef.current.insertMessage = (params: any) => {
        insertMessage(params);
      };
      propsRef.current.sendImageMessage = (params: any) => {
        const eventParams = params;
        for (const item of eventParams) {
          sendImageMessage(item)
            .then(() => {
              item.onResult?.(undefined);
            })
            .catch((error) => {
              console.warn('test:sendImageMessage:error', error);
              item.onResult?.(error);
            });
        }
      };
      propsRef.current.sendVoiceMessage = (params) => {
        sendVoiceMessage({
          localPath: params.localPath,
          duration: params.duration,
        })
          .then(() => {
            params.onResult?.(undefined);
          })
          .catch((error) => {
            console.warn('test:sendVoiceMessage:error', error);
            params.onResult?.(error);
          });
      };
      propsRef.current.sendTextMessage = (params) => {
        sendTextMessage(params.content, params.onResult);
      };
      propsRef.current.sendCustomMessage = (params) => {
        sendCustomMessage(params);
      };
      propsRef.current.sendFileMessage = (params) => {
        sendFileMessage(params)
          .then(() => {
            params.onResult?.(undefined);
          })
          .catch((error) => {
            console.warn('test:sendFileMessage:error', error);
            params.onResult?.(error);
          });
      };
      propsRef.current.sendVideoMessage = (params) => {
        sendVideoMessage(params)
          .then(() => {
            params.onResult?.(undefined);
          })
          .catch((error) => {
            console.warn('test:sendVideoMessage:error', error);
            params.onResult?.(error);
          });
      };
      propsRef.current.sendLocationMessage = (params) => {
        sendLocationMessage(params);
      };
      propsRef.current.loadHistoryMessage = (params) => {
        loadHistoryMessage(params);
      };
      propsRef.current.deleteLocalMessage = (params) => {
        deleteLocalMessage(params);
      };
      propsRef.current.recallMessage = (params) => {
        recallMessage(params);
      };
      propsRef.current.resendMessage = (params) => {
        resendMessage(params);
      };
      propsRef.current.downloadAttachment = (params) => {
        checkAttachment(params.msg, params.onResult);
      };
    }

    const addListeners = React.useCallback(() => {
      const sub2 = DeviceEventEmitter.addListener(
        MessageChatSdkEvent,
        (event) => {
          const eventType = event.type as MessageChatSdkEventType;

          switch (eventType) {
            case 'onMessagesReceived':
              {
                const eventParams = event.params as { messages: ChatMessage[] };
                /// todo: !!! 10000 message count ???
                const messages = eventParams.messages;
                const r = [] as ChatMessage[];
                for (const msg of messages) {
                  if (msg.conversationId === chatId) {
                    r.push(msg);
                  }
                }
                if (r.length > 0) loadMessage(r);
              }
              break;
            // case 'onMessagesRecalled': {
            //   const messages = eventParams.messages;
            //   for (const msg of messages) {
            //     if (msg.conversationId === chatId) {
            //       console.log('test:onMessagesRecalled:', msg.msgId);
            //       client.chatManager
            //         .getMessage(msg.msgId)
            //         .then((value) => {
            //           console.log('test:onMessagesRecalled:getMessage:', value);
            //         })
            //         .catch();
            //       // getMsgListRef().current?.recallMessage(msg);
            //     }
            //   }

            //   break;
            // }
            case 'onConversationRead':
              updateMessageState({
                localMsgId: '',
                type: 'all-state',
                items: [
                  {
                    state: 'read',
                  } as MessageItemType,
                ],
              });
              break;
            case 'onMessagesRead':
              {
                const eventParams = event.params as { messages: ChatMessage[] };
                for (const msg of eventParams.messages) {
                  updateMessageState({
                    localMsgId: msg.localMsgId,
                    type: 'one-state',
                    items: [
                      {
                        key: msg.localMsgId,
                        state: 'read',
                      } as MessageItemType,
                    ],
                  });
                }
              }
              break;
            case 'onGroupMessageRead':
              {
                const eventParams = event.params as {
                  messagesAcks: ChatGroupMessageAck[];
                };
                for (const ack of eventParams.messagesAcks) {
                  updateMessageState({
                    localMsgId: ack.msg_id,
                    type: 'one-state',
                    items: [
                      {
                        msgId: ack.msg_id,
                        state: 'read',
                      } as MessageItemType,
                    ],
                  });
                }
              }
              break;
            case 'onMessagesDelivered':
              {
                const eventParams = event.params as { messages: ChatMessage[] };
                for (const msg of eventParams.messages) {
                  updateMessageState({
                    localMsgId: msg.localMsgId,
                    type: 'one-state',
                    items: [
                      {
                        key: msg.localMsgId,
                        state: 'arrived',
                      } as MessageItemType,
                    ],
                  });
                }
              }
              break;
            default:
              break;
          }
        }
      );

      return () => {
        sub2.remove();
      };
    }, [chatId, loadMessage, updateMessageState]);

    const initDirs = React.useCallback((convIds: string[]) => {
      for (const convId of convIds) {
        Services.dcs
          .isExistedConversationDir(convId)
          .then((result) => {
            if (result === false) {
              Services.dcs
                .createConversationDir(convId)
                .then(() => {})
                .catch((error) => {
                  console.warn('test:create:dir:error:', error);
                });
            }
          })
          .catch((error) => {
            console.warn('test:isExisted:dir:error:', error);
          });
      }
    }, []);

    const initList = React.useCallback(() => {
      client.chatManager
        .getMessages(
          chatId,
          chatType as number as ChatConversationType,
          '',
          ChatSearchDirection.UP,
          2
        )
        .then((result) => {
          if (result) {
            loadMessage(result);
          }
        })
        .catch((error) => {
          console.warn('test:error:', error);
        });
    }, [chatId, chatType, client.chatManager, loadMessage]);

    React.useEffect(() => {
      const load = () => {
        const unsubscribe = addListeners();
        initList();
        initDirs([chatId]);
        // createConversationIfNotExisted();
        // clearRead();
        return {
          unsubscribe: unsubscribe,
        };
      };
      const unload = (params: { unsubscribe: () => void }) => {
        params.unsubscribe();
      };

      const res = load();
      return () => unload(res);
    }, [addListeners, initList, initDirs, chatId]);

    const onRequestHistoryMessage = React.useCallback(
      (params: { earliestId: string }) => {
        if (messageBubbleList?.bubbleListProps.onRequestHistoryMessage) {
          messageBubbleList?.bubbleListProps.onRequestHistoryMessage({
            earliestId: params.earliestId,
          });
        } else {
          requestHistoryMessage(params.earliestId);
        }
      },
      [messageBubbleList?.bubbleListProps, requestHistoryMessage]
    );

    const onVoiceRecordEndInternal = React.useCallback(
      (params: { localPath: string; duration: number }) => {
        if (onVoiceRecordEnd) {
          onVoiceRecordEnd(params);
        } else {
          sendVoiceMessage({
            localPath: params.localPath,
            duration: params.duration,
          })
            .then()
            .catch((error) => {
              console.warn('test:sendVoiceMessage:error', error);
            });
        }
      },
      [onVoiceRecordEnd, sendVoiceMessage]
    );

    const onClickInputMoreButtonInternal = () => {
      if (onClickInputMoreButton) {
        onClickInputMoreButton();
      } else {
        openInputExtension({
          theme,
          openSheet,
          onClicked: (
            action:
              | 'chat_open_camera'
              | 'chat_open_media_library'
              | 'chat_open_document'
          ) => {
            if (action === 'chat_open_camera') {
              Services.ms
                .openCamera({})
                .then((result) => {
                  console.log('openCamera:', Platform.OS, result);
                  sendImageMessage({
                    name: result?.name ?? '',
                    localPath: result?.uri ?? '',
                    fileSize: result?.size ?? 0,
                    imageType: result?.type ?? '',
                    width: result?.width ?? 0,
                    height: result?.height ?? 0,
                    onResult: (r) => {
                      console.log('openCamera:result:', r);
                    },
                  });
                })
                .catch((error) => {
                  console.warn('error:', error);
                });
            } else if (action === 'chat_open_document') {
              Services.ms
                .openDocument({})
                .then((result) => {
                  console.log('openDocument:', Platform.OS, result);
                  sendFileMessage({
                    localPath: result?.uri ?? '',
                    fileSize: result?.size ?? 0,
                    displayName: result?.name,
                    onResult: (result) => {
                      console.log('openDocument:result', result);
                    },
                  });
                })
                .catch((error) => {
                  console.warn('error:', error);
                });
            } else if (action === 'chat_open_media_library') {
              Services.ms
                .openMediaLibrary({ selectionLimit: 1, mediaType: 'all' })
                .then((result) => {
                  console.log('openMediaLibrary:', Platform.OS, result);
                  if (result === undefined || result.length === 0) {
                    return;
                  }
                  console.log(
                    'openMediaLibrary:',
                    Platform.OS,
                    result[0]?.type
                  );
                  const type = result[0]?.type;
                  if (type?.includes('video')) {
                    sendVideoMessage({
                      localPath: result[0]?.uri ?? '',
                      fileSize: result[0]?.size ?? 0,
                      displayName: result[0]?.name ?? '',
                      duration: 0,
                      width: result[0]?.width ?? 0,
                      height: result[0]?.height ?? 0,
                      onResult: (result) => {
                        console.log('openMediaLibrary:result:', result);
                      },
                    });
                  } else {
                    const s = result.map((value) => {
                      return {
                        name: value?.name ?? '',
                        localPath: value?.uri ?? '',
                        fileSize: value?.size ?? 0,
                        imageType: value?.type ?? '',
                        width: value?.width ?? 0,
                        height: value?.height ?? 0,
                        onResult: (r: any) => {
                          console.log('openMediaLibrary:result:', r);
                        },
                      };
                    });
                    sendImageMessage(s[0]!);
                  }
                })
                .catch((error) => {
                  console.warn('error:', error);
                });
            }
          },
        });
      }
    };

    const onPressInInputVoiceButtonInternal = () => {
      if (onPressInInputVoiceButton) {
        onPressInInputVoiceButton();
      } else {
        showVoice({ state, theme, i18n });
        // !!! The simulator will crash.
        Services.ms
          .startRecordAudio({
            audio: {
              AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
              AudioSourceAndroid: AudioSourceAndroidType.MIC,
              AVModeIOS: AVModeIOSOption.measurement,
              AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
              AVNumberOfChannelsKeyIOS: 2,
              AVFormatIDKeyIOS: AVEncodingOption.aac,
            } as AudioSet,
            onPosition: (pos) => {
              console.log('test:startRecordAudio:pos:', pos);
            },
            onFailed: (error) => {
              console.warn('test:startRecordAudio:onFailed:', error);
            },
            onFinished: ({ result, path, error }) => {
              console.log(
                'test:startRecordAudio:onFinished:',
                result,
                path,
                error
              );
            },
          })
          .then((result) => {
            console.log('test:startRecordAudio:result:', result);
          })
          .catch((error) => {
            console.warn('test:startRecordAudio:error:', error);
          });
      }
    };

    const onPressOutInputVoiceButtonInternal = () => {
      if (onPressOutInputVoiceButton) {
        onPressOutInputVoiceButton();
      } else {
        state.hideState();
        let localPath = localUrl(Services.dcs.getFileDir(chatId, uuid()));
        Services.ms
          .stopRecordAudio()
          .then((result?: { pos: number; path: string }) => {
            if (result?.path) {
              const extension = getFileExtension(result.path);
              console.log('test:extension:', extension);
              localPath = localPath + extension;
              Services.ms
                .saveFromLocal({
                  targetPath: localPath,
                  localPath: result.path,
                })
                .then(() => {
                  if (onVoiceRecordEnd) {
                    onVoiceRecordEnd({
                      localPath,
                      duration: result.pos / 1000,
                    });
                  } else {
                    onVoiceRecordEndInternal({
                      localPath,
                      duration: result.pos / 1000,
                    });
                  }
                })
                .catch((error) => {
                  console.warn('test:startRecordAudio:save:error', error);
                });
            }
          })
          .catch((error) => {
            console.warn('test:stopRecordAudio:error:', error);
          });
      }
    };

    // There are problems with react-navigation native stack and keyboard being used together.
    const chatInputHeight = 60;
    const keyboardVerticalOffsetInternal = sf(
      Platform.select({ ios: chatInputHeight + bottom, android: 0 })!
    );

    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            _onFace('face');
            const ref = getInputRef()?.current as any;
            ref?.onFace?.('key');
            Keyboard.dismiss();
          }}
        >
          <View
            style={{
              flexGrow: 1,
            }}
          >
            <ChatMessageBubbleList
              messageBubbleList={messageBubbleList}
              _onFace={_onFace}
              onRequestHistoryMessage={onRequestHistoryMessage}
              msgListRef={msgListRef}
            />
          </View>
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          pointerEvents="box-none"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={
            keyboardVerticalOffset ?? keyboardVerticalOffsetInternal
          }
        >
          <ChatInput
            inputRef={inputRef ? inputRef : TextInputRef}
            onFace={_onFace}
            onSendTextMessage={({ content }) => {
              const test = true;
              if (test) sendTextMessage(content);
              else
                sendCustomMessage({
                  data: {
                    sender: chatId,
                    timestamp: timestamp(),
                    isSender: true,
                    key: seqId('ml').toString(),
                    type: ChatMessageType.CUSTOM,
                    state: 'sending',
                    SubComponentProps: {
                      data: content,
                      eventType: 'test',
                    },
                  } as CustomMessageItemType,
                });
              setTestRef.current();
            }}
            onInit={({ setIsInput, exeTest, getContent, setContent }) => {
              setIsInputRef.current = setIsInput;
              setTestRef.current = exeTest;
              setContentRef.current = setContent;
              getContentRef.current = getContent;
            }}
            onVoiceRecordEnd={onVoiceRecordEndInternal}
            onClickInputMoreButton={onClickInputMoreButtonInternal}
            onPressInInputVoiceButton={onPressInInputVoiceButtonInternal}
            onPressOutInputVoiceButton={onPressOutInputVoiceButtonInternal}
            isFaceVisible={faceDelVisible}
          />

          <FaceList height={faceHeightRef} onFace={onFaceInternal} />
          <View
            style={{
              position: 'absolute',
              display: faceDelVisible === true ? 'flex' : 'none',
              bottom: 20,
              right: 20,
            }}
          >
            <TouchableOpacity onPress={onFaceRemove}>
              <LocalIcon name={'backspace_clr'} size={40} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
);

const ChatMessageBubbleList = React.memo(
  (props: {
    messageBubbleList?: {
      bubbleList: React.ForwardRefExoticComponent<
        MessageBubbleListProps & React.RefAttributes<MessageBubbleListRef>
      >;
      bubbleListProps: MessageBubbleListProps;
      bubbleListRef: React.RefObject<MessageBubbleListRef>;
    };
    _onFace: (value?: 'face' | 'key') => void;
    onRequestHistoryMessage: (params: { earliestId: string }) => void;
    msgListRef: React.RefObject<MessageBubbleListRef>;
  }) => {
    const { messageBubbleList, _onFace, onRequestHistoryMessage, msgListRef } =
      props;
    return messageBubbleList ? (
      <messageBubbleList.bubbleList
        ref={messageBubbleList.bubbleListRef}
        {...messageBubbleList.bubbleListProps}
        onPressed={() => {
          Keyboard.dismiss();
          _onFace('face');
          messageBubbleList.bubbleListProps?.onPressed?.();
        }}
        onRequestHistoryMessage={onRequestHistoryMessage}
      />
    ) : (
      <MessageBubbleList
        ref={msgListRef}
        onPressed={() => {
          Keyboard.dismiss();
          _onFace('face');
        }}
        onRequestHistoryMessage={onRequestHistoryMessage}
      />
    );
  }
);
