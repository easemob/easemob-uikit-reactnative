import * as React from 'react';
import {
  Container,
  Switch,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Test1() {
  const [value, setValue] = React.useState(false);
  return (
    <SafeAreaView>
      <Switch value={value} onValueChange={setValue} height={50} width={100} />
      <Switch value={value} onValueChange={setValue} height={20} width={40} />
      {/* <Switch value={value} onValueChange={setValue} height={10} width={20} /> */}
    </SafeAreaView>
  );
}

export default function TestSwitch() {
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
