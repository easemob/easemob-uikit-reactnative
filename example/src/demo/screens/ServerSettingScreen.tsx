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

import {
  SingleLineText,
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
import { main_bg, main_bg_dark } from '../common/assets';
import { appKey as gAppKey } from '../common/const';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import { useServerConfig, useStackScreenRoute } from '../hooks';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ServerSettingScreen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  const { goBack } = navi;
  const { style } = useThemeContext();
  const { tr } = useI18nContext();
  const {
    getAlertRef,
    getAppKey,
    getImPort,
    getEnableDNSConfig,
    getImServer,
    getRestSever,
    setAppKey: _setAppKey,
    setImServer: _setImServer,
    setEnableDNSConfig: _setEnableDNSConfig,
    setImPort: _setImPort,
    setRestSever: _setRestServer,
  } = useServerSettingScreen();
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
  const [restServer, setRestServer] = React.useState<string>('');
  const [enablePrivateServer, setEnablePrivateServer] = React.useState<
    boolean | undefined
  >(undefined);
  const initRef = React.useRef<boolean>(false);

  const onBack = React.useCallback(() => {
    goBack();
  }, [goBack]);
  const onSave = React.useCallback(async () => {
    // todo: 将变量保存到本地，之后重启时读取
    try {
      await _setAppKey(appKey);
      await _setImPort(imPort);
      await _setEnableDNSConfig(enablePrivateServer);
      await _setImServer(imServer);
      await _setRestServer(restServer);

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
    restServer,
    _setAppKey,
    _setEnableDNSConfig,
    _setImPort,
    _setImServer,
    _setRestServer,
    appKey,
    enablePrivateServer,
    getAlertRef,
    imPort,
    imServer,
    tr,
  ]);

  const getData = React.useCallback(async () => {
    try {
      const _appKey = await getAppKey();
      const _imServer = await getImServer();
      const _imPort = await getImPort();
      const _restServer = await getRestSever();
      const _enablePrivateServer = await getEnableDNSConfig();
      return {
        appKey: _appKey,
        imServer: _imServer,
        imPort: _imPort,
        restServer: _restServer,
        enablePrivateServer: _enablePrivateServer,
      };
    } catch (error) {
      console.warn('get error:', error);
      return undefined;
    }
  }, [getAppKey, getEnableDNSConfig, getImPort, getImServer, getRestSever]);

  React.useEffect(() => {
    if (initRef.current === false) {
      initRef.current = true;
      getData().then((value) => {
        if (value) {
          setAppKey(value.appKey);
          setImServer(value.imServer);
          setImPort(value.imPort);
          setRestServer(value.restServer);
          setEnablePrivateServer(value.enablePrivateServer ?? false);
        }
      });
    }
  }, [getAppKey, getData]);

  return (
    <ImageBackground
      style={{
        backgroundColor: getColor('bg'),
        // justifyContent: 'center',
        // alignItems: 'center',
        flex: 1,
      }}
      source={style === 'light' ? main_bg : main_bg_dark}
    >
      <SafeAreaViewFragment>
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
                value={restServer}
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
      </SafeAreaViewFragment>
    </ImageBackground>
  );
}

function useServerSettingScreen() {
  const { getAlertRef } = useAlertContext();
  const callbacks = useServerConfig();
  return {
    getAlertRef,
    ...callbacks,
  };
}
