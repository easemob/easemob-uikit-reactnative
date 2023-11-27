import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { RootScreenParamsList, SCREEN_NAME_LIST } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function TopMenuScreen(props: Props) {
  const { navigation } = props;
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={{ color: 'red' }}>
          {'Note: Please log in and enter the chat room first.'}
        </Text>
      </View>
      <ScrollView
        style={{ height: '80%', width: '100%' }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {SCREEN_NAME_LIST.map((v, i) => {
          if (v === 'TopMenu') {
            return null;
          }
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
                if (v === 'Config') {
                  navigation.push('Config', {});
                } else if (v === 'LoginList') {
                  navigation.push('LoginList', {});
                } else if (v === 'Login') {
                  navigation.push('Login', {});
                } else if (v === 'ConversationList') {
                  navigation.push('ConversationList', {});
                } else if (v === 'ContactList') {
                  navigation.push('ContactList', {});
                } else if (v === 'GroupList') {
                  navigation.push('GroupList', {});
                } else if (v === 'GroupParticipantList') {
                  navigation.push('GroupParticipantList', {
                    params: { groupId: 'xx' },
                  });
                }
              }}
            >
              <Text style={{ color: '#8fbc8f', fontSize: 26 }}>{v}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={{ flex: 1 }} />
    </View>
  );
}
