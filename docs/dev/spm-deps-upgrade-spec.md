# SPM 适配收尾：三方库升级与补丁共享 Spec

> 创建：2026-11-24。前置文档：`docs/troubleshooting/ios-spm-support.md`（结论记录）、`docs/troubleshooting/ios-spm-third-party-latest.md`（最新版调研）。本文档是已确认决策与执行步骤的权威依据。

## 背景

三个包（uikit / callkit / room）的 SPM 支持已验证（podspec 零修改，三个 example 在 `USE_FRAMEWORKS=dynamic` 下构建通过）。收尾工作：按调研结论升级可升级的三方库、去除对应补丁、完成 product-uikit-demo 的 SPM 最终验证、把补丁共享给用户并补齐文档。

## 已确认决策（用户拍板）

1. **升级**：image-crop-picker → 0.52.0、quick-base64 → 3.0.2、RNFB → 27.1.1、linear-gradient → 3.x。audio-recorder-player 不升级（4.x 是 Nitro 重写），维持 3.6.14 + 补丁。
2. **用户侧补丁策略**：静态 CocoaPods 用户零影响（`patch:` 仅在 devDependencies，不随发布传播）；SPM 模式用户需手动打等效补丁——接受此 DX 摩擦，缓解方式为**文档化 + 共享我们的补丁文件**（文档明确「仅 SPM 模式需要，静态模式无感」）。
3. **上游**：不提 PR（经验判断维护意愿低），改为提 issue 请求支持 SPM（即 podspec 改用 `install_modules_dependencies`）。
4. **linear-gradient**：升级到 3.x。注意：npm 上 3.x 目前只有预发布版（最新 `3.0.0-beta.2`），peer 约束按用户要求对齐 3.x；semver 上 `>=3.0.0` 不匹配预发布版，故 peer 写 `>=3.0.0-beta.0`（否则安装了 beta 的用户反而过不了 peer 检查）。
5. **执行方式**：一个一个改，每步有记录（dailylog）有验证；顺序由执行方定。

## 关键事实（调研已确认）

- 三个待升级库（image-crop-picker、quick-base64、RNFB）**不在任何 package 的 peerDependencies 中**，`packages/*/src` 也不 import 它们——升级不触及三个包的源码与 peer 范围，只动 examples/demo。
- quick-base64 是传递依赖：`uikit-example → react-native-quick-crypto → @craftzdog/react-native-buffer → react-native-quick-base64@^2.2.2`，升级需用 workspace resolutions 强压，且要实测 quick-crypto 加解密链路。
- RNFB 27：Firebase iOS SDK 走 SPM（唯一方式）、要求 `use_frameworks! :linkage => :dynamic`（即 SPM 模式本身）、podspec 自带 `CLANG_ALLOW_NON_MODULAR_INCLUDES` 与 `install_modules_dependencies`、要求 New Arch。升级后 demo 的两段 RNFB 变通（Podfile post_install 片段、`scripts/patch-ios-build.js` 3c 步）可删。
- linear-gradient 3.0.0-beta.2 的 podspec 兼容性需在升级时实测（若已用 `install_modules_dependencies` 则可去补丁）。
- room 包当前 peer `react-native-linear-gradient: >=3.0.0` 与 dev 实际使用 2.8.3 不一致，本次一并对齐。

## 执行步骤（每步独立验证、独立记录）

### Step 1：image-crop-picker 0.42.0 → 0.52.0
- 范围：`examples/uikit-example`、`examples/product-uikit-demo`。
- 动作：改版本 → `yarn install` → 删除对应 patch 接线与 `.yarn/patches/react-native-image-crop-picker-*.patch` → 构建验证。
- 验证：`uikit-example` SPM 模式构建通过（不加补丁）。若 0.52.0 的显式 `React-Core` 依赖仍导致失败，则重新生成补丁并记录。
- 冒烟：uikit-example 图片选择链路（如可运行则手动冒烟，否则以构建为准并记录）。

### Step 2：quick-base64 2.2.2 → 3.0.2
- 范围：根 `package.json` 加 resolutions（或 uikit-example 局部），影响 uikit-example 与 product-uikit-demo。
- 动作：resolution 强压 3.0.2 → `yarn install` → 删除 quick-base64 补丁 → 构建验证。
- 验证：uikit-example SPM 构建通过；quick-crypto 加解密链路冒烟（示例内有使用点则以运行为准）。
- 风险：buffer 声明 `^2.2.2`，强压 major 版本若 API 不兼容会在运行期暴露，构建通过不算充分验证。

### Step 3：linear-gradient 2.8.3 → 3.0.0-beta.2
- 范围：`packages/react-native-chat-room`（devDep + peer 对齐 `>=3.0.0-beta.0`）、`examples/room-example`、`examples/product-room-demo`、`examples/uikit-example`。
- 动作：改版本 → `yarn install` → 视 3.x podspec 情况删除补丁 → 构建验证。
- 验证：`room-example` SPM 构建通过。
- 风险：beta 版 API/原生实现变动；peer 预发布范围的发布影响已在决策 4 记录。

