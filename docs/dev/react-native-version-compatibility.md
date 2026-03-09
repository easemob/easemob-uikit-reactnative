# React Native 版本兼容性分析

> 分析日期：2025-02-25
> 基于：react-native 0.83.2 / react 19.2.0 / create-react-native-library 0.57.2

## 1. React Native 0.83 运行平台最低版本

| 平台    | 最低版本     |
| ------- | ------------ |
| iOS     | 15.1         |
| Android | 7.0 (API 24) |

来源：[React Native v0.83.2 README - Requirements](https://github.com/facebook/react-native/tree/v0.83.2#-requirements)

## 2. React Native 0.83 开发环境要求

| 工具                    | 版本要求                 |
| ----------------------- | ------------------------ |
| Node.js                 | 20.19.4+                 |
| JDK                     | 17（推荐）               |
| Xcode                   | 16.1+                    |
| React                   | 19.2                     |
| Android SDK Platform    | 35（Android 15，编译用） |
| Android SDK Build-Tools | 36.0.0                   |
| C++ Standard            | C++20                    |

来源：

- [React Native 0.83 环境配置文档](https://reactnative.dev/docs/0.83/set-up-your-environment)
- [helpers.rb (min_ios_version_supported / min_xcode_version_supported)](https://github.com/facebook/react-native/blob/v0.83.2/packages/react-native/scripts/cocoapods/helpers.rb)

## 3. react-native-chat-uikit 库兼容性分析

### 3.1 当前架构

本库是**纯 Fabric（New Architecture）组件**，没有对旧架构的兼容代码。

关键源码依据：

| 文件                                      | 使用的 API                                                                     | 说明                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `ios/ChatUikitView.mm`                    | `ComponentDescriptorProvider`, `Props::Shared`, `RCTFabricComponentsPlugins.h` | 纯 Fabric C++ 渲染器，无 `RCTViewManager` 回退                 |
| `android/src/.../ChatUikitViewManager.kt` | `ViewManagerDelegate`, codegen 生成的 `Delegate`/`Interface`                   | 依赖 codegen 和 New Architecture                               |
| `src/ChatUikitViewNativeComponent.ts`     | `codegenNativeComponent`                                                       | New Architecture codegen API，无 `requireNativeComponent` 回退 |
| `android/build.gradle`                    | `apply plugin: "com.facebook.react"`, `com.facebook.react:react-android`       | RN 0.71+ 引入的 Gradle 插件和 Maven artifact                   |
| `ChatUikit.podspec`                       | `install_modules_dependencies(s)`                                              | RN 0.71+ 引入的 CocoaPods helper                               |

### 3.2 最低兼容 React Native 版本

| 场景             | 最低 RN 版本 | 说明                                                                               |
| ---------------- | ------------ | ---------------------------------------------------------------------------------- |
| **推荐最低版本** | **0.76**     | New Architecture 默认开启，开箱即用                                                |
| **理论最低版本** | **0.71**     | 需宿主 App 手动开启 New Architecture，API 可能存在差异                             |
| **不可用**       | **< 0.71**   | 缺少 `com.facebook.react:react-android`、`install_modules_dependencies` 等基础设施 |

### 3.3 为什么推荐 0.76 为最低版本

1. **RN 0.76 是 New Architecture 正式默认开启的版本**。本库没有旧架构回退代码（iOS 端没有 `RCTViewManager`，JS 端没有 `requireNativeComponent`），在旧架构的 App 中完全无法使用。
2. **RN 0.71 ~ 0.75 需要宿主 App 手动开启 New Architecture**。虽然理论上可用，但增加了集成门槛，且各版本间 Fabric API 可能有兼容差异。
3. **RN < 0.71 完全不可用**。缺少 `com.facebook.react:react-android` Maven artifact、`install_modules_dependencies` CocoaPods helper 等基础设施。

### 3.4 建议 peerDependencies 配置

```json
"peerDependencies": {
  "react": ">=18.2.0",
  "react-native": ">=0.76.0"
}
```

### 3.5 如需扩大兼容范围

若要支持 RN 0.71+ 的旧架构 App，需要做双架构兼容改造：

- **iOS**：添加 `RCTViewManager` 回退实现，使用 `#ifdef RCT_NEW_ARCH_ENABLED` 条件编译
- **Android**：添加不依赖 codegen 的 `ViewManager` 实现
- **JS**：添加 `requireNativeComponent` 回退

参考文档：[Backward Compatibility for Fabric Components](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/backwards-compat-fabric-component.md)

## 4. 参考资料

- [React Native 0.83 Release Blog](https://reactnative.dev/blog/2025/12/10/react-native-0.83)
- [React Native 0.83 环境配置](https://reactnative.dev/docs/0.83/set-up-your-environment)
- [React Native v0.83.2 GitHub (README / Requirements)](https://github.com/facebook/react-native/tree/v0.83.2)
- [React Native v0.83.2 helpers.rb (iOS/Xcode 最低版本定义)](https://github.com/facebook/react-native/blob/v0.83.2/packages/react-native/scripts/cocoapods/helpers.rb)
- [React Native v0.83.2 Gradle Plugin 版本目录](https://github.com/facebook/react-native/blob/v0.83.2/packages/gradle-plugin/gradle/libs.versions.toml)
- [React Native 0.76 - New Architecture by Default](https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture)
- [React Native 版本策略](https://reactnative.dev/docs/releases/versioning-policy)
- [React Native 版本列表](https://reactnative.dev/versions.html)
- [Fabric Component 双架构兼容指南](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/backwards-compat-fabric-component.md)
- [react-native-builder-bob FAQ](https://callstack.github.io/react-native-builder-bob/faq)
