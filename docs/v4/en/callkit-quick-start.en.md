[Return to parent document](./index.md)

# Quick Start Guide

## Goal: Create Audio and Video Chat

Create an application, configure the project, implement the necessary callkit code to achieve 1-on-1 audio and video calls.

## Steps

### 1. Create Project

[Refer to relevant section](./create-app.md)

**Note** If you're using `expo` to create a project, you need to create `native` related files. See the FAQ section in the project creation guide for details.

### 2. Initialize Project

Run the command `yarn` to initialize the project. [ref](./create-app.md)

Add callkit and its dependencies. Run the following command:

```sh
yarn add @react-native-community/blur \
react-native-agora \
react-native-chat-callkit \
react-native-chat-sdk \
react-native-safe-area-context \
react-native-screens \
react-native-vector-icons
```

For iOS platform:

Update the `Info.plist` file content to add required permissions.

```xml
<dict>
	<key>NSCameraUsageDescription</key>
	<string></string>
	<key>NSMicrophoneUsageDescription</key>
	<string></string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string></string>
</dict>
```

Install iOS dependencies. Run the following command:

```sh
# Install iOS dependencies in the `ios` folder of the project directory
# Note: Expo-created projects don't have an ios folder, you need to create it using a command. See the "Project Creation Guide" section for details.
pod install
```

For Android platform:

Update the `AndroidManifest.xml` file content to add required permissions.

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
</manifest>
```

Install Android dependencies. Open the Android Studio application, open the Android project, and run sync automatically or manually.

### 3. Write Code

```tsx
/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import { Pressable, SafeAreaView, Text, TextInput } from 'react-native';
import { Alert, Button, Platform, ToastAndroid, View } from 'react-native';
import {
  GlobalContainer as Container,
  CallError,
  CallListener,
  CallType,
  CallUser,
  ChatClient,
  formatElapsed,
  SingleCall,
  useCallkitSdkContext,
} from 'react-native-chat-callkit';

const appKey = '<your app key>';
const agoraId = '<your agora id>';
const accountType: 'easemob' | 'agora' | undefined = 'easemob';
const userId = '<current login id>';
const userPassword = '<current login password or token>';
const usePassword = true; // or false;
const peerId = '<chat peer id>';

function LoginScreen() {
  const [page, setPage] = React.useState(0);
  const [_appKey, setAppKey] = React.useState(appKey);
  const [id, setId] = React.useState(userId);
  const [ps, setPs] = React.useState(userPassword);
  const [peer, setPeer] = React.useState(peerId);

  if (page === 0) {
    // login screen
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TextInput
          placeholder="Please App Key."
          value={_appKey}
          onChangeText={setAppKey}
        />
        <TextInput
          placeholder="Please Login ID."
          value={id}
          onChangeText={setId}
        />
        <TextInput
          placeholder="Please Login token or password."
          value={ps}
          onChangeText={setPs}
        />
        <TextInput
          placeholder="Please peer ID."
          value={peer}
          onChangeText={setPeer}
        />
        <Pressable
          onPress={() => {
            ChatClient.getInstance()
              .login(id, ps, usePassword)
              .then(() => {
                setPage(1);
              })
              .catch();
          }}
        >
          <Text>{'Login'}</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            ChatClient.getInstance()
              .logout()
              .then(() => {
                setPage(0);
              })
              .catch();
          }}
        >
          <Text>{'Logout'}</Text>
        </Pressable>
      </SafeAreaView>
    );
  } else if (page === 1) {
    // audio and video handler screen.
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AVScreen
          inviterId={userId}
          currentId={userId}
          inviteeId={peerId}
          agoraAppId={agoraId}
        />
      </SafeAreaView>
    );
  } else {
    return <View />;
  }
}

