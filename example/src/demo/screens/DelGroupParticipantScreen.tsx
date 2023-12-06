import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DelGroupParticipant } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function DelGroupParticipantScreen(props: Props) {
  const { navigation, route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <DelGroupParticipant
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        groupId={groupId}
        onBack={() => {
          navigation.goBack();
        }}
        onDelResult={(data) => {
          console.log('test:zuoyu:DelGroupParticipantScreen', data);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
