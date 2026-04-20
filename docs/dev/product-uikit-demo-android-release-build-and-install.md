# product-uikit-demo Android Release 编译与安装

本文档记录 `examples/product-uikit-demo` 的 Android release 包本地编译方式，以及使用 `adb` 安装到指定模拟器或真机的命令。

## 适用范围

- 仓库根目录：`/Users/asterisk/Codes/rn/react-native-chat-library-4.0`
- 示例工程：`examples/product-uikit-demo`
- 当前工程类型：Expo prebuild + 原生 Android 工程

## 前置条件

确保以下条件已经满足：

- 已安装 Node.js、Yarn、JDK、Android SDK
- `adb` 可直接在终端中使用
- 已在仓库根目录完成依赖安装
- 已补全示例项目配置，例如 `env.ts`

首次初始化建议执行：

```bash
cd /Users/asterisk/Codes/rn/react-native-chat-library-4.0

yarn
yarn prepare
```

如果项目需要 Firebase 配置文件，但当前仅做本地构建验证，可先使用模板文件：

```bash
cp templates/google-services.json.template examples/product-uikit-demo/google-services.json
cp templates/GoogleService-Info.plist.template examples/product-uikit-demo/GoogleService-Info.plist
```

## 编译 Android Release APK

进入示例工程目录：

```bash
cd /Users/asterisk/Codes/rn/react-native-chat-library-4.0/examples/product-uikit-demo
```

执行 release 构建：

```bash
./android/gradlew assembleRelease
# 构建指定架构
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
```

如果需要生成 AAB：

```bash
./android/gradlew bundleRelease
```

## 产物路径

### APK

执行 `assembleRelease` 后，APK 默认输出到：

```text
/Users/asterisk/Codes/rn/react-native-chat-library-4.0/examples/product-uikit-demo/android/app/build/outputs/apk/release/app-release.apk
```

### AAB

执行 `bundleRelease` 后，AAB 默认输出到：

```text
/Users/asterisk/Codes/rn/react-native-chat-library-4.0/examples/product-uikit-demo/android/app/build/outputs/bundle/release/app-release.aab
```

## 当前签名配置说明

当前示例工程的 `release` 构建仍使用 debug keystore 签名，仅适合本地安装验证，不适合正式发布到应用商店。

相关配置位于：

- [`examples/product-uikit-demo/android/app/build.gradle`](/Users/asterisk/Codes/rn/react-native-chat-library-4.0/examples/product-uikit-demo/android/app/build.gradle)

其中 `release` 当前指向：

```groovy
signingConfig signingConfigs.debug
```

如果用于正式发布，需要替换为你自己的 release keystore 配置。

## 使用 ADB 安装到指定设备

先查看当前在线设备：

```bash
adb devices
```

示例输出：

```text
List of devices attached
emulator-5554    device
AJTLVB4C19001899 device
```

其中：

- `emulator-5554` 通常是 Android 模拟器
- `AJTLVB4C19001899` 这类通常是真机序列号

### 安装到指定设备

命令格式：

```bash
adb -s <设备序列号> install -r /绝对路径/app-release.apk
```

示例：

```bash
adb -s emulator-5554 install -r /Users/asterisk/Codes/rn/react-native-chat-library-4.0/examples/product-uikit-demo/android/app/build/outputs/apk/release/app-release.apk
```

```bash
adb -s AJTLVB4C19001899 install -r /Users/asterisk/Codes/rn/react-native-chat-library-4.0/examples/product-uikit-demo/android/app/build/outputs/apk/release/app-release.apk
```

`-r` 表示覆盖安装并尽量保留已有应用数据。

## 实际验证过的安装命令

以下命令已经在真机上验证通过：

```bash
adb -s AJTLVB4C19001899 install -r /Users/asterisk/Codes/rn/react-native-chat-library-4.0/examples/product-uikit-demo/android/app/build/outputs/apk/release/app-release.apk
```

终端输出：

```text
Performing Streamed Install
Success
```

## 包名

当前应用包名为：

```text
com.hyphenate.rn.ChatUikitFullExample
```

如果签名不一致导致覆盖安装失败，可以先卸载再安装：

```bash
adb -s <设备序列号> uninstall com.hyphenate.rn.ChatUikitFullExample
adb -s <设备序列号> install /绝对路径/app-release.apk
```

## 启动应用

安装完成后，可以直接使用 `adb` 启动：

```bash
adb -s <设备序列号> shell monkey -p com.hyphenate.rn.ChatUikitFullExample -c android.intent.category.LAUNCHER 1
```

## 常见检查命令

查看设备型号：

```bash
adb -s <设备序列号> shell getprop ro.product.model
```

如果当前只有一台设备在线，也可以省略 `-s`：

```bash
adb install -r /Users/asterisk/Codes/rn/react-native-chat-library-4.0/examples/product-uikit-demo/android/app/build/outputs/apk/release/app-release.apk
```