function AVScreen({
  inviterId,
  currentId,
  inviteeId,
  agoraAppId,
}: {
  inviterId: string;
  currentId: string;
  inviteeId: string;
  agoraAppId: string;
}) {
  const { call } = useCallkitSdkContext();

  const { showSingleCall } = useCallApi();
  const [visible, setVisible] = React.useState(false);
  const [callType, setCallType] = React.useState<CallType>(CallType.Audio1v1);

  const onRequestClose = React.useCallback(() => {
    setVisible(false);
  }, []);

  const _Call = (props: {
    callType: CallType;
    currentId: string;
    inviterId: string;
    visible: boolean;
    onRequestClose: () => void;
  }) => {
    const { callType, currentId, inviterId, visible, onRequestClose } = props;
    const inviteeIds = [inviteeId] as string[];
    if (visible !== true) {
      return null;
    }
    if (callType === CallType.Audio1v1 || callType === CallType.Video1v1) {
      return showSingleCall({
        appKey:
          ChatClient.getInstance().options?.appKey ??
          ChatClient.getInstance().options?.appId ??
          '',
        agoraAppId: agoraAppId,
        inviterId: inviterId,
        currentId: currentId,
        inviteeIds: inviterId === currentId ? inviteeIds : [currentId],
        callType: callType,
        onRequestClose: onRequestClose,
      });
    } else {
      return null;
    }
  };

  const showCall = React.useCallback(
    (params: { callType: CallType; currentId: string; inviterId: string }) => {
      const { callType } = params;
      setCallType(callType);
      setVisible(true);
    },
    []
  );

  const addListener = React.useCallback(() => {
    const listener = {
      onCallReceived: (params: {
        channelId: string;
        inviterId: string;
        callType: CallType;
        extension?: any;
      }) => {
        showCall({
          callType: params.callType,
          currentId: ChatClient.getInstance().currentUserName ?? '',
          inviterId: params.inviterId,
        });
      },
      onCallOccurError: (params: { channelId: string; error: CallError }) => {
        console.warn('onCallOccurError:', params);
      },
    } as CallListener;
    call.addListener(listener);
    return () => {
      call.removeListener(listener);
    };
  }, [call, showCall]);

  React.useEffect(() => {
    const sub = addListener();
    return () => {
      sub();
    };
  }, [addListener]);

  const tools = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginVertical: 20,
          flexWrap: 'wrap',
        }}
      >
        <Button
          onPress={() => {
            showCall({
              callType: CallType.Video1v1,
              currentId: ChatClient.getInstance().currentUserName ?? '',
              inviterId: ChatClient.getInstance().currentUserName ?? '',
            });
          }}
          title={'singleV'}
        />
        <Button
          onPress={() => {
            showCall({
              callType: CallType.Audio1v1,
              currentId: ChatClient.getInstance().currentUserName ?? '',
              inviterId: ChatClient.getInstance().currentUserName ?? '',
            });
          }}
          title={'singleA'}
        />
      </View>
    );
  };
  return (
    <>
      <View style={{ top: 44, flex: 1 }}>{tools()}</View>
      <_Call
        callType={callType}
        currentId={currentId}
        inviterId={inviterId}
        visible={visible}
        onRequestClose={onRequestClose}
      />
    </>
  );
}

function useCallApi() {
  const showSingleCall = React.useCallback(
    (params: {
      appKey: string;
      agoraAppId: string;
      inviterId: string;
      currentId: string;
      inviteeIds: string[];
      callType: CallType;
      inviterName?: string;
      inviterAvatar?: string;
      invitees?: CallUser[];
      onRequestClose: () => void;
    }) => {
      const {
        inviteeIds,
        currentId,
        inviterId,
        callType,
        invitees,
        inviterAvatar,
        inviterName,
        onRequestClose,
      } = params;
      return (
        <SingleCall
          inviterId={inviterId}
          inviterName={inviterName}
          inviterAvatar={inviterAvatar}
          currentId={currentId}
          inviteeId={inviteeIds[0] ?? ''}
          inviteeName={invitees?.[0]?.userName}
          inviteeAvatar={invitees?.[0]?.userAvatarUrl}
          callType={callType === CallType.Audio1v1 ? 'audio' : 'video'}
          onClose={(elapsed, reason) => {
            onRequestClose();
            if (Platform.OS === 'android') {
              if (reason) {
                ToastAndroid.show(
                  `tip: reason: ${JSON.stringify(reason)}`,
                  ToastAndroid.SHORT
                );
              } else {
                ToastAndroid.show(
                  `tip: Call End: ${formatElapsed(elapsed)}`,
                  ToastAndroid.SHORT
                );
              }
            } else {
              if (reason) {
                Alert.alert(`tip: reason: ${JSON.stringify(reason)}`);
              } else {
                Alert.alert(`tip: Call End: ${formatElapsed(elapsed)}`);
              }
            }
          }}
          onHangUp={() => {
            onRequestClose();
          }}
          onCancel={() => {
            onRequestClose();
          }}
          onRefuse={() => {
            onRequestClose();
          }}
          onError={(error) => {
            onRequestClose();
            if (Platform.OS === 'android') {
              ToastAndroid.show(`error: ${JSON.stringify(error)}`, 3);
            } else {
              Alert.alert(`error: ${JSON.stringify(error)}`);
            }
          }}
        />
      );
    },
    []
  );

  return {
    showSingleCall,
  };
}

