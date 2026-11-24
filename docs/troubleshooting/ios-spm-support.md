# iOS SPM 支持：三个包的适配结论与三方库兼容记录

> 记录时间：2026-11-24。背景：CocoaPods trunk 于 2026-12-02 转只读，三个包（react-native-chat-uikit / react-native-chat-callkit / react-native-chat-room）需要支持 SPM 集成。

## 结论

三个包本身支持 SPM，已验证。它们的 podspec 不依赖任何第三方 pod（只有 `install_modules_dependencies`），iOS 原生代码仅为模板 stub，**podspec 未做任何修改**。

SPM 集成由 App 侧获得：宿主 App 以 `USE_FRAMEWORKS=dynamic pod install` 集成时，`react-native-chat-sdk` 的 `ChatSdk.podspec` 内置的 `spm_dependency` 会把 HyphenateChat 换成 SPM 包（`https://github.com/easemob/HyphenateChat_iOS.git`）；不加 `USE_FRAMEWORKS=dynamic` 则保持 pod 引用，两种模式向后兼容。

## SPM 模式运行时崩溃：Library not loaded（必做修复）

**仅完成上面的集成，App 能编译通过，但启动即崩溃：**

```
Library not loaded: @rpath/HyphenateChat.framework/HyphenateChat
  Referenced from: .../Frameworks/ChatSdk.framework/ChatSdk
```

原因：RN 的 `spm_dependency` 只把 SPM 包挂到 **pod target**（ChatSdk）上，而 Xcode 只会把挂到 **App target** 的 SPM product 嵌入 App bundle。`HyphenateChat.framework`（及其依赖的 `aosl.framework`）从未被拷进 App，dyld 启动时找不到即崩溃。RNFB 也是同样机制——它能正常运行，是因为 RNFB 把 firebase-ios-sdk 挂到了 App target 上并自带 `[RNFB] Embed Firebase SPM Frameworks` 脚本阶段。

**修复（已验证）**：在 App 的 Podfile 中把两个 SPM product 挂到 App target。把本目录下的 `embed_spm_frameworks.rb` 复制到 `ios/` 目录（与 Podfile 同级），然后：

```ruby
# ios/Podfile 顶部
require_relative 'embed_spm_frameworks'

# post_install 块内（react_native_post_install 之后即可）
post_install do |installer|
  SpmEmbed.embed_spm_products(installer)
  # ...
end
```

脚本幂等：向 App 工程添加 `HyphenateChat_iOS`（upToNextMinor 5.0.0）与 `ShengwangInfra_iOS`（upToNextMajor 1.3.5）两个 package reference，并把 `HyphenateChat` / `ShengwangInfra_iOS` product 链到 App target；Xcode 对 App target 链接的 SPM product 会自动嵌入并签名，无需手写 Embed 阶段（手写反而触发 `Unexpected duplicate tasks` 构建错误）。脚本仅在 `USE_FRAMEWORKS=dynamic` 时生效，CocoaPods 模式为 no-op。

本仓库五个 App 均已接入：product-uikit-demo 与 callkit-example 在各自的 `scripts/patch-ios-build.js`（step 4，prebuild 后自动重新生成并接线）；uikit-example / room-example / product-room-demo 在各自的 `scripts/patch-ios-build.js`（仅此一步，已挂入 `prepare`）。

注意一个测试陷阱：用 `CODE_SIGNING_ALLOWED=NO` 构建的包只能验证编译，不能验证启动——该配置下 `[CP] Embed Pods Frameworks` 不签名，AgoraRtcKit 等无签名的 vendored framework 会被 dyld 以 `Trying to load an unsigned library` 拒绝。`yarn ios`（expo run:ios）正常签名，不受影响。

**Agora 共存时的额外冲突（callkit / demo）**：`AgoraRtcEngine_Special_iOS` pod 自带 `aosl.xcframework`，SPM 模式下 aosl 已由 `ShengwangInfra_iOS` SPM 包提供，两份同时嵌入会报 `Multiple commands produce .../aosl.framework`。`fix_aosl_conflicting.rb` 已增加 SPM 分支：`USE_FRAMEWORKS=dynamic` 时直接删除所有 Pod 内置的 aosl.xcframework（CocoaPods 模式保持原有的按版本去重逻辑）。uikit-example / room-example 不含 Agora，不受影响。

