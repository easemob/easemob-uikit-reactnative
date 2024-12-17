// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Text, View } from 'react-native';

// ref: https://www.youtube.com/watch?v=ch8kiuRJc7I

const MyContext = React.createContext<{ value: string }>({
  value: 'hi, how are you?',
});

class MyComponent extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }
  render(): React.ReactNode {
    return (
      <MyContext.Consumer>
        {({ value }) => {
          return (
            <View style={{ flex: 1, backgroundColor: 'green', top: 100 }}>
              <Text>{value}</Text>
            </View>
          );
        }}
      </MyContext.Consumer>
    );
  }
}

export function TextContextInClass() {
  return (
    <MyContext.Provider value={{ value: 'Can you speak with English?' }}>
      <MyComponent />
    </MyContext.Provider>
  );
}

export default function test_context_in_class() {
  return <TextContextInClass />;
}
