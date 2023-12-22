import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ImageMessagePreview } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ImageMessagePreviewScreen(props: Props) {
  const { navigation, route } = props;
  const msgId = ((route.params as any)?.params as any)?.msgId;
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <ImageMessagePreview
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        msgId={msgId}
        onClicked={() => {
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}
