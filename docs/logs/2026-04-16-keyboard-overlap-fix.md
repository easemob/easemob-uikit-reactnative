# 键盘遮挡回归修复记录

日期：2026-04-16

## 修复策略确认稿（2026-04-16）

基于当前已确认的根因，后续修复不再优先尝试通过关闭 `edgeToEdgeEnabled` 来规避问题，而是把重点放在 UIKit 组件自身对 Android 新旧键盘模型的兼容上。

### 已确认的策略取向

1. **不把 `edgeToEdgeEnabled=false` 作为最终方案。**
   - 虽然它已经被验证可以暂时消除遮挡，但会引入新的界面问题。
   - 此外，example / demo 中部分 Android 宿主目录属于生成产物，不适合把宿主级修改直接固化为长期方案。
   - 因此，关闭 edge-to-edge 只能作为定位问题的实验手段，不能作为 UIKit 的正式交付方案。

2. **Android 输入区优先采用 `bottom padding` / `bottom margin` 一类布局调整方式，不采用 `translateY`。**
   - `translateY` 更偏视觉位移，容易和点击区域、布局测量、面板切换产生语义分离。
   - 底部 padding / margin 更接近“真实占位”，更利于输入区、消息列表和附加面板之间保持一致布局关系。

3. **最终方向仍然是兼容 Android 新旧两种窗口模型。**
   - 旧模型：键盘弹出时，根窗口会自动 resize。
   - 新模型：开启 edge-to-edge 后，根窗口不一定 resize，需要组件依据键盘高度主动调整底部布局。
   - 但由于这个兼容判断较复杂、验证成本较高，不在第一阶段一次性做完。

### 分阶段执行原则

#### 第一阶段：先修复 RN 0.83 + `edgeToEdgeEnabled=true` 的主问题

第一阶段目标非常聚焦：

- 只解决当前已确认的主回归问题；
- 优先覆盖 **RN 0.83 + Android + `edgeToEdgeEnabled=true`**；
- 在 `MessageInput` 附近完成修复，不依赖关闭 edge-to-edge；
- 调整方式优先使用键盘高度驱动的底部 padding / margin，而不是 `translateY`。

这一阶段的核心思想是：

- 既然当前宿主窗口在 edge-to-edge 下不会可靠 resize；
- 那么输入组件就不再等待系统把自己“顶上去”；
- 而是在 Android 键盘显示时，依据键盘高度主动补偿底部占位。

#### 第二阶段：再验证 `edgeToEdgeEnabled=false` / 旧模型下是否存在兼容问题

第二阶段不预设一定要改代码，而是以验证为先：

- 检查第一阶段方案在 `edgeToEdgeEnabled=false` 下是否产生双重避让、过度上移或布局错位；
- 如果没有问题，则说明第一阶段方案已经自然兼容新旧模型；
- 如果存在问题，再进一步补充“更巧妙的判断逻辑”，识别当前到底属于“窗口已 resize”还是“窗口未 resize”的运行模型，再决定是否启用底部补偿。

也就是说，第二阶段的目标不是马上增加复杂逻辑，而是：

- **先用最小实现修复主问题；**
- **再决定是否真的有必要为旧模型增加分支判断。**

### 关于“更巧妙判断”的原则

当前已经明确，希望最终不是简单写死版本判断或配置判断，而是尽量根据运行时现象做判断，例如：

- 键盘弹出前后，根容器 / 关键容器高度是否发生变化；
- 是否已经出现系统 resize；
- 只有在“窗口未 resize”的情况下，才启用组件自身的底部补偿。

但这类判断牵涉到：

- 布局测量时机；
- Android 键盘事件与 `onLayout` 的先后顺序；
- 新旧 React Native / 宿主环境差异；
- emoji / extension / 编辑 / 引用等联动场景；

因此它应当作为**第二阶段的增强兼容方案**来评估，而不是第一阶段的交付前提。

### 当前阶段的实施建议

接下来若进入实现，建议按以下顺序推进：

1. 在 `MessageInput` 附近实现 Android 键盘高度驱动的底部占位调整；
2. 第一轮只面向 `edgeToEdgeEnabled=true` 场景验证遮挡是否消失；
3. 再回头验证 `edgeToEdgeEnabled=false` 是否存在副作用；
4. 只有在旧模型确实出现问题时，再补充运行时判断逻辑。

### 修复原则补充（2026-04-16）

在当前阶段，正式修复还应遵循以下原则：

1. **不引入新的第三方库。**
   - 优先基于现有 React Native 能力、现有 UIKit 组件结构和已有键盘事件机制完成修复。
   - 避免为当前问题额外扩大依赖面，减少维护和兼容成本。

2. **最小修改，尽量不要影响现有无关处理。**
   - 修改范围尽量收敛在当前键盘遮挡相关路径内，例如 `MessageInput`、相关 hooks、必要的容器联动逻辑。
   - 不因为修复 Android 键盘遮挡问题而顺带重构无关逻辑。
   - 不轻易改动 emoji、extension、消息列表联动等已确认不是当前主因的部分，除非验证表明必须联动调整。

3. **iOS 当前没有问题，尽量不要修改。**
   - iOS 现有键盘避让表现正常，应优先保持现状。
   - 第一阶段实现应尽量把影响范围限制在 Android 分支，避免把 Android 的修复复杂度带到 iOS。
   - 只有在共享代码路径无法避免时，才谨慎评估是否需要做最小范围调整。

### 关于调试日志

在实施过程中，允许在相关组件中添加必要的测试日志，方便观察和验证问题。建议覆盖以下关键信息：