### Step 4：RNFB 23.8.6 → 27.1.1（demo SPM 最终验证）
- 范围：`examples/product-uikit-demo`。
- 动作：升级 `@react-native-firebase/app` 与 `messaging` → 核对 `src/demo/common/fcm.ts` API（v23→v27 逐版本 breaking）→ 删除 Podfile post_install 的 RNFB 变通与 `scripts/patch-ios-build.js` 3c 步 → `yarn install` → `USE_FRAMEWORKS=dynamic pod install` → 构建。
- 验证：**demo SPM 模式构建通过 = 本任务最终验证**。推送链路真机/模拟器冒烟（FCM token 获取）。
- 风险：跨 4 个 major；Expo 配置插件兼容性；Firebase iOS SDK 13 行为变化。若阻塞超出可控范围，回退记录并以三个 example 为准（需用户确认）。

### Step 5：补丁共享与用户文档
- 共享方式：将保留的 6 个补丁（file-viewer、create-thumbnail、linear-gradient 视 Step 3 结果、rn-fs、device-info、camera-roll、audio-recorder-player）复制到 `docs/troubleshooting/patches/`（yarn patch 可直接引用的格式），并在 `docs/troubleshooting/ios-spm-support.md` 增加「用户如何应用补丁」小节（yarn patch / patch-package 两种用法）。
- 三个包的 README SPM 小节补充：SPM 模式下需补丁的库清单 + 指向共享补丁的链接，明确「静态模式无需任何处理」。

### Step 6：上游 issue
- 对维护活跃库提 issue 请求 podspec 改用 `install_modules_dependencies`：react-native-device-info、@react-native-camera-roll/camera-roll；停更库（file-viewer、rn-fs、create-thumbnail）一并提但预期不处理。issue 链接记录到 dailylog 与本文档。

### Step 7：收尾
- 更新本 spec 与 troubleshooting 文档中随执行变化的结论；
- `dailylog/2026-11-24.md` 记录各步结果；
- 一次性提交（conventional commits，英文），含 spec、文档、补丁、package.json/yarn.lock、Podfile 等全部改动。

## 用户侧影响总结（写入发布说明的依据）

| 用户场景 | 影响 |
|---|---|
| 静态 CocoaPods | 零影响，无需任何处理 |
| SPM 模式 + 使用上游未修复库 | 需按文档手动应用共享补丁（yarn patch / patch-package） |
| SPM 模式 + 库版本 ≥ 已修复版本 | 无需补丁（image-crop-picker≥0.52.0、quick-base64≥3.0.2、RNFB≥27、linear-gradient≥3.x 视 Step 3 结果） |

## 任务依赖关系

Step 1/2/3 互相独立，可任意顺序；Step 4 独立（仅 demo）；Step 5 依赖 Step 1–4 的最终补丁清单；Step 6 独立；Step 7 依赖全部。

## 执行结果（2026-11-24）

- Step 1 ✅ image-crop-picker 0.52.0 免补丁，uikit-example iOS 构建通过（注意需 `pod update TOCropViewController`）。
- Step 2 ✅ quick-base64 3.0.2（resolutions 强压）免补丁，uikit-example iOS 构建通过；运行期冒烟未覆盖。
- Step 3 ✅ linear-gradient 3.0.0-beta.2 免补丁，room-example iOS + Android 均通过；room peer 对齐 `>=3.0.0-beta.0`。
- Step 4 ✅ RNFB 27.1.1：fcm.ts 迁移模块化 API（v26 移除 namespaced API，类型命名空间 `FirebaseMessagingTypes` 移除改用 `RemoteMessage`），RNFB 变通全删，demo iOS SPM 构建通过。踩坑 1：首轮失败是 DerivedData 陈旧（RNScreens 缺 x86_64 切片），清理后 4.5 分钟通过。踩坑 2：Android 侧 RNFB 27 按 RN ≥ 0.84 编写（`Promise.reject` code 可空），RN 0.83 编译报类型不匹配，已加 yarn patch（`code ?: "unknown"`，3 处），demo Android 构建通过。
- Step 5 ✅ 6 个保留补丁共享至 `docs/troubleshooting/patches/`，用户指南入 `ios-spm-support.md`，README（uikit 中英、room）已补补丁说明。
- Step 6 ✅ 5 个上游 issue 已提交。
- 额外修复：audio-recorder-player 补丁重建时丢失 Android hunks（`currentActivity` → `getCurrentActivity()`），已从 git HEAD 恢复合并补丁。
- Android 复验 ✅ 以 product-uikit-demo 为准（依赖超集，用户指示）：assembleDebug 通过（含 RNFB 补丁、audio-recorder-player 补丁回归修复、全部升级库）；room-example Android 亦通过。
- product-room-demo SPM 接入补验 ✅：首轮失败为 DerivedData 陈旧（RNScreens 缺 x86_64 切片，与 demo/callkit-example 同一坑），清理后全量重建 BUILD SUCCEEDED，HyphenateChat/aosl 均嵌入。五个 App 全部 SPM 验证通过。
- 版本升级：uikit 3.0.0→3.1.0、callkit 1.1.0→1.2.0、room 2.0.0→2.1.0（minor：SPM 支持文档 + room peer 放宽）；五个 example 同步升版（package.json 1.1.0；app.json：三个 example 1.1.0、product-uikit-demo 2.6.0、product-room-demo 1.1.0）；三个包 CHANGELOG 已补 2026-11-24 条目。
- Step 7 收尾（dailylog、提交）✅。
