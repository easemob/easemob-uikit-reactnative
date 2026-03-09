# 多包项目开发环境最低要求与集成版本兼容性

## 文档概述

本文档汇总当前 React Native 多包 monorepo 项目的开发环境最低要求，以及 `react-native-chat-uikit`、`react-native-chat-callkit`、`react-native-chat-room` 三个库在集成到宿主 App 时对 React Native / Expo 版本的最低要求。

## 一、项目开发环境最低要求

### 1.1 核心工具链

以下是在本 monorepo 中进行**开发、构建、测试**所需的最低工具版本：

| 工具 | 最低版本 | 推荐版本 | 说明 |
| --- | --- | --- | --- |
| **Node.js** | 20.19 | 22.20.0+ | `package.json` 要求 `>=20.19`，`.nvmrc` 锁定 `v22` |
| **Yarn** | 4.11.0 | 4.11.0 | 由 `packageManager` 字段锁定，使用 `node-modules` linker |
| **TypeScript** | 5.9.x | ~5.9.2 | 用于类型检查和 codegen |
| **React** | 19.2.0 | 19.2.0 | 开发时固定版本 |
| **React Native** | 0.83.2 | 0.83.2 | 开发时固定版本 |
| **Expo SDK** | 55 | 55 | 示例工程统一使用 |

### 1.2 iOS 构建环境

| 工具 / 属性 | 要求 | 说明 |
| --- | --- | --- |
| **macOS** | Sequoia 15.6+ | Xcode 26 的最低运行要求 |
| **Xcode** | 26+ (Swift 6.2) | `expo-modules-core@55` 使用 Isolated Conformances 语法，需要 Swift 6.2 编译器 |
| **Xcode 推荐版本** | 26.3 RC2 | 当前最稳定版本，**不要使用 26.4 beta**（可能需要 macOS 26） |
| **CocoaPods** | 最新版 | 由 `expo prebuild` 自动管理 |
| **iOS 最低部署版本** | 16.0 | RN 0.83 的 `min_ios_version_supported` |

> **重要**：Xcode 16.x（含 16.4）**无法**编译 Expo SDK 55 的 iOS 代码。详见 [expo-sdk55-xcode-build-issue.md](expo-sdk55-xcode-build-issue.md)。

### 1.3 Android 构建环境

| 工具 / 属性 | 要求 | 说明 |
| --- | --- | --- |
| **JDK** | 17 | AGP 8.12.0 + Gradle 9.0.0 强制要求 |
| **Gradle** | 9.0.0 | 由 `gradle-wrapper.properties` 锁定 |
| **AGP** | 8.12.0 | 由 React Native 版本目录注入 |
| **Kotlin** | 2.1.20 | 由 Expo/RN 版本目录注入（包自身声明 2.0.21，构建时被覆盖） |
| **Android SDK Platform** | API 36 (Android 16) | `compileSdkVersion` / `targetSdkVersion` |
| **Android Build-Tools** | 36.0.0 | |
| **NDK** | 27.1.12297006 | 用于 Hermes / Fabric JNI 编译 |
| **CMake** | 3.22.1 | Fabric / Hermes JNI 编译需要 |
| **C++ 标准** | C++20 | RN 0.83 要求 |
| **minSdkVersion** | 24 (Android 7.0) | 最低运行版本 |

> **注意**：Expo SDK 55 **强制开启 New Architecture**（`newArchEnabled=true`），不再支持旧架构。详见 [expo-sdk55-android-build-env.md](expo-sdk55-android-build-env.md)。

### 1.4 环境依赖链总览

```
Expo SDK 55  ──────────────  React Native 0.83.2  ──────────────  React 19.2.0
  │                                 │
  │  iOS 端                         │  Android 端
  │  ├── Xcode 26+ (Swift 6.2)     │  ├── JDK 17
  │  │     └── macOS 15.6+         │  ├── Gradle 9.0.0
  │  ├── iOS 16.0+（部署目标）      │  ├── AGP 8.12.0
  │  └── New Arch 强制              │  ├── Kotlin 2.1.20
  │                                 │  ├── SDK Platform 36
  │  通用                           │  ├── NDK 27.1.12297006
  │  ├── Node.js >=20.19 (推荐 22) │  ├── minSdk 24 (Android 7.0)
  │  ├── Yarn 4.11.0               │  └── New Arch 强制
  │  └── TypeScript ~5.9.2         │
```

