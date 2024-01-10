import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { GroupList } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupListScreen(props: Props) {
  const { navigation } = props;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <GroupList
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        onClickedSearch={() => {
          navigation.push('SearchGroup', {});
        }}
        onClicked={(data) => {
          if (data) {
            navigation.push('GroupInfo', {
              params: {
                groupId: data.groupId,
              },
            });
          }
        }}
        onBack={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
