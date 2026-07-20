# product-room-demo Android Release 构建与安装

## 前置条件

```bash
cd /Users/asterisk/Codes/rn/react-native-chat-library-4.0
yarn
yarn prepare
```

## 构建 Release APK

必须在 `android/` 目录下执行 Gradle 命令：

```bash
cd examples/product-room-demo/android
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
```

> ⚠️ 不能在 `product-room-demo/` 目录下执行 `./android/gradlew assembleRelease`，会报错 "does not contain a Gradle build"。必须先 `cd android` 再执行，或使用 `./android/gradlew -p android assembleRelease`。

如果需要全架构构建（体积更大）：

```bash
./gradlew assembleRelease
```

## APK 输出位置

```
examples/product-room-demo/android/app/build/outputs/apk/release/app-release.apk
```

## 安装到设备

查看已连接设备：

```bash
adb devices
```

安装到指定设备：

```bash
adb -s <DEVICE_SERIAL> install <APK_PATH>
```

示例：

```bash
adb -s AJTLVB4C19001899 install /Users/asterisk/Codes/rn/react-native-chat-library-4.0/examples/product-room-demo/android/app/build/outputs/apk/release/app-release.apk
```

### 常见安装失败处理

**签名冲突**（之前安装过不同签名的版本）：

```bash
adb -s <DEVICE_SERIAL> uninstall com.hyphenate.rn.ChatRoomFullExample
adb -s <DEVICE_SERIAL> install <APK_PATH>
```

**覆盖安装**：

```bash
adb -s <DEVICE_SERIAL> install -r <APK_PATH>
```

## 签名说明

当前 release 使用 debug keystore 签名，仅适合内部测试。正式发布需要配置独立的 release keystore，参考：https://reactnative.dev/docs/signed-apk-android