## 验证矩阵

统一命令（各 example 的 `ios/` 目录内）：

```bash
USE_FRAMEWORKS=dynamic pod install
xcodebuild -workspace <name>.xcworkspace -scheme <name> -configuration Debug \
  -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' \
  CODE_SIGNING_ALLOWED=NO build
```

| App | SPM 模式构建 | 模拟器启动运行 | 说明 |
|---|---|---|---|
| uikit-example | ✅ 通过 | 构建验证（机制同 demo） | Podfile.lock 无 HyphenateChat，确认走 SPM |
| room-example | ✅ 通过 | 构建验证（机制同 demo） | |
| product-room-demo | ✅ 通过（2026-11-24） | 构建验证（机制同 demo） | 首轮失败为 DerivedData 陈旧（RNScreens 缺 x86_64 切片），清理后全量重建通过，HyphenateChat/aosl 均嵌入 |
| callkit-example | ✅ 通过 | 构建验证（机制同 demo） | Agora 引擎仍走 pod（无 SPM 分发），混合模式下 aosl 无冲突（Pods 里只剩 Agora 一份 aosl.xcframework，`fix_aosl_conflicting.rb` 无需改动） |
| product-uikit-demo | ✅ 通过（2026-11-24） | ✅ 启动正常（2026-11-24，iPhone 17 Pro iOS 26.2 模拟器，进入 Expo dev-client 界面，无崩溃报告） | 升级 RNFB 到 27.1.1 后构建通过，无任何变通代码；运行时修复见上节 |

## product-uikit-demo 失败归因（RNFB）与最终解法

demo 使用 `@react-native-firebase/app` + `@react-native-firebase/messaging`（FCM 推送演示，`src/demo/common/fcm.ts`）。

旧版 RNFB（23.x）只支持静态框架；SPM 模式必须 `USE_FRAMEWORKS=dynamic`，RNFB 被编成动态框架后，撞上预编译 React-Core（shim pod，头文件走非模块路径）的兼容问题，编译失败。

**最终解法（已验证）**：升级 RNFB 到 27.1.1。RNFB 26.1 起方向反转——Firebase Apple SDK 默认（27 起唯一）走 SPM，并要求 `use_frameworks! :linkage => :dynamic`，与 SPM 模式天然一致；podspec 自带 `CLANG_ALLOW_NON_MODULAR_INCLUDES` 与 `install_modules_dependencies`。升级后 demo 在 SPM 模式构建通过，此前的 RNFB 变通（Podfile post_install 片段、Firebase modular_headers pod、`patch-ios-build.js` 3b/3c 步）已全部删除。注意 v26 移除了 namespaced API，`fcm.ts` 已迁移到模块化 API。

历史尝试（已否决）：`ios.buildReactNativeFromSource=true`（RN 从源码编译）可绕开但会让干净构建/CI 增加 15~25 分钟。

## 三方库补丁说明

**静态 CocoaPods 模式完全不需要这些补丁，现有用户不受影响。** 补丁只作用于 SPM 必须的动态框架模式：一批老式三方库的 podspec 仍使用 `s.dependency "React-Core"`，在动态框架 + 预编译 RNCore 下链接不到 React 符号，统一改为 `install_modules_dependencies`（RN 官方写法，对静态模式无害）。这是上游库自身未适配，任何 App 在 SPM 模式下使用它们都会遇到。

补丁位于 `.yarn/patches/`，并复制一份到 `docs/troubleshooting/patches/` 供用户直接使用。

仍需要补丁的 6 个（上游最新版也未修复）：

