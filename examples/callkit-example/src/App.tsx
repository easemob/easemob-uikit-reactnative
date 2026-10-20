import './utils/globals';

import {
  // DefaultTheme as NDefaultTheme,
  NavigationAction,
  NavigationContainer,
  NavigationState,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { registerRootComponent } from 'expo';
import * as React from 'react';
import { DeviceEventEmitter, Platform, View } from 'react-native';

import { AppDev } from './__dev__';
import {
  CallUser,
  ChatClient,
  ChatConnectEventListener,
  ChatDataSyncType,
  ChatDisconnectErrorCode,
  ChatOptions,
  GlobalContainer as CallkitContainer,
} from './rename.callkit';
import type { RootParamsList, RootParamsName } from './routes';
import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import { SplashScreen } from './screens/Splash';
import { TestScreen } from './screens/Test';
import { AppServerClient } from './utils/AppServer';
import { requestAndroidVideo } from './utils/permission';

if (Platform.OS === 'web') {
  console.error('web platforms are not supported.');
}

const Root = createNativeStackNavigator<RootParamsList>();

let __TEST__ = true;
let appKey = '';
let appId = '';
let gAppKey = '';
let agoraAppId = '';
let accountType: 'easemob' | 'agora' | undefined;
let useSandbox = false;
let sandBoxConfig = {};

try {
  const env = require('./env');
  __TEST__ = env.test ?? false;
  if (
    (!env.appKey || env.appKey.length === 0) &&
    (!env.appId || env.appId.length === 0)
  ) {
    throw new Error('appKey or appId is required');
  }
  appKey = env.appKey;
  appId = env.appId;
  gAppKey = appKey && appKey.length > 0 ? appKey : appId;
  agoraAppId = env.agoraAppId;
  accountType = env.accountType;
  useSandbox = env.restServerDomain.length > 0 && env.imServer.length > 0; // from android source code
  sandBoxConfig = useSandbox
    ? {
        restServer: env.restServerDomain,
        enableDNSConfig: false,
        imPort: env.imPort,
        imServer: env.imServer,
      }
    : {};
} catch (e) {
  console.error('dev:config_error:', e);
}

console.log('DEV:', __DEV__);
console.log('TEST:', __TEST__);

// let fcmToken = '';
// if (fcmSenderId && fcmSenderId.length > 0) {
//   fcmToken = await requestFcmToken();
// }

export function App() {
  const [isReady, setIsReady] = React.useState(false);
  const [initialRouteName] = React.useState('Splash' as RootParamsName);

  const RootRef = useNavigationContainerRef<RootParamsList>();
  React.useEffect(() => {
    const client = ChatClient.getInstance();
    const returnToLogin = () => {
      if (!RootRef.isReady()) return;
      RootRef.resetRoot({
        index: 0,
        routes: [
          {
            name: 'Login',
            params: {
              params: {
                id: client.currentUserName ?? '',
                pass: '',
                accountType: accountType === 'agora' ? 'agora' : 'easemob',
              },
            },
          },
        ],
      });
    };
    const logoutReasons = [
      ChatDisconnectErrorCode.APP_ACTIVE_NUMBER_REACH_LIMIT,
      ChatDisconnectErrorCode.INVALID_TOKEN,
      ChatDisconnectErrorCode.INVALID_PARAM,
      ChatDisconnectErrorCode.USER_AUTHENTICATION_FAILED,
      ChatDisconnectErrorCode.USER_NOT_FOUND,
      ChatDisconnectErrorCode.USER_LOGIN_FROM_OTHER_DEVICE,
      ChatDisconnectErrorCode.USER_REMOVED_FROM_SERVER,
      ChatDisconnectErrorCode.USER_BIND_ANOTHER_DEVICE,
      ChatDisconnectErrorCode.USER_LOGIN_TOO_MANY_DEVICES,
      ChatDisconnectErrorCode.USER_KICKED_BY_CHANGE_PASSWORD,
      ChatDisconnectErrorCode.USER_KICKED_BY_OTHER_DEVICE,
      ChatDisconnectErrorCode.USER_DEVICE_CHANGED,
      ChatDisconnectErrorCode.SERVER_GET_DNSLIST_FAILED,
      ChatDisconnectErrorCode.SERVER_SERVICE_RESTRICTED,
    ];
    const listener: ChatConnectEventListener = {
      onTokenDidExpire: returnToLogin,
      onDisconnected: (errorCode) => {
        if (errorCode !== undefined && logoutReasons.includes(errorCode)) {
          returnToLogin();
        }
      },
    };
    client.addConnectionListener(listener);
    return () => client.removeConnectionListener(listener);
  }, [RootRef]);
  const isOnInitialized = React.useRef(false);
  const isOnReady = React.useRef(false);
  const enableLog = true;

  console.log('test:App:isReady:', isReady);

  const onInitApp = React.useCallback(async () => {
    console.log('test:onInitApp:', isOnInitialized, isOnReady);
    if (isOnInitialized.current === false || isOnReady.current === false) {
      console.log('Waiting for initialization...');
      return;
    }

    try {
      const hasPermission = await requestAndroidVideo();
      if (!hasPermission) {
        console.warn('Video and Audio Permission request failed.');
        // Continue with limited functionality instead of returning
      }

      DeviceEventEmitter.emit('on_initialized', {
        navigation: RootRef,
      });

      console.log('test:onInitApp:completed');
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }, [RootRef]);

  React.useEffect(() => {
    ChatClient.getInstance()
      .init(
        ChatOptions.withAppKey({
          appKey: appKey,
          debugModel: true,
          dataSyncType: ChatDataSyncType.Contacts,
          ...sandBoxConfig,
        })
      )
      .then(() => {
        console.log('ChatClient initialized successfully');
        setIsReady(true);
        isOnInitialized.current = true;
        onInitApp(); // Call onInitApp after initialization
      })
      .catch((e) => {
        console.error('ChatClient initialization failed:', e);
        setIsReady(true); // Still set ready to show error state
      });
  }, [onInitApp]);

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
    <CallkitContainer
      option={{
        appKey: gAppKey,
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
        AppServerClient.requestRtcToken({
          userId: params.userId,
          channelId: params.channelId,
          onResult: (pp: { data?: any; error?: any }) => {
            console.log('test:requestRTCToken:onResult:', pp);
            if (pp.data?.uid && typeof pp.data.uid === 'string') {
              pp.data.uid = +pp.data.uid; // ensure uid is number
            }
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
        AppServerClient.requestRtcMap({
          channelId: params.channelId,
          onResult: (pp: { data?: any; error?: any }) => {
            console.log('requestUserMap:requestUserMap:onResult:', pp);
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
      <NavigationContainer
        ref={RootRef}
        // theme={NDefaultTheme}
        onStateChange={(state: NavigationState | undefined) => {
          const rr: string[] & string[][] = [];
          formatNavigationState(state, rr);
          console.log(
            'test:onStateChange:',
            JSON.stringify(rr, undefined, '  ')
          );
          // console.log('test:onStateChange:o:', JSON.stringify(state));
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
            <View style={{ height: 45, width: 45 }} />
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
    </CallkitContainer>
  );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
// registerRootComponent(App);

const env = require('./env');

const reactStrictMode = env.reactStrictMode ?? false;
const isDev = env.test ?? false;

const AppWrapper = () => {
  if (reactStrictMode) {
    if (isDev) {
      return (
        <React.StrictMode>
          <AppDev />
        </React.StrictMode>
      );
    } else {
      return (
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }
  } else {
    if (isDev) {
      return <AppDev />;
    } else {
      return <App />;
    }
  }
};

export default AppWrapper;
