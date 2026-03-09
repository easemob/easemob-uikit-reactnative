# Expo SDK 55 Android 构建环境依赖分析

## 问题概述

Expo SDK 55 搭配 React Native 0.83 对 Android 构建工具链的版本要求大幅提升。本文档记录完整的环境依赖链和版本要求，帮助开发者快速搭建可用的 Android 构建环境。

## 环境信息

| 项目              | 版本     |
| ----------------- | -------- |
| Expo SDK          | 55       |
| React Native      | 0.83.2   |
| React             | 19.2.0   |
| expo-modules-core | 55.0.11  |

## 构建工具链版本要求

### 核心工具链

| 工具                            | 要求版本         | 来源                                                |
| ------------------------------- | ---------------- | --------------------------------------------------- |
| JDK                             | **17**           | RN 0.83 官方要求                                    |
| Gradle                          | **9.0.0**        | `android/gradle/wrapper/gradle-wrapper.properties`   |
| AGP (Android Gradle Plugin)     | **8.12.0**       | `react-native/gradle/libs.versions.toml`             |
| Kotlin                          | **2.1.20**       | `react-native/gradle/libs.versions.toml`             |
| C++ Standard                    | **C++20**        | RN 0.83 要求                                        |

### Android SDK

| 属性              | 值                   | 说明                                                                 |
| ----------------- | -------------------- | -------------------------------------------------------------------- |
| compileSdkVersion | **36**               | Android 16，编译用                                                   |
| targetSdkVersion  | **36**               | Android 16                                                           |
| minSdkVersion     | **24**               | Android 7.0，最低运行版本                                            |
| buildToolsVersion | **36.0.0**           |                                                                      |
| NDK               | **27.1.12297006**    | 用于 JNI/C++ 原生编译（Hermes、Fabric 等）                          |

## 版本注入机制

Expo SDK 55 中，Android 构建参数的设置经过多层注入，理解这一链路有助于排查版本冲突问题。

### 注入流程

```
react-native/gradle/libs.versions.toml        ← 版本真值来源
  ↓
settings.gradle
  expoAutolinking.useExpoVersionCatalog()      ← 加载为 expoLibs 版本目录
  ↓
build.gradle
  apply plugin: "expo-root-project"            ← ExpoRootProjectPlugin
  ↓
rootProject.ext.compileSdkVersion = 36         ← 写入 rootProject.ext.*
rootProject.ext.targetSdkVersion  = 36
rootProject.ext.minSdkVersion     = 24
rootProject.ext.ndkVersion        = "27.1.12297006"
rootProject.ext.kotlinVersion     = "2.1.20"
  ↓
app/build.gradle
  android {
    compileSdk rootProject.ext.compileSdkVersion   ← 消费 ext 属性
    ndkVersion rootProject.ext.ndkVersion
    ...
  }
```

### 版本覆盖方式

如需覆盖默认值，可在 `android/gradle.properties` 中设置：

```properties
android.compileSdkVersion=36
android.targetSdkVersion=36
android.minSdkVersion=24
android.buildToolsVersion=36.0.0
android.kotlinVersion=2.1.20
```

一般情况下**不需要手动覆盖**，Expo 会自动从 React Native 的版本目录中读取正确的值。

## Gradle Properties 关键配置

`android/gradle.properties` 中的重要配置项：

```properties
# JVM 内存分配
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m

# 并行构建
org.gradle.parallel=true

# AndroidX（必须）
android.useAndroidX=true

# Expo SDK 55 强制新架构，此项已无法关闭
newArchEnabled=true

# Hermes 引擎（必须）
hermesEnabled=true

# Edge-to-Edge 模式
edgeToEdgeEnabled=true

# 构建的 ABI 架构
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
```

> **注意**：`newArchEnabled=true` 在 Expo SDK 55 中是强制的，不再支持旧架构。

## 关键原生依赖版本

以下是 React Native 0.83 通过版本目录（`libs.versions.toml`）锁定的主要原生依赖：