| 包 | 当前版本 | 补丁内容 |
|---|---|---|
| react-native-file-viewer | 2.1.5 | 改用 `install_modules_dependencies` |
| react-native-create-thumbnail | 2.2.0 | 同上 |
| react-native-fs | 2.20.0 | 同上 |
| react-native-device-info | 14.1.1 | 同上（上游 15.0.2 仍未修） |
| @react-native-camera-roll/camera-roll | 7.10.2 | 同上 |
| react-native-audio-recorder-player | 3.6.14 | podspec 修改合并进已有 Android patch（该 patch 同时含 Android 修复） |

另有 1 个 Android 平台补丁（与 SPM 无关，仅 RN < 0.84 时需要；仅 demo 使用 RNFB 的项目涉及）：

| 包 | 当前版本 | 补丁内容 |
|---|---|---|
| @react-native-firebase/app | 27.1.1 | 3 处 `promise.reject(code, ...)` 改为 `code ?: "unknown"`——RNFB 27 的 Kotlin 代码按 RN ≥ 0.84（`reject` 的 code 可空）编写，RN 0.83 及更早版本编译报类型不匹配（同类问题见 invertase/react-native-google-mobile-ads#912） |

已通过升级去除补丁的 3 个（2026-11-24 完成，验证均通过）：

| 包 | 升级 | 说明 |
|---|---|---|
| react-native-image-crop-picker | 0.42.0 → 0.52.0 | 上游已加 `install_modules_dependencies`；uikit-example SPM 构建通过。注意需 `pod update TOCropViewController` 解除旧锁 |
| react-native-quick-base64 | 2.2.2 → 3.0.2 | 经根 resolutions 强压（传递依赖链 quick-crypto → buffer 只用了保留的 API）；uikit-example SPM 构建通过 |
| react-native-linear-gradient | 2.8.3 → 3.0.0-beta.2 | 3.x 守卫写法正确；room peer 对齐为 `>=3.0.0-beta.0`；room-example SPM 构建通过 |

## SPM 模式下用户如何应用补丁

补丁文件在 `docs/troubleshooting/patches/`。两种用法：

**Yarn Berry（推荐）**：把补丁文件复制到自己项目的 `.yarn/patches/`，然后在 `package.json` 中把对应依赖改为 `patch:` 协议，例如：

```json
"react-native-device-info": "patch:react-native-device-info@npm%3A14.1.1#~/.yarn/patches/react-native-device-info-npm-14.1.1-901d2a3302.patch"
```

对传递依赖（无法直接改版本声明的），用 `resolutions`：

```json
"resolutions": {
  "react-native-fs@npm:2.20.0": "patch:react-native-fs@npm%3A2.20.0#~/.yarn/patches/react-native-fs-npm-2.20.0-a38fe24051.patch"
}
```

然后 `yarn install`。

**patch-package（npm 用户）**：把补丁文件改名复制到项目 `patches/` 目录，命名格式 `<包名>+<版本>.patch`（scoped 包去掉 `@`、`/` 保留），例如 `patches/react-native-device-info+14.1.1.patch`，并按 patch-package 常规方式接入（`postinstall: patch-package`）。

## 后续事项

1. 已向 5 个上游库提交 issue 请求迁移 `install_modules_dependencies`（device-info#1834、cameraroll#768、create-thumbnail#150、file-viewer#173、react-native-fs#1270）；上游修复后可提高 peer 最低版本并移除对应共享补丁。
2. react-native-audio-recorder-player 4.x 为 Nitro 重写，是否迁移需单独评估，当前维持 3.6.14 + 补丁。
3. 运行时嵌入修复目前需要每个 App 接入 `embed_spm_frameworks.rb`（见上节）。更省事的长期方案：在 `react-native-chat-sdk` 内仿照 RNFB 的 `firebase_spm.rb`，通过 `Pod::Installer` 钩子自动完成 App target 挂载，使用者零配置——涉及 SDK 仓库改动，待决策。

## 三方库最新版本 SPM 兼容性调研

见同目录 `ios-spm-third-party-latest.md`（调研各库最新版是否已免补丁支持动态框架/SPM；调研结论已执行，见 `docs/dev/spm-deps-upgrade-spec.md`）。
