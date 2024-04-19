import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ImageMessagePreview } from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ImageMessagePreviewScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const msgId = ((route.params as any)?.params as any)?.msgId;
  const localMsgId = ((route.params as any)?.params as any)?.localMsgId;
  const msg = ((route.params as any)?.params as any)?.msg;
  return (
    <SafeAreaViewFragment>
      <ImageMessagePreview
        msgId={msgId}
        msg={msg}
        localMsgId={localMsgId}
        onBack={() => {
          navi.goBack();
        }}
      />
    </SafeAreaViewFragment>
  );
}
