import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  DeviceEventEmitter,
  Dimensions,
  ImageBackground,
  Keyboard,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {
  CmnButton,
  getReleaseArea,
  Icon,
  KeyboardAvoidingView,
  LoadingIcon,
  SingleLineText,
  TextInput,
  useColors,
  useForceUpdate,
  useGetStyleProps,
  useI18nContext,
  usePaletteContext,
  useThemeContext,
} from '../../rename.uikit';
import { main_bg, main_bg_dark } from '../common/assets';
import { accountType } from '../common/const';
import { RestApi } from '../common/rest.api';
import { SafeAreaViewFragment } from '../common/SafeAreaViewFragment';
import {
  useGeneralSetting,
  useLogin,
  useNavigationState,
  useStackScreenRoute,
} from '../hooks';
import type { RootScreenParamsList } from '../routes';

type CaptchaState = 'init' | 'sending' | 'sent' | 'resend' | 'error';
type Props = NativeStackScreenProps<RootScreenParamsList>;
function EasemobLoginV2Screen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  const { push } = navi;
  const [id, setId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [captchaState, setCaptchaState] = React.useState<CaptchaState>('init');
  const [second, setSecond] = React.useState(60);
  const [check, setCheck] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { tr } = useI18nContext();
  const { style, cornerRadius: corner } = useThemeContext();
  const { getBorderRadius } = useGetStyleProps();
  const { colors, cornerRadius } = usePaletteContext();
  const { input } = corner;
  const { getColor } = useColors({
    bg: {
      light: '#EFF4FF',
      dark: 'rgba(142, 199, 239, 0.49)',
    },
    bg2: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    p: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    clear: {
      light: colors.neutral[7],
      dark: colors.neutral[8],
    },
    n: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    v: {
      light: 'rgba(0, 0, 0, 0.20)',
      dark: 'rgba(0, 0, 0, 0.20)',
    },
    tip: {
      light: colors.neutral[3],
      dark: colors.neutral[8],
    },
    placeholder: {
      light: colors.neutral[6],
      dark: colors.neutral[4],
    },
    loading: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
  });
  const { getToastRef, loginAction } = useLogin();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const countRef = React.useRef(0);
  const [version, setVersion] = React.useState('');
  const [serverSettingVisible, SetServerSettingVisible] = React.useState(false);
  const { updater } = useForceUpdate();
  const ra = getReleaseArea();
  const releaseAreaRef = React.useRef(ra);
  useNavigationState(props);

  const { initParams } = useGeneralSetting();
  const [_initParams, setInitParams] = React.useState(false);

  const initParamsCallback = React.useCallback(async () => {
    if (_initParams === true) {
      return;
    }
    try {
      const ret = await initParams();
      releaseAreaRef.current = ret.appStyle === 'classic' ? 'china' : 'global';
      setInitParams(true);
    } catch (error) {
      setInitParams(true);
    }
  }, [_initParams, initParams, releaseAreaRef, setInitParams]);

  const getCaptchaText = () => {
    if (captchaState === 'init') {
      return tr('_demo_login_input_phone_number_captcha_button_1');
    } else if (captchaState === 'sending') {
      return tr('_demo_login_input_phone_number_captcha_button_2', second);
    } else if (captchaState === 'sent') {
      return tr('_demo_login_input_phone_number_captcha_button_3');
    } else if (captchaState === 'resend') {
      return tr('_demo_login_input_phone_number_captcha_button_3');
    } else {
      return tr('_demo_login_input_phone_number_captcha_button_3');
    }
  };
  const getCaptchaColor = () => {
    if (captchaState === 'init') {
      return getColor('p');
    } else if (captchaState === 'sending') {
      return getColor('clear');
    } else if (captchaState === 'sent') {
      return getColor('p');
    } else if (captchaState === 'resend') {
      return getColor('p');
    } else {
      return getColor('clear');
    }
  };

  const startCaptcha = () => {
    if (captchaState === 'sending') {
      return;
    }
    setCaptchaState('sending');
    setSecond(60);
    RestApi.requestSmsCode({ phone: id });
    const interval = setInterval(() => {
      setSecond((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setCaptchaState('resend');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onClickedServices = () => {
    Linking.openURL('https://www.easemob.com/terms');
  };
  const onClickedProtocol = () => {
    Linking.openURL('https://www.easemob.com/protocol');
  };

  const validPhone = (phone: string) => {
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phone)) {
      return false;
    }
    return true;
  };

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      if (countRef.current >= 4) {
        countRef.current = 0;
        SetServerSettingVisible(true);
        push({ to: 'LoginV2Setting' });
        return;
      }
      ++countRef.current;
    }
  }, [push]);

  const onClickedServerSetting = React.useCallback(() => {
    push({ to: 'LoginV2Setting' });
  }, [push]);

  const onClickedEnableDev = React.useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      countRef.current = 0;
    }, 1000);
  }, [clearTimer]);

  const onClickedLogin = React.useCallback(() => {
    if (check === false) {
      getToastRef().show({
        message: tr('_demo_login_tip_reason_2'),
        showPosition: 'center',
      });
      return;
    }
    if (validPhone(id) === false) {
      getToastRef().show({
        message: tr('_demo_login_tip_reason_1'),
        showPosition: 'center',
      });
      return;
    }
    if (password.length === 0) {
      getToastRef().show({
        message: tr('_demo_login_tip_reason_3'),
        showPosition: 'center',
      });
      return;
    }
    setIsLoading(true);
    loginAction({
      id,
      pass: password,
      onResult: (res) => {
        setIsLoading(false);
        if (res.isOk) {
          navi.replace({ to: 'Home' });
        }
      },
    });
  }, [check, getToastRef, id, loginAction, navi, password, tr]);

  React.useEffect(() => {
    const appVersion = DeviceInfo.getVersion();
    console.log('dev:appVersion:', appVersion);
    setVersion(appVersion);
  }, []);

  React.useEffect(() => {
    initParamsCallback().catch();
  }, [initParamsCallback]);

  React.useEffect(() => {
    const ret8 = DeviceEventEmitter.addListener('_demo_emit_app_style', (e) => {
      console.log('dev:emit:app:style:', e);
      releaseAreaRef.current = e === 'classic' ? 'china' : 'global';
      updater();
    });

    return () => {
      ret8.remove();
    };
  }, [updater]);

  return (
    <ImageBackground
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
      source={style === 'light' ? main_bg : main_bg_dark}
    >
      <SafeAreaViewFragment backgroundColor={null} visibleStatusBar={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
            // pointerEvents={'box-none'}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                alignSelf: 'flex-start',
                paddingHorizontal: 30,
                width: '100%',
                marginTop: 20,
              }}
            >
              <SingleLineText
                style={{
                  fontSize: 24,
                  fontWeight: '600',
                  lineHeight: 34,
                  color: getColor('p'),
                  marginRight: 8,
                }}
              >
                {tr('_demo_login_title')}
              </SingleLineText>
              <View style={{ flexGrow: 1 }} />
              <View
                style={{
                  backgroundColor: getColor('v'),
                  borderRadius: 6,
                  // borderBottomLeftRadius: 2,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
                onTouchEnd={onClickedEnableDev}
              >
                <SingleLineText
                  style={{
                    fontSize: 11,
                    fontWeight: '500',
                    lineHeight: 14,
                    fontStyle: 'normal',
                    color: getColor('bg'),
                  }}
                >
                  {`V${version}`}
                </SingleLineText>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 30,
                marginBottom: 24,
              }}
              // onStartShouldSetResponder={() => true}
              // onStartShouldSetResponderCapture={() => true}
            >
              <TextInput
                containerStyle={{
                  backgroundColor: getColor('bg2'),
                  justifyContent: 'center',
                  height: 48,
                  flex: 1,
                  borderRadius: getBorderRadius({
                    height: 48,
                    crt: corner.input,
                    cr: cornerRadius,
                  }),
                }}
                style={{
                  paddingLeft: 16,
                  paddingRight: 13,
                  paddingVertical: 13,
                  color: getColor('fg'),
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: '400',
                  // lineHeight: 22,
                }}
                onChangeText={setId}
                value={id}
                keyboardAppearance={style === 'light' ? 'light' : 'dark'}
                autoFocus={true}
                cursorColor={getColor('p')}
                enableClearButton={true}
                placeholder={tr('_demo_login_input_phone_number_tip')}
                clearButtonStyle={{ tintColor: getColor('clear') }}
                placeholderTextColor={getColor('placeholder')}
                keyboardType={'number-pad'}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 30,
                marginBottom: 24,
              }}
              // onStartShouldSetResponderCapture={() => true}
            >
              <TextInput
                containerStyle={{
                  backgroundColor: getColor('bg2'),
                  justifyContent: 'center',
                  height: 48,
                  flex: 1,
                  borderRadius: getBorderRadius({
                    height: 48,
                    crt: corner.input,
                    cr: cornerRadius,
                  }),
                }}
                style={{
                  paddingLeft: 16,
                  paddingRight: 13,
                  paddingVertical: 13,
                  color: getColor('fg'),
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: '400',
                }}
                onChangeText={setPassword}
                value={password}
                keyboardAppearance={style === 'light' ? 'light' : 'dark'}
                cursorColor={getColor('p')}
                enableClearButton={false}
                secureTextEntry={false}
                placeholder={tr('_demo_login_input_phone_number_captcha_tip')}
                placeholderTextColor={getColor('placeholder')}
                keyboardType={'number-pad'}
              />
              <Pressable
                style={[
                  StyleSheet.absoluteFill,
                  {
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    left: Dimensions.get('window').width - 30 - 150,
                    right: 30 + 22,
                  },
                ]}
                onPress={startCaptcha}
              >
                <SingleLineText
                  style={{
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: 18,
                    color: getCaptchaColor(),
                  }}
                >
                  {getCaptchaText()}
                </SingleLineText>
              </Pressable>
            </View>

            <View
              style={{
                marginBottom: 20,
                flexDirection: 'row',
                paddingHorizontal: 30,
              }}
            >
              <CmnButton
                contentType={'only-text'}
                text={tr('_demo_login_button')}
                style={{ flex: 1, height: 46 }}
                maxRadius={46}
                radiusType={input}
                sizesType={'large'}
                textStyle={{
                  fontSize: 16,
                  fontWeight: '600',
                  fontStyle: 'normal',
                }}
                onPress={onClickedLogin}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Pressable
                onPress={() => {
                  setCheck((pre) => !pre);
                }}
              >
                <Icon
                  name={
                    check
                      ? releaseAreaRef.current === 'china'
                        ? 'checked_rectangle'
                        : 'checked_ellipse'
                      : releaseAreaRef.current === 'china'
                      ? 'unchecked_rectangle'
                      : 'unchecked_ellipse'
                  }
                  style={{
                    width: 20,
                    height: 20,
                    marginHorizontal: 4,
                    tintColor: getColor(check ? 'p' : 'clear'),
                  }}
                />
              </Pressable>

              <SingleLineText
                style={{
                  maxWidth: '100%',
                  fontSize: 12,
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: 16,
                  color: getColor('tip'),
                  textAlign: 'center',
                }}
              >
                {tr('_demo_login_tip_1')}
                <SingleLineText
                  style={{
                    maxWidth: '100%',
                    fontSize: 12,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: 16,
                    color: getColor('p'),
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                  }}
                  onPress={onClickedServices}
                >
                  {tr('_demo_login_tip_2')}
                </SingleLineText>
                <SingleLineText
                  style={{
                    maxWidth: '100%',
                    fontSize: 12,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: 16,
                    color: getColor('tip'),
                    textAlign: 'center',
                  }}
                >
                  {tr('_demo_login_tip_3')}
                </SingleLineText>
                <SingleLineText
                  style={{
                    maxWidth: '100%',
                    fontSize: 12,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: 16,
                    color: getColor('p'),
                    textAlign: 'center',
                    textDecorationLine: 'underline',
                  }}
                  onPress={onClickedProtocol}
                >
                  {tr('_demo_login_tip_4')}
                </SingleLineText>
              </SingleLineText>
            </View>

            {serverSettingVisible === true ? (
              <Pressable
                style={{ position: 'absolute', bottom: 99 }}
                onPress={onClickedServerSetting}
              >
                <SingleLineText
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    fontStyle: 'normal',
                    textDecorationLine: 'underline',
                    color: getColor('n'),
                  }}
                >
                  {tr('_demo_login_server_setting_button')}
                </SingleLineText>
              </Pressable>
            ) : null}

            {isLoading ? (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: '40%',
                  },
                ]}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 94,
                    height: 78,
                    backgroundColor: '#00000059',
                    borderRadius: 12,
                  }}
                >
                  <LoadingIcon
                    name={'spinner'}
                    style={{
                      width: 36,
                      height: 36,
                      tintColor: getColor('loading'),
                    }}
                  />
                  <View style={{ height: 4 }} />
                  <SingleLineText
                    style={{
                      fontSize: 14,
                      fontStyle: 'normal',
                      fontWeight: '500',
                      lineHeight: 18,
                      color: getColor('loading'),
                    }}
                  >
                    {tr('_demo_login_loading_tip')}
                  </SingleLineText>
                </View>
              </View>
            ) : null}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaViewFragment>
    </ImageBackground>
  );
}

