# Android 构建补丁说明

## 概述

项目从 React Native 0.76 升级到 0.83（Expo SDK 55）后，Android 端出现了若干第三方依赖的编译和链接问题。本文档记录了所有需要的补丁及其原因。

由于 `android/` 目录由 `expo prebuild --clean` 自动生成、不被 git 追踪，所有针对 Gradle 构建文件的补丁通过 `scripts/patch-android-build.js` 脚本自动应用，集成在 `prepare` 流程中。

## 补丁一览

| 补丁                              | 类型        | 影响的库                                 | 管理方式                                     |
| --------------------------------- | ----------- | ---------------------------------------- | -------------------------------------------- |
| `currentActivity` API 变更        | Kotlin 源码 | react-native-audio-recorder-player@3.6.x | `yarn patch`（`.yarn/patches/`）             |
| androidsvg 重复类                 | Gradle 配置 | @d11/react-native-fast-image (Glide)     | `patch-android-build.js`                     |
| libaosl.so 智能去重               | Gradle 配置 | react-native-agora + hyphenate-chat      | `patch-android-build.js` → `aosl-fix.gradle` |
| libaosl.so pickFirst 兜底         | Gradle 配置 | react-native-agora + hyphenate-chat      | `patch-android-build.js`                     |
| GeneratedAppGlideModuleImpl 重复  | Gradle 配置 | @d11/react-native-fast-image (Glide)     | `patch-android-build.js`                     |
| Release APK ABI 过滤              | Gradle 配置 | React Native Gradle Plugin               | Expo config plugin `withReleaseAbiFilter`    |

## 补丁详细说明

### 1. react-native-audio-recorder-player — `currentActivity` 未解析引用

**问题：**

```
Unresolved reference 'currentActivity'.
Unresolved reference 'applicationContext'.
```

**根因分析：**

React Native 从 0.80 起逐步将核心类 `ReactContextBaseJavaModule` 从 Java 迁移为 Kotlin 源码（`getCurrentActivity()` 在 0.80.0 标记为 `@Deprecated`）。在旧版本中，该类是 Java 编写的，其中有 `public Activity getCurrentActivity()` 方法。Kotlin 调用 Java 的 getter 方法时，可以省略 `get` 前缀，直接作为属性 `currentActivity` 访问。

迁移为纯 Kotlin 后，同 Kotlin 类之间不再支持这种 Java 属性语法糖。`react-native-audio-recorder-player` 3.6.x 中的 `RNAudioRecorderPlayerModule.kt` 仍使用旧写法，在 RN 0.83 上编译失败。

RN 源码中的变更（`ReactContextBaseJavaModule.kt`）：

```kotlin
@Deprecated(
    "Deprecated in 0.80.0. Use getReactApplicationContext().getCurrentActivity() instead.",
    ReplaceWith("reactApplicationContext.currentActivity"),
)
protected fun getCurrentActivity(): Activity? {
    return reactApplicationContext.currentActivity
}
```

**修复内容：**

将 `currentActivity` 替换为 `getCurrentActivity()`，共 3 处：

| 文件                             | 行号 | 修改                                                                                 |
| -------------------------------- | ---- | ------------------------------------------------------------------------------------ |
| `RNAudioRecorderPlayerModule.kt` | 47   | `(currentActivity)!!` → `(getCurrentActivity())!!`                                   |
| `RNAudioRecorderPlayerModule.kt` | 53   | `(currentActivity)!!` → `(getCurrentActivity())!!`                                   |
| `RNAudioRecorderPlayerModule.kt` | 255  | `currentActivity!!.applicationContext` → `getCurrentActivity()!!.applicationContext` |

**管理方式：**

使用 Yarn 4 原生的 `yarn patch` 功能，补丁文件保存在 `.yarn/patches/` 目录中，由 `package.json` 的 `resolutions` 字段引用。每次 `yarn install` 自动应用。

```bash
# 创建补丁的命令（已执行，仅供参考）
yarn patch react-native-audio-recorder-player
# 修改临时目录中的文件后：
yarn patch-commit -s <临时目录>
```

