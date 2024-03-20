import * as React from 'react';
import { Text, View } from 'react-native';
import {
  Container,
  useDispatchContext,
  useLifecycle,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

export function CL() {
  const [is, setIs] = React.useState(false);
  const test = () => {};
  useLifecycle(
    React.useCallback((state: any) => {
      if (state === 'load') {
        test();
      } else if (state === 'unload') {
      }
    }, [])
  );
  return (
    <SafeAreaView>
      <View
        style={{ width: 100, height: 100, backgroundColor: 'red' }}
        onTouchEnd={() => {
          setIs(!is);
        }}
      >
        <Text>{'Hello'}</Text>
      </View>
    </SafeAreaView>
  );
}

export function CL2() {
  const [is, setIs] = React.useState(false);
  const init = () => {};
  const unInit = () => {};
  const { addListener, removeListener, emit } = useDispatchContext();
  useLifecycle(
    React.useCallback(
      (state: any) => {
        const listener = (data: any) => {
          if (data === 'load') {
            init();
          } else if (data === 'unload') {
            unInit();
          }
        };
        if (state === 'load') {
          addListener('test', listener);
        } else if (state === 'unload') {
          removeListener('test', listener);
        }
      },
      [addListener, removeListener]
    )
  );
  useLifecycle(
    React.useCallback(
      (state: any) => {
        if (state === 'load') {
          emit('test', 'load');
        } else if (state === 'unload') {
          emit('test', 'unload');
        }
      },
      [emit]
    )
  );
  return (
    <SafeAreaView>
      <View
        style={{ width: 100, height: 100, backgroundColor: 'red' }}
        onTouchEnd={() => {
          setIs(!is);
        }}
      >
        <Text>{'Hello'}</Text>
      </View>
    </SafeAreaView>
  );
}

export class CL3 extends React.PureComponent<{ id: string }> {
  constructor(props: { id: string }) {
    super(props);
  }
  render(): React.ReactNode {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>
          <Text>{'test'}</Text>
        </View>
      </View>
    );
  }
}

export default function TestLifeCycle() {
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
    >
      <CL />
    </Container>
  );
}
