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

Since the example project uses the FCM push notification plugin, it is necessary to add the required FCM configuration files.

If you don't have them, you can use the preset template placeholders:

```sh
cp templates/google-services.json.template examples/product-uikit-demo/android/app/google-services.json
cp templates/GoogleService-Info.plist.template examples/product-uikit-demo/ios/ChatUikitFullExample/GoogleService-Info.plist
```

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
