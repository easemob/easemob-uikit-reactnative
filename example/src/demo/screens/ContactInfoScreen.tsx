import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ContactInfo } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactInfoScreen(props: Props) {
  const { navigation, route } = props;
  const userId = ((route.params as any)?.params as any)?.userId;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <ContactInfo
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        userId={userId}
        onSendMessage={() => {
          navigation.navigate('ConversationDetail', {
            params: {
              convId: userId,
              convType: 0,
              convName: userId,
            },
          });
        }}
      />
    </SafeAreaView>
  );
}