## 二、各包集成最低版本要求

### 2.1 架构前提

三个库（`react-native-chat-uikit`、`react-native-chat-callkit`、`react-native-chat-room`）均为 **纯 Fabric（New Architecture）组件**：

| 层级 | 实现 | 旧架构回退 |
| --- | --- | --- |
| **JS** | `codegenNativeComponent` | 无 `requireNativeComponent` |
| **iOS** | `ComponentDescriptorProvider` + codegen | 无 `RCTViewManager` |
| **Android** | `SimpleViewManager` + `ViewManagerDelegate` + codegen | 无独立 `ViewManager` |
| **Podspec** | `install_modules_dependencies(s)` | 无旧架构分支 |
| **Gradle** | `com.facebook.react` 插件 + codegen | 无旧架构分支 |

这意味着宿主 App **必须**开启 New Architecture，否则组件完全不可用。

### 2.2 公共最低版本要求

三个库的 `peerDependencies` 保持一致的基线：

```json
"react": ">=18.2.0",
"react-native": ">=0.76.0"
```

所有库还依赖：

```json
"react-native-chat-sdk": "^1.12.0"
```

### 2.3 各包集成兼容性矩阵

#### react-native-chat-uikit

| 维度 | 最低版本 | 说明 |
| --- | --- | --- |
| **React Native** | **0.76.0** | New Arch 默认开启 |
| **React** | **18.2.0** | |
| **Expo SDK** | **52** | 对应 RN 0.76，New Arch 默认开启 |
| **iOS 部署目标** | **15.1** | RN 0.76 的 `min_ios_version_supported` |
| **Android minSdk** | **24** | 硬编码在 `build.gradle` |
| **关键 peer 依赖** | | `@react-native-async-storage/async-storage >=2.0.0`、`@react-native-camera-roll/camera-roll >=7.0.0`、`react-native-video >=6.0.0`、`react-native-gesture-handler >=2.0.0` 等 |

#### react-native-chat-callkit

| 维度 | 最低版本 | 说明 |
| --- | --- | --- |
| **React Native** | **0.76.0** | New Arch 默认开启 |
| **React** | **18.2.0** | |
| **Expo SDK** | **52** | 对应 RN 0.76 |
| **iOS 部署目标** | **15.1** | RN 0.76 的 `min_ios_version_supported` |
| **Android minSdk** | **24** | |
| **关键 peer 依赖** | | `react-native-agora ~4.5.0`、`@react-native-community/blur ^4.4.1`、`react-native-screens >=4.0.0` |

> **注意**：`react-native-agora` 包含原生 `libaosl.so`，如果宿主 App 同时集成了声网 IM SDK（`hyphenate-chat`），需要处理 Android 端 SO 库冲突。详见 [android-build-patches.md](android-build-patches.md)。

#### react-native-chat-room

| 维度 | 最低版本 | 说明 |
| --- | --- | --- |
| **React Native** | **0.76.0** | New Arch 默认开启 |
| **React** | **18.2.0** | |
| **Expo SDK** | **52** | 对应 RN 0.76 |
| **iOS 部署目标** | **15.1** | RN 0.76 的 `min_ios_version_supported` |
| **Android minSdk** | **24** | |
| **关键 peer 依赖** | | `react-native-linear-gradient >=3.0.0`、`react-native-gesture-handler >=2.0.0` |

### 2.4 Expo SDK 与 React Native 版本映射

| Expo SDK | React Native | React | New Arch 状态 | 是否可集成本库 |
| --- | --- | --- | --- | --- |
| **55** | 0.83 | 19.2.0 | 强制开启 | ✅ 当前开发版本 |
| **54** | 0.81 | 19.1.0 | 默认开启 | ✅ |
| **53** | 0.79 | 19.0.0 | 默认开启 | ✅ |
| **52** | 0.76 | 18.3.1 | 默认开启 | ✅ 最低推荐版本 |
| **51** | 0.74 | 18.2.0 | 需手动开启 | ⚠️ 需手动配置 |
| **50** | 0.73 | 18.2.0 | 需手动开启 | ⚠️ 需手动配置 |
| ≤49 | ≤0.72 | — | 不支持 | ❌ 不可用 |

