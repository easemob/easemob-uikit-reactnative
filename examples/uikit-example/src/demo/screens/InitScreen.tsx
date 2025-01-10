import * as React from 'react';
import {
  SafeAreaView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ChatClient, ChatOptions } from '../../rename.uikit';
import { appId, appKey } from '../common/const';
import { useAppConfig, useServerConfig } from '../hooks';

type Props = {
  onSave: () => void;
};
export function InitScreen(props: Props) {
  const { onSave } = props;
  const { getOptions } = useAppConfig();
  const {
    setAppId,
    setAppKey,
    getAppKey,
    getAppId,
    getIsAppKey,
    setIsAppKey,
    setEnableDevMode,
  } = useServerConfig();

  const [id, _setId] = React.useState(
    appKey && appKey.length > 0 ? appKey : appId
  );
  const [isAppKey, _setIsAppKey] = React.useState(appKey && appKey.length > 0);

  const onId = (t: string) => {
    _setId(t);
  };

  const onIsAppKey = async (value: boolean) => {
    _setIsAppKey(value);
    if (value) {
      const _id = await getAppKey();
      _setId(_id ?? '');
    } else {
      const _id = await getAppId();
      _setId(_id ?? '');
    }
  };

  const onInit = () => {
    ChatClient.getInstance()
      .init(
        isAppKey
          ? ChatOptions.withAppKey({
              ...getOptions(),
              appKey: id,
            })
          : ChatOptions.withAppId({
              ...getOptions(),
              appId: id,
            })
      )
      .then(() => {
        onSave();
      })
      .catch((e) => {
        console.warn('init error:', e);
      });
  };

  const onSaveAndInit = async () => {
    if (isAppKey) {
      await setAppKey(id);
    } else {
      await setAppId(id);
    }
    await setIsAppKey(isAppKey);
    await setEnableDevMode(true);
    onInit();
  };

  React.useEffect(() => {
    (async () => {
      const _isAppKey = await getIsAppKey();
      if (_isAppKey) {
        const _id = await getAppKey();
        _setId(_id ?? '');
        _setIsAppKey(true);
      } else {
        const _id = await getAppId();
        _setId(_id ?? '');
        _setIsAppKey(false);
      }
    })();
  }, [getAppId, getAppKey, getIsAppKey, _setIsAppKey]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text style={{ color: 'red' }}>
          {'Note: Input App ID or App Token to Init.'}
        </Text>
      </View>

      <View style={{ height: 10 }} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <Text>{isAppKey ? 'is app key' : 'is app id'}</Text>
        {isAppKey !== undefined && (
          <Switch onValueChange={onIsAppKey} value={isAppKey} />
        )}
      </View>
      <View style={{ height: 10 }} />

      <TextInput
        placeholder={'Please enter app key or app id.'}
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
          {'sava app key or app id, and init.'}
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />
    </SafeAreaView>
  );
}
