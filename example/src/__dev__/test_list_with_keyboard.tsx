import * as React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  // TextInput as RNTextInput,
  View,
} from 'react-native';
import {
  GlobalContainer,
  TextInput,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-uikit';
import { ScrollView } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export function Test1() {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: 'red',
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={top}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexGrow: 1,
                width: '100%',
                backgroundColor: 'red',
                justifyContent: 'flex-end',
              }}
              onTouchEnd={() => {
                Keyboard.dismiss();
              }}
            >
              <Text>{'test'}</Text>
            </View>
            <View
              style={{ height: 54, width: '100%', backgroundColor: 'blue' }}
              onTouchEnd={() => {}}
            >
              <TextInput style={{ backgroundColor: 'yellow', height: 50 }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const array = Array.from({ length: 50 }, (_, index) => index.toString());
export function Test2() {
  const { top } = useSafeAreaInsets();
  const data = React.useMemo(() => array, []);
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', () => {
      if (Platform.OS === 'ios') {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }
    });
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      if (Platform.OS === 'android') {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      // setKeyboardHeight(0);
    });
    return () => {
      keyboardWillShow.remove();
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: 'red',
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        > */}
        {/* <ScrollView
          style={{
            // flex: 1,
            flexGrow: 1,
            // minHeight: 300,
            // justifyContent: 'flex-end',
            backgroundColor: 'orange',
          }}
          onTouchEnd={() => {
            Keyboard.dismiss();
          }}
        >
          {data.map((v, i) => {
            return (
              <View key={i} style={{ height: 100, backgroundColor: 'green' }}>
                <Text>{v}</Text>
              </View>
            );
          })}
        </ScrollView> */}
        {/* <View
          style={{
            flexGrow: 1,
            width: '100%',
            backgroundColor: 'red',
            justifyContent: 'flex-end',
          }}
          onTouchEnd={() => {
            Keyboard.dismiss();
          }}
        >
          <FlatList
            style={{ flexGrow: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={data}
            renderItem={(info) => {
              const { item } = info;
              return (
                <View style={{ height: 100, backgroundColor: 'green' }}>
                  <Text>{item}</Text>
                </View>
              );
            }}
          />
        </View> */}
        {/* </TouchableWithoutFeedback> */}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={top}
          // style={{ flex: 1 }}
        >
          {/* <View
            style={{
              flexGrow: 1,
              width: '100%',
              backgroundColor: 'red',
              justifyContent: 'flex-end',
            }}
            onTouchEnd={() => {
              Keyboard.dismiss();
            }}
          >
            <FlatList
              style={{ flexGrow: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              data={data}
              renderItem={(info) => {
                const { item } = info;
                return (
                  <View style={{ height: 100, backgroundColor: 'green' }}>
                    <Text>{item}</Text>
                  </View>
                );
              }}
            />
          </View> */}
          <ScrollView
            ref={scrollViewRef}
            style={{
              // flex: 1,
              flexGrow: 1,
              // minHeight: 300,
              maxHeight: '90%',
              // justifyContent: 'flex-end',
              backgroundColor: 'orange',
            }}
            onTouchEnd={() => {
              Keyboard.dismiss();
            }}
          >
            {data.map((v, i) => {
              return (
                <View key={i} style={{ height: 100, backgroundColor: 'green' }}>
                  <Text>{v}</Text>
                </View>
              );
            })}
          </ScrollView>
          <View style={{ flex: 0 }}>
            <View
              style={{ height: 54, width: '100%', backgroundColor: 'blue' }}
              onTouchEnd={() => {}}
            >
              <TextInput style={{ backgroundColor: 'yellow', height: 50 }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

export default function TestListWithKeyboard() {
  const p = usePresetPalette();
  const t = useLightTheme(p, 'global');
  return (
    <GlobalContainer
      options={{
        appKey: 'sdf',
        debugModel: true,
        autoLogin: false,
      }}
      palette={p}
      theme={t}
    >
      <Test2 />
    </GlobalContainer>
  );
}
