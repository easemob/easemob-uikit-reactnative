import * as React from 'react';
import {
  Alert,
  type AlertRef,
  CmnButton,
  Container,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Alert1() {
  const ref = React.useRef<AlertRef>({} as any);
  return (
    <SafeAreaView>
      <CmnButton
        style={{ width: 200, marginTop: 100 }}
        sizesType={'small'}
        radiusType={'small'}
        contentType={'only-text'}
        text={'alert'}
        onPress={() => {
          ref.current.alertWithInit({
            title: 'test',
            message: 'message',
            supportInput: true,
            buttons: [
              {
                text: 'cancel',
                onPress: () => {
                  ref.current.close();
                },
              },
              {
                text: 'confirm',
                onPress: () => {
                  ref.current.close();
                },
              },
              {
                text: 'confirm2',
                isPreferred: true,
                onPress: (value) => {
                  console.log('test:zuoyu:', value);
                  ref.current.close();
                },
              },
            ],
          });
        }}
      />
      <Alert ref={ref} />
    </SafeAreaView>
  );
}

export default function TestAlert() {
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
      <Alert1 />
    </Container>
  );
}
