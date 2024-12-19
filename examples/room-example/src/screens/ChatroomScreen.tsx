import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackgroundImageMemo } from '../BackgroundImage';
import { ChatroomTestMenu, ChatroomTestMenuRef } from '../ChatroomTestMenu';
import {
  BottomSheetGift2,
  BottomSheetGiftSimuRef,
  ChatMessage,
  ChatMessageChatType,
  ChatRoom,
  Chatroom,
  GiftListModel,
  Icon,
  ReportItemModel,
  seqId,
  useColors,
  useDispatchContext,
  usePaletteContext,
  useRoomContext,
  useRoomListener,
} from '../rename.room';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ChatroomScreen(props: Props) {
  const { navigation, route } = props;
  const room = (route.params as any).params.room as ChatRoom;
  const {} = useSafeAreaInsets();
  const testRef = React.useRef<View>({} as any);
  const menuRef = React.useRef<ChatroomTestMenuRef>({} as any);
  const chatroomRef = React.useRef<Chatroom>({} as any);
  const giftRef = React.useRef<BottomSheetGiftSimuRef>({} as any);
  const im = useRoomContext();
  const count = React.useRef(0);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg2: {
      light: colors.barrage.onLight[2],
      dark: colors.barrage.onDark[2],
    },
    tintColor: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
  });

  const [pageY, setPageY] = React.useState(0);
  const { addListener, removeListener } = useDispatchContext();

  useRoomListener(
    React.useMemo(() => {
      return {
        onError: (params) => {
          console.log(
            'ChatroomScreen:onError:',
            params,
            params.error.toString()
          );
          if (Platform.OS === 'ios') {
            let content;
            try {
              content = JSON.stringify(params);
            } catch (error) {
              content = params.toString();
            }
            chatroomRef?.current?.getGlobalBroadcastRef()?.pushTask?.({
              model: {
                id: seqId('_mq').toString(),
                content: content,
              },
            });
          } else {
            ToastAndroid.show(JSON.stringify(params), 3000);
          }
        },
        onFinished: (params) => {
          console.log('ChatroomScreen:onFinished:', params);
          if (Platform.OS === 'ios') {
            let content;
            try {
              content = params.event + ':' + params.extra?.toString();
            } catch (error) {
              content = params.toString();
            }
            chatroomRef?.current?.getGlobalBroadcastRef()?.pushTask?.({
              model: {
                id: seqId('_mq').toString(),
                content: content,
              },
            });
          } else {
            ToastAndroid.show(
              params.event + ':' + params.extra?.toString(),
              3000
            );
          }
        },
      };
    }, [])
  );

  // !!! ERROR  Warning: React has detected a change in the order of Hooks called by HeaderConfig. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks
  // React.useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: ChatroomHeaderRight,
  //     // headerShadowVisible: false,
  //     // headerBackTitleVisible: false,
  //   });
  // }, [navigation]);

  React.useEffect(() => {
    const cb = () => {
      menuRef?.current?.startShow?.();
    };
    addListener(`_$${ChatroomHeaderRight?.name}`, cb);
    return () => {
      removeListener(`_$${ChatroomHeaderRight?.name}`, cb);
    };
  }, [addListener, removeListener]);

  const addGiftEffectTask = () => {
    chatroomRef?.current?.getGiftMessageListRef()?.pushTask({
      model: {
        id: seqId('_gf').toString(),
        nickname: 'NickName',
        giftCount: 1,
        giftIcon: 'http://notext.png',
        content: 'send Agoraship',
      },
    });
  };
  const addGlobalBroadcastTask = () => {
    const content =
      'For several generations, stories from Africa have traditionally been passed down by word of mouth. ';
    const content2 = "I'm fine.";
    chatroomRef?.current?.getGlobalBroadcastRef()?.pushTask?.({
      model: {
        id: count.current.toString(),
        content: count.current % 2 === 0 ? content : content2,
      },
    });
    ++count.current;
  };

  const showParticipantList = () => {
    menuRef?.current?.startHide?.(() => {
      chatroomRef?.current?.getParticipantListRef()?.startShow();
    });
  };

  const testMemberMenu = () => {
    const member = chatroomRef?.current
      ?.getParticipantListRef()
      ?.getParticipantListRef('member');
    member?.initMenu?.([
      {
        name: 'my',
        isHigh: true,
        onClicked: (name, others) => {
          console.log('onClicked:', name, others);
          member?.closeMenu?.();
        },
      },
    ]);
  };

  const testMessagePin = React.useCallback(() => {
    // error: `hello, wor ldhello, wo rld,h ello, worldjs oeild + ${count.current++}s`,
    //`hello, wor ldhello, wo rld,h ello, world333js oeild + ${count.current++}s`,
    // 1line: ok: `hello, wo+ ${count.current++}s`,
    // 4line: ok: `hello, wor ldhello, wo rld,h ello, worl sdkjfksdf sdkfjskdjfksd sdkfjskdfjskdf sdkfjskdfjskdfj  kjsdkfjs dfk sdkfj sdkfj sdkfj sdfksj dfksj dfksjdf ksdfj d333js oeild + ${count.current++}s`,
    // 4line: ok: `hello, wor ldhello, wo rld,h ello, worl sdkjfksdf sdkfjskdjfksd sdkfjslskd sdlk sdlkf jsldkfj sldkfj sldfkj sdlfkjs dlfksj dflksjd flksdj flskdjf lskdjf lskdfj lskdfj sldkfj sldkfj sldkfj sldkfj sldkfj sdlkfj sdlkfjs dlfkjs dlfkjs dflksjd flksdjf lsdkjf kdfjskdf sdkfjskdfjskdfj  kjsdkfjs dfk sdkfj sdkfj sdkfj sdfksj dfksj dfksjdf ksdfj d333js oeild + ${count.current++}s`,
    // 3line: ok: `hello, wor ldhello, wo rld,h ello, worl sdkfj  kjsdkfjs dfk sdkfj sdkfj sdkfj sdfksj dfksj dfksjdf ksdfj d333js oeild + ${count.current++}s`,
    // 2line: ok: `hello, wor ldhello, wo rld,h ello, worl sdkfj  kjsdkffksjdf ksdfj d333js oeild + ${count.current++}s`,
    const message = ChatMessage.createTextMessage(
      'zhangsan',
      count.current % 2 === 1
        ? `hello, wor ldhello, wo rld,h ello, worl sdkfj  kjsdkffksjdf ksdfj d333js oeild + ${count.current++}s`
        : `hello, wor ldhello, wo rld,h ello, worl sdkjfksdf sdkfjskdjfksd sdkfjslskd sdlk sdlkf jsldkfj sldkfj sldfkj sdlfkjs dlfksj dflksjd flksdj flskdjf lskdjf lskdfj lskdfj sldkfj sldkfj sldkfj sldkfj sldkfj sdlkfj sdlkfjs dlfkjs dlfkjs dflksjd flksdjf lsdkjf kdfjskdf sdkfjskdfjskdfj  kjsdkfjs dfk sdkfj sdkfj sdkfj sdfksj dfksj dfksjdf ksdfj d333js oeild + ${count.current++}s`,
      ChatMessageChatType.ChatRoom
    );
    chatroomRef?.current?.getMessagePinRef()?.pushTask?.({
      id: message.msgId,
      avatar: 'http://avatar.png',
      nickname: 'zhangsan',
      //@ts-ignore tell me why???
      msg: message,
    });
  }, []);

  return (
    <View
      ref={testRef}
      style={{ flex: 1 }}
      onLayout={() => {
        testRef.current?.measure(
          (
            _x: number,
            _y: number,
            _width: number,
            _height: number,
            _pageX: number,
            pageY: number
          ) => {
            // console.log(
            //   'Sub:Sub:measure:',
            //   _x,
            //   _y,
            //   _width,
            //   _height,
            //   _pageX,
            //   pageY
            // );
            setPageY(pageY);
          }
        );
        testRef.current?.measureInWindow(
          (_x: number, _y: number, _width: number, _height: number) => {
            // console.log('Sub:Sub:measureInWindow:', _x, _y, _width, _height);
          }
        );
      }}
    >
      {/* <BackgroundImageMemo /> */}
      {/* <Chatroom ref={chatroomRef} roomId={room.roomId} ownerId={room.owner} /> */}
      <Chatroom
        ref={chatroomRef}
        // position={'absolute'}
        // GlobalBroadcast={GlobalBroadcast}
        // containerStyle={{ transform: [{ translateY: -pageY }] }}
        messageList={{
          props: {
            visible: true,
            // containerStyle: {
            //   position: 'absolute',
            //   top: 100,
            //   // height: 400,
            //   // width: 150,
            //   // backgroundColor: 'red',
            // },
            reportProps: {
              data: [] as ReportItemModel[],
            },
            // MessageListItemComponent: MessageListItemMemo,
            // messageMenuItems: [
            //   {
            //     name: 'my',
            //     isHigh: false,
            //     onClicked: (name, others) => {
            //       console.log('onClicked:', name, others);
            //       chatroomRef.current?.getMessageListRef()?.closeMenu?.();
            //     },
            //   },
            // ],
          },
        }}
        // gift={{
        //   props: {
        //     visible: true,
        //     containerStyle: {
        //       position: 'absolute',
        //       top: 100,
        //     },
        //   },
        // }}
        backgroundView={<BackgroundImageMemo />}
        // backgroundView={<View style={{ flex: 1, backgroundColor: 'blue' }} />}
        // globalBroadcast={{
        //   props: {
        //     visible: true,
        //     containerStyle: {
        //       position: 'absolute',
        //       top: 100,
        //     },
        //   },
        // }}
        // messagePin={{
        //   props: {},
        // }}
        input={{
          props: {
            keyboardVerticalOffset: Platform.OS === 'ios' ? pageY : 0,
            after: [
              <TouchableOpacity
                style={{
                  borderRadius: 38,
                  backgroundColor: getColor('bg2'),
                  width: 38,
                  height: 38,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon
                  name={'ellipsis_vertical'}
                  resolution={'3x'}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: getColor('tintColor'),
                  }}
                />
              </TouchableOpacity>,
              <TouchableOpacity
                style={{
                  borderRadius: 38,
                  backgroundColor: getColor('bg2'),
                  width: 38,
                  height: 38,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  giftRef?.current?.startShow?.();
                }}
              >
                <Icon
                  name={'gift_color'}
                  style={{ width: 30, height: 30, tintColor: undefined }}
                />
              </TouchableOpacity>,
            ],
          },
        }}
        participantList={{
          props: {
            onSearch: (memberType) => {
              navigation.push('TestSearchParticipant', {
                params: { memberType },
              });
            },
            // MemberItemComponent: ParticipantListItemMemo,
          },
        }}
        roomId={room.roomId}
        ownerId={room.owner}
        onError={(e) => {
          console.log('ChatroomScreen:onError:2', e.toString());
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: 150,
            height: 300,
            // backgroundColor: 'red',
            // bottom: 100,
            top: 100,
            right: 20,
          }}
        >
          <TouchableOpacity
            style={{
              height: 30,
              width: 150,
              backgroundColor: '#fff8dc',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              addGlobalBroadcastTask();
            }}
          >
            <Text>{'add import message'}</Text>
          </TouchableOpacity>
          <View style={{ height: 1 }} />
          <TouchableOpacity
            style={{
              height: 30,
              width: 150,
              backgroundColor: '#fff8dc',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              addGiftEffectTask();
            }}
          >
            <Text>{'add gift message'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 30,
              width: 150,
              backgroundColor: '#fff8dc',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              testMemberMenu();
            }}
          >
            <Text>{'test member menu'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 30,
              width: 150,
              backgroundColor: '#fff8dc',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              testMessagePin();
            }}
          >
            <Text>{'test message pin'}</Text>
          </TouchableOpacity>
        </View>
      </Chatroom>
      <BottomSheetGift2
        ref={giftRef}
        maskStyle={{ transform: [{ translateY: -pageY }] }}
        gifts={[
          { title: 'gift1', gifts },
          { title: 'gift2', gifts: gifts2 },
        ]}
        onSend={(giftId) => {
          for (const gift of gifts) {
            if (gift.giftId === giftId) {
              if (im.roomState === 'joined') {
                im.sendGift({
                  roomId: im.roomId!,
                  gift: {
                    giftId: gift.giftId,
                    giftName: gift.giftName,
                    giftPrice: gift.giftPrice.toString(),
                    giftCount: 1,
                    giftIcon: gift.giftIcon,
                    giftEffect: gift.giftEffect ?? '',
                    sendedThenClose: true,
                    selected: true,
                  },
                  result: ({ isOk, error, message }) => {
                    console.log('sendGift:', isOk, error);
                    if (isOk === true && message) {
                      chatroomRef?.current
                        ?.getMessageListRef()
                        ?.addSendedMessage(message);
                      chatroomRef?.current?.getGiftMessageListRef()?.pushTask({
                        model: {
                          id: seqId('_gf').toString(),
                          nickname:
                            im.getUserInfo(im.userId)?.nickname ??
                            im.userId ??
                            'unknown',
                          giftCount: 1,
                          giftIcon: gift.giftIcon,
                          content: `sent ${gift.giftName}`,
                          avatar: im.userInfoFromMessage(message)?.avatarURL,
                        },
                      });
                    }
                  },
                });
                giftRef?.current?.startHide?.();
              }
              break;
            }
          }
        }}
      />
      <ChatroomTestMenu
        ref={menuRef}
        onRequestModalClose={() => {
          menuRef?.current?.startHide?.();
        }}
        addGiftEffectTask={addGiftEffectTask}
        addGlobalBroadcastTask={addGlobalBroadcastTask}
        showParticipantList={showParticipantList}
      />
    </View>
  );
}