| 库               | 版本             | 说明                            |
| ---------------- | ---------------- | ------------------------------- |
| Boost            | 1_83_0           | C++ Boost 库                    |
| Folly            | 2024.11.18.00    | Facebook 开源 C++ 库            |
| glog             | 0.3.5            | Google 日志库                   |
| fbjni            | 0.7.0            | Facebook JNI 桥接库             |
| Fresco           | 3.6.0            | 图片加载库                      |
| SoLoader         | 0.12.1           | Facebook SO 库加载器            |
| OkHttp           | 4.9.2            | HTTP 客户端                     |
| double-conversion | 1.1.6           | 数值转换库                      |
| fmt              | 11.0.2           | C++ 格式化库                    |
| fast_float       | 8.0.0            | 快速浮点数解析                  |

## JDK 版本详解

### 为什么必须是 JDK 17

AGP 8.12.0 + Gradle 9.0.0 的组合对 JDK 版本有硬性要求：

| AGP 版本 | 最低 JDK | 推荐 JDK |
| -------- | -------- | -------- |
| 8.0 ~ 8.3 | 17     | 17       |
| 8.4+     | 17       | 17       |

使用 JDK 11 或更低版本会直接导致 Gradle sync 失败：

```
An exception occurred applying plugin request [id: 'com.android.application']
> Failed to apply plugin 'com.android.internal.application'.
   > Android Gradle plugin requires Java 17 to run. You are currently using Java 11.
```

### 验证 JDK 版本

```bash
java -version
# 应输出包含 "17" 的版本号，例如：
# openjdk version "17.0.x" ...
```

### Android Studio 内置 JDK

Android Studio 自带 JBR (JetBrains Runtime)，通常已是 JDK 17。如果命令行使用不同的 JDK，需确保 `JAVA_HOME` 指向正确版本：

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

或在 `android/gradle.properties` 中指定：

```properties
org.gradle.java.home=/path/to/jdk-17
```

## Android SDK 安装清单

通过 Android Studio 的 SDK Manager 或 `sdkmanager` 命令行工具，确保安装以下组件：

```bash
# SDK Platform
sdkmanager "platforms;android-36"

# Build Tools
sdkmanager "build-tools;36.0.0"

# NDK
sdkmanager "ndk;27.1.12297006"

# CMake（Fabric / Hermes JNI 编译需要）
sdkmanager "cmake;3.22.1"

# 命令行工具（最新版）
sdkmanager "cmdline-tools;latest"
```

### 在 Android Studio SDK Manager 中勾选

1. **SDK Platforms** 标签页：勾选 `Android 16 (API 36)`
2. **SDK Tools** 标签页：
   - Android SDK Build-Tools 36.0.0
   - NDK (Side by side) 27.1.12297006
   - CMake 3.22.1
   - Android SDK Command-line Tools (latest)

## 常见构建问题

### 问题一：Gradle sync 失败 — JDK 版本不匹配

**错误信息：**

```
Android Gradle plugin requires Java 17 to run. You are currently using Java 11.
```

**解决方案：** 安装 JDK 17 并设置 `JAVA_HOME`。macOS 上推荐使用 Homebrew：

```bash
brew install openjdk@17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

### 问题二：SDK Platform 未安装

**错误信息：**

```
Failed to find target with hash string 'android-36'
```

**解决方案：** 通过 SDK Manager 安装 Android 16 (API 36) Platform。

### 问题三：NDK 版本不匹配

**错误信息：**

```
No version of NDK matched the requested version 27.1.12297006.
```

**解决方案：** 通过 SDK Manager 安装指定版本的 NDK：

```bash
sdkmanager "ndk;27.1.12297006"
```

### 问题四：Kotlin 版本冲突

第三方库可能在其 `build.gradle` 中硬编码了较老的 Kotlin 版本（如 `1.9.x`），与 Expo 注入的 `2.1.20` 冲突。

**错误表现可能为：**

```
Module was compiled with an incompatible version of Kotlin.
The binary version of its metadata is X.X.X, expected version is Y.Y.Y.
```

**解决方案：** 在根 `build.gradle` 或 `gradle.properties` 中统一 Kotlin 版本，确保所有模块使用 `2.1.20`。

### 问题五：第三方库兼容性问题

升级到 RN 0.83 后，部分第三方库存在编译问题，详见 [android-build-patches.md](android-build-patches.md)，包括：

- `react-native-audio-recorder-player` 的 `currentActivity` API 变更
- `androidsvg` 重复类冲突
- `libaosl.so` 重复原生库冲突

## 环境依赖链总结

```
Expo SDK 55
  └── React Native 0.83.2
        ├── AGP 8.12.0
        │     └── 需要 JDK 17
        ├── Gradle 9.0.0
        │     └── 需要 JDK 17
        ├── Kotlin 2.1.20
        ├── compileSdkVersion 36
        │     └── 需要 Android SDK Platform 36
        ├── buildToolsVersion 36.0.0
        │     └── 需要 Android SDK Build-Tools 36.0.0
        ├── NDK 27.1.12297006
        │     └── 用于 Hermes / Fabric JNI 编译
        ├── C++20
        │     └── 由 NDK 提供的 clang 编译器支持
        └── newArchEnabled = true（强制）
              └── Expo SDK 55 不再支持旧架构
