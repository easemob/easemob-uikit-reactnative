import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ChatMessage,
  CmnButton,
  Container,
  MessageInputEditMessage,
  type MessageInputEditMessageRef,
  useLightTheme,
  usePresetPalette,
} from '../rename.uikit';

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
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
      palette={p}
      theme={t}
    >
      <Test1 />
    </Container>
  );
}
