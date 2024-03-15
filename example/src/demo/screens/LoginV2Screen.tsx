import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
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
import {
  CmnButton,
  Icon,
  KeyboardAvoidingView,
  LoadingIcon,
  SingleLineText,
  Text,
  TextInput,
  useAlertContext,
  useChatContext,
  useColors,
  useI18nContext,
  usePaletteContext,
  useSimpleToastContext,
  useThemeContext,
  useToastViewContext,
} from 'react-native-chat-uikit';

import { main_bg } from '../common/assets';
import { RequestLoginResult, RequestResult, RestApi } from '../common/rest.api';
import type { RootScreenParamsList } from '../routes';

type CaptchaState = 'init' | 'sending' | 'sent' | 'resend' | 'error';
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function LoginV2Screen(props: Props) {
  const { navigation } = props;
  const [id, setId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [captchaState, setCaptchaState] = React.useState<CaptchaState>('init');
  const [second, setSecond] = React.useState(60);
  const [check, setCheck] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { tr } = useI18nContext();
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
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
  const { onLogin, getToastRef } = useLoginV2Screen();
  const im = useChatContext();
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const countRef = React.useRef(0);

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
        navigation.push('LoginV2Setting', {});
        return;
      }
      ++countRef.current;
    }
  }, [navigation]);

  const onClickedEnableDev = React.useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      countRef.current = 0;
    }, 1000);
  }, [clearTimer]);

  return (
    <ImageBackground
      style={{
        backgroundColor: getColor('bg'),
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
      source={main_bg}
    >
      <TouchableWithoutFeedback
        style={{
          backgroundColor: getColor('bg'),
          justifyContent: 'center', // !!!
          alignItems: 'center', // !!!
          width: '100%', // !!!
        }}
        onPress={Keyboard.dismiss}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            backgroundColor: getColor('bg'),
            justifyContent: 'center',
            alignItems: 'center',
          }}
          pointerEvents={'box-none'}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
              alignSelf: 'flex-start',
              paddingHorizontal: 30,
              width: '100%',
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: '600',
                lineHeight: 34,
                color: getColor('p'),
                marginRight: 8,
              }}
            >
              {tr('_demo_login_title')}
            </Text>
            <View
              style={{
                backgroundColor: getColor('v'),
                borderRadius: 6,
                borderBottomLeftRadius: 2,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}
              onTouchEnd={onClickedEnableDev}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '500',
                  lineHeight: 14,
                  fontStyle: 'normal',
                  color: getColor('bg'),
                }}
              >
                {'V1.0.0'}
              </Text>
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
              }}
              style={{
                paddingLeft: 24,
                color: getColor('color'),
              }}
              onChangeText={setId}
              value={id}
              keyboardAppearance={style === 'light' ? 'light' : 'dark'}
              autoFocus={true}
              cursorColor={getColor('p')}
              enableClearButton={true}
              placeholder={tr('_demo_login_input_phone_number_tip')}
              clearButtonStyle={{ tintColor: getColor('clear') }}
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
              }}
              style={{
                paddingLeft: 24,
                color: getColor('color'),
              }}
              onChangeText={setPassword}
              value={password}
              keyboardAppearance={style === 'light' ? 'light' : 'dark'}
              cursorColor={getColor('p')}
              enableClearButton={false}
              secureTextEntry={true}
              placeholder={tr('_demo_login_input_phone_number_captcha_tip')}
              keyboardType={'number-pad'}
            />
            <Pressable
              style={[
                StyleSheet.absoluteFill,
                {
                  justifyContent: 'center',
                  left: Dimensions.get('window').width - 30 - 90,
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
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

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
          onPress={() => {
            if (check === false) {
              getToastRef().show({ message: tr('_demo_login_tip_reason_2') });
              return;
            }
            if (validPhone(id) === false) {
              getToastRef().show({ message: tr('_demo_login_tip_reason_1') });
              return;
            }
            if (password.length === 0) {
              getToastRef().show({ message: tr('_demo_login_tip_reason_3') });
              return;
            }
            setIsLoading(true);
            onLogin(id, password, (res) => {
              if (res.isOk && res.value && res.value.code === 200) {
                console.log('login success');
                im.login({
                  userId: res.value.chatUserName,
                  userToken: res.value.token,
                  usePassword: false,
                  result: (rres) => {
                    if (rres.isOk) {
                      setIsLoading(false);
                      console.log('login success 2');
                      navigation.replace('Home', {});
                    } else {
                      setIsLoading(false);
                      console.log('login failed 2:', rres.error);
                    }
                  },
                });
              } else {
                setIsLoading(false);
                console.log('login failed:', res.error);
              }
            });
          }}
        />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable
          onPress={() => {
            setCheck((pre) => !pre);
          }}
        >
          <Icon
            name={check ? 'checked_rectangle' : 'unchecked_rectangle'}
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
            fontWeight: '400',
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
              fontWeight: '400',
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
              fontWeight: '400',
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
              fontWeight: '400',
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
              style={{ width: 36, height: 36, tintColor: getColor('bg2') }}
            />
            <View style={{ height: 4 }} />
            <SingleLineText
              style={{
                fontSize: 14,
                fontStyle: 'normal',
                fontWeight: '500',
                lineHeight: 18,
                color: getColor('bg2'),
              }}
            >
              {tr('_demo_login_loading_tip')}
            </SingleLineText>
          </View>
        </View>
      ) : null}
    </ImageBackground>
  );
}

function useLoginV2Screen() {
  const { getSimpleToastRef } = useSimpleToastContext();
  const { getToastViewRef } = useToastViewContext();
  const { getAlertRef } = useAlertContext();
  const onLogin = React.useCallback(
    (
      id: string,
      pass: string,
      onResult: (result: RequestResult<RequestLoginResult, any>) => void
    ) => {
      RestApi.reqLogin({ phone: id, code: pass }).then((res) => {
        onResult(res);
      });
    },
    []
  );
  return {
    onLogin,
    getToastRef: getSimpleToastRef,
    getToastViewRef,
    getAlertRef,
  };
}
