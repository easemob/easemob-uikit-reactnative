import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';
import {
  GroupList,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupListScreen(props: Props) {
  const { navigation } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  return (
    <View
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <SafeAreaView
        style={{
          backgroundColor: getColor('bg'),
          flex: 1,
        }}
      >
        <GroupList
          containerStyle={{
            flexGrow: 1,
          }}
          onClickedSearch={() => {
            navigation.push('SearchGroup', {});
          }}
          onClickedItem={(data) => {
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
    </View>
  );
}
