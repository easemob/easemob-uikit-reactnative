import Clipboard from '@react-native-clipboard/clipboard';
import * as React from 'react';
import { Pressable, View } from 'react-native';
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

export function Test2() {
  return (
    <View style={{ top: 100 }}>
      <Pressable
        style={{ backgroundColor: 'red', padding: 20 }}
        onLongPress={() => {
          console.log('test:zuoyu:Pressable:longPress:');
        }}
        // onPress={() => {
        //   console.log('test:zuoyu:Pressable:press:');
        // }}
        // onStartShouldSetResponderCapture={() => true}
        // onStartShouldSetResponder={() => true}
        // onMoveShouldSetResponderCapture={() => true}
        // onMoveShouldSetResponder={() => true}
        onPressIn={() => {
          console.log('test:zuoyu:Pressable:pressIn:');
        }}
        onPressOut={() => {
          console.log('test:zuoyu:Pressable:pressOut:');
        }}
      >
        <Text
          selectable={true}
          selectionColor={'red'}
          // onStartShouldSetResponderCapture={() => true}
          // onStartShouldSetResponder={() => true}
          // onMoveShouldSetResponderCapture={() => true}
          // onMoveShouldSetResponder={() => true}
          onLongPress={(e) => {
            e.stopPropagation();
            console.log('test:zuoyu:Text:longPress:');
          }}
          onPress={(e) => {
            e.stopPropagation();
            console.log('test:zuoyu:Text:press:');
          }}
          onPressIn={(e) => {
            e.stopPropagation();
            console.log('test:zuoyu:Text:pressIn:');
          }}
          onPressOut={() => {
            console.log('test:zuoyu:Text:pressOut:');
          }}
        >
          {'test you welcome.'}
        </Text>
      </Pressable>
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
      <Test2 />
    </Container>
  );
}
