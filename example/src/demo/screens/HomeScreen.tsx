import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import {
  Badges,
  BottomTabBar,
  ContactList,
  ConversationList,
  DataModel,
  EventServiceListener,
  getReleaseArea,
  TabPage,
  TabPageRef,
  timeoutTask,
  useAlertContext,
  useChatContext,
  useColors,
  useDispatchContext,
  useForceUpdate,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGeneralSetting, useLogin } from '../hooks';
import type { RootScreenParamsList } from '../routes';
import { MineInfo } from '../ui/MineInfo';

const env = require('../../env');
const demoType = env.demoType;

type Props = NativeStackScreenProps<RootScreenParamsList>;

function ConversationBadge() {
  const [count, setCount] = React.useState<number>(0);
  const { addListener, removeListener } = useDispatchContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    fg: {
      light: colors.error[5],
      dark: colors.error[6],
    },
  });

  React.useEffect(() => {
    const listener = (params: { count: number }) => {
      const { count } = params;
      setCount(count);
    };
    addListener('_demo_conv_list_total_unread_count', listener);
    return () => {
      removeListener('_demo_conv_list_total_unread_count', listener);
    };
  }, [addListener, removeListener]);

  return (
    <View
      style={{
        borderColor: getColor('bg'),
        borderWidth: 2,
        borderRadius: 50,
      }}
    >
      <Badges
        count={count}
        containerStyle={{ backgroundColor: getColor('fg') }}
      />
    </View>
  );
}

function ContactBadge() {
  const [count, setCount] = React.useState<number>(0);
  const { addListener, removeListener } = useDispatchContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    fg: {
      light: colors.error[5],
      dark: colors.error[6],
    },
  });

  React.useEffect(() => {
    const listener = (params: { count: number }) => {
      const { count } = params;
      setCount(count);
    };
    addListener('_demo_contact_list_total_request_count', listener);
    return () => {
      removeListener('_demo_contact_list_total_request_count', listener);
    };
  }, [addListener, removeListener]);

  return (
    <View
      style={{
        borderColor: getColor('bg'),
        borderWidth: 2,
        borderRadius: 50,
      }}
    >
      <Badges
        count={count}
        containerStyle={{ backgroundColor: getColor('fg') }}
      />
    </View>
  );
}

export function HomeScreen(props: Props) {
  const {} = props;
  const tabRef = React.useRef<TabPageRef>(null);
  const currentIndexRef = React.useRef<number>(0);
  const { tr } = useI18nContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const { updater } = useForceUpdate();
  const ra = getReleaseArea();
  const releaseAreaRef = React.useRef(ra);

  const { initParams } = useGeneralSetting();
  const [_initParams, setInitParams] = React.useState(false);

  const initParamsCallback = React.useCallback(async () => {
    if (_initParams === true) {
      return;
    }
    try {
      const ret = await initParams();
      releaseAreaRef.current = ret.appStyle === 'classic' ? 'china' : 'global';
      setInitParams(true);
    } catch (error) {
      setInitParams(true);
    }
  }, [_initParams, initParams, releaseAreaRef, setInitParams]);

  React.useEffect(() => {
    const ret8 = DeviceEventEmitter.addListener('_demo_emit_app_style', (e) => {
      console.log('dev:emit:app:style:', e);
      releaseAreaRef.current = e === 'classic' ? 'china' : 'global';
      updater();
    });

    return () => {
      ret8.remove();
    };
  }, [updater]);

  React.useEffect(() => {
    initParamsCallback().catch();
  }, [initParamsCallback]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
      }}
    >
      {/* <View
        style={{ height: 100, width: '100%' }}
        onTouchEnd={() => {
          const tmp = currentIndexRef.current + 1;
          tabRef.current?.changeIndex(tmp % 3);
        }}
      >
        <Text>{'change index'}</Text>
      </View> */}
      <TabPage
        ref={tabRef}
        header={{
          Header: BottomTabBar as any,
          HeaderProps: {
            titles:
              releaseAreaRef.current === 'global'
                ? [
                    {
                      icon: 'bubble_fill',
                    },
                    {
                      icon: 'person_double_fill',
                    },
                    {
                      icon: 'person_single_fill',
                    },
                  ]
                : [
                    {
                      title: tr('_demo_tab_conv_list'),
                      icon: 'bubble_fill',
                    },
                    {
                      title: tr('_demo_tab_contact_list'),
                      icon: 'person_double_fill',
                    },
                    {
                      title: tr('_demo_tab_mine'),
                      icon: 'person_single_fill',
                    },
                  ],
            StateViews: [ConversationBadge, ContactBadge],
          } as any,
        }}
        // body={{
        //   type: 'TabPageBodyT',
        //   BodyProps: {
        //     RenderChildren: BodyPagesT,
        //     RenderChildrenProps: {
        //       index: 0,
        //       currentIndex: 0,
        //     },
        //   },
        // }}
        body={{
          type: 'TabPageBodyLIST',
          BodyProps: {
            RenderChildren: [
              HomeTabConversationListScreen,
              HomeTabContactListScreen,
              HomeTabMineScreen,
            ],
            RenderChildrenProps: {
              index: 0,
              currentIndex: 0,
            },
            scrollEnabled: false,
          },
        }}
        headerPosition="down"
        initIndex={0}
        onCurrentIndex={(index) => {
          currentIndexRef.current = index;
        }}
      />
    </SafeAreaView>
  );
}

