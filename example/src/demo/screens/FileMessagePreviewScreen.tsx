import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  FileMessagePreview,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function FileMessagePreviewScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const msgId = ((route.params as any)?.params as any)?.msgId;
  const localMsgId = ((route.params as any)?.params as any)?.localMsgId;
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <FileMessagePreview
        containerStyle={{
          flexGrow: 1,
        }}
        msgId={msgId}
        localMsgId={localMsgId}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaView>
  );
}
