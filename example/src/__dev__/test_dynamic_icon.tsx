import * as React from 'react';
import {
  Pressable,
  Text,
  // TextInput as RNTextInput,
  View,
} from 'react-native';
import {
  DynamicIcon,
  DynamicIconRef,
  GlobalContainer,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

// export function Test11() {
//   const ref = React.useRef<DynamicIconRef>({} as any);
//   return (
//     <DynamicIcon
//       propsRef={ref}
//       names={['loading', 'link', 'location']}
//       loopCount={5}
//       onPlayStart={() => {}}
//       onPlayFinished={() => {}}
//       style={{ width: 20, height: 20, tintColor: 'red' }}
//     />
//   );
// }

export function Test1() {
  const ref = React.useRef<DynamicIconRef>({} as any);
  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: 'red',
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            // height: 100,
            // width: 100,
            // backgroundColor: 'green',
            flexGrow: 1,
            // overflow: 'hidden',
          }}
        >
          <Pressable
            style={{
              width: '60%',
              height: 60,
              backgroundColor: 'yellow',
              marginBottom: 10,
            }}
            onPress={() => {
              console.log('test:zuoyu:play:', true);
              ref.current?.startPlay();
            }}
          >
            <Text>{'start'}</Text>
          </Pressable>
          <Pressable
            style={{ width: '60%', height: 60, backgroundColor: 'yellow' }}
            onPress={() => {
              console.log('test:zuoyu:play:', false);
              ref.current?.stopPlay();
            }}
          >
            <Text>{'stop'}</Text>
          </Pressable>
          <DynamicIcon
            propsRef={ref}
            names={['loading', 'link', 'location']}
            loopCount={5}
            onPlayFinished={() => {}}
            style={{ width: 20, height: 20, tintColor: 'red' }}
          />
          {/* <Test11 /> */}
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function TestDynamicIcon() {
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
      {/* <View style={{ height: 50 }} /> */}
    </GlobalContainer>
  );
}
