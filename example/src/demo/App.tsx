import {
  NavigationAction,
  NavigationContainer,
  NavigationState,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';
import {
  CallUser,
  GlobalContainer as CallkitContainer,
} from 'react-native-chat-callkit';
import {
  ChatService,
  ChatServiceListener,
  Container,
  createDefaultStringSet,
  LanguageCode,
  StringSet,
  useChatListener,
} from 'react-native-chat-uikit';

import { createStringSetCn, createStringSetEn, ToastView } from './common';
import {
  accountType,
  agoraAppId,
  appKey as gAppKey,
  demoType,
  isDevMode,
  restServer,
} from './common/const';
import { RestApi } from './common/rest.api';
import { useApp } from './hooks/useApp';
import { useGeneralSetting } from './hooks/useGeneralSetting';
import { useServerConfig } from './hooks/useServerConfig';
import type { RootParamsList } from './routes';
import {
  AboutSettingScreen,
  AddGroupParticipantScreen,
  AVSelectGroupParticipantScreen,
  ChangeGroupOwnerScreen,
  ColorSettingScreen,
  ConfigScreen,
  ContactInfoScreen,
  ContactListScreen,
  ConversationDetailScreen,
  ConversationListScreen,
  CreateGroupScreen,
  CreateThreadScreen,
  DelGroupParticipantScreen,
  EditInfoScreen,
  FeatureSettingScreen,
  FileMessagePreviewScreen,
  GeneralSettingScreen,
  GroupInfoScreen,
  GroupListScreen,
  GroupParticipantInfoScreen,
  GroupParticipantListScreen,
  HomeScreen,
  ImageMessagePreviewScreen,
  LanguageSettingScreen,
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
  NotificationSettingScreen,
  PersonInfoScreen,
  SearchContactScreen,
  SearchConversationScreen,
  SearchGroupScreen,
  SelectSingleParticipantScreen,
  ServerSettingScreen,
  ShareContactScreen,
  SplashScreen,
  StyleSettingScreen,
  TopMenuScreen,
  VideoMessagePreviewScreen,
} from './screens';
import { defaultAvatars, formatNavigationState } from './utils/utils';

const Root = createNativeStackNavigator<RootParamsList>();

// SplashScreen?.preventAutoHideAsync?.();

export function App() {
  console.log('test:dev:App:', demoType);
  const {
    onRequestMultiData,
    initialRouteName,
    paletteRef,
    dark,
    light,
    isLightRef,
    languageRef,
    isNavigationReadyRef,
    isContainerReadyRef,
    isFontReadyRef,
    isReadyRef,
    enablePresenceRef,
    enableReactionRef,
    enableThreadRef,
    enableTranslateRef,
    enableAVMeetingRef,
    fontsLoaded,
    rootRef,
    imServerRef,
    imPortRef,
    enableDNSConfigRef,
    _initParams,
    setInitParams,
    releaseAreaRef,
    getOptions,
    enableOfflinePushRef,
    initPush,
  } = useApp();

  const { getEnableDNSConfig, getImPort, getImServer } = useServerConfig();
  const { initParams } = useGeneralSetting();
  const imRef = React.useRef<ChatService>();

  const initParamsCallback = React.useCallback(async () => {
    if (_initParams === true) {
      return;
    }
    try {
      imPortRef.current = await getImPort();
      imServerRef.current = await getImServer();
      enableDNSConfigRef.current = await getEnableDNSConfig();
      const ret = await initParams();
      isLightRef.current = !ret.appTheme;
      releaseAreaRef.current = ret.appStyle === 'classic' ? 'china' : 'global';
      languageRef.current = ret.appLanguage === 'en' ? 'en' : 'zh-Hans';
      enablePresenceRef.current = ret.appPresence;
      enableReactionRef.current = ret.appReaction;
      enableThreadRef.current = ret.appThread;
      enableTranslateRef.current = ret.appTranslate;
      enableAVMeetingRef.current = ret.appAv;
      enableOfflinePushRef.current = ret.appNotification;
      console.log(
        'dev:init:params:',
        isLightRef.current,
        releaseAreaRef.current,
        languageRef.current,
        enablePresenceRef.current,
        enableReactionRef.current,
        enableThreadRef.current,
        enableTranslateRef.current,
        enableAVMeetingRef.current,
        enableOfflinePushRef.current
      );
      setInitParams(true);
    } catch (error) {
      setInitParams(true);
    }
  }, [
    _initParams,
    enableAVMeetingRef,
    enableDNSConfigRef,
    enableOfflinePushRef,
    enablePresenceRef,
    enableReactionRef,
    enableThreadRef,
    enableTranslateRef,
    getEnableDNSConfig,
    getImPort,
    getImServer,
    imPortRef,
    imServerRef,
    initParams,
    isLightRef,
    languageRef,
    releaseAreaRef,
    setInitParams,
  ]);

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

      await initPush();

      // await SplashScreen?.hideAsync?.();
      if (demoType === 4) {
        setTimeout(async () => {
          const ret = await imRef.current?.loginState();
          console.log('dev:loginState:', ret);
          if (ret === 'logged') {
            rootRef.navigate('Home', {});
          } else {
            rootRef.navigate('LoginV2', {});
          }
        }, 1000);
      }
    },
    [isReadyRef, rootRef, initPush]
  );

  const onContainerInitialized = React.useCallback(
    (im: ChatService) => {
      imRef.current = im;
      isContainerReadyRef.current = true;
      if (
        isFontReadyRef.current === true &&
        isNavigationReadyRef.current === true &&
        isContainerReadyRef.current === true
      ) {
        onReady(true);
      }
    },
    [isContainerReadyRef, isFontReadyRef, isNavigationReadyRef, onReady]
  );

  const onNavigationInitialized = React.useCallback(() => {
    isNavigationReadyRef.current = true;
    if (
      isFontReadyRef.current === true &&
      isNavigationReadyRef.current === true &&
      isContainerReadyRef.current === true
    ) {
      onReady(true);
    }
  }, [isContainerReadyRef, isFontReadyRef, isNavigationReadyRef, onReady]);

  React.useEffect(() => {
    initParamsCallback().then().catch();
  }, [initParamsCallback]);

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
  }, [
    fontsLoaded,
    isContainerReadyRef,
    isFontReadyRef,
    isNavigationReadyRef,
    onReady,
  ]);

  if (_initParams === false) {
    // !!! This is a workaround for the issue that the app will not start if the
    // !!! `initParams` is not called in the `useEffect` hook.
    return null;
  }

  return (
    <React.StrictMode>
      <Container
        options={getOptions()}
        palette={paletteRef.current}
        theme={isLightRef.current ? light : dark}
        language={languageRef.current}
        releaseArea={releaseAreaRef.current}
        enablePresence={enablePresenceRef.current}
        enableReaction={enableReactionRef.current}
        enableThread={enableThreadRef.current}
        enableTranslate={enableTranslateRef.current}
        enableAVMeeting={enableAVMeetingRef.current}
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
            imRef.current?.client
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
              <Root.Screen
                name={'PersonInfo'}
                options={{
                  headerShown: false,
                }}
                component={PersonInfoScreen}
              />
              <Root.Screen
                name={'CommonSetting'}
                options={{
                  headerShown: false,
                }}
                component={GeneralSettingScreen}
              />
              <Root.Screen
                name={'LanguageSetting'}
                options={{
                  headerShown: false,
                }}
                component={LanguageSettingScreen}
              />
              <Root.Screen
                name={'ColorSetting'}
                options={{
                  headerShown: false,
                }}
                component={ColorSettingScreen}
              />
              <Root.Screen
                name={'StyleSetting'}
                options={{
                  headerShown: false,
                }}
                component={StyleSettingScreen}
              />
              <Root.Screen
                name={'AboutSetting'}
                options={{
                  headerShown: false,
                }}
                component={AboutSettingScreen}
              />
              <Root.Screen
                name={'FeatureSetting'}
                options={{
                  headerShown: false,
                }}
                component={FeatureSettingScreen}
              />
              <Root.Screen
                name={'NotificationSetting'}
                options={{
                  headerShown: false,
                }}
                component={NotificationSettingScreen}
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
