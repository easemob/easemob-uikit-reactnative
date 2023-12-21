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
import {
  GlobalContainer,
  useChatListener,
  useDarkTheme,
  useLightTheme,
  usePermissions,
  usePresetPalette,
} from 'react-native-chat-uikit';

import type { RootParamsList, RootParamsName } from './routes';
import {
  AddGroupParticipantScreen,
  ChangeGroupOwnerScreen,
  ConfigScreen,
  ContactInfoScreen,
  ContactListScreen,
  ConversationDetailScreen,
  ConversationListScreen,
  CreateGroupScreen,
  DelGroupParticipantScreen,
  GroupInfoScreen,
  GroupListScreen,
  GroupParticipantInfoScreen,
  GroupParticipantListScreen,
  LoginListScreen,
  LoginScreen,
  NewConversationScreen,
  NewRequestScreen,
  SearchContactScreen,
  SearchConversationScreen,
  SearchGroupScreen,
  SelectSingleParticipantScreen,
  TopMenuScreen,
} from './screens';

const env = require('../env');

const Root = createNativeStackNavigator<RootParamsList>();

SplashScreen.preventAutoHideAsync();

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
    [fontFamily]: require('../../assets/Twemoji.Mozilla.ttf'),
  });

  const permissionsRef = React.useRef(false);
  usePermissions({
    onResult: (isSuccess) => {
      console.log('dev:permissions:', isSuccess);
      permissionsRef.current = isSuccess;
    },
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
      <GlobalContainer
        appKey={env.appKey}
        isDevMode={env.isDevMode}
        palette={palette}
        theme={theme}
        language={'en'}
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
          </Root.Navigator>
        </NavigationContainer>
        <TestListener />
      </GlobalContainer>
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
      };
    }, [])
  );
  return <></>;
}
