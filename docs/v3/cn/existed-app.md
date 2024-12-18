[返回父文档](./index.md)

# 集成到现有项目介绍

添加依赖主要包括以下主要内容：

- UIKit 最小需求
- 添加依赖
- 添加 native 配置
- 添加代码

### UIKit 最小需求

- react 17.0.2 或以上。
- react-native: 0.66.5 或以上。
- nodejs: 16.18.0 或以上。
- chat sdk: 1.3.1 或以上，推荐最新版本。

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

```bash
yarn add @react-native-async-storage/async-storage \
@react-native-camera-roll/camera-roll \
@react-native-clipboard/clipboard \
@react-native-firebase/app \
@react-native-firebase/messaging \
date-fns \
pinyin-pro \
react \
react-native \
react-native-agora \
react-native-audio-recorder-player \
react-native-chat-sdk \
react-native-chat-callkit \
react-native-chat-uikit \
react-native-create-thumbnail \
react-native-device-info \
react-native-document-picker \
react-native-fast-image \
react-native-file-access \
react-native-gesture-handler \
react-native-get-random-values \
react-native-image-picker \
react-native-permissions \
react-native-safe-area-context \
react-native-screens \
react-native-vector-icons \
react-native-video \
react-native-web \
react-native-webview \
twemoji
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
