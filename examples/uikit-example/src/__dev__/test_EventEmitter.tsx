import * as React from 'react';
import { DeviceEventEmitter, type EmitterSubscription } from 'react-native';
import {
  CmnButton,
  Container,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

type Callback = (data: any) => void;

export const EventEmitter = DeviceEventEmitter;

export function useEventEmitter() {
  const keyRef = React.useRef<string | undefined>(undefined);
  const listenerRef = React.useRef<Callback | undefined>(undefined);
  const [v, updater] = React.useState(0);
  const setListener = React.useCallback(
    (keyword: string, listener: Callback) => {
      keyRef.current = keyword;
      listenerRef.current = listener;
      updater((v) => v + 1);
    },
    []
  );
  React.useEffect(() => {
    console.log('test:zuoyu:useEffect', v);
    v;
    if (!keyRef.current || !listenerRef.current) {
      return;
    }
    console.log('test:zuoyu:useEffect:2');
    const sub = EventEmitter.addListener(keyRef.current, listenerRef.current);
    return () => {
      console.log('test:zuoyu:useEffect:3');
      sub.remove();
    };
  }, [v]);
  return {
    setListener,
  };
}

const subs: Map<string, EmitterSubscription> = new Map();
export function setListener(keyword: string, listener: Callback) {
  subs.get(keyword)?.remove();
  subs.set(keyword, EventEmitter.addListener(keyword, listener));
}

export function Test1() {
  const listener = React.useCallback((data: any) => {
    console.log('test:zuoyu:', data);
  }, []);
  const { setListener } = useEventEmitter();
  React.useEffect(() => {
    setListener('test', listener);
  }, [setListener, listener]);
  return (
    <SafeAreaView>
      <CmnButton
        style={{ width: 200, marginTop: 100 }}
        sizesType={'small'}
        radiusType={'small'}
        contentType={'only-text'}
        text={'emit'}
        onPress={() => {
          EventEmitter.emit('test', 'test');
        }}
      />
      <CmnButton
        style={{ width: 200, marginTop: 100 }}
        sizesType={'small'}
        radiusType={'small'}
        contentType={'only-text'}
        text={'update'}
        onPress={() => {
          setListener('test', listener);
        }}
      />
    </SafeAreaView>
  );
}

export function Test2() {
  const listener = React.useCallback((data: any) => {
    console.log('test:zuoyu:', data);
  }, []);
  return (
    <SafeAreaView>
      <CmnButton
        style={{ width: 200, marginTop: 100 }}
        sizesType={'small'}
        radiusType={'small'}
        contentType={'only-text'}
        text={'emit'}
        onPress={() => {
          EventEmitter.emit('test', 'test');
        }}
      />
      <CmnButton
        style={{ width: 200, marginTop: 100 }}
        sizesType={'small'}
        radiusType={'small'}
        contentType={'only-text'}
        text={'update'}
        onPress={() => {
          setListener('test', listener);
        }}
      />
    </SafeAreaView>
  );
}

export default function TestEmitter() {
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
      <Test2 />
    </Container>
  );
}
