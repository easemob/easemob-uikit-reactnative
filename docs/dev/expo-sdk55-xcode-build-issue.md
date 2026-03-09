# Expo SDK 55 iOS 构建失败问题分析

## 问题概述

在 `uikit-example` 项目中运行 `yarn run ios`（即 `expo run:ios`）时，iOS 原生构建失败，`xcodebuild` 退出码 65，共 22 个编译错误，全部来自 `expo-modules-core` 的 iOS Swift 代码。

## 环境信息

| 项目                | 版本                    |
| ------------------- | ----------------------- |
| macOS               | 15.7.4 (Sequoia)        |
| 硬件                | Apple M1 Max, 64GB RAM  |
| Xcode（尝试过）     | 16.2 → 16.4 → 26.4 beta |
| Expo SDK            | 55                      |
| expo-modules-core   | 55.0.11                 |
| React Native        | 0.83.2                  |
| Swift（Xcode 16.4） | 6.1.2                   |

## 错误日志分析

### 22 个错误分为三类

**第一类：`unknown attribute 'MainActor'`（关键线索）**

```
❌ (expo-modules-core/ios/Core/Views/ViewDefinition.swift:121:19)
> extension UIView: @MainActor AnyArgument {
                    ^ unknown attribute 'MainActor'

❌ (expo-modules-core/ios/Core/Views/SwiftUI/SwiftUIHostingView.swift:45:89)
> public final class HostingView<...>: ExpoView, @MainActor AnyExpoSwiftUIHostingView {
                                                  ^ unknown attribute 'MainActor'
```

这里 `@MainActor` 出现在 **protocol conformance 的位置**（冒号后面），是 **Isolated Conformances** 语法。这不是常规的 `@MainActor class Foo {}` 用法（Swift 5.5 即支持），而是一种全新的语法。

**第二类：`main actor-isolated ... nonisolated context`**

```
> try props.updateRawProps(rawProps, appContext: appContext)
      ^ main actor-isolated property 'props' can not be referenced from a nonisolated context
```

Swift 6 strict concurrency checking 相关的错误。

**第三类：`Sendable` 类型不匹配**

```
> let completionHandler: (URLSession.AuthChallengeDisposition, URLCredential?) -> Void
      ^ stored property 'completionHandler' of 'Sendable'-conforming class has non-sendable type
```

## 根因定位

### 核心问题：编译器版本不够新

`expo-modules-core@55.0.11` 的 podspec 声明了 `swift_version = '6.0'`（Swift 6 语言模式），其源码使用了 **Isolated Conformances** 语法（`extension UIView: @MainActor AnyArgument`）。

**关键技术概念区分：**

- **Swift 语言模式（Language Mode）**：由 `SWIFT_VERSION` 控制，只有 `4`、`4.2`、`5`、`6` 几种选项，控制语义规则（如 strict concurrency）
- **Swift 编译器版本（Compiler Version）**：安装的编译器二进制文件的版本，决定认识哪些语法

新语法是跟随 **编译器版本** 的，不是语言模式。Isolated Conformances 语法是 **Swift 6.2 编译器新增的**：

| 编译器                   | 语言模式 | 是否认识该语法 |
| ------------------------ | -------- | -------------- |
| Swift 6.0.3 (Xcode 16.2) | 6.0      | 不认识         |
| Swift 6.1.2 (Xcode 16.4) | 6.0      | 不认识         |
| Swift 6.2 (Xcode 26)     | 6.0      | 认识           |

因此，**即使将 Xcode 从 16.2 升级到 16.4，问题仍然存在**，因为 Swift 6.1 编译器同样不认识这种语法。需要 Xcode 26（Swift 6.2）。

### 升级 Xcode 到 16.4 无效的验证

升级 Xcode 到 16.4 后重新 `pod install` 并构建，错误完全相同，确认不是缓存问题，而是编译器本身不支持该语法。

## Expo 官方态度

在 [GitHub issue #42525](https://github.com/expo/expo/issues/42525) 中，Expo 核心开发者 @tsapeta（expo-modules-core 维护者）明确回复：

> "Yes, Xcode 15 (and 16 as well) are not supported anymore, so I'm closing it."

并建议使用 Xcode 26，issue 报告者确认使用 Xcode 26 后问题解决。

## 解决方案

### 安装 Xcode 26.3（推荐）

Xcode 26.3 RC2 是当前最新的稳定版本，其 Release Notes 明确声明：

> **Xcode 26.3 RC 2 requires a Mac running macOS Sequoia 15.6 or later.**

当前 macOS 15.7.4 满足要求。

**注意：不要下载 Xcode 26.4 beta**，beta 版本可能需要 macOS 26 (Tahoe)，在 macOS 15.x 上会提示 "You can't use this version of the application" 而无法打开。

**安装步骤：**

1. 从 App Store 更新 Xcode（会安装最新稳定版），或从 [developer.apple.com/download/all](https://developer.apple.com/download/all/) 下载 **Xcode 26.3 RC2**（`.xip` 格式，不要选带 "beta" 字样的）
2. `.xip` 解压后将 `Xcode.app` 移动到 `/Applications`
3. 切换 xcode-select：
   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   xcodebuild -version  # 确认显示 Xcode 26.x
   ```
4. 清理旧构建并重新编译：
   ```bash
   cd examples/uikit-example
   rm -rf ios/build ios/Pods
   cd ios && pod install && cd ..
   yarn run ios
   ```

### 关于 .xip 格式

从 Apple Developer 官网下载的 Xcode 是 `.xip` 格式（签名压缩包），双击后先验证签名再解压出 `Xcode.app`，解压过程较慢（十几分钟），解压后手动拖入 `/Applications`。功能与 App Store 安装的完全相同。

## 参考资料

| 来源                         | 链接                                                                                                      | 关键信息                                        |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Expo GitHub Issue            | [#42525](https://github.com/expo/expo/issues/42525)                                                       | Expo 核心开发者确认 Xcode 15/16 不再支持 SDK 55 |
| Expo SDK-Xcode 兼容性        | [expo/fyi](https://github.com/expo/fyi/blob/main/expo-sdk-xcode-compatibility.md)                         | 通用兼容性说明（无 SDK 55 具体映射）            |
| Xcode 26 Release Notes       | [Apple Developer](https://developer.apple.com/documentation/xcode-release-notes/xcode-26-release-notes)   | Xcode 26 包含 Swift 6.2，需 macOS 15.6+         |
| Xcode 26.3 RC2 Release Notes | [Apple Developer](https://developer.apple.com/documentation/xcode-release-notes/xcode-26_3-release-notes) | Xcode 26.3 RC2 包含 Swift 6.2.3，需 macOS 15.6+ |
| expo-modules-core podspec    | `node_modules/expo-modules-core/ExpoModulesCore.podspec` 第 86 行                                         | `s.swift_version = '6.0'`                       |

## 版本兼容性总结

```
Expo SDK 55
  └── expo-modules-core@55.0.11
        └── 源码使用 Isolated Conformances 语法
              └── 需要 Swift 6.2 编译器
                    └── 需要 Xcode 26+
                          └── 需要 macOS Sequoia 15.6+
```
