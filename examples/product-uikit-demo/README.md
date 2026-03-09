_English | [中文](./README.zh.md)_

---

# Download Code

Method 1:

    Download the code from the repository: `https://github.com/easemob/easemob-uikit-reactnative`

Method 2:

    Download the zip file from `https://github.com/easemob/easemob-uikit-reactnative`.

# Project Initialization

Make sure the environment is configured properly. If not, please [refer to this guide](../../docs/v4/en/env.md)

Go to the root directory and execute:

```sh
yarn && yarn prepare
```

# Required Information

Go to the `examples/product-uikit-demo` directory.
Find the `env.ts` file and fill in the `appKey` and other required information.

In this file, set `useAppServerDomain` to `false` to disable the `app server` related functionality.

# Configure Push Notification Environment

The example project uses `@react-native-firebase/messaging` for FCM push notifications. Firebase config files are automatically integrated via `googleServicesFile` and Expo config plugins in `app.json`, and will be copied to the native projects during `expo prebuild`.

If you don't have real Firebase config files, you can use the preset template placeholders by copying them to the project root:

```sh
cp templates/google-services.json.template examples/product-uikit-demo/google-services.json
cp templates/GoogleService-Info.plist.template examples/product-uikit-demo/GoogleService-Info.plist
```

To use real FCM push notifications, download the config files from [Firebase Console](https://console.firebase.google.com/) and replace the placeholder files above.

# Running the Project

Go to the `examples/product-uikit-demo` directory and execute:

```sh
yarn run android
# or
yarn run ios
```

By default, iOS can automatically run the debug service. If the debug service is not running, you can run it manually:

```sh
yarn run start
```

Select the corresponding device: including iOS devices, simulators, Android devices, simulators.

# Notes

1. When building an Android application, if the `debug.keystore` file is not found, you can go to the `examples/product-uikit-demo/android/app` directory and use `keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"` to generate one.
2. The login page of the example project actually has two modes: normal mode for logging in with a phone number and verification code, and developer mode for logging in with a user ID and password. The normal mode previously used SMS verification, but now uses Aliyun Captcha 2.0 verification.