export const ChatroomHeaderRight = () => {
  const { emit } = useDispatchContext();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          emit(`_$ChatroomHeaderRight`, {});
        }}
        // style={{ backgroundColor: 'red' }}
      >
        <Icon name={'plus_in_circle'} style={{ width: 30, height: 30 }} />
      </TouchableOpacity>
    </View>
  );
};

export const gifts: GiftListModel[] = [
  {
    giftId: '2665752a-e273-427c-ac5a-4b2a9c82b255',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift1.png',
    giftName: 'Sweet Heart Sweet Heart',
    giftPrice: 1,
  },
  {
    giftId: 'ff3bbb9e-ef18-430f-aa61-5bddf75eb722',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift2.png',
    giftName: 'Flower',
    giftPrice: 2,
  },
  {
    giftId: '94f296fa-86d9-4552-84db-025b05ed9f8d',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift3.png',
    giftName: 'Sweet Heart',
    giftPrice: 5,
  },
  {
    giftId: 'd4cd0526-d8db-4e00-8fc0-d5228907a517',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift4.png',
    giftName: 'Super Agora',
    giftPrice: 10,
  },
  {
    giftId: 'c1997f02-d927-46f5-adda-e6af6714bd75',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift5.png',
    giftName: 'Star',
    giftPrice: 20,
  },
  {
    giftId: '0c62b402-376f-4fbb-b584-769a8249189e',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift6.png',
    giftName: 'Lollipop',
    giftPrice: 30,
  },
  {
    giftId: 'ce3f8bc3-74d7-43be-a040-c397d5c49f6d',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift7.png',
    giftName: 'Diamond',
    giftPrice: 50,
  },
  {
    giftId: '948b1a3b-b2c6-41fc-99b7-a5b9457cd159',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift8.png',
    giftName: 'Crown',
    giftPrice: 100,
  },
  {
    giftId: 'f1e12397-feb7-4c01-b834-f11faf321dbf',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift9.png',
    giftName: 'Mic',
    giftPrice: 500,
  },
  {
    giftId: 'e915438c-7fbd-4e03-840f-0036ec97c824',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift10.png',
    giftEffect:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pag/ballon.pag',
    giftName: 'Balloon',
    giftPrice: 666,
    effectMD5: '141761700268c0290852af8f6a501c10',
  },
  {
    giftId: '0c832b52-8f2e-4202-958b-9410db2d9438',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift11.png',
    giftEffect:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pag/planet.pag',
    giftName: 'Plant',
    giftPrice: 888,
    effectMD5: '41f3eeff249be268004d82a1d1eaf481',
  },
  {
    giftId: 'beada6a3-eae6-450e-869c-743d02fa95e7',
    giftIcon:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift12.png',
    giftEffect:
      'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pag/rocket.pag',
    giftName: 'Rocket',
    giftPrice: 1000,
    effectMD5: 'de5094b30eebeadf8b8f5d8357a19578',
  },
];

export const gifts2 = gifts.slice(0, gifts.length - 1);
