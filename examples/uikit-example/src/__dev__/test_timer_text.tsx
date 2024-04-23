import * as React from 'react';
import {
  CmnButton,
  Container,
  TimerText,
  type TimerTextRef,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Test1() {
  const ref = React.useRef<TimerTextRef>({} as any);
  return (
    <SafeAreaView>
      <CmnButton
        style={{ width: 200, marginTop: 100 }}
        sizesType={'small'}
        radiusType={'small'}
        contentType={'only-text'}
        text={'start'}
        onPress={() => {
          ref.current.start();
        }}
      />
      <CmnButton
        style={{ width: 200, marginTop: 10 }}
        sizesType={'small'}
        radiusType={'small'}
        contentType={'only-text'}
        text={'stop'}
        onPress={() => {
          ref.current.stop();
        }}
      />
      <CmnButton
        style={{ width: 200, marginTop: 10 }}
        sizesType={'small'}
        radiusType={'small'}
        contentType={'only-text'}
        text={'reset'}
        onPress={() => {
          ref.current.reset();
        }}
      />
      <TimerText
        propsRef={ref}
        isIncrease={false}
        startValue={60}
        stopValue={0}
      />
    </SafeAreaView>
  );
}

export default function TestTimerText() {
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
