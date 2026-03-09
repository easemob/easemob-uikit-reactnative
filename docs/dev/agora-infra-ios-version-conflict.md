# AgoraInfra_iOS 版本冲突与 aosl.xcframework 重复问题

## 问题概述

在 `product-uikit-demo` 项目中运行 `pod install` 时，CocoaPods 报告 `AgoraInfra_iOS` 版本不兼容，无法同时满足 `react-native-agora` 和 `react-native-chat-sdk` 的依赖要求。解决版本冲突后，又出现 `aosl.xcframework` 框架名重复的问题。

## 环境信息

| 项目                  | 版本                       |
| --------------------- | -------------------------- |
| react-native          | 0.83.2                     |
| react-native-agora    | ~4.5.0（resolved 4.5.3）   |
| react-native-chat-sdk | ^1.12.0（resolved 1.14.0） |
| Expo SDK              | 55                         |

## 错误信息

### 错误 1：AgoraInfra_iOS 版本冲突

```
[!] CocoaPods could not find compatible versions for pod "AgoraInfra_iOS":
  In Podfile:
    react-native-agora was resolved to 4.5.3, which depends on
      AgoraRtcEngine_iOS (= 4.5.2) was resolved to 4.5.2, which depends on
        AgoraInfra_iOS (= 1.2.13.1)

    react-native-chat-sdk was resolved to 1.14.0, which depends on
      HyphenateChat (~> 4.18.1) was resolved to 4.18.1, which depends on
        AgoraInfra_iOS (~> 1.3.0)
```

### 错误 2：aosl.xcframework 重复（解决错误 1 后出现）

```
[!] The 'Pods-productuikitdemo' target has frameworks with conflicting names: aosl.xcframework.
```

## 根因分析

### 错误 1：精确版本约束互斥

两个 SDK 对共享基础库 `AgoraInfra_iOS` 的版本要求完全互斥：

| 依赖链                                                  | AgoraInfra_iOS 要求               |
| ------------------------------------------------------- | --------------------------------- |
| `react-native-agora` 4.5.3 → `AgoraRtcEngine_iOS` 4.5.2 | `= 1.2.13.1`（精确锁定）          |
| `react-native-chat-sdk` 1.14.0 → `HyphenateChat` 4.18.1 | `~> 1.3.0`（需要 ≥1.3.0, <1.4.0） |

`AgoraRtcEngine_iOS` 使用了精确版本约束（`=`），无法通过 Podfile 层面覆盖。

### 错误 2：两个 Pod 都捆绑了 aosl.xcframework

将 `AgoraRtcEngine_iOS` 替换为 `AgoraRtcEngine_Special_iOS` 后，版本冲突解决。但 `AgoraRtcEngine_Special_iOS` 是一个扁平化的 Pod（无 subspecs），其 `vendored_frameworks` 中包含 `aosl.xcframework`，而 `AgoraInfra_iOS`（由 HyphenateChat 引入）也提供同名框架，导致 CocoaPods 检测到重复。

实际版本对比（通过 `aosl.framework/Info.plist` 的 `CFBundleShortVersionString` 字段确认）：

| Pod                                                     | aosl 版本  |
| ------------------------------------------------------- | ---------- |
| `AgoraInfra_iOS`（来自 HyphenateChat）                  | **1.3.5**  |
| `AgoraRtcEngine_Special_iOS`（来自 react-native-agora） | **1.2.13** |

## 曾考虑的方案

| 方案                                            | 评估                                                                                                  |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 升级 `react-native-agora`                       | npm 上无更新版本，不可行                                                                              |
| 降级 `react-native-chat-sdk` 到 1.12.0          | 可行但会丢失 1.13/1.14 新功能；1.12.0 依赖 `HyphenateChat ~> 4.16.2`，可能兼容 `AgoraInfra_iOS` 1.2.x |
| 在 Podfile 中强制指定 `AgoraInfra_iOS` 版本     | 不可行，`AgoraRtcEngine_iOS` 的精确约束（`=`）无法被覆盖                                              |
| **切换到 `AgoraRtcEngine_Special_iOS`（采用）** | `react-native-agora` 的 GitHub main 分支已采用此方案，专为多 Agora SDK 共存设计                       |

## 采用的解决方案

通过一个补丁脚本（`scripts/patch-ios-build.js`）在 `expo prebuild` 之后自动执行三项修补：

### Step 1：替换 react-native-agora 的 native SDK 依赖

将 `node_modules/react-native-agora/react-native-agora.podspec` 中的：

```ruby
s.dependency 'AgoraRtcEngine_iOS', '4.5.2'
s.dependency 'AgoraIrisRTC_iOS', '4.5.2-build.1'
```

替换为（与 react-native-agora main 分支一致）：

```ruby
s.dependency 'AgoraRtcEngine_Special_iOS', '4.5.2.140'
s.dependency 'AgoraIrisRTC_iOS', '4.5.2.140-build.6'
```

