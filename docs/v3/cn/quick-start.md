[返回父文档](./index.md)

# 快速开始介绍

## 目标：发送一条消息

创建应用，配置项目，填写必要 UIKit 代码，实现消息发送。

[截图](todo:待完成)

## 步骤

### 1. 创建项目

[参考相关章节](./create-app.md)

### 2. 初始化项目

执行命令 `yarn` 初始化项目。

添加 UIKit 需要的 依赖。执行命令添加。如下：

```sh
yarn add @react-native-async-storage/async-storage@^1.17.11 \
@react-native-camera-roll/camera-roll@^5.6.0 \
@react-native-clipboard/clipboard@^1.11.2 \
date-fns@^2.30.0 \
pinyin-pro@^3.18.3 \
pure-uuid@^1.6.3 \
react@18.2.0 \
react-native@0.73.2 \
react-native-agora@^4.2.6 \
react-native-chat-uikit@2.1.0-beta.4 \
react-native-chat-sdk@1.3.1 \
react-native-audio-recorder-player@^3.5.3 \
@easemob/react-native-create-thumbnail@^1.6.6 \
react-native-device-info@^10.6.0 \
react-native-document-picker@^9.0.1 \
react-native-fast-image@^8.6.3 \
react-native-file-access@^3.0.4 \
react-native-gesture-handler@~2.9.0 \
react-native-get-random-values@~1.8.0 \
react-native-image-picker@^7.0.3 \
react-native-permissions@^3.8.0 \
react-native-safe-area-context@4.5.0 \
react-native-screens@^3.20.0 \
react-native-video@^5.2.1 \
react-native-web@~0.19.6 \
react-native-webview@13.2.2 \
twemoji@14.0.2
```

对于 iOS 平台：

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

安装 iOS 需要的依赖。 执行命令，如下：

```sh
# 在项目根目录 切换目录 安装 iOS依赖
cd example && pod install
```

对于 Android studio 平台：

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

安装 Android studio 需要的以来。 打开 Android studio 应用，打开 android 项目，自动运行 sync 或者手动执行。

### 3. 编写代码

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

const appKey = 'easemob#easeim';
const userId = 'du004';
const userPs = '1';
const peerId = 'du005';

function SendMessage() {
  const [page, setPage] = React.useState(0);
  const [appkey, setAppkey] = React.useState(appKey);
  const [id, setId] = React.useState(userId);
  const [ps, setPs] = React.useState(userPs);
  const [peer, setPeer] = React.useState(peerId);
  const im = useChatContext();

  if (page === 0) {
    return (
      // 登录页面
      <SafeAreaView style={{ flex: 1 }}>
        <TextInput
          placeholder="Please App Key."
          value={appkey}
          onChangeText={setAppkey}
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
            console.log('test:zuoyu:login', id, ps);
            im.login({
              userId: id,
              userToken: ps,
              usePassword: true,
              result: (res) => {
                console.log('login result', res);
                console.log('test:zuoyu:error', res);
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

function App(): React.JSX.Element {
  // 初始化 UIKit
  return (
    <Container options={{ appKey: appKey, autoLogin: false }}>
      <SendMessage />
    </Container>
  );
}

export default App;
```

### 4. 构建和编译

编译运行方法主要有两种：命令行编译运行和 native 编译运行。 命令行运行比较简单，但是无法发现一些 native 问题。native 编译运行稍微麻烦，但是可以在创建项目中找到运行出错的原因。笔者推荐初次使用第二种，后续使用第一种。

#### 命令行方式介绍

在 `package.json` 配置文件中，可以找到 `scripts` 节点，这里面都是命令，在创建 `react-native` 项目后，会自动提供编译运行命令。

运行 iOS 应用，在终端执行命令 `yarn run ios`。
运行 Android 应用，在终端执行命令 `yarn run android`。

#### native 方式介绍

在 `package.json` 配置文件中，可以找到 `scripts` 节点，这里面都是命令。

运行开发服务命令 `yarn run start`。

对于 iOS 应用，打开 xcode 工具，打开 `ios` 文件夹下 `.xcworkspace` 工程文件，执行编译运行即可。关于 xcode 操作请详见官网。
对于 Android 应用，打开 Android studio 工具，打开 `android` 文件夹工程，自动执行 sync，如果失败请看报错信息，否则完成项目初始胡啊，执行编译运行。

### 5. 发送消息

在运行之前，编写好预置的必要参数；

```tsx
const appKey = 'easemob#easeim';
const userId = 'du004'; // 当前用户ID。
const userPs = '1'; // 当前用户密码。
const peerId = 'du005'; // 对方ID。
```

**如果修改了 appKey，则需要重启应用才会生效。**

运行之后，点击登录按钮进入聊天页面，输入文本内容，点击发送按钮，发送消息给对方。