### 2. androidsvg 重复类冲突

**问题：**

```
Duplicate class com.caverock.androidsvg.* found in modules:
  - androidsvg-1.4.jar (com.caverock:androidsvg:1.4)
  - androidsvg-aar-1.4.aar (com.caverock:androidsvg-aar:1.4)
```

**根因分析：**

`@d11/react-native-fast-image` 的依赖链中同时引入了两种格式的 androidsvg：

- `com.caverock:androidsvg:1.4` — JAR 格式
- `com.caverock:androidsvg-aar:1.4` — AAR 格式（通过 Glide 间接引入）

两者包含完全相同的 Java 类，只是打包格式不同，Gradle 在合并时报 Duplicate class 错误。

**修复内容（`patch-android-build.js`）：**

在 `android/app/build.gradle` 中全局排除 jar 格式的 `androidsvg`，保留 Glide 使用的 `androidsvg-aar`：

```groovy
configurations.all {
    exclude group: "com.caverock", module: "androidsvg"
}
```

### 3. libaosl.so 重复 — Android 版 aosl 冲突

**问题：**

```
2 files found with path 'lib/arm64-v8a/libaosl.so' from inputs:
  - hyphenate-chat-4.18.1/jni/arm64-v8a/libaosl.so
  - aosl-1.2.13.1/jni/arm64-v8a/libaosl.so
```

**根因分析：**

与 iOS 端的 `aosl.xcframework` 冲突同源（参见 `patch-ios-build.js`）：

- `hyphenate-chat`（环信 Chat SDK）自带 `libaosl.so`（4.18.x 内嵌在 AAR 中；4.19.0+ 改为远程依赖 `cn.shengwang.infra:aosl`）
- `aosl`（Agora RTC SDK 的传递依赖 `io.agora.infra:aosl`）也带了 `libaosl.so`（`agora-special-full` 则内嵌在 AAR 中）

两份 `libaosl.so` 无法同时存在于同一个 APK 中，且版本可能不同，需要确保保留较高版本。

**修复方案：双层机制**

#### 3a. 智能去重（`aosl-fix.gradle`，由 `patch-android-build.js` 生成）

`aosl-fix.gradle` 在 `afterEvaluate` 阶段检测依赖并智能处理，设计理念与 iOS 端 `fix_aosl_conflicting.rb` 一致：

| 场景   | `cn.shengwang.infra:aosl` | `io.agora.infra:aosl` | 动作                             |
| ------ | ------------------------- | --------------------- | -------------------------------- |
| **1**  | ✅ 远程依赖               | ✅ 远程依赖           | 自动比较版本，`exclude` 低版本的 |
| **2a** | ❌ 内嵌在 AAR             | ✅ 远程依赖           | 根据 `aosl_prefer` 参数决定      |
| **2b** | ✅ 远程依赖               | ❌ 内嵌在 AAR         | 根据 `aosl_prefer` 参数决定      |
| **3**  | ❌ 内嵌在 AAR             | ❌ 内嵌在 AAR         | 根据 `aosl_prefer` 参数决定      |

处理方式：

- **远程依赖** → 用 `configurations.all { exclude group: '...', module: 'aosl' }` 排除
- **内嵌在 AAR** → 在 merge JNI 任务的 `doFirst` 阶段物理删除 `.so` 文件

参数：

```groovy
ext.aosl_prefer = "easemob"  // 默认保留 hyphenate-chat 的 aosl
// 或 "agora" → 保留 agora 的 aosl
```

当前依赖版本下的实际场景：

