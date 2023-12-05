import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { CreateGroup } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function CreateGroupScreen(props: Props) {
  const { navigation, route } = props;
  const data = ((route.params as any)?.params as any)?.data
    ? JSON.parse(((route.params as any)?.params as any)?.data)
    : undefined;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <CreateGroup
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        onSearch={() => {
          navigation.navigate('SearchContact', {
            params: { searchType: 'create-group' },
          });
        }}
        selectedData={data}
        onCreateGroupResult={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
