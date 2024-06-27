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
    "react-native-audio-recorder-player": "^3.5.3",
    "react-native-chat-sdk": "1.3.1",
    "react-native-chat-callkit": "1.0.4",
    "react-native-chat-uikit": "2.1.0",
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
        appKey: 'foo',
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
