import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import FileViewer from 'react-native-file-viewer';

import { FileMessagePreview } from '../common/FileMessagePreview';
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
        onOpenFile={async (localPath) => {
          // todo: open file with other app
          try {
            await FileViewer.open(localPath);
          } catch (error) {
            console.warn('open file error', error);
          }
        }}
      />
    </SafeAreaViewFragment>
  );
}
