import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackgroundVideoMemo, RoomData } from '../common';
import { gGifts, gReportData } from '../const';
import {
  Alert,
  AlertRef,
  Avatar,
  BottomSheetGift,
  BottomSheetGiftSimuRef,
  Chatroom,
  gGiftEffectListHeight,
  gInputBarStyleHeight,
  gMessageListHeight,
  Icon,
  IconButton,
  seqId,
  SimpleToast,
  SimpleToastRef,
  useColors,
  useI18nContext,
  usePaletteContext,
  useRoomContext,
  useRoomListener,
  UserServiceData,
} from '../rename.room';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ChatroomScreen(props: Props) {
  const { navigation, route } = props;
  const room = (route.params as any).params.room as RoomData;
  const pageCount = (route.params as any).params.pageCount as number;
  const { top, bottom } = useSafeAreaInsets();
  const testRef = React.useRef<View>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const chatroomRef = React.useRef<Chatroom>({} as any);
  const toastRef = React.useRef<SimpleToastRef>({} as any);
  const giftRef = React.useRef<BottomSheetGiftSimuRef>({} as any);
  const im = useRoomContext();
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
    marquee: {
      light: 'hsla(203, 100%, 60%, 1)',
      dark: 'hsla(203, 100%, 60%, 1)',
    },
  });

  const [pageY, setPageY] = React.useState(0);
  const { tr } = useI18nContext();
  const messageTop = () => {
    if (Platform.OS === 'ios') {
      return (
        Dimensions.get('window').height -
        gMessageListHeight -
        gInputBarStyleHeight -
        bottom
      );
    } else {
      return (
        Dimensions.get('window').height -
        gMessageListHeight -
        gInputBarStyleHeight -
        bottom -
        (StatusBar.currentHeight ?? 0)
      );
    }
  };
  const giftTop = () => {
    if (Platform.OS === 'ios') {
      return (
        Dimensions.get('window').height -
        gMessageListHeight -
        gInputBarStyleHeight -
        gGiftEffectListHeight -
        4 -
        bottom
      );
    } else {
      return (
        Dimensions.get('window').height -
        gMessageListHeight -
        gInputBarStyleHeight -
        gGiftEffectListHeight -
        4 -
        bottom -
        (StatusBar.currentHeight ?? 0)
      );
    }
  };

  const onNavigationGoBack = React.useCallback(() => {
    navigation.navigate({
      name: 'ChannelList',
      params: {
        params: {
          pageCount,
        },
      },
      merge: true,
    });
  }, [navigation, pageCount]);

  useRoomListener(
    React.useMemo(() => {
      return {
        onError: (params) => {
          console.log('ChatroomScreen:onError:', JSON.stringify(params));
        },
        onFinished: (params) => {
          console.log('ChatroomScreen:onFinished:', params);
        },
        onUserJoined: (roomId: string, user: UserServiceData): void => {
          console.log('ChatroomScreen:onUserJoined:', roomId, user);
        },
        onUserLeave: (roomId: string, userId: string): void => {
          console.log('ChatroomScreen:onUserLeave:', roomId, userId);
        },
        onUserBeKicked: (roomId: string, reason: number) => {
          console.log('ChatroomScreen:onUserBeKicked:', roomId, reason);
          onNavigationGoBack();
        },
        onUserMuted: (roomId, userIds, operatorId) => {
          console.log(
            'ChatroomScreen:onUserMuted:',
            roomId,
            userIds,
            operatorId,
            im.userId
          );
        },
        onUserUnmuted: (roomId, userIds, operatorId) => {
          console.log(
            'ChatroomScreen:onUserUnmuted:',
            roomId,
            userIds,
            operatorId
          );
        },
      };
    }, [im.userId, onNavigationGoBack])
  );

  const onGoBack = () => {
    alertRef.current.alert?.();
  };

  const onRequestMemberList = () => {
    chatroomRef?.current?.getParticipantListRef()?.startShow();
  };

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
            // console.log('dev:', _x, _y, _width, _height, _pageX, pageY);
            setPageY(pageY);
          }
        );
      }}
    >
      <Chatroom
        ref={chatroomRef}
        position={'absolute'}
        globalBroadcast={{
          props: {
            containerStyle: {
              // position: 'absolute',
              // marginHorizontal: 12,
              // width: winWidth - 24,
              // marginTop: 8 + top + 44,
              backgroundColor: getColor('marquee'),
            },
          },
        }}
        messagePinAndBroadcastContainerStyle={{
          position: 'absolute',
          marginHorizontal: 12,
          marginTop: 8 + top + 44,
        }}
        backgroundView={<BackgroundVideoMemo />}
        messageList={{
          props: {
            containerStyle: {
              position: 'absolute',
              // backgroundColor: 'red',
              // bottom: 0,
              // top: messageTop,
              top: messageTop(),
            },
            reportProps: {
              data: gReportData,
            },
          },
        }}
        gift={{
          props: {
            containerStyle: {
              position: 'absolute',
              top: giftTop(),
              left: 16,
              // backgroundColor: 'red',
            },
          },
        }}
        input={{
          props: {
            keyboardVerticalOffset: Platform.OS === 'ios' ? pageY : 0,
            after: [
              <TouchableOpacity
                key="gift"
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
              navigation.push('SearchMember', { params: { memberType } });
            },
          },
        }}
        roomId={room.roomId}
        ownerId={room.owner}
        onError={(e) => {
          console.log('ChatroomScreen:onError:2', e.toString());
        }}
      />
      <BottomSheetGift
        ref={giftRef}
        maskStyle={{ transform: [{ translateY: -pageY }] }}
        gifts={[{ title: tr('gifts'), gifts: gGifts }]}
        onSend={(giftId) => {
          for (const gift of gGifts) {
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
      <ChatroomHeader
        {...props}
        onGoBack={onGoBack}
        onRequestMemberList={onRequestMemberList}
      />
      <SimpleToast propsRef={toastRef} />
      <Alert
        ref={alertRef}
        title={tr('leaveRoom')}
        buttons={[
          {
            text: tr('Cancel'),
            onPress: () => {
              alertRef.current.close?.();
            },
          },
          {
            text: tr('Confirm'),
            onPress: () => {
              alertRef.current.close?.(() => {
                onNavigationGoBack();
              });
            },
          },
        ]}
      />
    </View>
  );
}

export const ChatroomHeader = (
  props: Props & { onGoBack: () => void; onRequestMemberList: () => void }
): React.ReactElement => {
  const { route, onGoBack, onRequestMemberList } = props;
  const room = (route.params as any).params.room as RoomData;
  const {} = useI18nContext();
  const { top } = useSafeAreaInsets();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    return: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
    text1: {
      light: 'hsla(0, 0%, 100%, 1)',
      dark: 'hsla(0, 0%, 100%, 1)',
    },
    text2: {
      light: 'hsla(0, 0%, 100%, 0.8)',
      dark: 'hsla(0, 0%, 100%, 0.8)',
    },
    bg: {
      light: 'hsla(0, 0%, 0%, 0.2)',
      dark: 'hsla(0, 0%, 100%, 0.1)',
    },
  });
  return (
    <View
      style={{
        position: 'absolute',
        marginTop: top,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16,
        paddingLeft: 6,
        width: '100%',
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onTouchEnd={onGoBack}
      >
        <Icon
          name={'chevron_left'}
          style={{
            width: 20,
            height: 20,
            tintColor: getColor('return'),
          }}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 48,
          backgroundColor: getColor('bg'),
          paddingLeft: 3,
          paddingRight: 16,
          paddingVertical: 2,
        }}
      >
        <Avatar borderRadius={32} size={32} url={room?.ownerAvatar} />
        <View style={{ width: 8 }} />
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              lineHeight: 22,
              color: getColor('text1'),
            }}
          >
            {room?.roomName ?? room?.roomId}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '400',
              lineHeight: 14,
              color: getColor('text2'),
            }}
          >
            {room?.ownerNickName ?? room.owner}
          </Text>
        </View>
      </View>
      <View style={{ flexGrow: 1 }} />
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 32,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: getColor('bg'),
        }}
        onTouchEnd={onRequestMemberList}
      >
        <IconButton
          iconName={'person_double_fill'}
          style={{
            width: 16,
            height: 16,
            tintColor: getColor('return'),
          }}
        />
      </View>
    </View>
  );
};
