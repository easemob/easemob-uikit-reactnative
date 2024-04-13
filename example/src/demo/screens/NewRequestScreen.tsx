import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  NewRequests,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function NewRequestScreen(props: Props) {
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
      <NewRequests
        containerStyle={{
          flexGrow: 1,
        }}
        onClickedItem={(data) => {
          if (data?.requestId) {
            navi.push({ to: 'ContactInfo', props: { userId: data.requestId } });
          }
        }}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaView>
  );
}
