# 三方库最新版本 SPM 模式兼容性调研

> 调研时间：2026-11-24。前置记录见同目录 `ios-spm-support.md`。
>
> 「SPM 模式」定义：宿主 App 以 `USE_FRAMEWORKS=dynamic pod install` 集成（HyphenateChat 经 `spm_dependency` 走 SPM）。除 RNFB 外，下列库本身仍以 pod 形式集成，调研问题是：**最新版在动态框架 + 预编译 RNCore 下是否免补丁编译通过**。

## 结论总表

| 包 | 现用版本 | npm 最新 | 最新版免补丁？ | 说明 |
|---|---|---|---|---|
| react-native-file-viewer | 2.1.5 | 2.1.5 | ❌ | 已是最新，仍需补丁 |
| react-native-create-thumbnail | 2.2.0 | 2.2.0 | ❌ | 已是最新，仍需补丁 |
| react-native-linear-gradient | 2.8.3 | 2.8.3 | ❌ | 已是最新，仍需补丁 |
| react-native-fs | 2.20.0 | 2.20.0 | ❌ | 已是最新，仍需补丁 |
| @react-native-camera-roll/camera-roll | 7.10.2 | 7.10.2 | ❌ | 已是最新，仍需补丁 |
| react-native-device-info | 14.1.1 | 15.0.2 | ❌ | 最新版 podspec 仍只有 `s.dependency 'React-Core'`，无 `install_modules_dependencies` |
| react-native-image-crop-picker | 0.42.0 | 0.52.0 | ⚠️ 大概率 | 最新版已加 `install_modules_dependencies(s)`，但仍保留显式 `React-Core`/`React-RCTImage` 依赖，需实测确认 |
| react-native-quick-base64 | 2.2.2 | 3.0.2 | ✅ | 最新版已正确使用 `install_modules_dependencies(s)`；但 2→3 是 major 升级，JS API 破坏性需确认 |
| react-native-audio-recorder-player | 3.6.14 | 4.5.0 | ⚠️ 重写 | 4.x 整体重写为 Nitro 模块（podspec 更名 `NitroAudioRecorderPlayer`），已用 `install_modules_dependencies`；属破坏性重写，迁移成本高，不是简单升级 |
| @react-native-firebase/app + messaging | 23.8.6 | 27.1.1 | ✅ 根本性解决 | 见下节 |

## RNFB（重点）

RNFB 在 26.1 起发生方向性变化（与旧版「只支持静态框架」完全相反）：

- **Firebase Apple SDK 默认改走 SPM**（`spm_dependency` 指向 `https://github.com/firebase/firebase-ios-sdk.git`），v27 起 SPM 是唯一方式；
- **要求 `use_frameworks! :linkage => :dynamic`** 和 RN ≥ 0.75 —— 恰好就是 SPM 模式本身，与我们的集成方向天然一致；
- podspec 已自带 `CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES=YES` 和 `install_modules_dependencies`（旧版缺这些，正是我们打变通的原因）；
- 要求 New Architecture（demo 是 RN 0.83，满足）；Firebase iOS SDK 13.1.1，iOS 部署目标 15.0（demo 15.1，满足）。

升级到 27.x 后，demo 在 SPM 模式下的 RNFB 阻塞预计原生消失，Podfile 与 `patch-ios-build.js` 里两段 RNFB 变通可删除。代价与风险：

- 23.8.6 → 27.1.1 跨 4 个 major，JS API 与原生行为破坏性变更需逐版本核对并实测推送链路；
- 社区反馈动态框架会暴露其他老式 pod 的同类问题（[discussions-and-proposals#1017](https://github.com/react-native-community/discussions-and-proposals/issues/1017)），即我们 9 个补丁处理的同一类问题——demo 直接依赖已覆盖，间接新增依赖需留意；
- 混合生态注意：凡自带 Firebase pod 依赖的其他库（如 customerio 旧版）会与 RNFB 的 SPM Firebase 产生重复集成（[customer.io changelog](https://docs.customer.io/integrations/sdk/react-native/whats-new/changelog/)）。demo 无此类库。

## 参考来源

- npm 最新版本号：`npm view <pkg> version`（2026-11-24）
- 各 podspec 原文：unpkg（`https://unpkg.com/<pkg>@<ver>/*.podspec`）
- RNFB SPM 要求：[npm @react-native-firebase/app](https://www.npmjs.com/package/@react-native-firebase/app)、[react-native-google-mobile-ads#872](https://github.com/invertase/react-native-google-mobile-ads/issues/872)、[react-native-firebase#9161](https://github.com/invertase/react-native-firebase/issues/9161)

## 对补丁策略的建议

1. **升级可去补丁**：image-crop-picker（→0.52.0，需实测）、quick-base64（→3.0.2，需确认 API）；
2. **升级可解锁 demo**：RNFB → 27.x（解决 demo SPM 验证的正路，替代「打地鼠」方案 B）；
3. **补丁保留**：file-viewer、create-thumbnail、linear-gradient、rn-fs、camera-roll、device-info（上游未修复，最新版仍需补丁）；
4. **单独决策**：audio-recorder-player 4.x 是 Nitro 重写，是否迁移需单独评估，与 SPM 无关时建议维持 3.6.14 + 补丁。
