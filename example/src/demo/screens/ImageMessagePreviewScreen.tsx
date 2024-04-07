import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ImageMessagePreview,
  useColors,
  usePaletteContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ImageMessagePreviewScreen(props: Props) {
  const { navigation, route } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const msgId = ((route.params as any)?.params as any)?.msgId;
  const localMsgId = ((route.params as any)?.params as any)?.localMsgId;
  const msg = ((route.params as any)?.params as any)?.msg;
  return (
    <SafeAreaView
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
    >
      <ImageMessagePreview
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        msgId={msgId}
        msg={msg}
        localMsgId={localMsgId}
        onBack={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
