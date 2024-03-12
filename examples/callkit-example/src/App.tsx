import './utils/globals';

import {
  DefaultTheme as NDefaultTheme,
  NavigationAction,
  NavigationContainer,
  NavigationState,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { registerRootComponent } from 'expo';
import * as React from 'react';
import { DeviceEventEmitter, Linking, Platform, View } from 'react-native';
import {
  CallUser,
  GlobalContainer as CallkitContainer,
} from 'react-native-chat-callkit';
import { ChatClient, ChatPushConfig } from 'react-native-chat-sdk';
import {
  Container as UikitContainer,
  createDefaultStringSet,
  LanguageCode,
  LoadingIcon,
  Services,
  StringSet,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';

import Dev from './__dev__';
import { createStringSetCn } from './I18n/StringSet.cn';
import { createStringSetEn } from './I18n/StringSet.en';
import type { RootParamsList, RootParamsName } from './routes';
import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import { SplashScreen } from './screens/Splash';
import { TestScreen } from './screens/Test';
import { AppServerClient } from './utils/AppServer';
import {
  checkFCMPermission,
  requestFCMPermission,
  // requestFcmToken,
  setBackgroundMessageHandler,
} from './utils/fcm';
import { requestAndroidVideo } from './utils/permission';

if (Platform.OS === 'web') {
  console.error('web platforms are not supported.');
}

const Root = createNativeStackNavigator<RootParamsList>();

const __KEY__ = '__KEY__';
let __TEST__ = true;
let appKey = '';
let agoraAppId = '';
let fcmSenderId: string | undefined;
let accountType: 'easemob' | 'agora' | undefined;

try {
  const env = require('./env');
  __TEST__ = env.test ?? false;
  appKey = env.appKey;
  agoraAppId = env.agoraAppId;
  fcmSenderId = env.fcmSenderId;
  accountType = env.accountType;
} catch (e) {
  console.warn('test:', e);
}

console.log('DEV:', __DEV__);
console.log('TEST:', __TEST__);

// let fcmToken = '';
// if (fcmSenderId && fcmSenderId.length > 0) {
//   fcmToken = await requestFcmToken();
// }

export default function App() {
  const palette = usePresetPalette();
  const light = useLightTheme(palette);
  const [isReady, setIsReady] = React.useState(__DEV__ ? true : true);
  const [initialState, setInitialState] = React.useState();
  const [initialRouteName] = React.useState('Splash' as RootParamsName);

  const autoLogin = React.useRef(true);
  const RootRef = useNavigationContainerRef<RootParamsList>();
  const isOnInitialized = React.useRef(false);
  const isOnReady = React.useRef(false);
  const enableLog = true;

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          if (Services.ls) {
            const savedStateString = await Services.ls.getItem(__KEY__);
            const state = savedStateString
              ? JSON.parse(savedStateString)
              : undefined;

            if (state !== undefined) {
              setInitialState(state);
            }
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);
  console.log('test:App:isReady:', isReady);

  const onInitApp = React.useCallback(async () => {
    console.log('test:onInitApp:', isOnInitialized, isOnReady);
    if (isOnInitialized.current === false || isOnReady.current === false) {
      return;
    }

    if (accountType !== 'easemob') {
      AppServerClient.rtcTokenUrl = 'http://a41.easemob.com/token/rtc/channel';
      AppServerClient.mapUrl = 'http://a41.easemob.com/agora/channel/mapper';
    }

    if ((await checkFCMPermission()) === false) {
      const ret = await requestFCMPermission();
      if (ret === false) {
        console.warn('Firebase Cloud Message Permission request failed.');
        return;
      }
    }
    if ((await requestAndroidVideo()) === false) {
      console.warn('Video and Audio Permission request failed.');
      return;
    }

    setBackgroundMessageHandler();
    // try {
    //   const fcmToken = await requestFcmToken();
    //   console.log('test:requestFcmToken:', fcmSenderId, fcmToken);
    //   ChatClient.getInstance().updatePushConfig(
    //     new ChatPushConfig({
    //       deviceId: fcmSenderId,
    //       deviceToken: fcmToken,
    //     })
    //   );
    // } catch (error) {
    //   console.warn('test:requestFcmToken:error', error);
    // }

    DeviceEventEmitter.emit('on_initialized', {
      autoLogin: autoLogin.current,
      navigation: RootRef,
    });

    console.log('test:onInitApp:');
  }, [RootRef]);

  if (!isReady) {
    return null;
  }

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

  return (
    <React.StrictMode>
      <UikitContainer
        options={{
          appKey: appKey,
          autoLogin: autoLogin.current,
          debugModel: true,
          pushConfig:
            fcmSenderId && fcmSenderId.length > 0
              ? new ChatPushConfig({
                  deviceId: fcmSenderId,
                  deviceToken: '',
                })
              : undefined,
        }}
        onInitialized={() => {
          isOnInitialized.current = true;
          onInitApp();
        }}
        theme={light}
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
      >
        <CallkitContainer
          option={{
            appKey: appKey,
            agoraAppId: agoraAppId,
          }}
          type={accountType}
          enableLog={enableLog}
          requestRTCToken={(params: {
            appKey: string;
            channelId: string;
            userId: string;
            userChannelId?: number | undefined;
            type?: 'easemob' | 'agora' | undefined;
            onResult: (params: { data?: any; error?: any }) => void;
          }) => {
            console.log('requestRTCToken:', params);
            AppServerClient.getRtcToken({
              userAccount: params.userId,
              channelId: params.channelId,
              appKey,
              userChannelId: params.userChannelId,
              type: params.type,
              onResult: (pp: { data?: any; error?: any }) => {
                console.log('test:', pp);
                params.onResult(pp);
              },
            });
          }}
          requestUserMap={(params: {
            appKey: string;
            channelId: string;
            userId: string;
            onResult: (params: { data?: any; error?: any }) => void;
          }) => {
            console.log('requestUserMap:', params);
            AppServerClient.getRtcMap({
              userAccount: params.userId,
              channelId: params.channelId,
              appKey,
              onResult: (pp: { data?: any; error?: any }) => {
                console.log('requestUserMap:getRtcMap:', pp);
                params.onResult(pp);
              },
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
          {__TEST__ === true ? (
            Dev()
          ) : (
            <NavigationContainer
              ref={RootRef}
              initialState={initialState}
              theme={NDefaultTheme}
              onStateChange={(state: NavigationState | undefined) => {
                const rr: string[] & string[][] = [];
                formatNavigationState(state, rr);
                console.log(
                  'test:onStateChange:',
                  JSON.stringify(rr, undefined, '  ')
                );
                // console.log('test:onStateChange:o:', JSON.stringify(state));
                Services.ls.setItem(__KEY__, JSON.stringify(state));
              }}
              onUnhandledAction={(action: NavigationAction) => {
                console.log('test:onUnhandledAction:', action);
              }}
              onReady={() => {
                console.log('test:NavigationContainer:onReady:');
                isOnReady.current = true;
                onInitApp();
              }}
              fallback={
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}
                >
                  <LoadingIcon style={{ height: 45, width: 45 }} />
                </View>
              }
            >
              <Root.Navigator initialRouteName={initialRouteName}>
                <Root.Screen
                  name="Splash"
                  options={{
                    headerShown: false,
                  }}
                  component={SplashScreen}
                />
                <Root.Screen
                  name="Login"
                  options={{
                    headerShown: false,
                  }}
                  component={LoginScreen}
                />
                <Root.Screen
                  name="Home"
                  options={() => {
                    return {
                      headerShown: false,
                    };
                  }}
                  component={HomeScreen}
                />
                <Root.Screen
                  name="Test"
                  options={() => {
                    return {
                      headerShown: true,
                    };
                  }}
                  component={TestScreen}
                />
              </Root.Navigator>
            </NavigationContainer>
          )}
        </CallkitContainer>
      </UikitContainer>
    </React.StrictMode>
  );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
// registerRootComponent(App);
