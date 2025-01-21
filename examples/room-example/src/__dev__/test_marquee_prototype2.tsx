// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Animated, Button, View } from 'react-native';

import { Queue } from '../rename.room';

let count = 1;

export type Task = {
  id: string;
};

export type GlobalBroadcastRef = {
  startScrolling: () => void;
  pushTask: (task: Task) => void;
};
export type GlobalBroadcastProps = {
  propsRef: React.RefObject<GlobalBroadcastRef>;
};
export function GlobalBroadcast(props: GlobalBroadcastProps) {
  const { propsRef } = props;

  const x = React.useRef(new Animated.Value(0)).current;
  const tasks: Queue<Task> = React.useRef(new Queue<Task>()).current;
  const taskState = React.useRef<'ing' | 'idle'>('idle');

  const createCompose = () => {
    const scrolling = Animated.timing(x, {
      toValue: -400,
      useNativeDriver: true,
      duration: 4000,
    });
    const holding = Animated.timing(x, {
      toValue: x,
      useNativeDriver: true,
      duration: 1000,
    });
    const holding2 = Animated.timing(x, {
      toValue: -400,
      useNativeDriver: true,
      duration: 1000,
    });
    const compose = Animated.sequence([holding, scrolling, holding2]).start;
    return { compose };
  };

  if (propsRef.current) {
    propsRef.current.startScrolling = () => {
      x.setValue(0);
      createCompose().compose();
    };
    propsRef.current.pushTask = async (task: Task) => {
      tasks.enqueue(task);
      execTask();
    };
  }

  const execTask = () => {
    if (taskState.current === 'idle') {
      taskState.current = 'ing';
      const task = tasks.dequeue();
      if (task) {
        x.setValue(0);
        createCompose().compose(() => {
          taskState.current = 'idle';
          execTask();
        });
      } else {
        taskState.current = 'idle';
      }
    }
  };

  return (
    <View
      style={{
        height: 100,
        width: 100,
        backgroundColor: 'yellow',
        overflow: 'scroll',
        // justifyContent: 'center',
        // alignItems: 'center',
      }}
    >
      <Animated.View
        style={{
          height: 100,
          width: 400,
          backgroundColor: 'blue',
          flexWrap: 'wrap',
          transform: [{ translateX: x }],
        }}
      >
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: 'gray',
          }}
        />
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: 'orange',
          }}
        />
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: 'red',
          }}
        />
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: 'yellow',
          }}
        />
      </Animated.View>
    </View>
  );
}

export function TestGlobalBroadcast() {
  const ref = React.useRef<GlobalBroadcastRef>({} as any);

  return (
    <View style={{ flex: 1, backgroundColor: 'green', paddingTop: 100 }}>
      <Button
        title="start rolling"
        onPress={() => {
          // ref.current.startScrolling();
          ref.current.pushTask({ id: count.toString() });
          ++count;
        }}
      />
      <Button title="reset rolling" onPress={() => {}} />
      <View style={{ height: 100 }} />
      <View style={{ flex: 0, alignItems: 'center' }}>
        <GlobalBroadcast propsRef={ref} />
      </View>
    </View>
  );
}

export default function test_globalBroadcast_prototype() {
  return <TestGlobalBroadcast />;
}