- 键盘显示 / 隐藏事件触发时机（`keyboardDidShow` / `keyboardDidHide` / `keyboardWillShow` / `keyboardWillHide`）
- 键盘事件中的 `endCoordinates.height`、`screenY` 等关键数值
- 根容器 / `MessageInput` 外层容器在键盘弹出前后的 `onLayout` 宽高
- 当前应用的底部补偿值（padding / margin）
- 当前运行模型的判断结果（后续若引入自动识别逻辑时）

关于日志使用的约束：

- 日志应集中、可识别，便于定位（例如统一前缀）；
- 不要在正式发布版本中输出过多噪声，必要时以开关或 debug 模式控制；
- 验证完成后，视情况保留少量关键日志或移除。

### 当前确认结论

本次策略确认后，后续讨论和实现将遵循以下共识：

- **最终正式方案不依赖关闭 edge-to-edge；**
- **Android 优先使用 bottom padding / margin 语义来做输入区底部补偿；**
- **先修复 RN 0.83 + edge-to-edge 主问题，再处理旧模型兼容；**
- **更复杂的新旧模型自动识别逻辑，放在第二阶段按需引入；**
- **允许在实施过程中添加必要的测试日志，用于观察和验证问题，验证完成后再收敛。**

## 第一阶段实施记录（2026-04-16）

### 修改范围

仅涉及两个文件，iOS 路径完全不变：

- `packages/react-native-chat-uikit/src/biz/ConversationDetail/MessageInput.tsx`
- `packages/react-native-chat-uikit/src/biz/ConversationDetail/MessageInput.hooks.tsx`

辅助修改（仅加日志）：

- `packages/react-native-chat-uikit/src/hook/useKeyboardHeight.tsx`

### 核心改动

#### 1. Android 不再使用 `KeyboardAvoidingView`，改为键盘高度驱动的 `paddingBottom`

**MessageInput.tsx** 中，按 `Platform.OS` 拆分了渲染路径：

- **iOS**：保持原有 `KeyboardAvoidingView` + `behavior='padding'` + `keyboardVerticalOffset={top}`，完全不变。
- **Android**：去掉 `KeyboardAvoidingView`，改为普通 `View`，通过 `paddingBottom` 动态补偿键盘高度。

#### 2. 补偿值计算

**MessageInput.hooks.tsx** 中新增 `androidKeyboardAvoidOffset`：

```typescript
const androidKeyboardAvoidOffset = React.useMemo(() => {
  if (Platform.OS !== 'android') {
    return 0;
  }
  if (keyboardCurrentHeight <= 0) {
    return 0;
  }
  return Math.max(keyboardCurrentHeight, 0);
}, [keyboardCurrentHeight]);
```

关键决策：**不减去 `bottom`（safe area bottom inset）**。

#### 3. 为什么不减 `bottom`

第一轮实现曾使用 `keyboardCurrentHeight - (bottom ?? 0)`，实际运行后发现输入区仍被遮挡一截，遮挡高度恰好等于 `bottom` 值。

调试日志确认：

```
[KBAvoid] keyboardDidShow: height: 282 screenY: 492.86
[KBAvoid] MessageInput metrics: bottom: 48 keyboardCurrentHeight: 282 androidKeyboardAvoidOffset: 234
```

- `keyboardDidShow.endCoordinates.height = 282` 已经是 React 视图层需要补偿的完整高度
- 再减去 `bottom = 48` 导致少补了底部系统导航栏高度
- 改为直接使用 `keyboardCurrentHeight` 后，补偿值正确

#### 4. 关于 `bottom`（safe area bottom inset）的结论

- `bottom` 来自 `useSafeAreaInsets().bottom`，由 `ConversationDetailScreen` 传入 `MessageInput`
- 在当前 Android edge-to-edge 环境下，它近似等于底部系统导航栏/手势区高度
- 但 `keyboardDidShow.endCoordinates.height` 返回的值已经包含了输入区需要补偿的完整区域
- 因此不应该从键盘补偿值中扣减 `bottom`
- 有底部导航栏的设备（`bottom > 0`）和没有底部导航栏的设备（`bottom = 0`）均不受影响，因为补偿值完全基于 `keyboardCurrentHeight` 运行时动态获取

### 验证结果

以下场景均已验证通过（`edgeToEdgeEnabled=true`）：

| 场景 | 结果 |
|------|------|
| iOS 模拟器 | 正常，输入区不被遮挡 |
| Android 模拟器（带底部导航栏） | 正常，输入区不被遮挡 |
| Android 真机（不带底部导航栏） | 正常，输入区不被遮挡 |

### 当前调试日志

以下位置添加了调试日志（统一前缀 `[KBAvoid]`），验证完成后可视情况收敛或移除：

- `useKeyboardHeight.tsx`：`keyboardDidShow` / `keyboardDidHide` 事件的 `endCoordinates` 详情
- `MessageInput.hooks.tsx`：`bottom`、`keyboardHeight`、`keyboardCurrentHeight`、`emojiHeight`、`androidKeyboardAvoidOffset` 汇总
- `MessageInput.tsx`：Android 分支输入区 `onLayout` 的 `width`、`height`、`paddingBottom`

### 待验证事项（第二阶段）

- [ ] `edgeToEdgeEnabled=false` 下是否存在双重避让或过度上移
- [ ] emoji 面板与键盘相互切换是否正常
- [ ] 引用消息 / 编辑消息场景
- [ ] 多选模式切换
- [ ] 不同第三方输入法（搜狗、Gboard 等）
- [ ] RN 0.76 兼容性（如需回归验证）