const App = () => {
  // initialize callkit
  return (
    <Container
      option={{
        appKey: appKey,
        agoraAppId: agoraId,
      }}
      type={accountType}
      requestRTCToken={(params: {
        appKey: string;
        channelId: string;
        userId: string;
        userChannelId?: number | undefined;
        type?: 'easemob' | 'agora' | undefined;
        onResult: (params: { data?: any; error?: any }) => void;
      }) => {
        // todo: config app server implement get user rtc token.
        // call params.onResult to return user rtc token.
        params.onResult({
          data: {
            userId: params.userId,
            userChannelId: 1000,
          },
        });
      }}
      requestUserMap={(params: {
        appKey: string;
        channelId: string;
        userId: string;
        onResult: (params: { data?: any; error?: any }) => void;
      }) => {
        // todo: config app server implement get user map.
        // call params.onResult to return user map.
        params.onResult({
          data: {
            userId: params.userId,
            userChannelId: 1000,
          },
        });
      }}
      requestCurrentUser={(params: {
        onResult: (params: { user: CallUser; error?: any }) => void;
      }) => {
        // call params.onResult to return current user.
        ChatClient.getInstance()
          .getCurrentUsername()
          .then((result) => {
            params.onResult({
              user: {
                userId: result,
                userName: result,
              },
            });
          })
          .catch((error) => {
            console.warn('test:getCurrentUsername:error:', error);
          });
      }}
    >
      <LoginScreen />
    </Container>
  );
};

export default App;
```

### 4. Build and Compile

There are two main methods for compiling and running: command-line compilation and native compilation. Command-line running is simpler but may not detect some native issues. Native compilation is slightly more complicated but can help identify errors when creating a project. The author recommends using the second method initially, then switching to the first method later.

#### Command Line Method

In the `package.json` configuration file, you can find the `scripts` node, which contains all the commands. After creating a `react-native` project, it automatically provides compilation and running commands.

To run an iOS application, execute the command `yarn run ios` in the terminal.
To run an Android application, execute the command `yarn run android` in the terminal.

#### Native Method

In the `package.json` configuration file, you can find the `scripts` node, which contains all the commands.

Run the development service command `yarn run start`.

For iOS applications, open the Xcode tool, open the `.xcworkspace` project file in the `ios` folder, and execute compilation and running. For Xcode operations, please refer to the official website.
For Android applications, open the Android Studio tool, open the `android` folder project, run sync automatically, and if it fails, check the error message. Otherwise, complete the project initialization and execute compilation and running.

### 5. Send Messages

Before running, prepare the necessary parameters:

```tsx
const appKey = '<your app key>';
const agoraId = '<your agora id>';
const accountType: 'easemob' | 'agora' | undefined;
const userId = '<current login id>';
const userPassword = '<current login password or token>';
const usePassword = true; // or false;
const peerId = '<chat peer id>';
```

**If you modify the appKey, you need to restart the application for it to take effect.**

After running, click the `Login` button to enter the audio and video page, click the audio or video button to request a 1-on-1 call, and the device on the other end receives the request to start the call.

## FAQ

1. You may encounter compilation errors due to `react-native-agora`: `2 files found with path 'lib/arm64-v8a/libaosl.so'`
   Solution 1:
   For Android platform, modify the `build.gradle` file in `android/app` [See details](../../../examples/callkit-example/android/app/aosl-fix.gradle)
   For iOS platform, modify the `Podfile` file. [See details](../../../examples/callkit-example/ios/fix_aosl_conflicting.rb)
   Solution 2:
   Upgrade to the latest version of `react-native-agora`
