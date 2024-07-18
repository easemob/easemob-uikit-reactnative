import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AsyncStorageBasic,
  SingleLineText,
  SingletonObjects,
  Switch,
  TextInput,
  TopNavigationBar,
  TopNavigationBarLeft,
  useAlertContext,
  useColors,
  useI18nContext,
  usePaletteContext,
  useThemeContext,
} from '../../rename.uikit';
import { main_bg } from '../common/assets';
import {
  appKey as gAppKey,
  enableDNSConfig as gEnableDNSConfig,
  imPort as gImPort,
  imServer as gImServer,
} from '../common/const';
import { RestApi } from '../common/rest.api';
import { useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ServerSettingScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  const { goBack } = navi;
  const { style } = useThemeContext();
  const { tr } = useI18nContext();
  const { getAlertRef } = useServerSettingScreen();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg2: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    t: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    p: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    n: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
  const [disable] = React.useState<boolean>(false);
  const [appKey, setAppKey] = React.useState<string>(gAppKey);
  const [imServer, setImServer] = React.useState<string>('');
  const [imPort, setImPort] = React.useState<string>('');
  const [_restServer, setRestServer] = React.useState<string>('');
  const [enablePrivateServer, setEnablePrivateServer] = React.useState<
    boolean | undefined
  >(undefined);

  const onBack = React.useCallback(() => {
    goBack();
  }, [goBack]);
  const onSave = React.useCallback(() => {
    // todo: 将变量保存到本地，之后重启时读取
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${appKey}/uikit/demo`,
    });
    try {
      s.setData({ key: 'appKey', value: appKey });
      s.setData({ key: 'imServer', value: imServer });
      s.setData({ key: 'imPort', value: imPort });
      s.setData({ key: '_restServer', value: _restServer });
      s.setData({
        key: 'enablePrivateServer',
        value:
          enablePrivateServer !== undefined
            ? enablePrivateServer.toString()
            : 'false',
      });
      getAlertRef().alertWithInit({
        title: tr('_demo_alert_server_setting_save_title'),
        message: tr('_demo_alert_server_setting_save_message'),
        buttons: [
          {
            text: tr('cancel'),
            onPress: () => {
              getAlertRef().close();
            },
          },
          {
            text: tr('confirm'),
            isPreferred: true,
            onPress: () => {
              getAlertRef().close();
            },
          },
        ],
      });
    } catch (error) {
      console.warn('save error:', error);
    }
  }, [
    _restServer,
    appKey,
    enablePrivateServer,
    getAlertRef,
    imPort,
    imServer,
    tr,
  ]);

  const getData = React.useCallback(async () => {
    const s = SingletonObjects.getInstanceWithParams(AsyncStorageBasic, {
      appKey: `${appKey}/uikit/demo`,
    });
    try {
      const _appKey = await s.getData({ key: 'appKey' });
      const _imServer = await s.getData({ key: 'imServer' });
      const _imPort = await s.getData({ key: 'imPort' });
      const _restServer = await s.getData({ key: '_restServer' });
      const enablePrivateServer = await s.getData({
        key: 'enablePrivateServer',
      });
      return {
        appKey: _appKey.value ?? gAppKey,
        imServer: _imServer.value ?? gImServer,
        imPort: _imPort.value ?? gImPort,
        _restServer: _restServer.value ?? RestApi.server,
        enablePrivateServer:
          enablePrivateServer.value === 'true'
            ? true
            : enablePrivateServer.value === 'false'
            ? false
            : gEnableDNSConfig,
      };
    } catch (error) {
      console.warn('get error:', error);
      return undefined;
    }
  }, [appKey]);

  React.useEffect(() => {
    getData().then((value) => {
      if (value) {
        setAppKey(value.appKey);
        setImServer(value.imServer ?? '');
        setImPort(value.imPort ?? '0');
        setRestServer(value._restServer);
        setEnablePrivateServer(value.enablePrivateServer ?? false);
      }
    });
  }, [getData]);

  return (
    <ImageBackground
      style={{
        backgroundColor: getColor('bg'),
        // justifyContent: 'center',
        // alignItems: 'center',
        flex: 1,
      }}
      source={main_bg}
    >
      <SafeAreaView
        style={{
          // backgroundColor: getColor('bg'),
          flex: 1,
        }}
      >
        <TopNavigationBar
          containerStyle={{ backgroundColor: undefined }}
          Left={
            <TopNavigationBarLeft
              onBack={onBack}
              content={tr('_demo_server_setting_navi_title')}
            />
          }
          Right={
            <Pressable
              disabled={disable}
              style={{
                paddingHorizontal: 16,
              }}
              onPress={() => {
                onSave();
              }}
            >
              <SingleLineText
                textType={'medium'}
                paletteType={'label'}
                style={{
                  color: getColor(disable !== true ? 'p' : 'n'),
                }}
              >
                {tr('_demo_server_setting_navi_save')}
              </SingleLineText>
            </Pressable>
          }
        />
        <TouchableWithoutFeedback
          style={{
            justifyContent: 'center', // !!!
            alignItems: 'center', // !!!
            width: '100%', // !!!
          }}
          onPress={Keyboard.dismiss}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            pointerEvents={'box-none'}
          >
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 16,
                marginBottom: 12,
                marginTop: 12,
                backgroundColor: getColor('bg'),
              }}
            >
              <TextInput
                containerStyle={{
                  backgroundColor: getColor('bg2'),
                  justifyContent: 'center',
                  height: 48,
                  flex: 1,
                }}
                style={{
                  paddingLeft: 24,
                }}
                onChangeText={setAppKey}
                value={appKey}
                keyboardAppearance={style === 'light' ? 'light' : 'dark'}
                autoFocus={true}
                cursorColor={getColor('p')}
                enableClearButton={true}
                placeholder={tr('_demo_server_setting_input_appkey_tip')}
                clearButtonStyle={{ tintColor: getColor('clear') }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 16,
                marginBottom: 12,
              }}
            >
              <SingleLineText
                paletteType={'title'}
                textType={'medium'}
                style={{
                  color: getColor('t'),
                }}
              >
                {tr('_demo_server_setting_private_setting')}
              </SingleLineText>
              <View style={{ flexGrow: 1 }} />
              {enablePrivateServer !== undefined ? (
                <Switch
                  value={enablePrivateServer}
                  onValueChange={setEnablePrivateServer}
                  height={31}
                  width={51}
                />
              ) : null}
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 16,
                marginBottom: 12,
                backgroundColor: getColor('bg'),
              }}
            >
              <TextInput
                containerStyle={{
                  backgroundColor: getColor('bg2'),
                  justifyContent: 'center',
                  height: 48,
                  flex: 1,
                }}
                style={{
                  paddingLeft: 24,
                }}
                onChangeText={setImServer}
                value={imServer}
                keyboardAppearance={style === 'light' ? 'light' : 'dark'}
                autoFocus={true}
                cursorColor={getColor('p')}
                enableClearButton={true}
                placeholder={tr('_demo_server_setting_input_im_server_tip')}
                clearButtonStyle={{ tintColor: getColor('clear') }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 16,
                marginBottom: 12,
                backgroundColor: getColor('bg'),
              }}
            >
              <TextInput
                containerStyle={{
                  backgroundColor: getColor('bg2'),
                  justifyContent: 'center',
                  height: 48,
                  flex: 1,
                }}
                style={{
                  paddingLeft: 24,
                }}
                onChangeText={setImPort}
                value={imPort}
                keyboardAppearance={style === 'light' ? 'light' : 'dark'}
                autoFocus={true}
                cursorColor={getColor('p')}
                enableClearButton={true}
                placeholder={tr('_demo_server_setting_input_port_tip')}
                clearButtonStyle={{ tintColor: getColor('clear') }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 16,
                marginBottom: 12,
                backgroundColor: getColor('bg'),
              }}
            >
              <TextInput
                containerStyle={{
                  backgroundColor: getColor('bg2'),
                  justifyContent: 'center',
                  height: 48,
                  flex: 1,
                }}
                style={{
                  paddingLeft: 24,
                }}
                onChangeText={setRestServer}
                value={_restServer}
                keyboardAppearance={style === 'light' ? 'light' : 'dark'}
                autoFocus={true}
                cursorColor={getColor('p')}
                enableClearButton={true}
                placeholder={tr('_demo_server_setting_input_rest_server_tip')}
                clearButtonStyle={{ tintColor: getColor('clear') }}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ImageBackground>
  );
}

function useServerSettingScreen() {
  const { getAlertRef } = useAlertContext();
  return {
    getAlertRef,
  };
}
