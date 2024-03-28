import * as React from 'react';
import {
  // FlatList,
  ListRenderItemInfo,
  Pressable,
  Text,
  View,
} from 'react-native';
import { ChatMessageStatus } from 'react-native-chat-sdk';
import {
  Container,
  MessageHistoryModel,
  MessageListItemProps,
  MessageModel,
  SystemMessageModel,
  TimeMessageModel,
  useFlatList,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { FlatListFactory } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

type RenderItemProps = {
  id: string;
};
function RenderItem(props: RenderItemProps) {
  const { id } = props;
  return (
    <View
      style={{ height: 20, width: '100%', backgroundColor: 'green', margin: 4 }}
    >
      <Text>{id}</Text>
    </View>
  );
}
const RenderItemMemo = React.memo(RenderItem);

export function Test1() {
  const FlatList = React.useMemo(() => FlatListFactory<RenderItemProps>(), []);
  const [data, setData] = React.useState<RenderItemProps[]>([]);
  const scrollEventThrottle = React.useRef(16).current;
  const [reachedThreshold] = React.useState(0.5);
  const bounces = React.useRef(true).current;

  React.useEffect(() => {
    setData([]);
    setData(
      Array.from({ length: 30 }, (_, i) => {
        return { id: `${i}` };
      })
    );
    setTimeout(() => {
      setData((pre) => {
        return [...pre, { id: `${pre.length}` }];
      });
    }, 5000);
  }, []);
  console.log('test:zuoyu:Test1:', data.length);
  return (
    <SafeAreaView>
      <Pressable
        style={{ height: 40, width: 100, backgroundColor: 'yellow' }}
        onPress={() => {
          console.log('update data');
          setData((pre) => {
            return [...pre, { id: `${pre.length}` }];
          });
        }}
      >
        <Text>{'update data'}</Text>
      </Pressable>

      <View
        style={{
          flexGrow: 1,
          // flexShrink: 1,
          // flex: 1,
          // maxListHeight: '80%',
          // maxHeight: maxListHeight,
          // maxHeight: 400,
          height: 400,
          backgroundColor: 'red',
        }}
      >
        <FlatList
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          data={data}
          inverted={true}
          keyExtractor={(item) => item.id}
          scrollEventThrottle={scrollEventThrottle}
          onEndReachedThreshold={reachedThreshold}
          bounces={bounces}
          initialNumToRender={10}
          renderItem={(info: ListRenderItemInfo<RenderItemProps>) => {
            return <RenderItemMemo {...info.item} />;
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export function Test2() {
  const FlatList = React.useMemo(
    () => FlatListFactory<MessageListItemProps>(),
    []
  );
  const flatListProps = useFlatList<MessageListItemProps>({
    listState: 'normal',
    enableRefresh: false,
    enableMore: true,
  });
  const { data, setData, dataRef } = flatListProps;
  // const [data, setData] = React.useState<MessageListItemProps[]>([]);
  const scrollEventThrottle = React.useRef(16).current;
  const [reachedThreshold] = React.useState(0.5);
  const bounces = React.useRef(true).current;

  const removeDuplicateData = React.useCallback(
    (list: MessageListItemProps[]) => {
      const uniqueList = list.filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => {
            if (
              item.model.modelType === 'message' &&
              t.model.modelType === 'message'
            ) {
              const msgModel = item.model as MessageModel;
              const tMsgModel = t.model as MessageModel;
              if (
                msgModel.msg.status === ChatMessageStatus.SUCCESS &&
                tMsgModel.msg.status === ChatMessageStatus.SUCCESS
              ) {
                if (msgModel.msg.msgId === tMsgModel.msg.msgId) {
                  return true;
                }
              } else {
                if (msgModel.msg.localMsgId === tMsgModel.msg.localMsgId) {
                  return true;
                }
              }
            } else if (
              item.model.modelType === 'history' &&
              t.model.modelType === 'history'
            ) {
              const msgModel = item.model as MessageHistoryModel;
              const tMsgModel = t.model as MessageHistoryModel;
              if (msgModel.msg.msgId === tMsgModel.msg.msgId) {
                return true;
              }
            } else if (
              item.model.modelType === 'system' &&
              t.model.modelType === 'system'
            ) {
              const msgModel = item.model as SystemMessageModel;
              const tMsgModel = t.model as SystemMessageModel;
              if (msgModel.msg.msgId === tMsgModel.msg.msgId) {
                return true;
              }
            } else if (
              item.model.modelType === 'time' &&
              t.model.modelType === 'time'
            ) {
              const msgModel = item.model as TimeMessageModel;
              const tMsgModel = t.model as TimeMessageModel;
              if (msgModel.timestamp === tMsgModel.timestamp) {
                return true;
              }
            }
            return false;
          })
      );
      return uniqueList;
    },
    []
  );

  const _refreshToUI = React.useCallback(
    (items: MessageListItemProps[]) => {
      for (const item of items) {
        const i = item.model as MessageModel;
        if (i?.msg?.msgId) {
          console.log('test:zuoyu:item:', item.id, i.msg.msgId);
        } else {
          console.log('test:zuoyu:item:', item.id, item.index);
        }
      }
      setData([...items]);
    },
    [setData]
  );

  const refreshToUI = React.useCallback(
    (items: MessageListItemProps[]) => {
      dataRef.current = removeDuplicateData(items);
      // if (dataRef.current.length > 0) {
      //   if (inverted === true) {
      //     preBottomDataRef.current = dataRef.current[0];
      //   } else {
      //     preBottomDataRef.current =
      //       dataRef.current[dataRef.current.length - 1];
      //   }
      // }
      _refreshToUI(dataRef.current);
    },
    [dataRef, removeDuplicateData, _refreshToUI]
  );

  const init = React.useCallback(() => {
    dataRef.current = [];
    refreshToUI(dataRef.current);
    setTimeout(() => {
      dataRef.current = Array.from({ length: 30 }, (_, i) => {
        return {
          id: `${i}`,
          model: {
            userId: '2170153634',
            modelType: 'message',
            layoutType: 'right',
            msg: {
              msgId: `${i}`,
              localMsgId: '1711521375852',
              conversationId: '15e3a9a6c6',
              from: '2170153634',
              to: '15e3a9a6c6',
              localTime: 1711521375852,
              serverTime: 1711521376158,
              hasDeliverAck: false,
              hasReadAck: false,
              needGroupAck: false,
              groupAckCount: 0,
              hasRead: true,
              status: 2,
              chatType: 0,
              direction: 'send',
              attributes: {
                ease_chat_uikit_user_info: {
                  avatarURL:
                    'https://a1.easemob.com/easemob/easeim/chatfiles/a8f0b460-e832-11ee-9c63-b3ceaa487c0f',
                },
              },
              body: { type: 'txt', content: '27', translations: {} },
              isChatThread: false,
              isOnline: true,
              deliverOnlineOnly: false,
              receiverList: [],
              isBroadcast: false,
            },
            reactions: [],
          },
        } as any;
      });
      refreshToUI(dataRef.current);
    }, 100);
  }, [dataRef, refreshToUI]);

  React.useEffect(() => {
    init();
  }, [init]);

  console.log('test:zuoyu:Test2:', data.length);
  return (
    <SafeAreaView>
      <Pressable
        style={{ height: 40, width: 100, backgroundColor: 'yellow' }}
        onPress={() => {
          console.log('update data');
          dataRef.current = [
            ...dataRef.current,
            {
              id: `${dataRef.current.length}`,
              model: {
                userId: '2170153634',
                modelType: 'message',
                layoutType: 'right',
                msg: {
                  msgId: `${dataRef.current.length}`,
                  localMsgId: '1711521375852',
                  conversationId: '15e3a9a6c6',
                  from: '2170153634',
                  to: '15e3a9a6c6',
                  localTime: 1711521375852,
                  serverTime: 1711521376158,
                  hasDeliverAck: false,
                  hasReadAck: false,
                  needGroupAck: false,
                  groupAckCount: 0,
                  hasRead: true,
                  status: 2,
                  chatType: 0,
                  direction: 'send',
                  attributes: {
                    ease_chat_uikit_user_info: {
                      avatarURL:
                        'https://a1.easemob.com/easemob/easeim/chatfiles/a8f0b460-e832-11ee-9c63-b3ceaa487c0f',
                    },
                  },
                  body: { type: 'txt', content: '27', translations: {} },
                  isChatThread: false,
                  isOnline: true,
                  deliverOnlineOnly: false,
                  receiverList: [],
                  isBroadcast: false,
                },
                reactions: [],
              },
            } as any,
          ];
          refreshToUI(dataRef.current);
        }}
      >
        <Text>{'update data'}</Text>
      </Pressable>

      <View
        style={{
          flexGrow: 1,
          // flexShrink: 1,
          // flex: 1,
          // maxListHeight: '80%',
          // maxHeight: maxListHeight,
          // maxHeight: 400,
          height: 400,
          backgroundColor: 'red',
        }}
      >
        <FlatList
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          data={data}
          inverted={true}
          keyExtractor={(item) => item.id}
          scrollEventThrottle={scrollEventThrottle}
          onEndReachedThreshold={reachedThreshold}
          bounces={bounces}
          // initialNumToRender={10}
          renderItem={(info: ListRenderItemInfo<MessageListItemProps>) => {
            return <RenderItemMemo {...info.item} />;
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default function TestFlatList() {
  const p = usePresetPalette();
  const t = useLightTheme(p, 'global');
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
      palette={p}
      theme={t}
    >
      <Test2 />
    </Container>
  );
}
