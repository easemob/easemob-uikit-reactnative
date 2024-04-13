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
  gCustomMessageCardEventType,
  MessageInputRef,
  MessageListRef,
  MessageModel,
  SystemMessageModel,
  TimeMessageModel,
  useChatContext,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function MessageThreadDetailScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const thread = ((route.params as any)?.params as any)?.thread;
  const firstMessage = ((route.params as any)?.params as any)?.firstMessage;
  const operateType = ((route.params as any)?.params as any)?.operateType;
  // const selectedParticipants = ((route.params as any)?.params as any)
  //   ?.selectedParticipants;
  const selectedContacts = ((route.params as any)?.params as any)
    ?.selectedContacts;
  const listRef = React.useRef<MessageListRef>({} as any);
  const inputRef = React.useRef<MessageInputRef>({} as any);
  const { top, bottom } = useSafeAreaInsets();
  const im = useChatContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const editTypeRef = React.useRef<string>();
  const { tr } = useI18nContext();

  const goBack = (data: any) => {
    // !!! warning: react navigation
    if (editTypeRef.current === 'threadName') {
      im.updateThreadName({
        threadId: convId,
        name: data,
      });
    }
  };
  const testRef = React.useRef<(data: any) => void>(goBack);
  const comType = React.useRef<ConversationDetailModelType>('thread').current;

  React.useEffect(() => {
    if (selectedContacts && operateType === 'share_card') {
      try {
        const p = JSON.parse(selectedContacts);
        listRef.current?.addSendMessage?.({
          type: 'card',
          userId: p.userId,
          userName: p.nickName,
          userAvatar: p.avatar,
        });
      } catch {}
    }
  }, [selectedContacts, operateType]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ConversationDetail
        type={comType}
        containerStyle={{
          flexGrow: 1,
        }}
        convId={convId}
        convType={convType}
        thread={thread}
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
            onClickedItemAvatar: (_id, model) => {
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
            firstMessage: firstMessage,
            onClickedEditThreadName: (thread) => {
              editTypeRef.current = 'threadName';
              navi.push({
                to: 'EditInfo',
                props: {
                  backName: tr('edit_thread_name'),
                  saveName: tr('save'),
                  initialData: thread.threadName,
                  maxLength: 64,
                  testRef,
                },
              });
            },
            onClickedOpenThreadMemberList: (thread) => {
              navi.push({
                to: 'MessageThreadMemberList',
                props: {
                  thread,
                },
              });
            },
            onClickedLeaveThread: (threadId) => {
              im.leaveThread({ threadId });
              navi.goBack();
            },
            onClickedDestroyThread: (threadId) => {
              im.destroyThread({ threadId });
              navi.goBack();
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
            if (comType === 'thread') {
              return;
            }
            navi.navigate({
              to: 'GroupInfo',
              props: {
                groupId: params.convId,
                ownerId: params.ownerId,
              },
            });
          }
        }}
        // ConversationDetailNavigationBar={
        //   <View style={{ width: 100, height: 44, backgroundColor: 'red' }} />
        // }
        // enableNavigationBar={true}
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
      />
    </SafeAreaView>
  );
}
