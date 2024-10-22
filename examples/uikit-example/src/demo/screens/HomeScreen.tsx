import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';
import {
  Badges,
  ChatServiceListener,
  ContactList,
  ConversationList,
  DisconnectReasonType,
  TabPage,
  TabPageRef,
  useChatContext,
  useChatListener,
  useColors,
  useDispatchContext,
  useI18nContext,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

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
          Header: TabPage.TabBarHeader,
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
  const { emit } = useDispatchContext();

  const onChangeUnreadCount = React.useCallback(
    (count: number) => {
      emit('_demo_conv_list_total_unread_count', {
        count,
      });
    },
    [emit]
  );

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