export function BodyPagesT({
  index,
  currentIndex,
}: {
  index: number;
  currentIndex: number;
}) {
  console.log('dev:BodyPagesT:', index, currentIndex);
  if (index === 0) {
    return <HomeTabConversationListScreen />;
  } else if (index === 1) {
    return <HomeTabContactListScreen />;
  } else if (index === 2) {
    return <View style={{ flexGrow: 1, backgroundColor: 'red' }} />;
  }
  return <View />;
}

export function BodyPagesLIST({
  index,
  currentIndex,
}: {
  index: number;
  currentIndex: number;
}) {
  console.log('dev:BodyPagesLIST:', index, currentIndex);
  return (
    <View
      style={{
        flexGrow: 1,
        backgroundColor: 'red',
        // height: 400,
      }}
    />
  );
}

type HomeTabConversationListScreenProps = {};
function HomeTabConversationListScreen(
  props: HomeTabConversationListScreenProps
) {
  const {} = props;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootScreenParamsList>>();

  const im = useChatContext();
  const { emit } = useDispatchContext();
  const updatedRef = React.useRef<boolean>(false);
  const updateData = React.useCallback(() => {
    if (updatedRef.current) {
      return;
    }
    updatedRef.current = true;
    im.getJoinedGroups({
      onResult: (r) => {
        if (r.value) {
          const groups: DataModel[] = [];
          r.value.forEach((conv) => {
            groups.push({
              id: conv.groupId,
              type: 'group',
              name: conv.groupName,
            });
          });
          im.updateRequestData({
            data: new Map([['group', groups ?? []]]),
          });
        }
      },
    });
  }, [im]);

  const onChangeUnreadCount = React.useCallback(
    (count: number) => {
      emit('_demo_conv_list_total_unread_count', {
        count,
      });
    },
    [emit]
  );

  React.useEffect(() => {
    const listener: EventServiceListener = {
      onFinished: (params) => {
        if (params.event === 'getAllConversations') {
          timeoutTask(500, updateData);
        }
      },
    };
    im.addListener(listener);
    return () => {
      im.removeListener(listener);
    };
  }, [im, updateData]);

  // React.useEffect(() => {
  //   timeoutTask(3000, updateData);
  // }, [im, updateData]);

  return (
    <ConversationList
      containerStyle={{
        flexGrow: 1,
        // backgroundColor: 'red',
        // height: 400,
      }}
      onChangeUnreadCount={onChangeUnreadCount}
      filterEmptyConversation={true}
      // onInitialized={updateData}
      // onRequestMultiData={(params: {
      //   ids: Map<DataModelType, string[]>;
      //   result: (
      //     data?: Map<DataModelType, DataModel[]>,
      //     error?: UIKitError
      //   ) => void;
      // }) => {
      //   const userIds = params.ids.get('user');
      //   const users = userIds?.map<DataModel>((id) => {
      //     return {
      //       id,
      //       name: id + 'name',
      //       // avatar: 'https://i.pravatar.cc/300',
      //       avatar:
      //         'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
      //       type: 'user' as DataModelType,
      //     };
      //   });
      //   const groupIds = params.ids.get('group');
      //   const groups = groupIds?.map<DataModel>((id) => {
      //     return {
      //       id,
      //       name: id + 'name',
      //       avatar:
      //         'https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-2-512.png',
      //       type: 'group' as DataModelType,
      //     };
      //   });
      //   params?.result(
      //     new Map([
      //       ['user', users ?? []],
      //       ['group', groups ?? []],
      //     ])
      //   );
      // }}
      onClickedSearch={() => {
        navigation.navigate('SearchConversation', {});
      }}
      onClickedItem={(data) => {
        if (data === undefined) {
          return;
        }
        const convId = data?.convId;
        const convType = data?.convType;
        const convName = data?.convName;
        navigation?.navigate?.('ConversationDetail', {
          params: {
            convId,
            convType,
            convName: convName ?? convId,
            from: 'ConversationList',
            hash: Date.now(),
          },
        });
      }}
      onClickedNewGroup={() => {
        navigation?.navigate?.('CreateGroup', {});
      }}
      onClickedNewConversation={() => {
        navigation?.navigate?.('NewConversation', {});
      }}
    />
  );
}
export type HomeTabContactListScreenProps = {};
function HomeTabContactListScreen(props: HomeTabContactListScreenProps) {
  const {} = props;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootScreenParamsList>>();
  const { emit } = useDispatchContext();

  const onChangeRequestCount = React.useCallback(
    (count: number) => {
      emit('_demo_contact_list_total_request_count', { count });
    },
    [emit]
  );

  return (
    <ContactList
      contactType={'contact-list'}
      containerStyle={{
        flexGrow: 1,
        // backgroundColor: 'red',
        // height: 400,
      }}
      onChangeRequestCount={onChangeRequestCount}
      // navigationBarVisible={false}
      // onRequestMultiData={(params: {
      //   ids: Map<DataModelType, string[]>;
      //   result: (
      //     data?: Map<DataModelType, DataModel[]>,
      //     error?: UIKitError
      //   ) => void;
      // }) => {
      //   const userIds = params.ids.get('user');
      //   const users = userIds?.map<DataModel>((id) => {
      //     return {
      //       id,
      //       name: id + 'name',
      //       // avatar: 'https://i.pravatar.cc/300',
      //       avatar:
      //         'https://cdn2.iconfinder.com/data/icons/valentines-day-flat-line-1/58/girl-avatar-512.png',
      //       type: 'user' as DataModelType,
      //     };
      //   });
      //   const groupIds = params.ids.get('group');
      //   const groups = groupIds?.map<DataModel>((id) => {
      //     return {
      //       id,
      //       name: id + 'name',
      //       avatar:
      //         'https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-2-512.png',
      //       type: 'group' as DataModelType,
      //     };
      //   });
      //   params?.result(
      //     new Map([
      //       ['user', users ?? []],
      //       ['group', groups ?? []],
      //     ])
      //   );
      // }}
      onClickedSearch={() => {
        navigation.navigate('SearchContact', {
          params: { searchType: 'contact-list' },
        });
      }}
      // onClickedNewGroup={() => {
      //   navigation.navigate('CreateGroup', {
      //     params: { searchType: 'create-group' },
      //   });
      // }}
      // onClickedNewConversation={() => {
      //   navigation.navigate('NewConversation', {
      //     params: { searchType: 'new-conversation' },
      //   });
      // }}
      onClickedItem={(data) => {
        if (data?.userId) {
          navigation.navigate('ContactInfo', {
            params: { userId: data.userId },
          });
        }
      }}
      onClickedGroupList={() => {
        navigation.navigate('GroupList', {
          params: {},
        });
      }}
      onClickedNewRequest={() => {
        navigation.navigate('NewRequests', {
          params: {},
        });
      }}
    />
  );
}

