_中文 | [English](./README.md)_

---

# 下载代码

方式1:

    通过代码库地址 `https://github.com/easemob/easemob-uikit-reactnative` 下载代码

方式2:

    从 `https://github.com/easemob/easemob-uikit-reactnative` 下载压缩包.

# 项目初始化

保证环境配置完成，如果没有配置请[参考](../../docs/v4/cn/env.md)

进入根目录，执行

```sh
yarn && yarn prepare
```

# 必要信息填写

进入 项目 `examples/product-uikit-demo` 目录
找到 `env.ts` 文件，填写 `appKey` 等信息。
其中，`useAppServerDomain` 需要填写为 `false`，这样将不使用 `app server` 相关功能。

# 配置推送环境

示例项目使用 `@react-native-firebase/messaging` 实现 FCM 推送。Firebase 配置文件已通过 `app.json` 中的 `googleServicesFile` 和 Expo config plugin 自动集成，`expo prebuild` 时会自动复制到原生项目中。

如果没有真实的 Firebase 配置文件，可以将预置模板作为占位文件复制到项目根目录：

```sh
cp templates/google-services.json.template examples/product-uikit-demo/google-services.json
cp templates/GoogleService-Info.plist.template examples/product-uikit-demo/GoogleService-Info.plist
```

如需使用真实的 FCM 推送功能，请从 [Firebase Console](https://console.firebase.google.com/) 下载对应的配置文件并替换上述占位文件。

# 运行

进入 项目 `examples/product-uikit-demo` 目录，执行

```sh
yarn run android
# 或者
yarn run ios
```

默认 ios 可以自动运行 调试服务。如果没有运行调试服务，可以手动运行。

```sh
yarn run start
```

选择对应的设备：包括 ios设备、模拟器，android设备、模拟器。

# 注意事项

1. 构建android应用时，如果找不到 `debug.store`文件，可以进入目录 `examples/product-uikit-demo/android/app`，再使用 `keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"` 生成一个。
2. 示例项目登录页面实际上有两种模式，正常模式通过手机号和验证码的方式登录，另外一种是开发者模式，使用用户ID和密码登录。 正常模式原来是短信验证，现在使用阿里云验证码2.0验证。
