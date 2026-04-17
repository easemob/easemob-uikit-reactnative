# 键盘遮挡回归修复记录

日期：2026-04-17

## 第二阶段验证结论

结论如下：

- Android 11–14（API 30–34）+ `edgeToEdgeEnabled=false`：系统会自动 resize window。
- Android 11–14（API 30–34）+ `edgeToEdgeEnabled=true`：系统不会自动 resize window。
- Android 15+（API 35+）+ 任意模式：系统都不会自动 resize window。

## 判断矩阵

| Android 版本 | `edgeToEdgeEnabled=false` | `edgeToEdgeEnabled=true` |
|------|------|------|
| Android 11–14（API 30–34） | 自动 resize | 不自动 resize |
| Android 15+（API 35+） | 不自动 resize | 不自动 resize |

## 最终结论

- 只有 `Android API < 35` 且 `edgeToEdgeEnabled=false` 时，系统会自动 resize。
- 其他 Android 场景都需要应用自己做键盘补偿。

## 对后续修复的意义

- 不能把关闭 `edgeToEdgeEnabled` 当作通用修复方案。
- Android 键盘避让方案应默认按“应用自行补偿”设计。
- 只有 `Android API < 35` 且 `edgeToEdgeEnabled=false` 可以视为旧模型兼容分支。

## 当前实现方案补充

基于当前 UIKit 会话页输入框的 WIP 改动，后续实现按以下思路推进：

1. 在 Android 侧新增 native 能力，向 JS 暴露当前宿主应用的 `edgeToEdgeEnabled` 值。
2. 在 JS 侧统一使用 `Android API 版本 + edgeToEdgeEnabled` 判断是否需要手动键盘补偿。
3. 保持当前会话页输入框的 Android 渲染路径不变，继续使用 `View + paddingBottom` 作为手动补偿承载方式；iOS 继续使用现有 `KeyboardAvoidingView` 路径。
4. 手动补偿判定规则明确为：
   - `Android >= 35`：始终手动补偿。
   - `Android < 35 && edgeToEdgeEnabled=true`：手动补偿。
   - `Android < 35 && edgeToEdgeEnabled=false`：不做手动补偿，由系统 resize 接管。
5. Android 是否需要手动补偿的最终判断收敛到键盘高度相关 hook 中，业务层只消费最终 offset，不重复分散判断。

## 第二阶段最终落地结果

### 修改文件

- `packages/react-native-chat-uikit/android/src/main/java/com/chatuikit/ChatUikitEnvironmentModule.kt`
- `packages/react-native-chat-uikit/android/src/main/java/com/chatuikit/ChatUikitPackage.kt`
- `packages/react-native-chat-uikit/src/hook/useKeyboardHeight.tsx`
- `packages/react-native-chat-uikit/src/biz/ConversationDetail/MessageInput.hooks.tsx`
- `packages/react-native-chat-uikit/src/biz/ConversationDetail/MessageInput.tsx`

### Android native 侧最终方案

Android native 不再通过 `fitsSystemWindows` 反推是否开启 edge-to-edge，而是直接读取宿主应用 `BuildConfig` 中的 `IS_EDGE_TO_EDGE_ENABLED`。

原因：

- `fitsSystemWindows` 只是 view 属性，不能稳定代表宿主窗口是否真正启用了 edge-to-edge。
- 实际验证中，Expo 55 Android 宿主会通过 `android/gradle.properties` 中的 `edgeToEdgeEnabled` 控制运行行为。
- 因此，直接读取宿主 `BuildConfig` 对应字段更接近宿主真实配置。

当前 native 逻辑要点：

- 读取 `sdkInt`
- 通过反射读取 `${activity.packageName}.BuildConfig.IS_EDGE_TO_EDGE_ENABLED`
- 若字段不存在，则按 SDK 做兜底：
  - `sdkInt >= 35` → 默认 `true`
  - `sdkInt < 35` → 默认 `false`
- 若读取异常，当前实现按保守策略返回 `true`

这一策略兼顾了两类场景：

- Expo 55 / 新宿主：优先读取真实宿主配置
- 旧宿主 / 低版本：字段不存在时，尽量贴近 Android 11–14 的传统默认行为

### JS 侧最终判定规则

`useKeyboardHeight.tsx` 中统一输出最终补偿结论：

- `shouldCompensateKeyboard`
- `keyboardCompensationHeight`

Android 规则为：

- `sdkInt >= 35` → 手动补偿
- `sdkInt < 35 && edgeToEdgeEnabled=true` → 手动补偿
- `sdkInt < 35 && edgeToEdgeEnabled=false` → 不手动补偿

其中：

- `keyboardCurrentHeight` 保留为原始键盘事件高度
- `keyboardCompensationHeight` 表示最终应被业务层消费的补偿高度
- 当不需要补偿时，`keyboardCompensationHeight = 0`

### 业务层消费方式

- `MessageInput.tsx` 保持原有平台分支：
  - iOS 继续使用 `KeyboardAvoidingView`
  - Android 继续使用 `View + paddingBottom`
- `MessageInput.hooks.tsx` 中：
  - `androidKeyboardAvoidOffset` 改为消费 `keyboardCompensationHeight`
  - emoji / extension 面板高度也复用同一套最终键盘高度来源，避免面板与输入区出现规则漂移

### 验证结果

已完成以下验证：

1. Android 11–14 + `edgeToEdgeEnabled=false`
   - 系统 resize 生效
   - 输入框不再重复上移
   - emoji / extension 面板高度正常
2. Android 11–14 + `edgeToEdgeEnabled=true`
   - UIKit 手动补偿生效
   - 输入框不被键盘遮挡
   - emoji / extension 面板高度正常
3. Android 15+
   - 按 UIKit 手动补偿处理
4. iOS
   - 现有输入框与键盘避让行为保持不变

### 当前状态

第二阶段问题已解决。

当前结论可以作为后续 Android 会话页键盘避让的基线规则：

- 只有 `Android API < 35 && edgeToEdgeEnabled=false` 走系统 resize 模型
- 其他 Android 场景统一走 UIKit 手动补偿模型
