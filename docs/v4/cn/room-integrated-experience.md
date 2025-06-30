# 集成单群聊 roomkit

下面介绍如何集成单群聊 roomkit。

## 开发环境需求

- MacOS 12 或以上版本
- React-Native 0.71 或以上版本
- NodeJs 20.18 或以上版本

对于 iOS 平台

- xcode 15 或以上版本

对于 Android 平台

- Android Studio 2022.3 或以上版本

## 创建项目

_如果已经有项目，则跳过此步。_

创建项目

```sh
npx @react-native-community/cli@latest init --skip-install --version 0.76 simple_roomkit_demo
```

初始化项目

```sh
yarn set version 4.9.1
yarn config set nodeLinker node-modules
yarn
```

## 集成 uikit

```sh
yarn add react-native-chat-room
```

## 添加 uikit 必须的三方依赖

```sh
yarn add react-native-linear-gradient \
react-native-chat-sdk \
react-native-safe-area-context
```

## 添加 权限

添加必要的应用权限：

ios:

更新 `Info.plist` 文件内容，增加需要的权限。

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

android:

更新 `AndroidManifest.xml` 文件内容，增加需要的权限。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
</manifest>
```

## 添加 代码

```typescript
import * as React from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Chatroom,
  Container,
  TextInput,
  useRoomContext,
} from "react-native-chat-room";

const appKey = "<your app key>";
const userId = "<current login id>";
const userName = "<current login name>";
const userToken = "<current login token or password>";
const userAvatar = "<current login avatar url>";
const roomId = "<chat room ID>";
const room = {
  roomId: roomId,
  owner: userId,
};

function SendMessage() {
  const [page, setPage] = React.useState(0);
  const [_appKey, setAppKey] = React.useState(appKey);
  const [id, setId] = React.useState(userId);
  const [ps, setPs] = React.useState(userToken);
  const im = useRoomContext();
  const { top } = useSafeAreaInsets();

  if (page === 0) {
    return (
      // Log in page
      <SafeAreaView style={styles.common}>
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
        <Pressable
          style={styles.login}
          onPress={() => {
            // Use a custom avatar and nickname.
            im.login({
              userId: id,
              userToken: ps,
              userNickname: userName,
              userAvatarURL: userAvatar,
              result: (res) => {
                console.log("login result", res);
                if (res.isOk === true) {
                  setPage(1);
                }
              },
            });
          }}
        >
          <Text>{"Login"}</Text>
        </Pressable>
        <Pressable
          style={styles.login}
          onPress={() => {
            im.logout({
              result: () => {},
            });
          }}
        >
          <Text>{"Logout"}</Text>
        </Pressable>
      </SafeAreaView>
    );
  } else if (page === 1) {
    // chat room page
    return (
      <SafeAreaView style={styles.common}>
        <Chatroom
          messageList={{
            props: {
              visible: true,
              reportProps: {
                data: [],
              },
            },
          }}
          input={{
            props: {
              keyboardVerticalOffset: Platform.OS === "ios" ? top : 0,
              after: [],
            },
          }}
          roomId={room.roomId}
          ownerId={room.owner}
          onError={(e) => {
            console.log("ChatroomScreen:onError:", e.toString());
          }}
        >
          <Pressable
            style={[styles.logout, styles.login]}
            onPress={() => {
              setPage(0);
              im.logout({
                result: () => {},
              });
            }}
          >
            <Text>{"log out"}</Text>
          </Pressable>
        </Chatroom>
      </SafeAreaView>
    );
  } else {
    return <View />;
  }
}

function App(): React.JSX.Element {
  // initialize the chat room
  return (
    <Container
      opt={{ appKey: appKey, autoLogin: false, debugModel: true } as any}
    >
      <SendMessage />
    </Container>
  );
}

const styles = StyleSheet.create({
  common: {
    flex: 1,
  },
  logout: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  login: {
    height: 40,
    backgroundColor: "darkseagreen",
    borderColor: "floralwhite",
    borderWidth: 1,
  },
});

export default App;
```

## 设置配置选项

通过 easemob [控制台](https://console.easemob.com/) 获取 appKey。在用户管理里面新建测试用户，获取用户 ID 和 token。

```tsx
const appKey = "<your app key>";
const userId = "<current login id>";
const userName = "<current login name>";
const userToken = "<current login token or password>";
const userAvatar = "<current login avatar url>";
const roomId = "<chat room ID>";
```

## 编译运行

ios:

1. 安装 pod 依赖

```sh
cd ios && pod install && cd ..
```

2. 运行项目

```sh
yarn run ios
```

android:

```sh
yarn run android
```

## 开始聊天

点击 登录按钮进入聊天室页面，输入文本消息，点击发送，即可开始聊天。

## 常见问题

1. 为什么项目管理工具选择 `yarn` 而不是其他？
