import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ChangeGroupOwner,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ChangeGroupOwnerScreen(props: Props) {
  const { navigation, route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
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
