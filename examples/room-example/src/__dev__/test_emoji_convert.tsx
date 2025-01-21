// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { View } from 'react-native';

import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  emoji,
} from '../rename.room';

export function TestEmojiConvert() {
  console.log('test:TestEmojiConvert:');

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
        <View
          style={{ height: 100, width: 100, backgroundColor: 'red' }}
          onTouchEnd={() => {
            console.log(
              'test:onTouchEnd:',
              emoji.toCodePointText(
                'U+1F644U+1F910U+1F644U+1F62DU+1F610U+1F610U+1F62DU+1F610U+1F62DU+1F610U+1F62DU+1F641U+1F641U+1F62DU+1F641U+1F62DU+1F62DU+1F610iknbbvvjbff'
              )
            );
          }}
        />
      </View>
    </Container>
  );
}

export default function test_emoji_convert() {
  return <TestEmojiConvert />;
}
