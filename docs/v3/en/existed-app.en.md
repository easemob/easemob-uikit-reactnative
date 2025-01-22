[Return to Parent Document](./index.en.md)

# Integration into Existing Projects

Adding dependencies primarily involve the following key parts:

- Minimum requirements for UIKit
- Adding dependencies
- Configuration of native elements
- Adding code snippets

## Minimum Requirements for UIKit

- react 17.0.2 or higher
- react-native: 0.66.5 or higher
- nodejs: 16.18.0 or higher
- chat sdk: 1.3.1 or higher (The latest version is recommended)

## Add Dependencies

Add dependencies:

```sh
# react-native project
yarn add react-native-chat-uikit

# expo project
yarn expo install react-native-chat-uikit
```

Add dependencies for UIKit dependencies. As `react-native-chat-uikit` uses several third-party native libraries, you need to add them to the app.

Add the following dependencies to `package.json`:

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

## Add Native Configurations

For the `ios` platform:

Add permissions in `ios/example/Info.plist`:

```xml
<dict>
  <key>NSCameraUsageDescription</key>
  <string></string>
  <key>NSMicrophoneUsageDescription</key>
  <string></string>
  <key>NSPhotoLibraryUsageDescription</key>
</dict>
```

For the `android` platform:

Add permissions in `android/app/src/main/AndroidManifest.xml`:

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

## Add Code

Add the following code at the app entrance:

```tsx
function App(): JSX.Element {
  return (
    <UIKit
      options={{
        appKey: '<your app key>',
      }}
    >
      {/* app component */}
    </UIKit>
  );
}
```

## Common Issues

1. Incompatibility with older versions
   Currently, there is no support for older versions, as they are not being maintained. It is recommended to upgrade to the latest version.

2. Incompatibility issues with shared dependencies

- Dependencies are mainly categorized into two types: common dependencies and native dependencies.
- Under native dependencies, there are ios or android folders that must be integrated into the application. However, common dependencies do not require these folders.
- You are advised to resolve compatibility issues by upgrading native dependencies.
-

3. Significant discrepancy in React-Native Versions
   The current version of UIKit utilizes version 0.71.11. If there is a significant difference between this version and that in the existing project, you need to upgrade the react-native version.
