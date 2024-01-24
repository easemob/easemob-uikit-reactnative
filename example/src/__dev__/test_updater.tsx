import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Container, useForceUpdate } from 'react-native-chat-uikit';

export function Test1() {
  const count = React.useRef(0);
  const { updater } = useForceUpdate();
  return (
    <View style={{ paddingTop: 100, flexGrow: 1 }}>
      <Pressable
        style={{ height: 50, width: 100, backgroundColor: 'red' }}
        onPress={() => {
          count.current += 1;
          updater();
        }}
      >
        <Text>{'test updater'}</Text>
      </Pressable>
      <Text>{`${count.current}`}</Text>
    </View>
  );
}

export default function TestUpdater() {
  return (
    <Container
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
    >
      <Test1 />
    </Container>
  );
}