export type HomeTabMineScreenProps = {};
function HomeTabMineScreen(props: HomeTabMineScreenProps) {
  const {} = props;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootScreenParamsList>>();
  const im = useChatContext();
  const { tr } = useI18nContext();
  const [userId, setUserId] = React.useState<string>();
  const { autoLoginAction } = useLogin();
  const { getAlertRef } = useAlertContext();

  const s = React.useCallback(async () => {
    const autoLogin = im.client.options?.autoLogin ?? false;
    if (autoLogin === true) {
      autoLoginAction({
        onResult: () => {
          setUserId(im.userId);
        },
      });
    } else {
      setUserId(im.userId);
    }
  }, [autoLoginAction, im]);

  React.useEffect(() => {
    s().catch();
  }, [s]);

  if (userId) {
    return (
      <MineInfo
        userId={userId}
        onClickedLogout={() => {
          getAlertRef()?.alertWithInit({
            title: tr('_demo_logout_title'),
            buttons: [
              {
                text: tr('cancel'),
                isPreferred: false,
                onPress: () => {
                  getAlertRef()?.close();
                },
              },
              {
                text: tr('confirm'),
                isPreferred: true,
                onPress: () => {
                  getAlertRef()?.close(() => {
                    if (demoType === 3) {
                      im.logout({});
                      navigation.replace('Login', {});
                    } else if (demoType === 4) {
                      im.logout({});
                      navigation.replace('LoginV2', {});
                    }
                  });
                },
              },
            ],
          });
        }}
        onClickedCommon={() => {
          navigation.push('CommonSetting', {});
        }}
        onClickedPersonInfo={() => {
          navigation.push('PersonInfo', {});
        }}
        onClickedAbout={() => {
          navigation.push('AboutSetting', {});
        }}
        onClickedMessageNotification={() => {
          navigation.push('NotificationSetting', {});
        }}
      />
    );
  } else {
    return <View />;
  }
}
