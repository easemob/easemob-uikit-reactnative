# Agora RTC SDK 标准版 vs Special 版对比

## 概述

Agora 为 iOS 和 Android 分别发布了两种变体的 RTC SDK：**标准版**和 **Special 版**。两者 API 功能完全一致，核心区别在于共享基础库 `aosl` 的打包方式——外置依赖还是内嵌捆绑。Special 版专为**多 Agora SDK 共存场景**设计（如同时集成 RTC + IM/Signaling）。

---

## iOS：`AgoraRtcEngine_iOS` vs `AgoraRtcEngine_Special_iOS`

### 基本信息

|                  | `AgoraRtcEngine_iOS`                                                        | `AgoraRtcEngine_Special_iOS`                                                  |
| ---------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **分发平台**     | CocoaPods                                                                   | CocoaPods                                                                     |
| **版本号风格**   | 三段式：`4.5.2`                                                             | 四段式：`4.5.2.140`（多一位 build number）                                    |
| **下载源**       | `AgoraRtcEngine_iOS-4.5.2.zip`                                              | `AgoraRtcEngine_Special_iOS-4.5.2.140.zip`                                    |
| **podspec 来源** | [CDN](https://cdn.jsdelivr.net/cocoa/Specs/1/d/9/AgoraRtcEngine_iOS/)       | [CDN](https://cdn.jsdelivr.net/cocoa/Specs/5/d/b/AgoraRtcEngine_Special_iOS/) |
| **GitHub 仓库**  | [AgoraIO/AgoraRtcEngine_iOS](https://github.com/AgoraIO/AgoraRtcEngine_iOS) | 无公开仓库（仅通过 CocoaPods 分发）                                           |

### 结构差异

|                           | `AgoraRtcEngine_iOS`                                                                              | `AgoraRtcEngine_Special_iOS`                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Pod 结构**              | **模块化** — 有 18 个 subspecs（`RtcBasic`, `AINS`, `AudioBeauty`, `ClearVision` 等），可按需引入 | **扁平化** — 无 subspecs，所有 xcframework 打包在顶级 `vendored_frameworks` 中（共 25 个） |
| **`AgoraInfra_iOS` 依赖** | `RtcBasic` subspec 声明精确依赖 `"AgoraInfra_iOS": ["1.2.13.1"]`，aosl 由外部 Pod 提供            | **无任何外部依赖**，不声明 `AgoraInfra_iOS`                                                |
| **aosl 来源**             | 来自独立 Pod `AgoraInfra_iOS`（**外置**）                                                         | `aosl.xcframework` 直接包含在 `vendored_frameworks` 列表中（**内嵌**）                     |

### podspec 关键片段

**`AgoraRtcEngine_iOS` 4.5.2** — subspecs + 外部依赖：

```json
"subspecs": [{
  "name": "RtcBasic",
  "vendored_frameworks": [
    "AgoraRtcKit.xcframework",
    "Agorafdkaac.xcframework",
    "Agoraffmpeg.xcframework",
    "AgoraSoundTouch.xcframework"
  ],
  "dependencies": {
    "AgoraInfra_iOS": ["1.2.13.1"]   // ← aosl 外置，精确版本约束
  }
}, {
  "name": "AINS",
  "vendored_frameworks": "AgoraAiNoiseSuppressionExtension.xcframework"
},
// ... 其他 16 个 subspecs
]
```

**`AgoraRtcEngine_Special_iOS` 4.5.2.140** — 扁平化，无依赖：

```json
"vendored_frameworks": [
  "AgoraRtcKit.xcframework",
  "AgoraAiNoiseSuppressionExtension.xcframework",
  "AgoraAudioBeautyExtension.xcframework",
  // ... 其他扩展 xcframework
  "aosl.xcframework",       // ← aosl 内嵌
  "Agorafdkaac.xcframework",
  "Agoraffmpeg.xcframework",
  "video_dec.xcframework",
  "video_enc.xcframework"
]
// 无 "dependencies" 字段，无 "subspecs" 字段
```

### 多 SDK 共存时的冲突表现

| 场景                  | `AgoraRtcEngine_iOS`                                                             | `AgoraRtcEngine_Special_iOS`                                                |
| --------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 与 HyphenateChat 共存 | **版本约束冲突**（`= 1.2.13.1` vs `~> 1.3.0`），`pod install` 直接失败，无法解决 | 版本约束不冲突（不依赖 `AgoraInfra_iOS`）                                   |
| aosl.xcframework 重复 | 不会出现（只有一份来自 `AgoraInfra_iOS`）                                        | **会出现**（自身内嵌一份 + HyphenateChat 引入的 `AgoraInfra_iOS` 也有一份） |
| 解决方式              | 无法在 Podfile 层面覆盖精确约束（`=`），**必须切换到 Special 版**                | 在 `pre_install` 阶段比较版本，物理删除低版本的 `aosl.xcframework`          |

---

## Android：`io.agora.rtc:full-sdk` vs `io.agora.rtc:agora-special-full`

### 基本信息

|                | `io.agora.rtc:full-sdk`                                                             | `io.agora.rtc:agora-special-full`                                                                       |
| -------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **分发平台**   | Maven Central                                                                       | Maven Central                                                                                           |
| **版本号风格** | 三段式：`4.5.2`                                                                     | 四段式：`4.5.2.146`（多一位 build number）                                                              |
| **Maven 坐标** | [`io.agora.rtc:full-sdk`](https://mvnrepository.com/artifact/io.agora.rtc/full-sdk) | [`io.agora.rtc:agora-special-full`](https://mvnrepository.com/artifact/io.agora.rtc/agora-special-full) |

### 结构差异

|                   | `io.agora.rtc:full-sdk`                                         | `io.agora.rtc:agora-special-full`                           |
| ----------------- | --------------------------------------------------------------- | ----------------------------------------------------------- |
| **aosl 依赖方式** | **远程传递依赖** `io.agora.infra:aosl`（独立 Maven 包）         | **内嵌在 AAR 中**（`libaosl.so` 打包进 AAR 的 `jni/` 目录） |
| **Gradle 依赖树** | `full-sdk` → `io.agora.infra:aosl:1.2.13.1`（可在依赖树中看到） | 无传递依赖，`libaosl.so` 存在于 AAR 解压路径                |
| **依赖冲突处理**  | 可通过 Gradle 的 `exclude` / `resolutionStrategy` 排除          | 必须**物理删除** AAR 解压后 `jni/` 中的 `libaosl.so` 文件   |

### 多 SDK 共存时的冲突表现

| 场景                                        | `full-sdk`                                                                                 | `agora-special-full`                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| 与 hyphenate-chat 4.18.x（aosl 内嵌）共存   | `libaosl.so` 重复（AAR 内嵌 + 远程 `io.agora.infra:aosl`），可用 `exclude` 排除远程依赖    | `libaosl.so` 重复（双方都内嵌），需物理删除一方的 `.so` 文件 |
| 与 hyphenate-chat ≥ 4.19.0（远程 aosl）共存 | 两个远程 aosl（`io.agora.infra:aosl` vs `cn.shengwang.infra:aosl`），Gradle 可按版本号仲裁 | 一个远程 + 一个内嵌，需物理删除内嵌的 `.so` 文件             |
| Gradle 排除示例                             | `exclude group: 'io.agora.infra', module: 'aosl'`                                          | 无法 exclude（内嵌在 AAR 中），需构建脚本删除                |

### 构建脚本解决方式示例

**`full-sdk` 场景** — Gradle exclude：

```groovy
configurations.all {
    exclude group: 'io.agora.infra', module: 'aosl'
}
```

**`agora-special-full` 场景** — 物理删除 `.so`：

```groovy
// 在 transforms 缓存中删除 agora-special-full 内嵌的 libaosl.so
fileTree(dir: transformsDir).matching {
    include '**/agora-special-full-*/jni/**/libaosl.so'
}.each { file ->
    println "[aosl-fix] Deleting: ${file}"
    file.delete()
}
```

---

## 跨平台对称关系

iOS 和 Android 的两种变体在设计上完全对称：

| 特性          | iOS 标准版                   | iOS Special 版               | Android 标准版                      | Android Special 版          |
| ------------- | ---------------------------- | ---------------------------- | ----------------------------------- | --------------------------- |
| **名称**      | `AgoraRtcEngine_iOS`         | `AgoraRtcEngine_Special_iOS` | `full-sdk`                          | `agora-special-full`        |
| **版本示例**  | `4.5.2`                      | `4.5.2.140`                  | `4.5.2`                             | `4.5.2.146`                 |
| **aosl 方式** | 外置 Pod（`AgoraInfra_iOS`） | 内嵌 `aosl.xcframework`      | 远程 Maven（`io.agora.infra:aosl`） | 内嵌 `libaosl.so` 在 AAR 中 |
| **冲突排除**  | 不可行（精确约束 `=`）       | 物理删除低版本 xcframework   | `exclude` / `resolutionStrategy`    | 物理删除 `.so` 文件         |
| **模块化**    | 有 subspecs                  | 扁平化                       | 单一 AAR                            | 单一 AAR                    |

---

## 使用建议

1. **单一 SDK 项目**：使用标准版（`AgoraRtcEngine_iOS` / `full-sdk`），模块化更灵活，依赖管理更规范
2. **多 Agora SDK 共存**：使用 Special 版（`AgoraRtcEngine_Special_iOS` / `agora-special-full`），避免版本约束冲突，但需要配合去重脚本处理 aosl 重复
3. `react-native-agora` 的 [main 分支](https://github.com/AgoraIO-Extensions/react-native-agora/blob/main/react-native-agora.podspec) 已切换到 Special 版

## 参考资料

- [Agora 官方文档：多 SDK 集成冲突处理](https://docs.agora.io/en/help/integration-issues/rtm2_rtc_integration_issue)
- [AgoraRtcEngine_iOS podspec（CocoaPods CDN）](https://cdn.jsdelivr.net/cocoa/Specs/1/d/9/AgoraRtcEngine_iOS/)
- [AgoraRtcEngine_Special_iOS podspec（CocoaPods CDN）](https://cdn.jsdelivr.net/cocoa/Specs/5/d/b/AgoraRtcEngine_Special_iOS/)
- [io.agora.rtc:full-sdk（Maven Central）](https://mvnrepository.com/artifact/io.agora.rtc/full-sdk)
- [io.agora.rtc:agora-special-full（Maven Central）](https://mvnrepository.com/artifact/io.agora.rtc/agora-special-full)
- [react-native-agora main 分支 podspec](https://github.com/AgoraIO-Extensions/react-native-agora/blob/main/react-native-agora.podspec)
