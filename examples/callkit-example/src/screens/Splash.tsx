import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, View } from 'react-native';

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
  navigation: _navigation,
}: NativeStackScreenProps<RootParamsList, 'Splash'>): React.ReactElement {
  console.log('test:SplashScreen:');

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('on_initialized', (event) => {
      event.navigation.dispatch(
        CommonActions.navigate('Login', {
          params: { id: gid, pass: gps, accountType: gt },
        })
      );
    });
    return () => sub.remove();
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
