import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import { DispatchContextProvider, useDispatchContext } from '../rename.room';

class ClassFunction {
  listener(...args: any[]) {
    console.log('test:', 'received notification', ...args);
  }
}

function DispatchComponent(): JSX.Element {
  console.log('test:DispatchComponent');
  const { addListener, removeListener } = useDispatchContext();

  // React.useEffect(() => {
  //   const listener = (...args: any[]) => {
  //     console.log('test:', 'received notification', ...args);
  //   };
  //   addListener('test', listener);
  //   return () => {
  //     removeListener('test', listener);
  //   };
  // }, [addListener, removeListener]);

  React.useEffect(() => {
    const listener = new ClassFunction();
    const l = listener.listener.bind(listener);
    addListener('test', l);
    return () => {
      removeListener('test', l);
    };
  }, [addListener, removeListener]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Pressable style={{ height: 100 }} onPress={() => {}}>
        <Text>DispatchComponent</Text>
      </Pressable>
      <DispatchComponent2 />
    </View>
  );
}

function DispatchComponent2(): JSX.Element {
  console.log('test:DispatchComponent2');
  const { emitSync } = useDispatchContext();
  return (
    <Pressable
      style={{ height: 100 }}
      onPress={() => {
        console.log('test:', 'send notification');
        emitSync('test', '1', 2);
      }}
    >
      <Text>DispatchComponent2</Text>
    </Pressable>
  );
}

export default function test_dispatch() {
  return (
    <DispatchContextProvider>
      <DispatchComponent />
    </DispatchContextProvider>
  );
}
