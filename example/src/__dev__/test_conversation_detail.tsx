import * as React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView as RNSafeAreaView,
  // TextInput as RNTextInput,
  View,
} from 'react-native';
import {
  ConversationDetail,
  GlobalContainer,
  Services,
  TextInput,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export function ConvDetail() {
  const { top, bottom } = useSafeAreaInsets();
  Services.dcs.init(`appkey/userid`);
  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: 'red',
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            // height: 100,
            // width: 100,
            // backgroundColor: 'green',
            flexGrow: 1,
            // overflow: 'hidden',
          }}
        >
          <ConversationDetail
            testMode={'only-ui'}
            convId="xxx"
            convType={0}
            input={{ props: { top, bottom } }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

export function ConvDetail2() {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: 'red',
      }}
    >
      <RNSafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            // height: 100,
            // width: 100,
            backgroundColor: 'green',
            flexGrow: 1,
            // overflow: 'hidden',
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{ flex: 1, backgroundColor: 'orange' }}
              onTouchEnd={() => {
                Keyboard.dismiss();
              }}
            />
            <KeyboardAvoidingView
              behavior={'padding'}
              keyboardVerticalOffset={top}
            >
              <TextInput containerStyle={{ minHeight: 40 }} />
            </KeyboardAvoidingView>
          </View>
        </View>
      </RNSafeAreaView>
    </View>
  );
}

export function ConvDetail3() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: 'red',
      }}
    >
      <View
        style={{
          // height: 100,
          // width: 100,
          backgroundColor: 'green',
          flexGrow: 1,
          // overflow: 'hidden',
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{ flex: 1, backgroundColor: 'orange' }}
            onTouchEnd={() => {
              Keyboard.dismiss();
            }}
          />
          <KeyboardAvoidingView
            behavior={'padding'}
            keyboardVerticalOffset={bottom}
          >
            <TextInput
              containerStyle={{
                minHeight: 40,
                backgroundColor: 'yellow',
              }}
            />
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
}

export default function TestConversationDetail() {
  const p = usePresetPalette();
  const t = useLightTheme(p, 'global');
  return (
    <GlobalContainer appKey={''} palette={p} theme={t}>
      <ConvDetail />
      {/* <View style={{ height: 50 }} /> */}
    </GlobalContainer>
  );
}
