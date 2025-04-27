import {
  NavigationAction,
  NavigationContainer,
  NavigationState,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useFonts } from 'expo-font';
import * as React from 'react';
import { Appearance, DeviceEventEmitter, View } from 'react-native';

import { a_default_avatar } from './assets';
import { createStringSetCn, createStringSetEn } from './common';
import { ToastView } from './common/ToastView';
import {
  ChatOptions,
  Container,
  useDarkTheme,
  useLightTheme,
  usePresetPalette,
} from './rename.room';
import type { RootParamsList, RootParamsName } from './routes';
import {
  ChannelListScreen,
  ChatroomScreen,
  LoginScreen,
  SearchMemberScreen,
  SplashScreen,
} from './screens';

const env = require('./env');
const useSandbox = env.restServerDomain.length > 0 && env.imServer.length > 0; // from android source code
const sandboxConfig = useSandbox
  ? {
      restServer: env.restServerDomain,
      enableDNSConfig: false,
      imPort: env.imPort,
      imServer: env.imServer,
    }
  : {};

const Root = createNativeStackNavigator<RootParamsList>();

const opt =
  env.accountType === 'easemob' || env.accountType === 'agora'
    ? ChatOptions.withAppKey({ appKey: env.appKey, ...sandboxConfig })
    : ChatOptions.withAppId({ appId: env.appKey, ...sandboxConfig });

export function App() {
  const [initialRouteName] = React.useState('Login' as RootParamsName);
  const palette = usePresetPalette();
  const dark = useDarkTheme(palette);
  const light = useLightTheme(palette);
  const [theme, setTheme] = React.useState(light);
  const isNavigationReadyRef = React.useRef(false);
  const isContainerReadyRef = React.useRef(false);
  const isFontReadyRef = React.useRef(true);
  // const [isReady, setIsReady] = React.useState(false);
  const navigationRef = useNavigationContainerRef<RootParamsList>();
  const isReadyRef = React.useRef(false);
  // const fontFamily = 'Twemoji-Mozilla';
  // const [fontsLoaded] = useFonts({
  //   [fontFamily]: require('../assets/twemoji.ttf'),
  // });

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

  React.useEffect(() => {
    const ret = DeviceEventEmitter.addListener('example_change_theme', (e) => {
      if (e === 'dark') {
        setTheme(dark);
      } else {
        setTheme(light);
      }
    });
    return () => {
      ret.remove();
    };
  }, [dark, light]);

  Appearance.addChangeListener((e) => {
    console.log('dev:Appearance:', e.colorScheme);
    if (e.colorScheme === 'dark') {
      setTheme(dark);
    } else {
      setTheme(light);
    }
  });

  const onReady = async (_isReady: boolean) => {
    // setTimeout(() => {
    //   setIsReady(isReady);
    // }, 1000);
    // setIsReady(isReady);
    if (isReadyRef.current === true) {
      return;
    }
    isReadyRef.current = true;
    // navigationRef?.navigate('Login', {});
    DeviceEventEmitter.emit('example_login', {});
  };

  // if (fontsLoaded) {
  //   isFontReadyRef.current = true;
  //   if (
  //     isFontReadyRef.current === true &&
  //     isNavigationReadyRef.current === true &&
  //     isContainerReadyRef.current === true
  //   ) {
  //     onReady(true);
  //   }
  // }

  return (
    <Container
      appKey={env.appKey}
      opt={opt}
      isDevMode={env.isDevMode}
      palette={palette}
      theme={theme}
      roomOption={{
        globalBroadcast: { isVisible: true },
        messageList: {
          isVisibleTag: false,
        },
      }}
      // language={'zh-Hans'}
      languageExtensionFactory={(language) => {
        if (language === 'zh-Hans') {
          return createStringSetCn();
        } else {
          return createStringSetEn();
        }
      }}
      // fontFamily={fontFamily}
      onInitialized={() => {
        console.log('dev:onInitialized:');
        isContainerReadyRef.current = true;
        if (
          isFontReadyRef.current === true &&
          isNavigationReadyRef.current === true &&
          isContainerReadyRef.current === true
        ) {
          onReady(true);
        }
      }}
      avatar={{ borderRadiusStyle: 'large', localIcon: a_default_avatar }}
    >
      <NavigationContainer
        ref={navigationRef}
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
        onReady={() => {
          console.log('dev:onReady:');
          isNavigationReadyRef.current = true;
          if (
            isFontReadyRef.current === true &&
            isNavigationReadyRef.current === true &&
            isContainerReadyRef.current === true
          ) {
            onReady(true);
          }
        }}
        fallback={
          <View style={{ height: 100, width: 100, backgroundColor: 'red' }} />
        }
      >
        <Root.Navigator initialRouteName={initialRouteName}>
          <Root.Screen
            name={'Splash'}
            options={{
              headerShown: false,
            }}
            component={SplashScreen}
          />
          <Root.Screen
            name={'Login'}
            options={{
              headerShown: false,
            }}
            component={LoginScreen}
          />
          <Root.Screen
            name={'ChannelList'}
            options={{
              headerShown: false,
            }}
            component={ChannelListScreen}
          />
          <Root.Screen
            name={'Chatroom'}
            options={{
              headerShown: false,
            }}
            component={ChatroomScreen}
          />
          <Root.Screen
            name={'SearchMember'}
            options={{
              headerShown: false,
            }}
            component={SearchMemberScreen}
          />
        </Root.Navigator>
      </NavigationContainer>
      <ToastView />
    </Container>
  );
}

const reactStrictMode = env.reactStrictMode ?? false;

const AppWrapper = () => {
  if (reactStrictMode) {
    return (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    return <App />;
  }
};

export default AppWrapper;
