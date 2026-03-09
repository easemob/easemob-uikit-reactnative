[返回父文档](./index.md)

# 集成环境要求

## 架构要求

本库为纯 Fabric（New Architecture）组件，宿主 App **必须开启 New Architecture**。

## 基本要求

| 依赖 | 最低版本 | 说明 |
| --- | --- | --- |
| **React Native** | 0.76.0 | New Arch 默认开启，推荐最低版本 |
| **React** | 18.2.0 | |
| **Expo SDK**（可选） | 52 | 对应 RN 0.76；不使用 Expo 亦可 |
| **Node.js** | 18 | |
| **react-native-chat-sdk** | ^1.12.0 | 核心 IM SDK |

## iOS 平台

| 工具 / 属性 | Expo SDK 52 / RN 0.76 | Expo SDK 55 / RN 0.83 |
| --- | --- | --- |
| **Xcode** | 15.1+ | 26+（Swift 6.2）|
| **macOS** | — | 15.6+（Xcode 26 要求）|
| **iOS 最低部署版本** | 15.1 | 16.0 |

> **注意**：Expo SDK 55 的 `expo-modules-core` 使用 Swift 6.2 语法，必须使用 Xcode 26+。裸 RN（不使用 Expo）项目不受此限制，Xcode 版本由 RN 自身决定。

## Android 平台

| 工具 / 属性 | Expo SDK 52 / RN 0.76 | Expo SDK 55 / RN 0.83 |
| --- | --- | --- |
| **JDK** | 17 | 17 |
| **Gradle** | 8.10.2 | 9.0.0 |
| **AGP** | 8.6.0 | 8.12.0 |
| **Kotlin** | 1.9.24 | 2.1.20 |
| **compileSdkVersion** | 35 | 36 |
| **targetSdkVersion** | 34 | 36 |
| **minSdkVersion** | 24（Android 7.0） | 24（Android 7.0） |
| **NDK** | 26.1.10909125 | 27.1.12297006 |

## Expo SDK 与 React Native 版本映射

| Expo SDK | React Native | 是否可集成 |
| --- | --- | --- |
| **55** | 0.83 | ✅ 最新版本 |
| **54** | 0.81 | ✅ |
| **53** | 0.79 | ✅ |
| **52** | 0.76 | ✅ 最低推荐版本 |
| 51 | 0.74 | ⚠️ 需手动开启 New Arch，未经验证 |
| ≤49 | ≤0.72 | ❌ 不可用 |