| hyphenate-chat                            | Agora SDK                                         | 实际场景 | 默认行为 (prefer=easemob)                    |
| ----------------------------------------- | ------------------------------------------------- | -------- | -------------------------------------------- |
| 4.18.x（内嵌）                            | `full-sdk:4.5.2` → `io.agora.infra:aosl:1.2.13.1` | 场景 2a  | `exclude io.agora.infra:aosl`                |
| 4.18.x（内嵌）                            | `agora-special-full`（内嵌）                      | 场景 3   | 物理删除 agora 路径的 .so                    |
| 4.19.0+ → `cn.shengwang.infra:aosl:1.3.0` | `full-sdk:4.5.2` → `io.agora.infra:aosl:1.2.13.1` | 场景 1   | 自动比版本：1.3.0 > 1.2.13.1 → exclude agora |
| 4.19.0+ → `cn.shengwang.infra:aosl:1.3.0` | `agora-special-full`（内嵌）                      | 场景 2b  | 物理删除 agora 路径的 .so                    |

#### 3b. pickFirst 兜底（安全网）

作为安全网保留，即使 `aosl-fix.gradle` 的检测或删除逻辑失败，构建也不会崩溃：

```groovy
packagingOptions {
    jniLibs {
        pickFirst 'lib/**/libaosl.so'
    }
}
```

> [!NOTE]
> iOS 端通过 `fix_aosl_conflicting.rb` 在 `pre_install` 阶段扫描所有 Pod 的 `aosl.xcframework`，比较版本（从 `Info.plist` 读取 `CFBundleShortVersionString`），保留最高版本，删除其余。
> Android 端通过 `aosl-fix.gradle` 检测远程 Maven 依赖和内嵌 AAR，使用 `exclude` 和物理删除的双层机制。`pickFirst` 保留为兜底安全网。

### 4. GeneratedAppGlideModuleImpl 重复类冲突（仅 release 构建）

**问题：**

```
Type com.bumptech.glide.GeneratedAppGlideModuleImpl is defined multiple times:
  - .../bundleLibRuntimeToDirRelease_dex/com/bumptech/glide/GeneratedAppGlideModuleImpl.dex
  - .../intermediates/external_libs_dex/release/mergeExtDexRelease/classes2.dex
```

**根因分析：**

`@d11/react-native-fast-image` 中的 `FastImageGlideModule.java` 使用 `@GlideModule` 注解继承 `AppGlideModule`。Glide 的 annotation processor（`com.github.bumptech.glide:compiler`）在编译时扫描到该注解后，会自动生成 `com.bumptech.glide.GeneratedAppGlideModuleImpl` 类。

Debug 构建不受影响，因为 AGP（Android Gradle Plugin）的 debug dex 合并流水线是单阶段合并，可以处理重复类。

Release 构建使用多阶段 dex 合并：
1. 外部库的 dex 先合并到 `mergeExtDexRelease`（产出 `classes2.dex`）
2. 各库模块的 runtime 类（`bundleLibRuntimeToDirRelease_dex`）再与之合并
3. `GeneratedAppGlideModuleImpl` 同时出现在两个来源中，触发 Duplicate class 错误

与 androidsvg 和 aosl 冲突不同，这里不涉及版本选择——整个项目只有一个 Glide 版本（`4.16.0`），`GeneratedAppGlideModuleImpl` 是编译产物而非带版本的库，两份内容完全一样，只需去重。

**修复内容（`patch-android-build.js`）：**

`@d11/react-native-fast-image` 的 `build.gradle` 已内置开关：

```groovy
if (safeExtGet('excludeAppGlideModule', false)) {
    exclude "**/FastImageGlideModule.java"
}
```

`safeExtGet` 从 `rootProject.ext` 读取属性。在 `android/build.gradle`（root project）中设置：

```groovy
ext {
    excludeAppGlideModule = true
}
```

这样 fast-image 库跳过编译 `FastImageGlideModule.java`，annotation processor 不会在库模块中生成 `GeneratedAppGlideModuleImpl`，冲突消失。

### 5. Release APK ABI 过滤 — 减小 APK 体积

**问题：**

Release APK 包含所有 4 个架构（armeabi-v7a、arm64-v8a、x86、x86_64），导致体积过大。仅在 `buildTypes.release` 中设置 `ndk { abiFilters 'arm64-v8a' }` 无效。

**根因分析：**

