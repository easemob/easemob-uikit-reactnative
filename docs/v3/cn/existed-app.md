[返回父文档](./index.md)

# 集成到现有项目介绍

添加依赖主要包括以下主要内容：

- UIKit最小需求
- 添加依赖
- 添加 native 配置
- 添加代码

### UIKit最小需求

- react 17.0.2 或以上。
- react-native: 0.66.5 或以上。
- nodejs: 16.18.0 或以上。
- chat sdk: 1.1.0 或以上，推荐最新版本。

### 添加依赖

添加依赖

```sh
# react-native 项目
yarn add react-native-chat-uikit

# expo 项目
yarn expo install react-native-chat-uikit
```

添加依赖的依赖。 由于 `react-native-chat-uikit` 使用了很多三方库，并且这些三方库是 native 库，所以，需要添加应用中。

在 `package.json`中，添加如下依赖：

```json
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "^1.17.11",
    "@react-native-camera-roll/camera-roll": "^5.6.0",
    "@react-native-clipboard/clipboard": "^1.11.2",
    "@react-native-firebase/app": "^18.0.0",
    "@react-native-firebase/messaging": "^18.0.0",
    "date-fns": "^3.6.0",
    "pinyin-pro": "^3.19.7",
    "react": "18.2.0",
    "react-native": "0.72.7",
    "react-native-agora": "^4.2.6",
    "react-native-agora-chat-callkit": "1.0.0",
    "react-native-audio-recorder-player": "^3.5.3",
    "react-native-chat-sdk": "1.3.0-beta.1",
    "react-native-chat-uikit": "2.0.0-beta.0",
    "react-native-create-thumbnail": "^1.6.4",
    "react-native-device-info": "^10.6.0",
    "react-native-document-picker": "^9.0.1",
    "react-native-fast-image": "^8.6.3",
    "react-native-file-access": "^3.0.4",
    "react-native-gesture-handler": "^2.16.0",
    "react-native-get-random-values": "~1.8.0",
    "react-native-image-picker": "^7.0.3",
    "react-native-permissions": "^3.8.0",
    "react-native-safe-area-context": "4.5.0",
    "react-native-screens": "^3.20.0",
    "react-native-vector-icons": "^10.0.3",
    "react-native-video": "^5.2.1",
    "react-native-web": "~0.19.6",
    "react-native-webview": "13.2.2",
    "twemoji": "^14.0.2"
  }
}
```

### 添加 native 配置

对于 `ios` 平台:

在文件`ios/example/Info.plist`中添加权限，如下:

```xml
<dict>
  <key>NSCameraUsageDescription</key>
  <string></string>
  <key>NSMicrophoneUsageDescription</key>
  <string></string>
  <key>NSPhotoLibraryUsageDescription</key>
</dict>
```

对于 `android` 平台:

在文件 `android/app/src/main/AndroidManifest.xml` 中添加权限。如下:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.hyphenate.rn.example">
  <uses-permission android:name="android.permission.INTERNET"/>
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
  <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
  <uses-permission android:name="android.permission.VIBRATE"/>
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
  <uses-permission android:name="android.permission.CAMERA" />
  <uses-permission android:name="android.permission.RECORD_AUDIO" />
</manifest>
```

### 添加代码

在应用的入口中，添加代码如下:

```tsx
function App(): JSX.Element {
  return (
    <UIKit
      options={{
        appKey: 'foo',
      }}
    >
      {/* 应用组件 */}
    </UIKit>
  );
}
```

## 常见问题

1. 和老版本不兼容
   1. 目前老版本用户不对，老版本也不在维护，建议升级到新版本。
2. 共同的依赖不兼容
   1. 依赖主要分为两种，普通依赖和 native 依赖。
   2. native 依赖下有 ios 或者 android 文件夹，必须在应用中集成，普通依赖不需要。
   3. native 依赖建议升级版本解决
3. react-native 版本差距过大
   1. 目前 uikit 采用 0.71.11 版本，如果和现有项目的 react-native 版本差距太大，需要升级 react-native 版本。
