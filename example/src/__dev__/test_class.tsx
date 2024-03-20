import * as React from 'react';
import { Container } from 'react-native-chat-uikit';

interface TestBindListener {
  print: () => void;
}
export class TestBind {
  listener: TestBindListener;
  constructor() {
    this.listener = {
      print: () => {},
    };
  }
  test() {}
}

export function Test1() {
  const text = '中国人imin';
  console.log('test:zuoyu:UnitList', text.length);
  return <></>;
}

export default function TestClass() {
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
