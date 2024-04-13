import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ChatConversationType,
  ChatCustomMessageBody,
  ChatMessageChatType,
  ChatMessageType,
} from 'react-native-chat-sdk';
import {
  ConversationDetail,
  ConversationDetailModelType,
  ConversationDetailRef,
  gCustomMessageCardEventType,
  GroupParticipantModel,
  MessageInputRef,
  MessageListRef,
  MessageModel,
  SystemMessageModel,
  TimeMessageModel,
  useColors,
  usePaletteContext,
  uuid,
} from 'react-native-chat-uikit';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useCallApi } from '../common/AVView';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

// export function MyMessageContent(props: MessageContentProps) {
//   const { msg } = props;
//   if (msg.body.type === ChatMessageType.CUSTOM) {
//     return (
//       <View>
//         <Text>{(msg.body as ChatCustomMessageBody).params?.test}</Text>
//       </View>
//     );
//   }
//   return <MessageContent {...props} />;
// }

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function MessageHistoryScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const messageId = ((route.params as any)?.params as any)?.messageId;
  const selectType = ((route.params as any)?.params as any)?.selectType;
  const from = ((route.params as any)?.params as any)?.__from;
  const hash = ((route.params as any)?.params as any)?.__hash;
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
  const comType = React.useRef<ConversationDetailModelType>('search').current;
  const avTypeRef = React.useRef<'video' | 'voice'>('video');
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
      navi.navigate({
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
      navi.navigate({
        to: 'AVSelectGroupParticipant',
        props: {
          groupId: convId,
        },
      });
    }
  }, [comType, convId, convType, getSelectedMembers, navi, showCall]);

  React.useEffect(() => {
    if (selectedContacts && operateType === 'share_card') {
      try {
        const p = JSON.parse(selectedContacts);
        convRef.current?.sendCardMessage({ ...p, type: 'card' });
      } catch {}
    }
  }, [selectedContacts, operateType]);

  React.useEffect(() => {
    if (from === 'MessageForwardSelector' && hash) {
      convRef.current?.changeSelectType(selectType);
    }
  }, [from, selectType, hash]);

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
        msgId={messageId}
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
                navi.push({
                  to: 'ImageMessagePreview',
                  props: {
                    msgId: msgModel.msg.msgId,
                    localMsgId: msgModel.msg.localMsgId,
                    msg: msgModel.msg,
                  },
                });
              } else if (msgModel.msg.body.type === ChatMessageType.VIDEO) {
                navi.push({
                  to: 'VideoMessagePreview',
                  props: {
                    msgId: msgModel.msg.msgId,
                    localMsgId: msgModel.msg.localMsgId,
                    msg: msgModel.msg,
                  },
                });
              } else if (msgModel.msg.body.type === ChatMessageType.FILE) {
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
                navi.navigate({
                  to: 'ContactInfo',
                  props: {
                    userId: userId,
                  },
                });
              } else if (userType === ChatMessageChatType.GroupChat) {
                navi.navigate({
                  to: 'ContactInfo',
                  props: {
                    userId: userId,
                  },
                });
              }
            },
            // reportMessageCustomList: [{ key: '1', value: 'test' }],
            // listItemRenderProps: {
            //   MessageContent: MyMessageContent,
            // },
            // messageLayoutType: 'left',
            onNoMoreMessage: React.useCallback(() => {
              console.log('onNoMoreMessage');
            }, []),
            onCreateThread: (params) => {
              navi.push({
                to: 'CreateThread',
                props: {
                  ...params,
                  convId: uuid(),
                  convType: ChatConversationType.GroupChat,
                },
              });
            },
            onOpenThread: (params) => {
              navi.push({
                to: 'MessageThreadDetail',
                props: {
                  thread: params,
                  convId: params.threadId,
                  convType: ChatConversationType.GroupChat,
                },
              });
            },
            onClickedOpenThreadMemberList: () => {},
            onClickedLeaveThread: () => {},
            onClickedHistoryDetail: (item) => {
              navi.push({
                to: 'MessageHistoryList',
                props: {
                  message: item.msg,
                },
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
            navi.navigate({
              to: 'ContactInfo',
              props: {
                userId: params.convId,
              },
            });
          } else if (params.convType === ChatConversationType.GroupChat) {
            navi.navigate({
              to: 'GroupInfo',
              props: {
                groupId: params.convId,
                ownerId: params.ownerId,
              },
            });
          }
        }}
        onClickedThread={() => {
          navi.navigate({
            to: 'MessageThreadList',
            props: {
              parentId: convId,
            },
          });
        }}
        onForwardMessage={(msgs) => {
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
