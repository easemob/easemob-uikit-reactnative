import { StackActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  ErrorCode,
  Icon,
  Text1Button,
  TextInput,
  useChatContext,
  useI18nContext,
} from 'react-native-chat-uikit';
import { SafeAreaView } from 'react-native-safe-area-context';

import { login_icon_2x, loginFail_2x } from '../const';
import { useStyleSheet } from '../hooks/useStyleSheet';
import type { RootScreenParamsList } from '../routes';
import { sf } from '../utils/utils';

type Props = NativeStackScreenProps<RootScreenParamsList>;

export default function LoginScreen({ route, navigation }: Props): JSX.Element {
  console.log('test:LoginScreen:route:', route);
  const rp = route.params as any;
  const params = rp?.params as any;
  const accountType = params.accountType as 'agora' | 'easemob';
  const gid = params.id;
  const gps = params.pass;
  const enableKeyboardAvoid = true;
  const { tr } = useI18nContext();
  const [id, setId] = React.useState(gid);
  const [tip, setTip] = React.useState('');
  const [password, setPassword] = React.useState(gps);
  const [disabled, setDisabled] = React.useState(
    id.length > 0 && password.length > 0 ? false : true
  );
  const [buttonState, setButtonState] = React.useState<'loading' | 'stop'>(
    'stop'
  );
  const im = useChatContext();
  console.log('test:LoginScreen:', params);

  React.useEffect(() => {
    if (id.length > 0 && password.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [id, password]);

  const execLogin = (state: 'loading' | 'stop') => {
    if (state === 'loading') {
      return;
    }
    setButtonState('loading');
    im.login({
      userId: id,
      userToken: password,
      usePassword: accountType === 'agora' ? false : true,
      result: (res) => {
        if (res.isOk) {
          console.log('test:login:success');
          setButtonState('stop');
          navigation.dispatch(StackActions.push('Home', { params: {} }));
        } else {
          console.warn('test:login:fail:', res.error);
          setButtonState('stop');
          if (res.error?.code === ErrorCode.login_error) {
            navigation.dispatch(StackActions.push('Home', { params: {} }));
          } else {
            setTip(res.error?.desc ?? '');
            // toast.showToast('Login Failed');
          }
        }
      },
    });
  };

  const addListeners = React.useCallback(() => {
    return () => {};
  }, []);

  React.useEffect(() => {
    const load = () => {
      console.log('test:load:', LoginScreen.name);
      const unsubscribe = addListeners();
      return {
        unsubscribe: unsubscribe,
      };
    };
    const unload = (params: { unsubscribe: () => void }) => {
      console.log('test:unload:', LoginScreen.name);
      params.unsubscribe();
    };

    const res = load();
    return () => unload(res);
  }, [addListeners]);

  return (
    <SafeAreaView
      mode="padding"
      style={useStyleSheet().safe}
      edges={['right', 'left', 'bottom']}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        enabled={enableKeyboardAvoid}
        behavior={Platform.select({ ios: 'padding', default: 'height' })}
        keyboardVerticalOffset={enableKeyboardAvoid ? 80 : 0}
        pointerEvents="box-none"
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View>
            <View style={styles.space} />
            <View>
              <Icon
                name={login_icon_2x}
                style={{ borderRadius: 0, width: 250, height: 250 }}
              />
            </View>
            <View
              style={[styles.errorTip, { opacity: tip.length > 0 ? 1 : 0 }]}
            >
              <Icon
                name={loginFail_2x}
                style={{ borderRadius: 0, width: 14, height: 14 }}
              />
              <Text style={styles.comment}>{tip}</Text>
            </View>
            <TextInput
              multiline={false}
              placeholder={tr('id')}
              clearButtonMode="while-editing"
              onChangeText={(text) => setId(text)}
              style={styles.item}
              value={id}
            />
            <View style={{ height: sf(18) }} />
            <TextInput
              multiline={false}
              placeholder={tr('pass')}
              textContentType="password"
              visible-password={false}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              style={styles.item}
              value={password}
            />
            <View style={{ height: sf(18) }} />
            <Text1Button
              disabled={disabled}
              text={tr('button')}
              style={styles.button}
              onPress={() => {
                if (buttonState === 'loading') {
                  return;
                }
                execLogin(buttonState);
              }}
            />
            <View style={styles.space} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  space: {
    flexGrow: 1,
    flexShrink: 1,
  },
  item: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 20,
  },
  button: {
    height: 48,
    borderRadius: 24,
    marginBottom: 31,
  },
  tr: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  tip: {
    color: 'rgba(153, 153, 153, 1)',
  },
  register: {
    paddingLeft: 10,
    color: 'rgba(17, 78, 255, 1)',
    fontWeight: '600',
  },
  errorTip: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },
  comment: {
    marginLeft: 5,
  },
});