React Native Gradle Plugin (RNGP) 在 `NdkConfiguratorUtils.configureNdkBuildForApp` 中读取 `gradle.properties` 的 `reactNativeArchitectures` 属性（默认 4 个架构），并通过 `addAll` 写入 `defaultConfig.ndk.abiFilters`：

```kotlin
val architectures = project.getReactNativeArchitectures()
if (architectures.isNotEmpty() && !ext.splits.abi.isEnable) {
    ext.defaultConfig.ndk.abiFilters.addAll(architectures)
}
```

AGP 合并 `defaultConfig` 和 `buildTypes` 的 `ndk.abiFilters` 时采用 **并集（union）** 策略，而非替换。因此 release buildType 单独设置 `abiFilters 'arm64-v8a'` 后，最终结果仍是全部 4 个架构的并集。此外 AGP 8.x+ 在 configuration 阶段即锁定 variant 配置，`afterEvaluate` 中修改 `defaultConfig.ndk.abiFilters` 也无法影响最终打包。

**修复内容（Expo config plugin `withReleaseAbiFilter`）：**

使用 AGP `androidComponents` Variant API，在 release variant 的 packaging 阶段排除不需要的 ABI 目录：

```groovy
androidComponents {
    onVariants(selector().withBuildType("release")) { variant ->
        variant.packaging.jniLibs.excludes.addAll(
            "lib/armeabi-v7a/**", "lib/x86/**", "lib/x86_64/**"
        )
    }
}
```

Variant API 在 variant 配置阶段（早于 `afterEvaluate`）注册，且直接控制 APK 打包内容，绕过了 `ndk.abiFilters` 的 union 问题。

效果：

| 构建类型 | jniLibs.excludes            | 最终结果                  |
| -------- | --------------------------- | ------------------------- |
| debug    | _(none)_                    | 全部架构（模拟器兼容）   |
| release  | armeabi-v7a, x86, x86_64   | 仅 arm64-v8a（体积最优） |

## 构建流程

`prepare` 脚本的执行顺序：

```
yarn copy:firebase         # 复制 Firebase 配置文件到项目根目录
  ↓
yarn expo:prebuild         # expo prebuild --clean --no-install（生成 ios/ 和 android/）
  ↓
yarn gen                   # 生成 env 和 rename 配置
  ↓
yarn patch:ios             # iOS 端补丁（Agora podspec + aosl 冲突 + Firebase modular_headers）
  ↓
yarn patch:android         # Android 端补丁（androidsvg 排除 + aosl-fix.gradle 生成 + pickFirst 兜底 + excludeAppGlideModule）
```

## 相关文件

| 文件                                                       | 说明                                                  |
| ---------------------------------------------------------- | ----------------------------------------------------- |
| `.yarn/patches/react-native-audio-recorder-player-*.patch` | audio-recorder-player 的 yarn patch 补丁              |
| `scripts/patch-android-build.js`                           | Android build.gradle 补丁脚本（生成 aosl-fix.gradle） |
| `plugins/withReleaseAbiFilter.js`                          | Expo config plugin — release ABI 过滤                 |
| `android/app/aosl-fix.gradle`                              | aosl 智能去重脚本（由 patch-android-build.js 生成）   |
| `scripts/patch-ios-build.js`                               | iOS 端 Agora podspec + Podfile 补丁脚本               |
| `ios/fix_aosl_conflicting.rb`                              | iOS 端 aosl 去重模块（由 patch-ios-build.js 生成）    |
| `docs/dev/firebase-expo-config-migration.md`               | Firebase 配置迁移文档                                 |

## 参考

- [React Native 0.80 Changelog](https://reactnative.dev/changelog/0.80) — ReactContextBaseJavaModule 开始迁移为 Kotlin（getCurrentActivity 标记 @Deprecated）
- [Glide v5 依赖说明](https://bumptech.github.io/glide/) — androidsvg-aar 作为 SVG 解码依赖
- [Gradle Duplicate class 解决方案](https://d.android.com/r/tools/classpath-sync-errors)
- [Gradle packagingOptions.pickFirst](https://developer.android.com/reference/tools/gradle-api/com/android/build/api/dsl/JniLibsPackaging)
