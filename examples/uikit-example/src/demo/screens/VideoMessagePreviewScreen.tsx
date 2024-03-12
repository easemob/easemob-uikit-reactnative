import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';
import { VideoMessagePreview } from 'react-native-chat-uikit';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function VideoMessagePreviewScreen(props: Props) {
  const { navigation, route } = props;
  const msgId = ((route.params as any)?.params as any)?.msgId;
  const localMsgId = ((route.params as any)?.params as any)?.localMsgId;
  return (
    <View
      style={{
        // backgroundColor: 'green',
        flex: 1,
      }}
    >
      <VideoMessagePreview
        containerStyle={{
          flexGrow: 1,
          // backgroundColor: 'red',
        }}
        msgId={msgId}
        localMsgId={localMsgId}
        onBack={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
}
