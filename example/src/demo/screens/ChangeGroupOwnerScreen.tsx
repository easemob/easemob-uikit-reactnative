import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ChangeGroupOwner } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ChangeGroupOwnerScreen(props: Props) {
  const { navigation, route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <ChangeGroupOwner
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        groupId={groupId}
        onBack={() => {
          navigation.goBack();
        }}
        onChangeResult={(data) => {
          console.log('test:zuoyu:ChangeGroupOwnerScreen', data);
          // navigation.goBack();
          navigation.navigate({
            name: 'GroupInfo',
            params: { params: { groupId, ownerId: data.value } },
            merge: true,
          });
        }}
      />
    </SafeAreaView>
  );
}
