import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CallConstKey } from '../../rename.callkit';
import type { ChatMessage } from '../../rename.uikit';
import {
  Badges,
  BottomTabBar,
  ContactItem,
  ContactList,
  ConversationList,
  ConversationListRef,
  getReleaseArea,
  TabPage,
  TabPageRef,
  useAlertContext,
  useChatContext,
  useColors,
  useDispatchContext,
  useForceUpdate,
  useI18nContext,
  usePaletteContext,
} from '../../rename.uikit';
import {
  useGeneralSetting,
  useLogin,
  useNativeStackRoute,
  useNavigationState,
} from '../hooks';
import type { RootScreenParamsList } from '../routes';
import { MineInfo } from '../ui/MineInfo';

type Props = NativeStackScreenProps<RootScreenParamsList>;

function useContactListItemActions() {
  const { navigate } = useNativeStackRoute();
  const { tr } = useI18nContext();
  const _onClickedBlockList = React.useCallback(() => {
    navigate({ to: 'BlockList' });
  }, [navigate]);
  const contactItems = React.useMemo(
    () => [
      <ContactItem
        key={'_uikit_contact_black_list'}
        name={tr('_uikit_contact_black_list')}
        count={<Badges count={0} />}
        hasArrow={true}
        onClicked={_onClickedBlockList}
      />,
    ],
    [_onClickedBlockList, tr]
  );
  return {
    contactItems,
  };
}

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
  useNavigationState(props);
  const im = useChatContext();

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

  React.useEffect(() => {
    im.getAllBlockList({
      isForce: true,
      onResult: () => {},
    });
  }, [im]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
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

type HomeTabConversationListScreenProps = {};
function HomeTabConversationListScreen(
  props: HomeTabConversationListScreenProps
) {
  const {} = props;
  const navi = useNativeStackRoute();
  const convRef = React.useRef<ConversationListRef>({} as any);
  const { emit } = useDispatchContext();

  const onChangeUnreadCount = React.useCallback(
    (count: number) => {
      emit('_demo_conv_list_total_unread_count', {
        count,
      });
    },
    [emit]
  );

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'onSignallingMessage',
      (data) => {
        const d = data as { type: string; extra: any };
        if (d.type === 'callSignal') {
          const msg = d.extra as ChatMessage;
          const action = msg.attributes?.[CallConstKey.KeyAction];
          if (action === CallConstKey.KeyInviteAction) {
            convRef.current.reloadList();
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
  }, []);

  return (
    <ConversationList
      propsRef={convRef}
      onChangeUnreadCount={onChangeUnreadCount}
      filterEmptyConversation={true}
      onClickedSearch={() => {
        navi.navigate({ to: 'SearchConversation' });
      }}
      onClickedItem={(data) => {
        if (data === undefined) {
          return;
        }
        const convId = data?.convId;
        const convType = data?.convType;
        const convName = data?.convName;
        navi.navigate({
          to: 'ConversationDetail',
          props: {
            convId,
            convType,
            convName: convName ?? convId,
          },
        });
      }}
      onClickedNewGroup={() => {
        navi.navigate({ to: 'CreateGroup' });
      }}
      onClickedNewConversation={() => {
        navi.navigate({ to: 'NewConversation' });
      }}
    />
  );
}
export type HomeTabContactListScreenProps = {};
function HomeTabContactListScreen(props: HomeTabContactListScreenProps) {
  const {} = props;
  const navi = useNativeStackRoute();
  const { emit } = useDispatchContext();
  const {} = useContactListItemActions();

  const onChangeRequestCount = React.useCallback(
    (count: number) => {
      emit('_demo_contact_list_total_request_count', { count });
    },
    [emit]
  );

  return (
    <ContactList
      contactType={'contact-list'}
      onChangeRequestCount={onChangeRequestCount}
      onClickedSearch={() => {
        navi.navigate({
          to: 'SearchContact',
          props: {
            searchType: 'contact-list',
          },
        });
      }}
      onClickedItem={(data) => {
        if (data?.userId) {
          navi.navigate({
            to: 'ContactInfo',
            props: {
              userId: data.userId,
            },
          });
        }
      }}
      onClickedGroupList={() => {
        navi.navigate({ to: 'GroupList' });
      }}
      onClickedNewRequest={() => {
        navi.navigate({ to: 'NewRequests' });
      }}
      // ListItemRender={() => (
      //   <View style={{ height: 20, backgroundColor: 'red' }} />
      // )}
      // isVisibleIndex={false}
      // isVisibleItemHeader={false}
      // onInitListItemActions={(data) => {
      //   data.push(...contactItems);
      //   return data;
      // }}
    />
  );
}

export type HomeTabMineScreenProps = {};
function HomeTabMineScreen(props: HomeTabMineScreenProps) {
  const {} = props;
  const navi = useNativeStackRoute();
  const { replace } = navi;
  const im = useChatContext();
  const { tr } = useI18nContext();
  const [userId, setUserId] = React.useState<string>();
  const { autoLoginAction, getFcmToken } = useLogin();
  const { getAlertRef } = useAlertContext();

  const s = React.useCallback(async () => {
    const autoLogin = im.client.options?.autoLogin ?? false;
    if (autoLogin === true) {
      autoLoginAction({
        onResult: (res) => {
          if (res.isOk) {
            setUserId(im.userId);
          } else {
            replace({ to: 'LoginV2' });
          }
        },
      });
    } else {
      setUserId(im.userId);
    }
  }, [autoLoginAction, im.client.options?.autoLogin, im.userId, replace]);

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
                    im.logout({
                      unbindDeviceToken: getFcmToken() !== undefined,
                      result: () => {
                        navi.replace({ to: 'LoginV2' });
                      },
                    });
                  });
                },
              },
            ],
          });
        }}
        onClickedCommon={() => {
          navi.push({ to: 'CommonSetting' });
        }}
        onClickedPersonInfo={() => {
          navi.push({ to: 'PersonInfo' });
        }}
        onClickedAbout={() => {
          navi.push({ to: 'AboutSetting' });
        }}
        onClickedMessageNotification={() => {
          navi.push({ to: 'NotificationSetting' });
        }}
        onClickedPrivacy={() => {
          navi.push({ to: 'PrivacySetting' });
        }}
      />
    );
  } else {
    return <View />;
  }
}
