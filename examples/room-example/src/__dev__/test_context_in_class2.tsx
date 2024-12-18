// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx
// ref: https://legacy.reactjs.org/docs/context.html

import * as React from 'react';
import { Text, View } from 'react-native';

type MyContextType = { value: string; children?: React.ReactNode };

class MyProvider extends React.Component<MyContextType, {}> {
  static contextType = React.createContext<MyContextType>({
    value: 'hi, how are you?',
  });
  constructor(props: MyContextType) {
    super(props);
  }
  render(): React.ReactNode {
    return (
      <MyProvider.contextType.Provider value={this.props}>
        {this.props.children}
      </MyProvider.contextType.Provider>
    );
  }
}

class MyComponent extends React.Component<{}, {}> {
  static contextType = MyProvider.contextType;
  // declare context: React.ContextType<React.Context<MyContextType>>;
  constructor(props: {}) {
    super(props);
  }
  render(): React.ReactNode {
    const { value } = this.context as MyContextType;
    return (
      <View>
        <Text>{value}</Text>
      </View>
    );
  }
}

export function TextContextInClass() {
  return (
    <View style={{ flex: 1, backgroundColor: 'green', top: 100 }}>
      <MyProvider value={'Who are you?'}>
        <MyComponent />
      </MyProvider>
    </View>
  );
}

export default function test_context_in_class() {
  return <TextContextInClass />;
}
