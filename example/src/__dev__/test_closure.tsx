import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Container } from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

let count = 0;
export function Test1() {
  console.log('test:zuoyu:test1:');
  const [, update] = React.useState(0);
  let dep1 = React.useMemo<{
    name: string;
    age: number;
  }>(() => {
    return {
      name: 'dep1',
      age: 1,
    };
  }, []);
  let dep2 = {
    name: 'dep2',
    age: 20,
  };
  let dep3 = React.useMemo<{
    name: string;
    age: number;
  }>(() => {
    return {
      name: 'dep3',
      age: 30,
    };
  }, []);
  let dep4 = 5;

  const testFunction = React.useCallback(() => {
    console.log('dev:testFunction:', dep1, dep2, dep3, dep4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep4]);
  const testFunction2 = () => {
    console.log('dev:testFunction2:', dep1, dep2, dep3);
  };

  React.useEffect(() => {
    testFunction();
    dep1.age = 2;
    testFunction();
  }, [dep1, testFunction]);
  return (
    <SafeAreaView>
      <Pressable
        style={{ width: '100%', height: 60, backgroundColor: 'yellow' }}
        onPress={() => {
          // todo: tell me why?
          console.log('test:zuoyu:pressable:');
          testFunction();
          dep1.age = count;
          dep2.age = count;
          dep3.age = count;
          dep1 = { name: 'dep10', age: 10 };
          dep2 = { name: 'dep20', age: 20 };
          dep3 = { name: 'dep30', age: 30 };
          dep4 = count;
          testFunction();
          ++count;
        }}
      >
        <Text>{'start test'}</Text>
      </Pressable>
      <View style={{ height: 40 }} />
      <Pressable
        style={{ width: '100%', height: 60, backgroundColor: 'yellow' }}
        onPress={() => {
          console.log('test:zuoyu:onPress:');
          testFunction2();
          dep1.age = count;
          dep2.age = count;
          dep3.age = count;
          testFunction2();
          ++count;
        }}
      >
        <Text>{'change test'}</Text>
      </Pressable>
      <View style={{ height: 40 }} />
      <Pressable
        style={{ width: '100%', height: 60, backgroundColor: 'yellow' }}
        onPress={() => {
          update((v) => v + 1);
        }}
      >
        <Text>{'change test'}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default function TestClosure() {
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
