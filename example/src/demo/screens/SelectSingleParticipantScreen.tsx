import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { SelectSingleParticipant } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function SelectSingleParticipantScreen(props: Props) {
  console.log('test:zuoyu:SelectSingleParticipantScreen');
  const { navigation, route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <SelectSingleParticipant
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        groupId={groupId}
        onBack={() => {
          navigation.goBack();
        }}
        onClicked={(data) => {
          // navigation.goBack();
          navigation.navigate({
            name: 'ConversationDetail',
            params: {
              params: {
                convId: groupId,
                convType: 1,
                convName: groupId,
                selectedParticipants: JSON.stringify(data),
                operateType: 'mention',
              },
            },
            merge: true,
          });
        }}
      />
    </SafeAreaView>
  );
}
