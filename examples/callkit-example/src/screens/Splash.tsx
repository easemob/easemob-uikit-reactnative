import { CommonActions, StackActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import {
  ChatServiceListener,
  DisconnectReasonType,
  LoadingIcon,
  useChatContext,
} from 'react-native-chat-uikit';

import type { RootParamsList } from '../routes';

let gid: string = '';
let gps: string = '';
let gt = 'agora' as 'agora' | 'easemob';

try {
  const env = require('../env');
  gid = env.id ?? '';
  gps = env.ps ?? '';
  gt = env.accountType ?? 'agora';
} catch (e) {
  console.warn('test:', e);
}

export function SplashScreen({
  navigation,
}: NativeStackScreenProps<RootParamsList, 'Splash'>): JSX.Element {
  console.log('test:SplashScreen:');
  // const { autoLogin: autoLoginAction } = useAppChatSdkContext();
  const im = useChatContext();

  const onDisconnected = React.useCallback(() => {
    console.warn('test:onDisconnected:');
    navigation.navigate('Login', {
      params: { id: gid, pass: gps, accountType: gt },
    });
  }, [navigation]);

  const onTokenDidExpire = React.useCallback(() => {
    console.log('test:onTokenDidExpire:');
    navigation.navigate('Login', {
      params: { id: gid, pass: gps, accountType: gt },
    });
  }, [navigation]);

  const onTokenWillExpire = React.useCallback(() => {
    console.log('test:onTokenWillExpire:');
  }, []);

  React.useEffect(() => {
    const listener = {
      onConnected: () => {},
      onDisconnected: (reason) => {
        if (reason !== DisconnectReasonType.others) {
          onDisconnected();
        }
      },
      onTokenDidExpire: () => {
        onTokenDidExpire();
      },
      onTokenWillExpire: () => {
        onTokenWillExpire();
      },
    } as ChatServiceListener;
    im.addListener(listener);
    return () => {
      im.removeListener(listener);
    };
  }, [im, onDisconnected, onTokenDidExpire, onTokenWillExpire]);

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('on_initialized', (event) => {
      const { autoLogin, navigation } = event;
      if (autoLogin === true) {
        im.autoLogin({
          result: (res) => {
            if (res.isOk) {
              navigation.dispatch(
                StackActions.push('Home', {
                  params: { id: 'sdf', pass: 'xxx' },
                })
              );
            } else {
              navigation.dispatch(
                CommonActions.navigate('Login', {
                  params: { id: gid, pass: gps, accountType: gt },
                })
              );
            }
          },
        });
      } else {
        navigation.dispatch(
          CommonActions.navigate('Login', {
            params: { id: gid, pass: gps, accountType: gt },
          })
        );
      }
    });
    return () => {
      return sub.remove();
    };
  }, [im]);

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        // backgroundColor: 'red',
      }}
    >
      <LoadingIcon
        style={{
          tintColor: 'rgba(15, 70, 230, 1)',
          width: 45,
          height: 45,
        }}
      />
    </View>
  );
}
