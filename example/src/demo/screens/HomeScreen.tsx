import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';
import {
  BottomTabBar,
  ChatServiceListener,
  ContactList,
  ConversationList,
  DataModel,
  DisconnectReasonType,
  EventServiceListener,
  TabPage,
  TabPageRef,
  timeoutTask,
  useChatContext,
  useChatListener,
  useColors,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';
import { CommonInfo } from '../ui/CommonInfo';
import { MineInfo } from '../ui/MineInfo';

const env = require('../../env');
const demoType = env.demoType;

type Props = NativeStackScreenProps<RootScreenParamsList>;

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
            titles: [
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

  return (
    <ContactList
      contactType={'contact-list'}
      containerStyle={{
        flexGrow: 1,
        // backgroundColor: 'red',
        // height: 400,
      }}
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
  const [userId, setUserId] = React.useState<string>();

  useChatListener(
    React.useMemo(() => {
      return {
        onConnected: (): void => {
          setUserId(im.userId);
        },
        onDisconnected: (reason: DisconnectReasonType): void => {
          if (reason === DisconnectReasonType.others) {
            return;
          }
          setUserId(undefined);
        },
      } as ChatServiceListener;
    }, [im.userId])
  );

  React.useEffect(() => {
    if (im.userId) {
      setUserId(im.userId);
    }
  }, [im.userId]);

  if (userId) {
    return (
      <MineInfo
        userId={userId}
        onClickedLogout={() => {
          if (demoType === 3) {
            navigation.replace('Login', {});
          }
        }}
        onClickedCommon={() => {
          navigation.push('CommonSetting', {});
        }}
      />
    );
  } else {
    return <View />;
  }
}

export function CommonSettingScreen(props: Props) {
  const { navigation } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
      }}
    >
      <CommonInfo
        onBack={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
