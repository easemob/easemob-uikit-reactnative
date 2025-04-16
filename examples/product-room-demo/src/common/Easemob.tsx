import * as React from 'react';
import { Text, View } from 'react-native';

import { a_easemob_logo_text } from '../assets';
import { Image } from '../rename.room';

export function Easemob() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{ flex: 100, justifyContent: 'center', alignItems: 'center' }}
      >
        <Image source={a_easemob_logo_text} />
      </View>
      <View style={{ flex: 10 }}>
        <Text
          style={{
            lineHeight: 18.2,
            fontWeight: '400',
            fontSize: 13,
            color: '#6C7192',
          }}
        >
          {'Powered by Easemob'}
        </Text>
      </View>
    </View>
  );
}
