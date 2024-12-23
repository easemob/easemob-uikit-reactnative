import { CommonActions, StackActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, View } from 'react-native';

import { ChatClient } from '../rename.callkit';
import type { RootParamsList } from '../routes';
import { Icon } from '../ui/Image';

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
      onTokenWillExpire(): void {
        onTokenWillExpire();
      },
      onTokenDidExpire(): void {
        onTokenDidExpire();
      },
      onConnected(): void {
        console.log('onConnected');
      },
      onDisconnected(): void {
        console.log('onDisconnected');
      },

      onAppActiveNumberReachLimit(): void {
        onDisconnected();
      },

      onUserDidLoginFromOtherDevice(_?: string): void {
        onDisconnected();
      },

      onUserDidLoginFromOtherDeviceWithInfo(_params: {
        deviceName?: string;
        ext?: string;
      }): void {
        onDisconnected();
      },

      onUserDidRemoveFromServer(): void {
        onDisconnected();
      },

      onUserDidForbidByServer(): void {
        onDisconnected();
      },

      onUserDidChangePassword(): void {
        onDisconnected();
      },

      onUserDidLoginTooManyDevice(): void {
        onDisconnected();
      },

      onUserKickedByOtherDevice(): void {
        onDisconnected();
      },

      onUserAuthenticationFailed(): void {
        onDisconnected();
      },
    };
    ChatClient.getInstance().addConnectionListener(listener);
    return () => {
      ChatClient.getInstance().removeConnectionListener(listener);
    };
  }, [onDisconnected, onTokenDidExpire, onTokenWillExpire]);

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('on_initialized', (event) => {
      const { autoLogin, navigation } = event;
      if (autoLogin === true) {
        ChatClient.getInstance()
          .isLoginBefore()
          .then((isLogined) => {
            if (isLogined) {
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
          })
          .catch(() => {
            navigation.dispatch(
              CommonActions.navigate('Login', {
                params: { id: gid, pass: gps, accountType: gt },
              })
            );
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
  }, []);

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        // backgroundColor: 'red',
      }}
    >
      <Icon
        style={{
          tintColor: 'rgba(15, 70, 230, 1)',
          width: 45,
          height: 45,
        }}
        name={0}
      />
    </View>
  );
}
