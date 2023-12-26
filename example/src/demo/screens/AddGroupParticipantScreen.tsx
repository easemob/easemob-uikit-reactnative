import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { AddGroupParticipant } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function AddGroupParticipantScreen(props: Props) {
  const { navigation, route } = props;
  const data = ((route.params as any)?.params as any)?.data
    ? JSON.parse(((route.params as any)?.params as any)?.data)
    : undefined;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <AddGroupParticipant
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        onSearch={() => {
          navigation.navigate('SearchContact', {
            params: { searchType: 'add-group-member', groupId },
          });
        }}
        selectedData={data}
        groupId={groupId}
        onAddedResult={() => {
          console.log('onAddedResult');
          navigation.goBack();
        }}
        onBack={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
