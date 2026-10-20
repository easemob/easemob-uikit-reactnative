import * as React from 'react';
import { Text, View } from 'react-native';

import { ChatClient, ChatError, useCallkitSdkContext } from '../rename.callkit';
import { Text1Button } from '../ui/Button';

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

// The test buttons explicitly log in with the configured IM token.
async function loginForRequest(): Promise<string> {
  const client = ChatClient.getInstance();
  try {
    await client.loginWithToken(gid, gps);
  } catch (error) {
    if ((error as ChatError).code !== 200) throw error;
  }
  return client.getCurrentUsername();
}

async function rr(call: any): Promise<void> {
  try {
    const userId = await loginForRequest();
    call.requestRTCToken?.({
      channelId,
      appKey,
      userId,
      onResult: (params: { data?: any; error?: any }) => console.log(params),
    });
  } catch (error) {
    console.warn(error);
  }
}

async function rm(call: any): Promise<void> {
  try {
    const userId = await loginForRequest();
    call.requestUserMap?.({
      channelId,
      appKey,
      userId,
      onResult: (params: { data?: any; error?: any }) => console.log(params),
    });
  } catch (error) {
    console.warn(error);
  }
}

export default function TestAppServer() {
  const { call } = useCallkitSdkContext();
  return (
    <View>
      <Text>hh</Text>
      <Text1Button
        style={{ height: 40, margin: 10 }}
        onPress={() => {
          rr(call as any);
        }}
        text={'requestRTCToken'}
      />
      <Text1Button
        style={{ height: 40, margin: 10 }}
        onPress={() => {
          rm(call as any);
        }}
        text={'requestUserMap'}
      />
    </View>
  );
}
