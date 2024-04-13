import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';
import {
  useColors,
  usePaletteContext,
  VideoMessagePreview,
} from 'react-native-chat-uikit';

import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function VideoMessagePreviewScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const msgId = ((route.params as any)?.params as any)?.msgId;
  const localMsgId = ((route.params as any)?.params as any)?.localMsgId;
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
      <VideoMessagePreview
        containerStyle={{
          flexGrow: 1,
        }}
        msgId={msgId}
        localMsgId={localMsgId}
        onBack={() => {
          navi.goBack();
        }}
      />
    </View>
  );
}
