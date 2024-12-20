import {
  NavigationAction,
  NavigationContainer,
  NavigationState,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { DeviceEventEmitter, View } from 'react-native';

import { AppDev } from './__dev__/AppDev';
import {
  ChatOptions,
  Container,
  useDarkTheme,
  useLightTheme,
  usePresetPalette,
} from './rename.room';
import type { RootParamsList, RootParamsName } from './routes';
import {
  ChatroomHeaderRight,
  ChatroomListScreen,
  ChatroomScreen,
  ConfigScreen,
  LoginListScreen,
  LoginScreen,
  ReportScreen,
  SearchParticipantScreen,
  TopMenuScreen,
} from './screens';

const env = require('./env');

const Root = createNativeStackNavigator<RootParamsList>();

SplashScreen.preventAutoHideAsync();

const opt =
  env.accountType === 'easemob' || env.accountType === 'agora'
    ? ChatOptions.withAppKey({ appKey: env.appKey })
    : ChatOptions.withAppId({ appId: env.appKey });

export function App() {
  const [initialRouteName] = React.useState('TopMenu' as RootParamsName);
  const palette = usePresetPalette();
  const dark = useDarkTheme(palette);
  const light = useLightTheme(palette);
  const [theme, setTheme] = React.useState(light);
  const isNavigationReadyRef = React.useRef(false);
  const isContainerReadyRef = React.useRef(false);
  const isFontReadyRef = React.useRef(false);
  const isReadyRef = React.useRef(false);
  const fontFamily = 'Twemoji-Mozilla';
  const [fontsLoaded] = useFonts({
    // [fontFamily]: require('../assets/twemoji.ttf'),
    [fontFamily]: require('../assets/Twemoji.Mozilla.ttf'),
  });

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

  const onReady = async (_ready: boolean) => {
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
    await SplashScreen.hideAsync();
  };

  if (fontsLoaded) {
    isFontReadyRef.current = true;
    if (
      isFontReadyRef.current === true &&
      isNavigationReadyRef.current === true &&
      isContainerReadyRef.current === true
    ) {
      onReady(true);
    }
  }

  return (
    <React.StrictMode>
      <Container
        opt={opt}
        isDevMode={env.isDevMode}
        palette={palette}
        theme={theme}
        roomOption={{ globalBroadcast: { isVisible: true } }}
        language={'zh-Hans'}
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
      >
        <NavigationContainer
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
              name={'TopMenu'}
              options={{
                headerShown: true,
              }}
              component={TopMenuScreen}
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
              name={'ChatroomList'}
              options={{
                headerShown: true,
              }}
              component={ChatroomListScreen}
            />
            <Root.Screen
              name={'TestChatroom'}
              options={{
                headerShown: true,
                headerRight: ChatroomHeaderRight,
              }}
              component={ChatroomScreen}
            />
            <Root.Screen
              name={'TestReport'}
              options={{
                headerShown: true,
              }}
              component={ReportScreen}
            />
            <Root.Screen
              name={'TestSearchParticipant'}
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
              component={SearchParticipantScreen}
            />
            <Root.Screen
              name={'Config'}
              options={{
                headerShown: true,
              }}
              component={ConfigScreen}
            />
          </Root.Navigator>
        </NavigationContainer>
      </Container>
    </React.StrictMode>
  );
}

let AppWrapper = App;
try {
  const isDev = require('./env').test;
  if (isDev === true) {
    AppWrapper = AppDev;
  }
  setTimeout(async () => {
    await SplashScreen.hideAsync();
  }, 0);
} catch (error) {
  console.warn(error);
}

export default AppWrapper;
