import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { NewRequests } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function NewRequestScreen(props: Props) {
  const {} = props;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <NewRequests
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
      />
    </SafeAreaView>
  );
}
