// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  GiftMessageList,
  GiftMessageListRef,
  seqId,
} from '../rename.room';

export function TestGiftEffect() {
  const ref = React.useRef<GiftMessageListRef>({} as any);
  const pal = createPresetPalette();
  const dark = createDarkTheme(pal);
  const light = createLightTheme(pal);

  return (
    <Container
      opt={{ appKey: 'sdf' } as any}
      palette={pal}
      theme={light ? light : dark}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'green',
          paddingTop: 100,
          // left: 100,
        }}
      >
        <TouchableOpacity
          style={{ width: 200, height: 40, backgroundColor: 'red' }}
          onPress={() => {
            ref.current?.pushTask({
              model: {
                id: seqId('_gf').toString(),
                nickname: 'NickName',
                giftCount: 1,
                giftIcon: 'http://notext.png',
                content: 'send Agoraship too too too long',
              },
            });
          }}
        >
          <Text>{'Start painting presents'}</Text>
        </TouchableOpacity>
        <View style={{ height: 100 }} />
        <GiftMessageList
          ref={ref}
          containerStyle={
            {
              // top: 50,
              // left: 100,
            }
          }
        />
      </View>
    </Container>
  );
}

export default function test_gift_floating() {
  return <TestGiftEffect />;
}
