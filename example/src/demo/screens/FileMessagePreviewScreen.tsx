import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { FileMessagePreview } from 'react-native-chat-uikit';

import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function FileMessagePreviewScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const msgId = ((route.params as any)?.params as any)?.msgId;
  const localMsgId = ((route.params as any)?.params as any)?.localMsgId;
  return (
    <SafeAreaViewFragment>
      <FileMessagePreview
        msgId={msgId}
        localMsgId={localMsgId}
        onBack={() => {
          navi.goBack();
        }}
        onOpenFile={(_localPath) => {
          // todo: open file with other app
        }}
      />
    </SafeAreaViewFragment>
  );
}
