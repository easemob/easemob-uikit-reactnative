import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { NewConversation } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function NewConversationScreen(props: Props) {
  const { navigation } = props;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <NewConversation
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        onSearch={() => {
          navigation.navigate('SearchContact', {
            params: { searchType: 'new-contact-list' },
          });
        }}
      />
    </SafeAreaView>
  );
}
