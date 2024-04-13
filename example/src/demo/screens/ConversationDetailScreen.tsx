import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter } from 'react-native';
import { CallConstKey } from 'react-native-chat-callkit';
import {
  ChatConversationType,
  ChatCustomMessageBody,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageStatus,
  ChatMessageType,
} from 'react-native-chat-sdk';
import {
  ConversationDetail,
  ConversationDetailModelType,
  ConversationDetailRef,
  gCustomMessageCardEventType,
  GroupParticipantModel,
  MessageContent,
  MessageContentProps,
  MessageInputRef,
  MessageListRef,
  MessageModel,
  MessageText,
  SendCustomProps,
  SystemMessageModel,
  TimeMessageModel,
  useColors,
  useI18nContext,
  usePaletteContext,
  useSimpleToastContext,
  uuid,
} from 'react-native-chat-uikit';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useCallApi } from '../common/AVView';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

export function MyMessageContent(props: MessageContentProps) {
  const { msg, layoutType, isSupport, contentMaxWidth } = props;
  if (
    msg.body.type === ChatMessageType.TXT &&
    msg.attributes?.[CallConstKey.KeyAction] === CallConstKey.KeyInviteAction
  ) {
    return (
      <MessageText
        msg={msg}
        layoutType={layoutType}
        isSupport={isSupport}
        maxWidth={contentMaxWidth}
      />
    );
  }
  return <MessageContent {...props} />;
}
// const MyMessageContentMemo = React.memo(MyMessageContent);

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const selectType = ((route.params as any)?.params as any)?.selectType;
  const from = ((route.params as any)?.params as any)?.__from;
  const hash = ((route.params as any)?.params as any)?.__hash;
  const onceRef = React.useRef(false);
  const operateType = ((route.params as any)?.params as any)?.operateType;
  // const selectedParticipants = ((route.params as any)?.params as any)
  //   ?.selectedParticipants;
  const selectedContacts = ((route.params as any)?.params as any)
    ?.selectedContacts;
  const selectedMembers = ((route.params as any)?.params as any)
    ?.selectedMembers as GroupParticipantModel[] | undefined;
  const listRef = React.useRef<MessageListRef>({} as any);
  const inputRef = React.useRef<MessageInputRef>({} as any);
  const { top, bottom } = useSafeAreaInsets();
  // const im = useChatContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const convRef = React.useRef<ConversationDetailRef>({} as any);
  const comType = React.useRef<ConversationDetailModelType>('chat').current;
  const avTypeRef = React.useRef<'video' | 'voice'>('video');
  const { getSimpleToastRef } = useSimpleToastContext();
  const { tr } = useI18nContext();
  const { showCall } = useCallApi({});

  const getSelectedMembers = React.useCallback(() => {
    return selectedMembers;
  }, [selectedMembers]);

  const onClickedVideo = React.useCallback(() => {
    if (comType !== 'chat') {
      return;
    }
    avTypeRef.current = 'video';
    if (convType === 0) {
      showCall({
        convId,
        convType,
        avType: 'video',
        getSelectedMembers: getSelectedMembers,
      });
    } else if (convType === 1) {
      onceRef.current = true;
      navi.push({
        to: 'AVSelectGroupParticipant',
        props: {
          groupId: convId,
        },
      });
    }
  }, [comType, convId, convType, getSelectedMembers, navi, showCall]);
  const onClickedVoice = React.useCallback(() => {
    if (comType !== 'chat') {
      return;
    }
    avTypeRef.current = 'voice';
    if (convType === 0) {
      showCall({
        convId,
        convType,
        avType: 'voice',
        getSelectedMembers: getSelectedMembers,
      });
    } else if (convType === 1) {
      onceRef.current = true;
      navi.push({
        to: 'AVSelectGroupParticipant',
        props: {
          groupId: convId,
        },
      });
    }
  }, [comType, convId, convType, getSelectedMembers, navi, showCall]);

  React.useEffect(() => {
    if (selectedContacts && operateType === 'share_card') {
      if (onceRef.current === false) {
        return;
      }
      onceRef.current = false;
      try {
        const p = JSON.parse(selectedContacts);
        convRef.current?.sendCardMessage({ ...p, type: 'card' });
      } catch {}
    }
  }, [selectedContacts, operateType]);

  React.useEffect(() => {
    if (from === 'MessageForwardSelector') {
      if (hash) {
        if (onceRef.current === false) {
          return;
        }
        onceRef.current = false;
        convRef.current?.changeSelectType(selectType);
      }
    } else if (from === 'AVSelectGroupParticipant') {
      if (hash) {
        if (onceRef.current === false) {
          return;
        }
        onceRef.current = false;
        showCall({
          convId,
          convType,
          avType: avTypeRef.current,
          getSelectedMembers: getSelectedMembers,
        });
      }
    }
  }, [from, selectType, hash, showCall, convType, getSelectedMembers, convId]);

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'onSignallingMessage',
      (data) => {
        const d = data as { type: string; extra: any };
        if (d.type === 'callSignal') {
          const msg = d.extra as ChatMessage;
          if (msg.conversationId === convId) {
            const action = msg.attributes?.[CallConstKey.KeyAction];
            const pseudoMsg = { ...msg } as ChatMessage;
            pseudoMsg.status = ChatMessageStatus.SUCCESS;
            if (action === CallConstKey.KeyInviteAction) {
              listRef.current?.addSendMessageToUI({
                value: {
                  type: 'custom',
                  msg: pseudoMsg,
                } as SendCustomProps,
              });
            }
          }
        } else if (d.type === 'callEnd') {
        } else if (d.type === 'callHangUp') {
        } else if (d.type === 'callCancel') {
        } else if (d.type === 'callRefuse') {
        }
      }
    );
    return () => {
      sub.remove();
    };
  }, [convId]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ConversationDetail
        propsRef={convRef}
        type={comType}
        containerStyle={{
          flexGrow: 1,
        }}
        convId={convId}
        convType={convType}
        selectType={selectType}
        input={{
          ref: inputRef,
          props: {
            top,
            bottom,
            // onInputMention: (groupId: string) => {
            //   // todo : select group member.
            //   navi.push('SelectSingleParticipant', {
            //     params: {
            //       groupId,
            //     },
            //   });
            // },
            onClickedCardMenu: () => {
              onceRef.current = true;
              navi.push({
                to: 'ShareContact',
                props: {
                  convId,
                  convType,
                  operateType: 'share_card',
                },
              });
            },
            // onInitMenu: (menu) => {
            //   return [
            //     ...menu,
            //     {
            //       name: 'test',
            //       isHigh: false,
            //       icon: 'bell',
            //       onClicked: () => {
            //         console.log('test');
            //         listRef.current?.addSendMessage({
            //           type: 'custom',
            //           msg: ChatMessage.createCustomMessage(convId, 'test', 1, {
            //             params: { test: '111' },
            //           }),
            //         });
            //       },
            //     },
            //   ];
            // },
          },
        }}
        list={{
          ref: listRef,
          props: {
            onClickedItem: (
              id: string,
              model: SystemMessageModel | TimeMessageModel | MessageModel
            ) => {
              console.log('onClickedItem', id, model);
              if (model.modelType !== 'message') {
                return;
              }
              const msgModel = model as MessageModel;
              if (msgModel.msg.body.type === ChatMessageType.IMAGE) {
                onceRef.current = true;
                navi.push({
                  to: 'ImageMessagePreview',
                  props: {
                    msgId: msgModel.msg.msgId,
                    localMsgId: msgModel.msg.localMsgId,
                    msg: msgModel.msg,
                  },
                });
              } else if (msgModel.msg.body.type === ChatMessageType.VIDEO) {
                onceRef.current = true;
                navi.push({
                  to: 'VideoMessagePreview',
                  props: {
                    msgId: msgModel.msg.msgId,
                    localMsgId: msgModel.msg.localMsgId,
                    msg: msgModel.msg,
                  },
                });
              } else if (msgModel.msg.body.type === ChatMessageType.FILE) {
                onceRef.current = true;
                navi.push({
                  to: 'FileMessagePreview',
                  props: {
                    msgId: msgModel.msg.msgId,
                    localMsgId: msgModel.msg.localMsgId,
                    msg: msgModel.msg,
                  },
                });
              } else if (msgModel.msg.body.type === ChatMessageType.CUSTOM) {
                const body = msgModel.msg.body as ChatCustomMessageBody;
                const event = body.event;
                const params = body.params;
                if (event === gCustomMessageCardEventType) {
                  const cardParams = params as {
                    userId: string;
                    nickname: string;
                    avatar: string;
                  };
                  onceRef.current = true;
                  navi.push({
                    to: 'ContactInfo',
                    props: {
                      userId: cardParams.userId,
                    },
                  });
                }
              }
            },
            onClickedItemAvatar: (id, model) => {
              console.log('onClickedItemAvatar', id, model);
              if (model.modelType !== 'message') {
                return;
              }
              const msgModel = model as MessageModel;
              const userId = msgModel.msg.from;

              const userType = msgModel.msg.chatType as number;
              if (userType === ChatMessageChatType.PeerChat) {
                onceRef.current = true;
                navi.navigate({
                  to: 'ContactInfo',
                  props: {
                    userId: userId,
                  },
                });
              } else if (userType === ChatMessageChatType.GroupChat) {
                onceRef.current = true;
                navi.navigate({
                  to: 'ContactInfo',
                  props: {
                    userId: userId,
                  },
                });
              }
            },
            // reportMessageCustomList: [{ key: '1', value: 'test' }],
            listItemRenderProps: {
              MessageContent: MyMessageContent,
            },
            // messageLayoutType: 'left',
            onNoMoreMessage: React.useCallback(() => {
              console.log('onNoMoreMessage');
            }, []),
            onCreateThread: (params) => {
              onceRef.current = true;
              navi.navigate({
                to: 'CreateThread',
                props: {
                  ...params,
                  convId: uuid(),
                  convType: ChatConversationType.GroupChat,
                },
              });
            },
            onOpenThread: (params) => {
              onceRef.current = true;
              navi.navigate({
                to: 'MessageThreadDetail',
                props: {
                  thread: params,
                  convId: params.threadId,
                  convType: ChatConversationType.GroupChat,
                },
              });
            },
            onClickedOpenThreadMemberList: () => {},
            onClickedHistoryDetail: (item) => {
              onceRef.current = true;
              navi.navigate({
                to: 'MessageHistoryList',
                props: {
                  message: item.msg,
                },
              });
            },
            onCopyFinished: () => {
              console.log('onCopyFinished');
              getSimpleToastRef().show({
                message: tr('copy_success'),
              });
            },
          },
        }}
        onBack={() => {
          navi.goBack();
        }}
        onClickedAvatar={(params: {
          convId: string;
          convType: ChatConversationType;
          ownerId?: string | undefined;
        }) => {
          if (params.convType === ChatConversationType.PeerChat) {
            onceRef.current = true;
            navi.navigate({
              to: 'ContactInfo',
              props: { userId: params.convId },
              merge: true,
            });
          } else if (params.convType === ChatConversationType.GroupChat) {
            onceRef.current = true;
            navi.navigate({
              to: 'GroupInfo',
              props: { groupId: params.convId, ownerId: params.ownerId },
              merge: true,
            });
          }
        }}
        onClickedThread={() => {
          onceRef.current = true;
          navi.navigate({
            to: 'MessageThreadList',
            props: { params: { parentId: convId } },
          });
        }}
        onForwardMessage={(msgs) => {
          onceRef.current = true;
          navi.push({
            to: 'MessageForwardSelector',
            props: {
              msgs,
              convId,
              convType,
            },
          });
        }}
        onClickedVideo={onClickedVideo}
        onClickedVoice={onClickedVoice}
        // ConversationDetailNavigationBar={
        //   <View style={{ width: 100, height: 44, backgroundColor: 'red' }} />
        // }
        // enableNavigationBar={true}
      />
    </SafeAreaView>
  );
}
