// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  EmojiList,
  EmojiListMemo,
  SlideModal,
  SlideModalRef,
  useCompare,
  useDarkTheme,
  useForceUpdate,
  usePresetPalette,
} from '../rename.room';

export function TestEmojiList() {
  console.log('test:TestEmojiList:');
  const { updater } = useForceUpdate();

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
        <View style={{ height: 100 }} />
        <EmojiList
          onFace={() => {
            console.log('test:press:face:');
            updater();
          }}
        />
      </View>
    </Container>
  );
}

export function TestEmojiList22() {
  const { updater } = useForceUpdate();
  // const [, updater] = React.useState(0);
  // const count = React.useRef(0);

  const onFace = React.useCallback(() => {
    console.log('test:TestEmojiList22:onFace:');
    // updater((pre) => pre + 1);
    updater();
  }, [updater]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'green',
        paddingTop: 100,
        // left: 100,
      }}
    >
      <TouchableOpacity
        style={{ height: 60, width: '100%', backgroundColor: 'red' }}
        onPress={() => {
          // updater((pre) => pre + 1);
          updater();
        }}
      >
        <Text>{'test emoji list'}</Text>
      </TouchableOpacity>
      <View style={{ height: 100 }} />
      <EmojiListMemo
        onFace={onFace}
        // containerStyle={{ width: 300 }}
        // countPerRow={5}
      />
    </View>
  );
}

export function TestEmojiList2() {
  console.log('test:TestEmojiList2:');

  // const pal = createPresetPalette();
  // const dark = createDarkTheme(pal);
  // const light = createLightTheme(pal);
  const pal = usePresetPalette();
  const dark = useDarkTheme(pal);
  const light = useDarkTheme(pal);
  useCompare(pal);
  useCompare(dark);
  useCompare(light);

  return (
    <Container
      opt={{ appKey: 'sdf' } as any}
      palette={pal}
      theme={light ? light : dark}
    >
      <TestEmojiList22 />
    </Container>
  );
}

export const ViewMemo = React.memo(({ count }: { count: number }) => {
  console.log('test:ViewMemo', count);
  return <View style={{ width: 100, height: 100, backgroundColor: 'red' }} />;
});

export function TestViewMemo() {
  console.log('test:TestViewMemo:');
  const [count, updater] = React.useState(0);
  const c = React.useRef(0);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'green',
        paddingTop: 100,
        // left: 100,
      }}
    >
      <TouchableOpacity
        style={{ height: 60, width: '100%', backgroundColor: 'red' }}
        onPress={() => {
          updater((pre) => {
            if (c.current++ % 2 === 0) {
              return pre;
            } else {
              return pre + 1;
            }
          });
        }}
      >
        <Text>{'test memo'}</Text>
      </TouchableOpacity>
      <View style={{ height: 100 }} />
      <ViewMemo count={count} />
    </View>
  );
}

export const ViewMemo2 = React.memo(
  ({ onPress }: { onPress: (i: number) => void }) => {
    console.log('test:ViewMemo2', onPress);
    const count = React.useRef(0);
    return (
      <Pressable
        style={{ width: 100, height: 100, backgroundColor: 'red' }}
        onPress={() => {
          onPress?.(count.current++);
        }}
      />
    );
  }
);

export function TestViewMemo2() {
  console.log('test:TestViewMemo2:');
  const [, updater] = React.useState(0);
  const c = React.useRef(0);

  const onPress = React.useCallback((i) => {
    console.log('test:TestViewMemo2:onPress:', onPress.name, i);
    updater((pre) => {
      if (c.current++ % 2 === 0) {
        return pre;
      } else {
        return pre + 1;
      }
    });
  }, []);
  const s = React.useRef(onPress);
  console.log('test:TestViewMemo2:s:', s.current === onPress);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'green',
        paddingTop: 100,
        // left: 100,
      }}
    >
      <TouchableOpacity
        style={{ height: 60, width: '100%', backgroundColor: 'red' }}
        onPress={() => {
          updater((pre) => {
            if (c.current++ % 2 === 0) {
              return pre;
            } else {
              return pre + 1;
            }
          });
        }}
      >
        <Text>{'test memo 2'}</Text>
      </TouchableOpacity>
      <View style={{ height: 100 }} />
      <ViewMemo2 onPress={onPress} />
    </View>
  );
}

export function TestEmojiList3() {
  const modalRef = React.useRef<SlideModalRef>({} as any);
  console.log('test:TestEmojiList3:');

  // const pal = createPresetPalette();
  // const dark = createDarkTheme(pal);
  // const light = createLightTheme(pal);
  const pal = usePresetPalette();
  const dark = useDarkTheme(pal);
  const light = useDarkTheme(pal);
  useCompare(pal);
  useCompare(dark);
  useCompare(light);

  return (
    <Container
      opt={{ appKey: 'sdf' } as any}
      palette={pal}
      theme={light ? light : dark}
    >
      <View
        style={{ top: 100, backgroundColor: 'red', height: 50 }}
        onTouchEnd={() => {
          modalRef?.current?.startShow?.();
        }}
      >
        <Text>{'click me for test'}</Text>
      </View>
      <SlideModal
        propsRef={modalRef}
        onRequestModalClose={(): void => {
          modalRef?.current?.startHide?.();
        }}
      >
        <EmojiListMemo
          onFace={function (id: string): void {
            console.log('test:', id);
          }}
        />
      </SlideModal>
    </Container>
  );
}

export default function test_emoji_list() {
  return <TestEmojiList3 />;
}
