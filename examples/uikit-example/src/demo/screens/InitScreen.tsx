import * as React from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ChatClient, ChatOptions } from '../../rename.uikit';
import { appKey } from '../common/const';
import { useAppConfig, useServerConfig } from '../hooks';

type Props = {
  onSave: () => void;
};
export function InitScreen(props: Props) {
  const { onSave } = props;
  const { getOptions } = useAppConfig();
  const { setAppKey, getAppKey, setEnableDevMode } = useServerConfig();

  const [id, _setId] = React.useState(appKey);

  const onId = (t: string) => {
    _setId(t);
  };

  const onInit = () => {
    ChatClient.getInstance()
      .init(
        new ChatOptions({
          ...getOptions(),
          appKey: id,
        } as any)
      )
      .then(() => {
        onSave();
      })
      .catch((e) => {
        console.warn('init error:', e);
      });
  };

  const onSaveAndInit = async () => {
    await setAppKey(id);
    await setEnableDevMode(true);
    onInit();
  };

  React.useEffect(() => {
    (async () => {
      const _id = await getAppKey();
      _setId(_id ?? '');
    })();
  }, [getAppKey]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text style={{ color: 'red' }}>{'Note: Input App Key to Init.'}</Text>
      </View>

      <View style={{ height: 10 }} />

      <TextInput
        placeholder={'Please enter app key.'}
        style={{
          height: 40,
          backgroundColor: '#fff8dc',
          color: 'black',
          borderRadius: 4,
          marginHorizontal: 16,
        }}
        value={id}
        onChangeText={onId}
      />
      <View style={{ height: 10 }} />

      <TouchableOpacity
        style={{
          width: '90%',
          height: 60,
          marginVertical: 4,
          backgroundColor: '#fff8dc',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          alignSelf: 'center',
        }}
        onPress={() => {
          onSaveAndInit();
        }}
      >
        <Text style={{ color: '#8fbc8f', fontSize: 26 }}>
          {'sava app key, and init.'}
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />
    </SafeAreaView>
  );
}