> **说明**：Expo SDK 50-51（RN 0.73-0.74）理论上可以通过手动开启 New Architecture 来使用本库，但未经过测试验证，可能存在 Fabric API 兼容性差异。**推荐最低版本为 Expo SDK 52（RN 0.76）**。

### 2.5 集成应用构建环境对比（Expo SDK 52 vs 55）

集成应用的构建环境要求取决于所选的 Expo SDK / React Native 版本。以下是最低推荐版本（Expo 52）与当前开发版本（Expo 55）的对比：

| 工具 / 属性 | Expo SDK 52 / RN 0.76 | Expo SDK 55 / RN 0.83 |
| --- | --- | --- |
| **React** | 18.3.1 | 19.2.0 |
| **JDK** | 17 | 17 |
| **Gradle** | 8.10.2 | 9.0.0 |
| **AGP** | 8.6.0 | 8.12.0 |
| **Kotlin** | 1.9.24 | 2.1.20 |
| **Android compileSdk** | 35 (Android 15) | 36 (Android 16) |
| **Android targetSdk** | 34 (Android 14) | 36 (Android 16) |
| **Android minSdk** | 24 (Android 7.0) | 24 (Android 7.0) |
| **Android Build-Tools** | 35.0.0 | 36.0.0 |
| **NDK** | 26.1.10909125 | 27.1.12297006 |
| **iOS 最低部署版本** | 15.1 | 16.0 |
| **Xcode 最低版本** | 15.1 | 26+ (Swift 6.2)¹ |
| **C++ 标准** | C++20 | C++20 |
| **New Architecture** | 默认开启 | 强制开启 |

> ¹ Xcode 26+ 的要求来自 `expo-modules-core@55` 使用了 Swift 6.2 Isolated Conformances 语法。如果集成应用使用 Expo SDK 52，则 `expo-modules-core@52` 不需要 Swift 6.2，Xcode 15.1 即可满足。

**关键差异说明**：

- **Xcode 门槛大幅降低**：Expo SDK 52 只需 Xcode 15.1，而 Expo SDK 55 需要 Xcode 26+（需 macOS 15.6+）
- **Android SDK 版本降低**：compileSdk 从 36 降到 35，targetSdk 从 36 降到 34
- **Kotlin 版本差异大**：1.9.24 vs 2.1.20，影响第三方库兼容性
- **Gradle 版本差异**：8.10.2 vs 9.0.0，Gradle 9 是大版本升级

### 2.6 裸 React Native（无 Expo）集成

| 场景 | 最低 RN 版本 | 说明 |
| --- | --- | --- |
| **推荐** | **0.76** | New Arch 默认开启，开箱即用 |
| **理论可用** | **0.71** | 需手动开启 New Arch，增加集成门槛，未经验证 |
| **不可用** | **< 0.71** | 缺少 `com.facebook.react:react-android`、`install_modules_dependencies` 等基础设施 |

裸 RN 项目集成时，需确保：

1. `newArchEnabled=true`（RN 0.76+ 默认，0.71-0.75 需手动设置）
2. Android: `compileSdkVersion >= 35`（RN 0.76）或 `>= 36`（RN 0.83）、`minSdkVersion >= 24`
3. iOS: 部署目标 >= 15.1（RN 0.76）或 >= 16.0（RN 0.83）
4. 如果不使用 Expo，则无 Xcode 26+ 的硬性要求（Xcode 版本由 RN 自身决定，RN 0.76 最低 Xcode 15.1）

## 三、已知构建问题与补丁

在当前版本（Expo SDK 55 / RN 0.83）的开发环境下，存在以下需要额外处理的构建问题：

