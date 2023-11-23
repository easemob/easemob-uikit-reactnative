import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { DeviceEventEmitter, Switch, Text, View } from 'react-native';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConfigScreen(props: Props) {
  const {} = props;
  const [value, onValueChange] = React.useState(false);
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={{ color: 'red' }}>
          {'Click the switch button to switch themes.'}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={(v) => {
          onValueChange(v);
          DeviceEventEmitter.emit(
            'example_change_theme',
            value === true ? 'light' : 'dark'
          );
        }}
      />
    </View>
  );
}
