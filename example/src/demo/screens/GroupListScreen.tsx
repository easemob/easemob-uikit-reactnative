import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  GroupList,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupListScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
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
      <GroupList
        containerStyle={{
          flexGrow: 1,
        }}
        onClickedSearch={() => {
          navi.push({ to: 'SearchGroup' });
        }}
        onClickedItem={(data) => {
          if (data) {
            navi.push({ to: 'GroupInfo', props: { groupId: data.groupId } });
          }
        }}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaView>
  );
}
