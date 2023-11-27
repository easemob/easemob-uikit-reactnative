import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { SearchGroup } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function SearchGroupParticipantScreen(props: Props) {
  const { navigation } = props;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <SearchGroup
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        onCancel={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
