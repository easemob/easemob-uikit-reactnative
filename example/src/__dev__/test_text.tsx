import Clipboard from '@react-native-clipboard/clipboard';
import * as React from 'react';
import { View } from 'react-native';
import { Container, Text } from 'react-native-chat-uikit';

export function Test1() {
  React.useEffect(() => {
    Clipboard.addListener(async () => {
      const ret = await Clipboard.getString();
      console.log('test:zuoyu:clipboard:', ret);
    });
  }, []);
  return (
    <View style={{ top: 100 }}>
      <Text
        selectable={true}
        selectionColor={'red'}
        // accessibilityState={{
        //   selected: true,
        //   checked: true,
        // }}
      >
        {'test you welcome.'}
      </Text>
    </View>
  );
}

export default function TestText() {
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