function AgoraLoginV2Screen(props: Props) {
  const {} = props;
  const navi = useStackScreenRoute(props);
  const { push } = navi;
  const [id, setId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { tr } = useI18nContext();
  const { style, cornerRadius: corner } = useThemeContext();
  const { getBorderRadius } = useGetStyleProps();
  const { colors, cornerRadius } = usePaletteContext();
  const { input } = corner;
  const { getColor } = useColors({
    bg: {
      light: '#EFF4FF',
      dark: 'rgba(142, 199, 239, 0.49)',
    },
    bg2: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    p: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    clear: {
      light: colors.neutral[7],
      dark: colors.neutral[8],
    },
    n: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    v: {
      light: 'rgba(0, 0, 0, 0.20)',
      dark: 'rgba(0, 0, 0, 0.20)',
    },
    tip: {
      light: colors.neutral[3],
      dark: colors.neutral[8],
    },
  });
  const { getToastRef, loginAction } = useLogin();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const countRef = React.useRef(0);
  const [version, setVersion] = React.useState('');
  const [serverSettingVisible, SetServerSettingVisible] = React.useState(false);
  const { updater } = useForceUpdate();
  const ra = getReleaseArea();
  const releaseAreaRef = React.useRef(ra);
  useNavigationState(props);

  const { initParams } = useGeneralSetting();
  const [_initParams, setInitParams] = React.useState(false);
  const [showTip, setShowTip] = React.useState('');

  const initParamsCallback = React.useCallback(async () => {
    if (_initParams === true) {
      return;
    }
    try {
      const ret = await initParams();
      releaseAreaRef.current = ret.appStyle === 'classic' ? 'china' : 'global';
      setInitParams(true);
    } catch (error) {
      setInitParams(true);
    }
  }, [_initParams, initParams, releaseAreaRef, setInitParams]);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      if (countRef.current >= 4) {
        countRef.current = 0;
        SetServerSettingVisible(true);
        push({ to: 'LoginV2Setting' });
        return;
      }
      ++countRef.current;
    }
  }, [push]);

  const onClickedServerSetting = React.useCallback(() => {
    push({ to: 'LoginV2Setting' });
  }, [push]);

  const onClickedEnableDev = React.useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      countRef.current = 0;
    }, 1000);
  }, [clearTimer]);

  const onClickedLogin = React.useCallback(() => {
    if (password.length === 0) {
      getToastRef().show({
        message: tr('_demo_login_tip_reason_3'),
        showPosition: 'center',
      });
      return;
    }
    setIsLoading(true);
    loginAction({
      id,
      pass: password,
      onResult: (res) => {
        setIsLoading(false);
        if (res.isOk) {
          navi.replace({ to: 'Home' });
        } else {
          setShowTip(res.reason ?? '');
        }
      },
    });
  }, [getToastRef, id, loginAction, navi, password, tr]);

  React.useEffect(() => {
    const appVersion = DeviceInfo.getVersion();
    console.log('dev:appVersion:', appVersion);
    setVersion(appVersion);
  }, []);

  React.useEffect(() => {
    initParamsCallback().catch();
  }, [initParamsCallback]);

  React.useEffect(() => {
    const ret8 = DeviceEventEmitter.addListener('_demo_emit_app_style', (e) => {
      console.log('dev:emit:app:style:', e);
      releaseAreaRef.current = e === 'classic' ? 'china' : 'global';
      updater();
    });

    return () => {
      ret8.remove();
    };
  }, [updater]);

  return (
    <ImageBackground
      style={{
        backgroundColor: getColor('bg'),
        flex: 1,
      }}
      source={style === 'light' ? main_bg : main_bg_dark}
    >
      <SafeAreaViewFragment backgroundColor={null} visibleStatusBar={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
            // pointerEvents={'box-none'}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                alignSelf: 'flex-start',
                paddingHorizontal: 30,
                width: '100%',
                marginTop: 20,
              }}
            >
              <SingleLineText
                style={{
                  fontSize: 24,
                  fontWeight: '600',
                  lineHeight: 34,
                  color: getColor('p'),
                  marginRight: 8,
                }}
              >
                {tr('_demo_login_title', accountType)}
              </SingleLineText>
              <View style={{ flexGrow: 1 }} />
              <View
                style={{
                  backgroundColor: getColor('v'),
                  borderRadius: 6,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
                onTouchEnd={onClickedEnableDev}
              >
                <SingleLineText
                  style={{
                    fontSize: 11,
                    fontWeight: '500',
                    lineHeight: 14,
                    fontStyle: 'normal',
                    color: getColor('bg'),
                  }}
                >
                  {`V${version}`}
                </SingleLineText>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 30,
                marginBottom: 24,
              }}
            >
              <TextInput
                containerStyle={{
                  backgroundColor: getColor('bg2'),
                  justifyContent: 'center',
                  height: 48,
                  flex: 1,
                  borderRadius: getBorderRadius({
                    height: 48,
                    crt: corner.input,
                    cr: cornerRadius,
                  }),
                }}
                style={{
                  paddingLeft: 16,
                  paddingRight: 13,
                  paddingVertical: 13,
                  color: getColor('fg'),
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: '400',
                  // lineHeight: 22,
                }}
                onChangeText={setId}
                value={id}
                keyboardAppearance={style === 'light' ? 'light' : 'dark'}
                autoFocus={true}
                cursorColor={getColor('p')}
                enableClearButton={true}
                placeholder={tr(
                  '_demo_login_input_phone_number_tip',
                  accountType
                )}
                clearButtonStyle={{ tintColor: getColor('clear') }}
                keyboardType={
                  accountType === 'agora' ? 'default' : 'number-pad'
                }
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 30,
                marginBottom: 24,
              }}
            >
              <TextInput
                containerStyle={{
                  backgroundColor: getColor('bg2'),
                  justifyContent: 'center',
                  height: 48,
                  flex: 1,
                  borderRadius: getBorderRadius({
                    height: 48,
                    crt: corner.input,
                    cr: cornerRadius,
                  }),
                }}
                style={{
                  paddingLeft: 16,
                  paddingRight: 13,
                  paddingVertical: 13,
                  color: getColor('fg'),
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: '400',
                }}
                onChangeText={setPassword}
                value={password}
                keyboardAppearance={style === 'light' ? 'light' : 'dark'}
                cursorColor={getColor('p')}
                enableClearButton={false}
                // !!! secureTextEntry={true} Setting to true causes layout changes.
                // !!! https://github.com/facebook/react-native/issues/45347
                secureTextEntry={accountType === 'agora' ? true : false}
                enableShowPassword={accountType === 'agora' ? true : undefined}
                passwordButtonStyle={{ tintColor: getColor('clear') }}
                placeholder={tr(
                  '_demo_login_input_phone_number_captcha_tip',
                  accountType
                )}
                keyboardType={
                  accountType === 'agora' ? 'default' : 'number-pad'
                }
              />
            </View>

            <View
              style={{
                marginBottom: 20,
                flexDirection: 'row',
                paddingHorizontal: 30,
              }}
            >
              <CmnButton
                contentType={'only-text'}
                text={tr('_demo_login_button')}
                style={{ flex: 1, height: 46 }}
                maxRadius={46}
                radiusType={input}
                sizesType={'large'}
                textStyle={{
                  fontSize: 16,
                  fontWeight: '600',
                  fontStyle: 'normal',
                }}
                onPress={onClickedLogin}
              />
            </View>

            {showTip.length > 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <Icon
                  name={'candle_in_circle_fill'}
                  style={{
                    width: 20,
                    height: 20,
                    marginHorizontal: 4,
                    tintColor: getColor('p'),
                  }}
                />

                <SingleLineText
                  style={{
                    maxWidth: '100%',
                    fontSize: 12,
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: 16,
                    color: getColor('tip'),
                    textAlign: 'center',
                  }}
                >
                  {tr('_demo_login_tip_1')}
                </SingleLineText>
              </View>
            ) : null}

            {serverSettingVisible === true ? (
              <Pressable
                style={{ position: 'absolute', bottom: 99 }}
                onPress={onClickedServerSetting}
              >
                <SingleLineText
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    fontStyle: 'normal',
                    textDecorationLine: 'underline',
                    color: getColor('n'),
                  }}
                >
                  {tr('_demo_login_server_setting_button')}
                </SingleLineText>
              </Pressable>
            ) : null}

            {isLoading ? (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: '40%',
                  },
                ]}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 94,
                    height: 78,
                    backgroundColor: '#00000059',
                    borderRadius: 12,
                  }}
                >
                  <LoadingIcon
                    name={'spinner'}
                    style={{
                      width: 36,
                      height: 36,
                      tintColor: getColor('loading'),
                    }}
                  />
                  <View style={{ height: 4 }} />
                  <SingleLineText
                    style={{
                      fontSize: 14,
                      fontStyle: 'normal',
                      fontWeight: '500',
                      lineHeight: 18,
                      color: getColor('loading'),
                    }}
                  >
                    {tr('_demo_login_loading_tip')}
                  </SingleLineText>
                </View>
              </View>
            ) : null}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaViewFragment>
    </ImageBackground>
  );
}

export const LoginV2Screen =
  accountType === 'agora' ? AgoraLoginV2Screen : EasemobLoginV2Screen;
