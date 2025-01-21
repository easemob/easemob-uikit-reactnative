// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Text, View } from 'react-native';

export function SubSubComponent() {
  let viewRef = React.useRef<View>({} as any);
  return (
    <View
      ref={viewRef}
      style={{
        flex: 1,
        backgroundColor: 'red',
        top: 100,
        justifyContent: 'flex-end',
        // height: 659 - 300,
        transform: [{ translateY: -400 }],
      }}
      onLayout={(e) => {
        console.log('Sub:Sub:onLayout:', e.nativeEvent.layout);
        viewRef.current?.measure(
          (
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number
          ) => {
            console.log('Sub:Sub:measure:', x, y, width, height, pageX, pageY);
          }
        );
        viewRef.current?.measureInWindow(
          (x: number, y: number, width: number, height: number) => {
            console.log('Sub:Sub:measureInWindow:', x, y, width, height);
          }
        );
      }}
    >
      <Text>{'SubSubComponent'}</Text>
    </View>
  );
}

export function SubComponent() {
  let viewRef = React.useRef<View>({} as any);
  return (
    <View
      ref={viewRef}
      style={{ flex: 1, backgroundColor: 'yellow', top: 100 }}
      onLayout={(e) => {
        console.log('Sub:onLayout:', e.nativeEvent.layout);
        viewRef.current?.measure(
          (
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number
          ) => {
            console.log('Sub:measure:', x, y, width, height, pageX, pageY);
          }
        );
        viewRef.current?.measureInWindow(
          (x: number, y: number, width: number, height: number) => {
            console.log('Sub:measureInWindow:', x, y, width, height);
          }
        );
      }}
    >
      <SubSubComponent />
    </View>
  );
}

export function TestLayoutPosition() {
  let viewRef = React.useRef<View>({} as any);
  return (
    <View style={{ flex: 1, backgroundColor: 'green' }}>
      <View
        ref={(ref) => {
          if (ref) {
            // if (viewRef.current === undefined)
            viewRef.current = ref;
          }
          viewRef.current?.measure(
            (
              x: number,
              y: number,
              width: number,
              height: number,
              pageX: number,
              pageY: number
            ) => {
              console.log('test:measure:2:', x, y, width, height, pageX, pageY);
            }
          );
          viewRef.current?.measureInWindow(
            (x: number, y: number, width: number, height: number) => {
              console.log('test:measureInWindow:2:', x, y, width, height);
            }
          );
        }}
        style={{
          flex: 1,
          backgroundColor: 'orange',
          top: 100,
          marginTop: 100,
        }}
        onLayout={(e) => {
          console.log('test:onLayout:', e.nativeEvent.layout);
          viewRef.current?.measure(
            (
              x: number,
              y: number,
              width: number,
              height: number,
              pageX: number,
              pageY: number
            ) => {
              console.log('test:measure:', x, y, width, height, pageX, pageY);
            }
          );
          viewRef.current?.measureInWindow(
            (x: number, y: number, width: number, height: number) => {
              console.log('test:measureInWindow:', x, y, width, height);
            }
          );
        }}
      >
        <SubComponent />
      </View>
    </View>
  );
}

export default function test_layout_position() {
  return <TestLayoutPosition />;
}
