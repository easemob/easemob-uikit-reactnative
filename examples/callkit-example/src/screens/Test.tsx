import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Text, View } from 'react-native';
import { Text1Button } from 'react-native-chat-uikit';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export function TestScreen({ navigation }: Props): JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      <Text>Test the effect of the navigator on the floating window.</Text>
      <Text1Button
        style={{ height: 40, width: 80 }}
        onPress={() => {
          navigation.goBack();
        }}
        text={'return'}
      />
    </View>
  );
}
