import * as React from 'react';
import { ChatMessage } from 'react-native-chat-sdk';
import {
  CmnButton,
  GlobalContainer,
  MessageInputEditMessage,
  MessageInputEditMessageRef,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Test1() {
  const ref = React.useRef<MessageInputEditMessageRef>({} as any);
  return (
    <SafeAreaView>
      <CmnButton
        style={{ width: 200, marginTop: 100 }}
        sizesType={'small'}
        radiusType={'small'}
        contentType={'only-text'}
        text={'alert'}
        onPress={() => {
          ref.current.startShowWithInit(
            ChatMessage.createTextMessage('xxx', 'test', 0)
          );
        }}
      />
      <MessageInputEditMessage
        ref={ref}
        onRequestModalClose={() => {
          ref.current.startHide();
        }}
      />
    </SafeAreaView>
  );
}

export default function TestEditMessage() {
  const p = usePresetPalette();
  const t = useLightTheme(p, 'global');
  return (
    <GlobalContainer
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
      palette={p}
      theme={t}
    >
      <Test1 />
    </GlobalContainer>
  );
}