这使得 CocoaPods 安装 `AgoraInfra_iOS` 1.3.x，同时满足两方需求。

### Step 2：生成 aosl.xcframework 通用去重脚本

在 `ios/fix_aosl_conflicting.rb` 中生成一个 Ruby 模块，用于在 CocoaPods `pre_install` 阶段**通用地**处理 aosl.xcframework 重复：

1. **扫描**所有 Pod 目录，找到所有包含 `aosl.xcframework` 的 Pod
2. **读取版本**：从每个 `aosl.xcframework/<arch>/aosl.framework/Info.plist` 的 `CFBundleShortVersionString` 字段获取精确版本号
3. **比较版本**：使用 `Gem::Version` 进行语义化版本比较
4. **保留最高版本**，删除所有低版本的 `aosl.xcframework`

```ruby
require 'fileutils'

module PodHelpers
  def self.handle_aosl_conflict(installer)
    pods_root = installer.sandbox.root

    # 1. Find all Pods containing aosl.xcframework
    aosl_entries = []
    Dir.glob(File.join(pods_root, '*', 'aosl.xcframework')).each do |xcfw_path|
      pod_name = File.basename(File.dirname(xcfw_path))

      # 2. Read version from Info.plist
      info_plist = Dir.glob(File.join(xcfw_path, 'ios-arm64*', 'aosl.framework', 'Info.plist')).first
      next unless info_plist

      version_str = `/usr/libexec/PlistBuddy -c "Print :CFBundleShortVersionString" "#{info_plist}"`.strip
      next if version_str.empty?

      aosl_entries << { pod: pod_name, path: xcfw_path, version: version_str }
    end

    return if aosl_entries.size <= 1

    # 3. Sort by version, keep highest
    aosl_entries.sort_by! { |e| Gem::Version.new(e[:version]) }
    keep = aosl_entries.last

    # 4. Remove all lower-version copies
    aosl_entries[0..-2].each do |entry|
      puts "[aosl-dedup] Removing v#{entry[:version]} from #{entry[:pod]}"
      FileUtils.rm_rf(entry[:path])
    end

    puts "[aosl-dedup] Kept v#{keep[:version]} from #{keep[:pod]}"
  end
end
```

> [!NOTE]
> 与之前硬编码删除 `AgoraRtcEngine_Special_iOS` 的方案不同，新方案不依赖任何 Pod 名称，适用于任意数量和版本组合的 aosl 冲突。版本信息直接从 framework 二进制的 `Info.plist` 读取，不依赖 podspec 声明。

### Step 3：修补 Podfile

在 expo 生成的 Podfile 中注入：

- `require_relative 'fix_aosl_conflicting'` —— 加载去重模块
- `pre_install` hook —— 调用去重逻辑
- Firebase 的 `modular_headers` 声明 —— 解决 `FirebaseCoreInternal` Swift 静态库模块映射问题

## 构建流程集成

补丁脚本已集成到 `package.json` 的 `prepare` 脚本中：

```json
{
  "scripts": {
    "prepare": "yarn copy:firebase && yarn expo:prebuild && yarn gen && yarn patch:ios && yarn patch:android",
    "patch:ios": "node scripts/patch-ios-build.js",
    "patch:android": "node scripts/patch-android-build.js"
  }
}
```

执行顺序：`copy:firebase`（复制 Firebase 配置文件）→ `expo prebuild --clean --no-install`（重新生成 ios/android）→ `gen`（生成 env 和 rename）→ `patch:ios`（iOS 端补丁）→ `patch:android`（Android 端补丁）。之后手动进入 `ios/` 目录执行 `pod install` 即可。

## 相关文件

- `examples/product-uikit-demo/scripts/patch-ios-build.js` —— 补丁脚本
- `examples/product-uikit-demo/ios/fix_aosl_conflicting.rb` —— aosl 去重模块（由脚本生成）
- `examples/product-uikit-demo/ios/Podfile` —— 被脚本修补（由 expo prebuild 生成）

## 参考

- [react-native-agora main 分支 podspec](https://github.com/AgoraIO-Extensions/react-native-agora/blob/main/react-native-agora.podspec) —— 已切换到 `AgoraRtcEngine_Special_iOS`
- [Agora: 同时集成 Signaling SDK 和 Video SDK 的冲突处理](https://docs.agora.io/en/help/integration-issues/rtm2_rtc_integration_issue)
- [react-native-chat-sdk 各版本 HyphenateChat 依赖](https://github.com/easemob/react-native-chat-sdk)

| react-native-chat-sdk | HyphenateChat |
| --------------------- | ------------- |
| 1.12.0                | ~> 4.16.2     |
| 1.13.0                | ~> 4.17.1     |
| 1.14.0                | ~> 4.18.1     |
