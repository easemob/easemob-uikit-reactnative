import {
  NavigationAction,
  NavigationContainer,
  NavigationState,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as React from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import {
  CallUser,
  GlobalContainer as CallkitContainer,
} from 'react-native-chat-callkit';
import { ChatClient } from 'react-native-chat-sdk';
import {
  AsyncStorageBasic,
  ChatOptionsType,
  ChatServiceListener,
  Container,
  createDefaultStringSet,
  LanguageCode,
  SingletonObjects,
  StringSet,
  useChatListener,
  useDarkTheme,
  useLightTheme,
  usePermissions,
  usePresetPalette,
} from 'react-native-chat-uikit';

import { createStringSetCn, createStringSetEn, ToastView } from './common';
import {
  accountType,
  agoraAppId,
  appKey as gAppKey,
  demoType,
  enableDNSConfig,
  imPort,
  imServer,
  isDevMode,
  restServer,
  useSendBox,
} from './common/const';
import { RestApi } from './common/rest.api';
import { useApp } from './hooks/useApp';
import type { RootParamsList, RootParamsName } from './routes';
import {
  AddGroupParticipantScreen,
  AVSelectGroupParticipantScreen,
  ChangeGroupOwnerScreen,
  CommonSettingScreen,
  ConfigScreen,
  ContactInfoScreen,
  ContactListScreen,
  ConversationDetailScreen,
  ConversationListScreen,
  CreateGroupScreen,
  CreateThreadScreen,
  DelGroupParticipantScreen,
  EditInfoScreen,
  FileMessagePreviewScreen,
  GroupInfoScreen,
  GroupListScreen,
  GroupParticipantInfoScreen,
  GroupParticipantListScreen,
  HomeScreen,
  ImageMessagePreviewScreen,
  LoginListScreen,
  LoginScreen,
  LoginV2Screen,
  MessageForwardSelectorScreen,
  MessageHistoryListScreen,
  MessageHistoryScreen,
  MessageSearchScreen,
  MessageThreadDetailScreen,
  MessageThreadListScreen,
  MessageThreadMemberListScreen,
  NewConversationScreen,
  NewRequestScreen,
  SearchContactScreen,
  SearchConversationScreen,
  SearchGroupScreen,
  SelectSingleParticipantScreen,
  ServerSettingScreen,
  ShareContactScreen,
  SplashScreen,
  TopMenuScreen,
  VideoMessagePreviewScreen,
} from './screens';
import { defaultAvatars } from './utils/utils';

const Root = createNativeStackNavigator<RootParamsList>();

// SplashScreen?.preventAutoHideAsync?.();

export function App() {
  console.log('test:dev:App:', demoType);
  const [initialRouteName] = React.useState(
    demoType === 2
      ? ('TopMenu' as RootParamsName)
      : demoType === 3
      ? ('Login' as RootParamsName)
      : ('Splash' as RootParamsName)
  );
  const palette = usePresetPalette();
  const dark = useDarkTheme(palette);
  const light = useLightTheme(palette);
  const [theme, setTheme] = React.useState(light);
  const [language, setLanguage] = React.useState<LanguageCode>('zh-Hans');
  const isNavigationReadyRef = React.useRef(false);
  const isContainerReadyRef = React.useRef(false);
  const isFontReadyRef = React.useRef(false);
  const isReadyRef = React.useRef(false);
  const fontFamily = 'Twemoji-Mozilla';
  const [fontsLoaded] = useFonts({
    [fontFamily]: require('../../assets/Twemoji.Mozilla.ttf'),
  });
  const rootRef = useNavigationContainerRef<RootParamsList>();
  const imServerRef = React.useRef(imServer);
  const imPortRef = React.useRef(imPort);
  const enableDNSConfigRef = React.useRef(enableDNSConfig);
  const [_initParams, setInitParams] = React.useState(false);

  const permissionsRef = React.useRef(false);
  const { getPermission } = usePermissions();

  const { onRequestMultiData } = useApp();

  const getImServer = async () => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    try {
      const ret = await s.getData({ key: 'imServer' });
      if (ret.value === undefined) {
        return imServer;
      }
      return ret.value;
    } catch (error) {
      return undefined;
    }
  };
  const getImPort = async () => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    try {
      const ret = await s.getData({ key: 'imPort' });
      if (ret.value === undefined) {
        return imPort;
      }
      if (ret.value) {
        return ret.value;
      }
      return undefined;
    } catch (error) {
      return undefined;
    }
  };
  const getEnableDNSConfig = async () => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${gAppKey}/uikit/demo`,
    });
    try {
      const ret = await s.getData({ key: 'enablePrivateServer' });
      if (ret.value === undefined) {
        return enableDNSConfig;
      }
      return ret.value === 'true'
        ? true
        : ret.value === 'false'
        ? false
        : (useSendBox as boolean);
    } catch (error) {
      return false;
    }
  };

  const initParams = React.useCallback(async () => {
    if (_initParams === true) {
      return;
    }
    try {
      imPortRef.current = await getImPort();
      imServerRef.current = await getImServer();
      enableDNSConfigRef.current = await getEnableDNSConfig();
      setInitParams(true);
    } catch (error) {
      setInitParams(true);
    }
  }, [_initParams]);

  // const options = React.useMemo(() => {
  //   return {
  //     appKey: env.appKey,
  //     debugModel: env.isDevMode,
  //     autoLogin: false,
  //     autoAcceptGroupInvitation: true,
  //     requireAck: true,
  //     requireDeliveryAck: true,
  //     restServer: restServer,
  //     imServer: imServerRef.current,
  //     imPort: imPortRef.current,
  //     enableDNSConfig: enableDNSConfigRef.current,
  //   } as ChatOptionsType;
  // }, []);

  const getOptions = React.useCallback(() => {
    return {
      appKey: gAppKey,
      debugModel: isDevMode,
      autoLogin: false,
      autoAcceptGroupInvitation: true,
      requireAck: true,
      requireDeliveryAck: true,
      restServer: useSendBox ? restServer : undefined,
      imServer: useSendBox ? imServerRef.current : undefined,
      imPort: useSendBox ? imPortRef.current : undefined,
      enableDNSConfig: useSendBox ? enableDNSConfigRef.current : undefined,
    } as ChatOptionsType;
  }, []);

  const formatNavigationState = (
    state: NavigationState | undefined,
    result: string[] & string[][]
  ) => {
    if (state) {
      const ret: string[] & string[][] = [];
      for (const route of state.routes) {
        ret.push(route.name);
        if (route.state) {
          formatNavigationState(
            route.state as NavigationState | undefined,
            ret
          );
        }
      }
      result.push(ret);
    }
  };

  const onReady = React.useCallback(
    async (_ready: boolean) => {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      // setTimeout(async () => {
      //   await SplashScreen.hideAsync();
      // }, 2000);
      if (isReadyRef.current === true) {
        return;
      }
      isReadyRef.current = true;
      RestApi.setServer(restServer);
      // await SplashScreen?.hideAsync?.();
      if (demoType === 4) {
        setTimeout(() => {
          rootRef.navigate('LoginV2', {});
        }, 1000);
      }
    },
    [rootRef]
  );

  const onContainerInitialized = React.useCallback(() => {
    isContainerReadyRef.current = true;
    if (
      isFontReadyRef.current === true &&
      isNavigationReadyRef.current === true &&
      isContainerReadyRef.current === true
    ) {
      onReady(true);
    }
  }, [onReady]);

  const onNavigationInitialized = React.useCallback(() => {
    isNavigationReadyRef.current = true;
    if (
      isFontReadyRef.current === true &&
      isNavigationReadyRef.current === true &&
      isContainerReadyRef.current === true
    ) {
      onReady(true);
    }
  }, [onReady]);

  React.useEffect(() => {
    getPermission({
      onResult: (isSuccess: boolean) => {
        console.log('dev:permissions:', isSuccess);
        permissionsRef.current = isSuccess;
      },
    });
  }, [getPermission]);

  React.useEffect(() => {
    const ret = DeviceEventEmitter.addListener('example_change_theme', (e) => {
      if (e === 'dark') {
        setTheme(dark);
      } else {
        setTheme(light);
      }
    });
    const ret2 = DeviceEventEmitter.addListener(
      'example_change_language',
      (e) => {
        setLanguage(e);
      }
    );
    return () => {
      ret.remove();
      ret2.remove();
    };
  }, [dark, light]);

  React.useEffect(() => {
    initParams().then().catch();
  }, [initParams]);

  React.useEffect(() => {
    if (fontsLoaded) {
      isFontReadyRef.current = true;
      if (
        isFontReadyRef.current === true &&
        isNavigationReadyRef.current === true &&
        isContainerReadyRef.current === true
      ) {
        console.log('dev:ready');
        onReady(true);
      }
    }
  }, [fontsLoaded, onReady]);

  if (_initParams === false) {
    // !!! This is a workaround for the issue that the app will not start if the
    // !!! `initParams` is not called in the `useEffect` hook.
    return null;
  }

  return (
    <React.StrictMode>
      <Container
        options={getOptions()}
        palette={palette}
        theme={theme}
        language={language}
        enablePresence={true}
        enableReaction={true}
        enableThread={true}
        enableTranslate={true}
        enableAVMeeting={true}
        // enableTranslate={false}
        avatar={{
          personAvatar: defaultAvatars[2],
          groupAvatar: defaultAvatars[0],
        }}
        // fontFamily={fontFamily}
        // languageExtensionFactory={languageExtensionFactory}
        onInitialized={onContainerInitialized}
        onInitLanguageSet={() => {
          const ret = (
            language: LanguageCode,
            _defaultSet: StringSet
          ): StringSet => {
            const d = createDefaultStringSet(language);
            if (language === 'zh-Hans') {
              return {
                ...d,
                ...createStringSetCn(),
              };
            } else if (language === 'en') {
              return {
                ...d,
                ...createStringSetEn(),
              };
            }
            return d;
          };
          return ret;
        }}
        onRequestMultiData={onRequestMultiData}
        // formatTime={formatTime}
        // recallTimeout={1200}
        // group={{ createGroupMemberLimit: 2 }}
      >
        <CallkitContainer
          option={{
            appKey: gAppKey,
            agoraAppId: agoraAppId,
          }}
          type={accountType as any}
          enableLog={isDevMode}
          requestRTCToken={(params: {
            appKey: string;
            channelId: string;
            userId: string;
            userChannelId?: number | undefined;
            type?: 'easemob' | 'agora' | undefined;
            onResult: (params: { data?: any; error?: any }) => void;
          }) => {
            console.log('requestRTCToken:', params);
            RestApi.reqGetRtcToken({
              userId: params.userId,
              channelId: params.channelId,
            })
              .then((res) => {
                params.onResult({
                  error: res.isOk !== true ? res.error : undefined,
                  data: {
                    uid:
                      res.value?.agoraUid !== undefined
                        ? +res.value.agoraUid
                        : 0,
                    token: res.value?.accessToken,
                  },
                });
              })
              .catch((e) => {
                console.warn('dev:reqGetRtcToken:error:', e);
              });
          }}
          requestUserMap={(params: {
            appKey: string;
            channelId: string;
            userId: string;
            onResult: (params: { data?: any; error?: any }) => void;
          }) => {
            console.log('requestUserMap:', params);
            RestApi.reqGetRtcMap({
              channelId: params.channelId,
            })
              .then((res) => {
                params.onResult({
                  error: res.isOk !== true ? res.error : undefined,
                  data: {
                    result: res.value?.result,
                  },
                });
              })
              .catch((e) => {
                console.warn('dev:reqGetRtcToken:error:', e);
              });
          }}
          requestCurrentUser={(params: {
            onResult: (params: { user: CallUser; error?: any }) => void;
          }) => {
            console.log('requestCurrentUser:', params);
            ChatClient.getInstance()
              .getCurrentUsername()
              .then((result) => {
                params.onResult({
                  user: {
                    userId: result,
                    userName: `${result}_self_name`,
                    userAvatarUrl:
                      'https://cdn3.iconfinder.com/data/icons/vol-2/128/dog-128.png',
                  },
                });
              })
              .catch((error) => {
                console.warn('test:getCurrentUsername:error:', error);
              });
          }}
          requestUserInfo={(params: {
            userId: string;
            onResult: (params: { user: CallUser; error?: any }) => void;
          }) => {
            console.log('requestCurrentUser:', params);
            // pseudo
            params.onResult({
              user: {
                userId: params.userId,
                userName: `${params.userId}_name2`,
                userAvatarUrl:
                  'https://cdn2.iconfinder.com/data/icons/pet-and-veterinary-1/85/dog_charity_love_adopt_adoption-128.png',
              },
            });
          }}
        >
          <NavigationContainer
            ref={rootRef}
            onStateChange={(state: NavigationState | undefined) => {
              const rr: string[] & string[][] = [];
              formatNavigationState(state, rr);
              console.log(
                'dev:onStateChange:',
                JSON.stringify(rr, undefined, '  ')
              );
              // console.log('onStateChange:o:', JSON.stringify(state));
            }}
            onUnhandledAction={(action: NavigationAction) => {
              console.log('dev:onUnhandledAction:', action);
            }}
            onReady={onNavigationInitialized}
            fallback={
              <View
                style={{ height: 100, width: 100, backgroundColor: 'red' }}
              />
            }
          >
            <Root.Navigator initialRouteName={initialRouteName}>
              <Root.Screen
                name={'TopMenu'}
                options={{
                  headerShown: true,
                }}
                component={TopMenuScreen}
              />
              <Root.Screen
                name={'Home'}
                options={{
                  headerShown: false,
                }}
                component={HomeScreen}
              />
              <Root.Screen
                name={'Config'}
                options={{
                  headerShown: true,
                }}
                component={ConfigScreen}
              />
              <Root.Screen
                name={'Login'}
                options={{
                  headerShown: true,
                }}
                component={LoginScreen}
              />
              <Root.Screen
                name={'LoginList'}
                options={{
                  headerShown: true,
                }}
                component={LoginListScreen}
              />
              <Root.Screen
                name={'ConversationList'}
                options={{
                  headerShown: false,
                }}
                component={ConversationListScreen}
              />
              <Root.Screen
                name={'ContactList'}
                options={{
                  headerShown: false,
                }}
                component={ContactListScreen}
              />
              <Root.Screen
                name={'SearchConversation'}
                options={{
                  headerShown: false,
                }}
                component={SearchConversationScreen}
              />
              <Root.Screen
                name={'SearchContact'}
                options={{
                  headerShown: false,
                }}
                component={SearchContactScreen}
              />
              <Root.Screen
                name={'GroupList'}
                options={{
                  headerShown: false,
                }}
                component={GroupListScreen}
              />
              <Root.Screen
                name={'SearchGroup'}
                options={{
                  headerShown: false,
                }}
                component={SearchGroupScreen}
              />
              <Root.Screen
                name={'GroupParticipantList'}
                options={{
                  headerShown: false,
                }}
                component={GroupParticipantListScreen}
              />
              <Root.Screen
                name={'NewConversation'}
                options={{
                  headerShown: false,
                }}
                component={NewConversationScreen}
              />
              <Root.Screen
                name={'NewRequests'}
                options={{
                  headerShown: false,
                }}
                component={NewRequestScreen}
              />
              <Root.Screen
                name={'CreateGroup'}
                options={{
                  headerShown: false,
                }}
                component={CreateGroupScreen}
              />
              <Root.Screen
                name={'ContactInfo'}
                options={{
                  headerShown: false,
                }}
                component={ContactInfoScreen}
              />
              <Root.Screen
                name={'GroupInfo'}
                options={{
                  headerShown: false,
                }}
                component={GroupInfoScreen}
              />
              <Root.Screen
                name={'GroupParticipantInfo'}
                options={{
                  headerShown: false,
                }}
                component={GroupParticipantInfoScreen}
              />
              <Root.Screen
                name={'AddGroupParticipant'}
                options={{
                  headerShown: false,
                }}
                component={AddGroupParticipantScreen}
              />
              <Root.Screen
                name={'DelGroupParticipant'}
                options={{
                  headerShown: false,
                }}
                component={DelGroupParticipantScreen}
              />
              <Root.Screen
                name={'ChangeGroupOwner'}
                options={{
                  headerShown: false,
                }}
                component={ChangeGroupOwnerScreen}
              />
              <Root.Screen
                name={'ConversationDetail'}
                options={{
                  headerShown: false,
                }}
                component={ConversationDetailScreen}
              />
              <Root.Screen
                name={'SelectSingleParticipant'}
                options={{
                  headerShown: false,
                }}
                component={SelectSingleParticipantScreen}
              />
              <Root.Screen
                name={'FileMessagePreview'}
                options={{
                  headerShown: false,
                }}
                component={FileMessagePreviewScreen}
              />
              <Root.Screen
                name={'ImageMessagePreview'}
                options={{
                  headerShown: false,
                }}
                component={ImageMessagePreviewScreen}
              />
              <Root.Screen
                name={'VideoMessagePreview'}
                options={{
                  headerShown: false,
                }}
                component={VideoMessagePreviewScreen}
              />
              <Root.Screen
                name={'ShareContact'}
                options={{
                  headerShown: false,
                }}
                component={ShareContactScreen}
              />
              <Root.Screen
                name={'EditInfo'}
                options={{
                  headerShown: false,
                }}
                component={EditInfoScreen}
              />
              <Root.Screen
                name={'CommonSetting'}
                options={{
                  headerShown: false,
                }}
                component={CommonSettingScreen}
              />
              <Root.Screen
                name={'CreateThread'}
                options={{
                  headerShown: false,
                }}
                component={CreateThreadScreen}
              />
              <Root.Screen
                name={'MessageThreadDetail'}
                options={{
                  headerShown: false,
                }}
                component={MessageThreadDetailScreen}
              />
              <Root.Screen
                name={'MessageThreadList'}
                options={{
                  headerShown: false,
                }}
                component={MessageThreadListScreen}
              />
              <Root.Screen
                name={'MessageThreadMemberList'}
                options={{
                  headerShown: false,
                }}
                component={MessageThreadMemberListScreen}
              />
              <Root.Screen
                name={'MessageForwardSelector'}
                options={{
                  headerShown: false,
                }}
                component={MessageForwardSelectorScreen}
              />
              <Root.Screen
                name={'MessageHistoryList'}
                options={{
                  headerShown: false,
                }}
                component={MessageHistoryListScreen}
              />
              <Root.Screen
                name={'MessageSearch'}
                options={{
                  headerShown: false,
                }}
                component={MessageSearchScreen}
              />
              <Root.Screen
                name={'MessageHistory'}
                options={{
                  headerShown: false,
                }}
                component={MessageHistoryScreen}
              />
              <Root.Screen
                name={'Splash'}
                options={{
                  headerShown: false,
                }}
                component={SplashScreen}
              />
              <Root.Screen
                name={'LoginV2'}
                options={{
                  headerShown: false,
                }}
                component={LoginV2Screen}
              />
              <Root.Screen
                name={'LoginV2Setting'}
                options={{
                  headerShown: false,
                }}
                component={ServerSettingScreen}
              />
              <Root.Screen
                name={'AVSelectGroupParticipant'}
                options={{
                  headerShown: false,
                }}
                component={AVSelectGroupParticipantScreen}
              />
            </Root.Navigator>
          </NavigationContainer>
        </CallkitContainer>

        <TestListener />
        <ToastView />
      </Container>
    </React.StrictMode>
  );
}

export function TestListener() {
  useChatListener(
    React.useMemo(() => {
      return {
        onError: (params) => {
          console.log('dev:app:onError:', JSON.stringify(params));
        },
        onFinished: (params) => {
          console.log('dev:app:onFinished:', params);
        },
      } as ChatServiceListener;
    }, [])
  );
  return <></>;
}
