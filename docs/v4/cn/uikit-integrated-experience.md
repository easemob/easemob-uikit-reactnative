# 集成单群聊 uikit

下面介绍如何集成单群聊 uikit。

## 开发环境需求

[参考env文档](./env.md)

## 创建项目

_如果已经有项目，则跳过此步。_

创建项目

```sh
npx @react-native-community/cli@latest init --skip-install --version 0.76 simple_uikit_demo
```

初始化项目

```sh
yarn set version 4.9.1
yarn config set nodeLinker node-modules
yarn
```

## 集成 uikit

```sh
yarn add react-native-chat-uikit
```

## 添加 uikit 必须的三方依赖

```sh
yarn add @react-native-async-storage/async-storage \
@react-native-camera-roll/camera-roll \
@react-native-clipboard/clipboard \
react-native-audio-recorder-player \
react-native-chat-sdk \
react-native-create-thumbnail \
react-native-device-info \
@react-native-documents/picker \
react-native-chat-uikit \
react-native-file-access \
react-native-gesture-handler \
react-native-image-picker \
react-native-safe-area-context \
react-native-video
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

```tsx
/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import {
  Container,
  ConversationDetail,
  TextInput,
  useChatContext,
} from 'react-native-chat-uikit';

const appKey = '<your app key>';
const userId = '<current login id>';
const userPassword = '<current login password or token>';
const usePassword = true; // or false;
const peerId = '<chat peer id>';

function SendMessage() {
  const [page, setPage] = React.useState(0);
  const [_appKey, setAppKey] = React.useState(appKey);
  const [id, setId] = React.useState(userId);
  const [ps, setPs] = React.useState(userPassword);
  const [peer, setPeer] = React.useState(peerId);
  const im = useChatContext();

  if (page === 0) {
    return (
      // 登录页面
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
            im.login({
              userId: id,
              userToken: ps,
              usePassword: usePassword,
              result: (res) => {
                console.log('login result', res);
                if (res.isOk === true) {
                  setPage(1);
                }
              },
            });
          }}
        >
          <Text>{'Login'}</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            im.logout({
              result: () => {},
            });
          }}
        >
          <Text>{'Logout'}</Text>
        </Pressable>
      </SafeAreaView>
    );
  } else if (page === 1) {
    // 聊天页面
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ConversationDetail
          convId={peer}
          convType={0}
          onBack={() => {
            setPage(0);
            im.logout({
              result: () => {},
            });
          }}
          type={'chat'}
        />
      </SafeAreaView>
    );
  } else {
    return <View />;
  }
}

export default function App(): React.React.ReactElement {
  // 初始化 UIKit
  return (
    <Container options={{ appKey: appKey, autoLogin: false }}>
      <SendMessage />
    </Container>
  );
}
```

## 设置配置选项

通过 easemob [控制台](https://console.easemob.com/) 获取 appKey。在用户管理里面新建测试用户，获取用户 ID 和 token。

```tsx
const appKey = '<your app key>';
const userId = '<current login id>';
const userPassword = '<current login password or token>';
const usePassword = false; // or false;
const peerId = '<chat peer id>';
```

## 编译运行

ios:

1. 安装pod依赖

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

点击 登录按钮，进入聊天页面，输入文本消息，点击发送，即可开始聊天。

## 常见问题

1. 为什么项目管理工具选择 `yarn` 而不是其他？
