import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useChatContext } from 'react-native-chat-uikit';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function LoginListScreen(props: Props) {
  const {} = props;
  const account = require('../../env').account as {
    id: string;
    token: string;
  }[];
  const im = useChatContext();
  const [s, setS] = React.useState<'' | 'success' | 'failed' | 'logouted'>('');
  const [reason, setReason] = React.useState<string>('');
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={{ color: 'red' }}>
          {'Note: Click id to try to log in.'}
        </Text>
        <Text
          style={{ color: 'red' }}
        >{`login state: ${s}. reason: ${reason}`}</Text>
      </View>
      <TouchableOpacity
        style={{
          width: '90%',
          height: 60,
          marginVertical: 4,
          backgroundColor: '#ff69b4',
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
        <Text style={{ color: '#f0fff0', fontSize: 26 }}>
          {'click me for logout.'}
        </Text>
      </TouchableOpacity>
      <ScrollView
        style={{ height: '80%', width: '100%' }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {account.map((v, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={{
                width: '90%',
                height: 60,
                marginVertical: 4,
                backgroundColor: '#fff8dc',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
              }}
              onPress={() => {
                im.login({
                  userId: v.id,
                  userToken: v.token,
                  userName: v.id,
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
              }}
            >
              <Text style={{ color: '#8fbc8f', fontSize: 26 }}>{v.id}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={{ flex: 1 }} />
    </View>
  );
}
