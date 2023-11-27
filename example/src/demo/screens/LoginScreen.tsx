import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import {
  TextInput,
  useChatContext,
  useChatListener,
} from 'react-native-chat-uikit';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function LoginScreen(props: Props) {
  const {} = props;

  const account = require('../../env').account as {
    id: string;
    token: string;
  }[];

  const im = useChatContext();
  useChatListener(
    React.useMemo(() => {
      return {
        onConnected: () => {
          setS2('onConnected');
        },
        onDisconnected: (type) => {
          setS2(`onDisconnected: ${type}`);
        },
      };
    }, [])
  );

  const [s, setS] = React.useState<'' | 'success' | 'failed' | 'logouted'>('');
  const [s2, setS2] = React.useState<string>('');
  const [reason, setReason] = React.useState<string>('');
  const [id, setId] = React.useState(account[0]?.id);
  const [isPass, setIsPass] = React.useState(false);
  const [token, setToken] = React.useState(account[0]?.token);

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={{ color: 'red' }}>
          {'Note: Click id to try to log in.'}
        </Text>
        <Text style={{ color: 'red' }}>{`connect state: ${s2}.`}</Text>
        <Text
          style={{ color: 'red' }}
        >{`login state: ${s}. reason: ${reason}`}</Text>
      </View>

      <View style={{ height: 10 }} />
      <TextInput
        placeholder={'Please enter ID.'}
        style={{ height: 40, backgroundColor: '#fff8dc' }}
        value={id}
        onChangeText={setId}
      />
      <View style={{ height: 10 }} />
      <TextInput
        placeholder={'Please enter Token or password.'}
        style={{ height: 40, backgroundColor: '#fff8dc' }}
        value={token}
        onChangeText={setToken}
      />
      <View style={{ height: 10 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>{'Whether to use a password to log in.'}</Text>
        <Switch value={isPass} onValueChange={setIsPass} />
      </View>
      <View style={{ height: 10 }} />
      <TouchableOpacity
        style={{
          width: '90%',
          height: 60,
          marginVertical: 4,
          backgroundColor: '#fff8dc',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          alignSelf: 'center',
        }}
        onPress={() => {
          if (id && token) {
            im.login({
              userId: id,
              userToken: token,
              userName: id,
              userAvatarURL:
                'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/cat-512.png',
              gender: 1,
              result: ({ isOk, error }) => {
                setS(isOk === true ? 'success' : 'failed');
                if (error) {
                  setReason(error.toString());
                }
              },
            });
          }
        }}
      >
        <Text style={{ color: '#8fbc8f', fontSize: 26 }}>
          {'click me for login.'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: '90%',
          height: 60,
          marginVertical: 4,
          backgroundColor: '#fff8dc',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          alignSelf: 'center',
        }}
        onPress={() => {
          im.logout({
            result: ({ isOk, error }) => {
              setS(isOk === true ? 'logouted' : 'failed');
              if (error) {
                console.warn('logout:', error);
              }
            },
          });
        }}
      >
        <Text style={{ color: '#8fbc8f', fontSize: 26 }}>
          {'click me for logout.'}
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />
    </View>
  );
}
