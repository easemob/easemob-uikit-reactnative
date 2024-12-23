import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BottomSheetMenuHeader,
  Container,
  type EmojiIconItem,
  type IconNameType,
  useLightTheme,
  usePresetPalette,
} from '../rename.uikit';

export function Test1() {
  const emojiList: EmojiIconItem[] = [
    { name: 'link' as IconNameType, state: 'selected' },
    { name: 'link' as IconNameType, state: 'common' },
    { name: 'link' as IconNameType, state: 'common' },
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BottomSheetMenuHeader emojiList={emojiList} />
    </SafeAreaView>
  );
}

export default function TestEmojiList() {
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
