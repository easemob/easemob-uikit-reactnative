// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import {
  Container,
  // Icon,
  GlobalBroadcast,
  GlobalBroadcastRef,
} from '../rename.room';

let count = 1;

export function TestGlobalBroadcast() {
  console.log('test:TestGlobalBroadcast');
  const ref = React.useRef<GlobalBroadcastRef>({} as any);
  // const content =
  //   'For several generations, stories from Africa have traditionally been passed down by word of mouth. Often, after a hard day’s work, the adults would gather the children together by moonlight, around a village fire and tell stories. This was traditionally called Tales by Moonlight. Usually, the stories are meant to prepare young people for life, and so each story taught a lesson or moral. ';
  // const content = 'sdf';
  const content = 'For several generations. by Moonlight. ';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'green',
        paddingTop: 100,
        // left: 100,
      }}
    >
      <TouchableOpacity
        style={{ width: 100, height: 60, backgroundColor: 'yellow' }}
        onPress={() => {
          ref.current?.pushTask?.({
            model: {
              id: count.toString(),
              content: count.toString() + content,
              // content: content,
            },
          });
          ++count;
        }}
      >
        <Text>{'add globalBroadcast task'}</Text>
      </TouchableOpacity>
      <View style={{ height: 100 }} />
      <GlobalBroadcast
        ref={ref}
        containerStyle={{
          // top: 100,
          // left: 100,
          // height: 30,
          // width: 250,
          // backgroundColor: 'hsla(0,0%,0%,0)',
          backgroundColor: 'hsla(203, 100%, 60%, 1)',
          position: 'absolute',
          top: 200,
        }}
        textStyle={
          {
            // fontSize: 30,
            // lineHeight: undefined,
          }
        }
        // icon={
        //   <View
        //     style={{
        //       height: 20,
        //       width: 20,
        //       backgroundColor: 'red',
        //       position: 'absolute',
        //       justifyContent: 'center',
        //       alignItems: 'center',
        //     }}
        //   >
        //     <Icon
        //       name={'archives_xmark'}
        //       style={[
        //         {
        //           // paddingLeft: 4,
        //           tintColor: 'white',
        //           height: 14,
        //           width: 14,
        //           backgroundColor: 'red',
        //         },
        //       ]}
        //     />
        //   </View>
        // }
      />
    </View>
  );
}

export default function test_globalBroadcast() {
  return (
    <Container opt={{ appKey: 'sdf' } as any}>
      <TestGlobalBroadcast />
    </Container>
  );
}