```

## 与 iOS 端对比

| 维度           | iOS                                                  | Android                                     |
| -------------- | ---------------------------------------------------- | ------------------------------------------- |
| 核心卡点       | Swift 编译器版本（需 6.2，即 Xcode 26+）             | JDK 版本（需 17）+ Android SDK Platform 36   |
| 原因           | `expo-modules-core` 使用了 Isolated Conformances 语法 | AGP 8.12.0 + Gradle 9.0.0 强制 JDK 17       |
| 升级难度       | 高（需安装 Xcode 26，可能需升级 macOS）              | 低（JDK 17 和 SDK 36 易于安装）              |
| 详细文档       | [expo-sdk55-xcode-build-issue.md](expo-sdk55-xcode-build-issue.md) | 本文档                       |

## 快速验证脚本

在项目根目录运行以下命令，快速检查 Android 构建环境是否满足要求：

```bash
echo "=== Java Version ==="
java -version 2>&1

echo ""
echo "=== JAVA_HOME ==="
echo $JAVA_HOME

echo ""
echo "=== Android SDK ==="
echo "ANDROID_HOME: $ANDROID_HOME"

echo ""
echo "=== Installed Platforms ==="
ls $ANDROID_HOME/platforms/ 2>/dev/null || echo "ANDROID_HOME not set or platforms not found"

echo ""
echo "=== Installed NDK ==="
ls $ANDROID_HOME/ndk/ 2>/dev/null || echo "No NDK installed"

echo ""
echo "=== Installed Build-Tools ==="
ls $ANDROID_HOME/build-tools/ 2>/dev/null || echo "No build-tools installed"
```

期望输出包含：

- Java version: `17.x.x`
- Platforms: `android-36`
- NDK: `27.1.12297006`
- Build-Tools: `36.0.0`

## 参考资料

| 来源                          | 链接                                                                                                       | 关键信息                                           |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| RN 0.83 环境配置              | [reactnative.dev](https://reactnative.dev/docs/0.83/set-up-your-environment)                                | 官方环境要求（JDK 17、Android SDK 等）             |
| RN 0.83 版本目录              | [libs.versions.toml](https://github.com/facebook/react-native/blob/v0.83.2/packages/gradle-plugin/gradle/libs.versions.toml) | AGP、Kotlin、SDK 版本定义                          |
| Expo SDK 55 Changelog         | [expo.dev](https://expo.dev/changelog/sdk-55-beta)                                                          | SDK 55 变更说明，强制新架构                        |
| AGP 兼容性                    | [developer.android.com](https://developer.android.com/build/releases/gradle-plugin#updating-gradle)         | AGP 版本与 Gradle / JDK 兼容性表                  |
| Android SDK Platform 36       | [developer.android.com](https://developer.android.com/about/versions/16)                                    | Android 16 API 概述                                |
| 项目 Android 补丁文档         | [android-build-patches.md](android-build-patches.md)                                                        | 第三方库编译问题和修复方案                         |
| Expo SDK-Xcode 兼容性         | [expo/fyi](https://github.com/expo/fyi/blob/main/expo-sdk-xcode-compatibility.md)                           | Expo 工具链兼容性说明                              |