| 问题 | 平台 | 原因 | 解决方案 | 详细文档 |
| --- | --- | --- | --- | --- |
| Xcode 16.x 编译失败 | iOS | `expo-modules-core` 使用 Swift 6.2 语法 | 升级到 Xcode 26+ | [expo-sdk55-xcode-build-issue.md](expo-sdk55-xcode-build-issue.md) |
| JDK 版本不匹配 | Android | AGP 8.12.0 要求 JDK 17 | 安装 JDK 17 | [expo-sdk55-android-build-env.md](expo-sdk55-android-build-env.md) |
| `currentActivity` API 变更 | Android | RN 0.80+ Kotlin 迁移 | yarn patch | [android-build-patches.md](android-build-patches.md) |
| `androidsvg` 重复类 | Android | 依赖冲突 | Gradle exclude | [android-build-patches.md](android-build-patches.md) |
| `libaosl.so` 重复原生库 | Android | agora SDK 与 IM SDK 共用 | Gradle pickFirst / exclude | [android-build-patches.md](android-build-patches.md) |
| Kotlin 版本冲突 | Android | 第三方库硬编码旧版本 | 统一 Kotlin 版本 | [expo-sdk55-android-build-env.md](expo-sdk55-android-build-env.md) |

## 四、快速环境检查

### macOS 全环境验证脚本

```bash
echo "=== Node.js ==="
node -v
# 期望: v22.x.x (最低 v20.19)

echo ""
echo "=== Yarn ==="
yarn -v
# 期望: 4.11.0

echo ""
echo "=== Java ==="
java -version 2>&1
# 期望: openjdk version "17.x.x"

echo ""
echo "=== Xcode ==="
xcodebuild -version
# 期望: Xcode 26.x

echo ""
echo "=== Swift ==="
swift -version 2>&1 | head -1
# 期望: Swift version 6.2.x

echo ""
echo "=== Android SDK ==="
echo "ANDROID_HOME: $ANDROID_HOME"
ls $ANDROID_HOME/platforms/ 2>/dev/null || echo "未找到 platforms"
ls $ANDROID_HOME/ndk/ 2>/dev/null || echo "未找到 NDK"
ls $ANDROID_HOME/build-tools/ 2>/dev/null || echo "未找到 build-tools"
# 期望: android-36, 27.1.12297006, 36.0.0

echo ""
echo "=== Ruby (CocoaPods) ==="
ruby -v
pod --version 2>/dev/null || echo "CocoaPods 未安装"
```

## 五、总结

| 维度 | 开发环境（本 Monorepo） | 集成应用（宿主 App） |
| --- | --- | --- |
| **React Native** | 0.83.2（固定） | ≥ 0.76.0（推荐） |
| **React** | 19.2.0（固定） | ≥ 18.2.0 |
| **Expo SDK** | 55（固定） | ≥ 52（推荐）；无 Expo 亦可 |
| **New Architecture** | 强制开启 | **必须开启** |
| **Node.js** | ≥ 20.19（推荐 22） | ≥ 18 |
| **JDK** | 17 | 17 |
| **Xcode** | 26+（Swift 6.2） | ≥ 15.1（Expo 52）/ 26+（Expo 55） |
| **iOS 部署目标** | 16.0 | ≥ 15.1（RN 0.76）/ ≥ 16.0（RN 0.83） |
| **Android compileSdk** | 36 | ≥ 35（RN 0.76）/ ≥ 36（RN 0.83） |
| **Android minSdk** | 24 | ≥ 24 |
| **核心依赖** | react-native-chat-sdk ^1.12.0 | react-native-chat-sdk ^1.12.0 |

## 参考资料

| 来源 | 链接 |
| --- | --- |
| React Native 0.83 环境配置 | [reactnative.dev](https://reactnative.dev/docs/0.83/set-up-your-environment) |
| Expo SDK 55 Changelog | [expo.dev](https://expo.dev/changelog/sdk-55-beta) |
| Expo-RN 版本对应关系 | [expo-rn-compatibility.md](expo-rn-compatibility.md) |
| Expo SDK 55 Android 构建环境 | [expo-sdk55-android-build-env.md](expo-sdk55-android-build-env.md) |
| Expo SDK 55 iOS 构建问题 | [expo-sdk55-xcode-build-issue.md](expo-sdk55-xcode-build-issue.md) |
| Android 构建补丁 | [android-build-patches.md](android-build-patches.md) |
| RN 版本兼容性分析 | [react-native-version-compatibility.md](react-native-version-compatibility.md) |
| RN 0.76 New Architecture 默认开启 | [reactnative.dev](https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture) |
| Fabric 双架构兼容指南 | [GitHub](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/backwards-compat-fabric-component.md) |
