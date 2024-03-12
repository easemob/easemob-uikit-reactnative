import type { CallManagerImpl } from 'packages/react-native-chat-callkit/src/call/CallManagerImpl';
import * as React from 'react';
import { Text, View } from 'react-native';
import { useCallkitSdkContext } from 'react-native-chat-callkit';
import { ChatClient } from 'react-native-chat-sdk';
import { Text1Button } from 'react-native-chat-uikit';

let gid: string = '';
let gps: string = '';
let appKey = '';

try {
  const env = require('../env');
  appKey = env.appKey ?? '';
  gid = env.id ?? '';
  gps = env.ps ?? '';
} catch (e) {
  console.warn('test:', e);
}

const channelId = 'magic';

function rr(call: CallManagerImpl): void {
  ChatClient.getInstance()
    .isLoginBefore()
    .then((result) => {
      if (result === true) {
        ChatClient.getInstance()
          .getCurrentUsername()
          .then((value) => {
            call.requestRTCToken?.({
              channelId,
              appKey,
              userId: value,
              onResult: (params: { data?: any; error?: any }) => {
                console.log(params);
              },
            });
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        ChatClient.getInstance()
          .login(gid, gps)
          .then(() => {
            const userId = ChatClient.getInstance().currentUserName;
            call.requestRTCToken?.({
              channelId,
              appKey,
              userId,
              onResult: (params: { data?: any; error?: any }) => {
                console.log(params);
              },
            });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    })
    .catch((e) => {
      console.log(e);
    });
}
function rm(call: CallManagerImpl): void {
  ChatClient.getInstance()
    .isLoginBefore()
    .then((result) => {
      if (result === true) {
        ChatClient.getInstance()
          .getCurrentUsername()
          .then((value) => {
            call.requestUserMap?.({
              channelId,
              appKey,
              userId: value,
              onResult: (params: { data?: any; error?: any }) => {
                console.log(params);
              },
            });
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        ChatClient.getInstance()
          .login(gid, gps)
          .then(() => {
            const userId = ChatClient.getInstance().currentUserName;
            call.requestUserMap?.({
              channelId,
              appKey,
              userId,
              onResult: (params: { data?: any; error?: any }) => {
                console.log(params);
              },
            });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

export default function TestAppServer() {
  const { call } = useCallkitSdkContext();
  return (
    <View>
      <Text>hh</Text>
      <Text1Button
        style={{ height: 40, margin: 10 }}
        onPress={() => {
          rr(call as CallManagerImpl);
        }}
        sizesType={'small'}
        radiusType={'small'}
        text={'requestRTCToken'}
      />
      <Text1Button
        style={{ height: 40, margin: 10 }}
        onPress={() => {
          rm(call as CallManagerImpl);
        }}
        sizesType={'small'}
        radiusType={'small'}
        text={'requestUserMap'}
      />
    </View>
  );
}
