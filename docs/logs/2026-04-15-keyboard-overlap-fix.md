# 键盘遮挡回归修复记录

日期：2026-04-15

## 问题现象

聚焦消息输入框后，输入区域被系统键盘遮挡，Android 会出现该问题, ios没有该问题。

## 回归历史

1. RN 0.76 阶段：ios和android两端键盘避让正常。
2. 升级到 RN 0.83 后：android出现输入组件被遮挡问题。

## 修改原则

- 不引入新的第三方库。
- 修改范围尽量控制在现有组件路径内，不额外扩散问题范围。
- 可以添加必要测试日志。
- 修改之后 react-native 0.76 可以正常运行（当前 0.83）

## 预期修复效果

- iOS：点击输入框后，输入区应始终位于键盘上方。
- Android：点击输入框后，输入区应始终位于键盘上方。
- emoji表情组件和键盘相互切换正常。

## 现状代码排查结论

### 1. 当前 Android 原生配置并没有丢

示例工程 AndroidManifest 里仍然是：

- `android:windowSoftInputMode="adjustResize"`

说明这次回归**不是因为 manifest 忘了配置 adjustResize**。

参考：
- `examples/uikit-example/android/app/src/main/AndroidManifest.xml:22`

### 2. MessageInput 自己又做了一层自定义键盘避让

当前消息输入区不是只依赖系统 `adjustResize`，还额外包了一层自定义 `KeyboardAvoidingView`：

- `packages/react-native-chat-uikit/src/biz/ConversationDetail/MessageInput.tsx:145`
- `packages/react-native-chat-uikit/src/ui/Keyboard/KeyboardAvoidingView.tsx:32`

Android 下当前使用的是：

- `behavior="height"`
- 监听 `keyboardDidShow` / `keyboardDidHide`
- 再自己计算 `bottom`，然后通过改高度做二次避让

也就是说，当前布局在 Android 上其实是：

- 原生窗口 `adjustResize`
- JS 自定义 `KeyboardAvoidingView(height)`
- 输入区自己的 emoji / extension 高度切换

这是一个**双重控制**模型。

### 3. 当前实现里最可疑的点

#### 可疑点 A：自定义 KeyboardAvoidingView 在 Android 上和 adjustResize 叠加

`KeyboardAvoidingView` 的计算逻辑来自旧版 RN 的改写，但它假设：

- 容器 frame
- 键盘 endCoordinates
- `keyboardVerticalOffset`

三者关系在 Android 上是稳定的。

但升级到 RN 0.83 后，这个前提很可能不再成立。尤其是在较新的 Android / targetSdk / edge-to-edge 语义下：

- 窗口本身可能已经 resize
- JS 侧再按旧公式做一次 height 收缩
- 结果就会出现“该收没收”或“算错基准”的情况

这类问题本质上不是简单的布局 bug，而是：

**RN 旧时期可工作的键盘规避经验公式，在 RN 0.83 + 新 Android 行为下失效了。**

#### 可疑点 B：Android 下使用 `behavior="height"`

当前 `MessageInput` 在 Android 上写死：

- `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`

而 `height` 模式本身就是最依赖“父布局高度基准稳定”的一种模式。只要根窗口、SafeArea、导航栏、系统栏、IME inset 的基准有变化，就最容易失真。

#### 可疑点 C：top 被当成 keyboardVerticalOffset 参与 Android 计算

`MessageInput` 把 screen safe area 的 `top` 直接作为：

- `keyboardVerticalOffset={top}`

而在自定义 `KeyboardAvoidingView` 中，会做：

- `keyboardY = keyboardFrame.screenY - keyboardVerticalOffset`

即使 `top` 在 iOS 上通常有意义，在 Android 上它是否应该参与当前这套公式，并不一定成立。尤其当屏幕已经 edge-to-edge、系统栏 inset 计算变化后，这个 offset 很可能会放大误差。

#### 可疑点 D：MessageInput 之外还有 emoji 高度切换逻辑

`MessageInput.hooks.tsx` 里还有一套：

- `keyboardHeight`
- `keyboardCurrentHeight`
- `emojiHeight`
- `onHeightChange?.(0 | 1)`

这里 `onHeightChange` 只是伪高度信号，不是真实像素值：

- `packages/react-native-chat-uikit/src/biz/ConversationDetail/MessageInput.hooks.tsx:591`

这意味着消息列表和输入区之间的联动，本身就比较脆弱，依赖“键盘状态判断正确”。只要 Android 键盘事件时序变了，列表和输入区的联动也会失步。

## 对“是不是 RN 0.83 / 0.76 对 Android 键盘处理不同导致”的判断

结论：**大概率是，而且不是单一点变化，而是整体语义变化导致旧方案失配。**

更准确地说，不应理解为“RN 0.83 单独引入了一个明显 bug”，而应理解为：

- RN 0.76 时代，这套“adjustResize + 自定义 KeyboardAvoidingView(height) + 手工 offset”还能凑巧工作。
- RN 0.83 及其对应的新 Android / targetSdk / edge-to-edge 环境下，这种旧方案对窗口高度、keyboard frame、safe area、system bar 的假设不再稳定。
- 所以回归暴露在 Android 输入区上。

也就是说，**根因更像“旧兼容策略依赖的隐含前提失效”，而不是单个属性写错。**

## 兼容 RN 0.76 与 RN 0.83 的修复思路

目标不是继续堆更多 if/else 去追事件，而是把 Android 键盘避让逻辑收敛成“单一事实来源”。

### 推荐方向：Android 只保留一套避让来源，不要双重调整

推荐优先级：

#### 方案 A（最推荐）

**Android 侧弱化/取消自定义 `KeyboardAvoidingView(height)` 对输入条主区域的二次避让，更多依赖系统窗口 resize；emoji 面板高度继续单独控制。**

核心思想：

- Android Activity 已经是 `adjustResize`
- 输入条主容器不要再用旧公式去改高度
- 只在 emoji / extension 这种“非系统键盘面板”场景下，用自己的高度逻辑

这条路线的优点：

- 与 RN 0.76 兼容性最好，因为 0.76 本来就能靠 adjustResize 正常工作
- 与 RN 0.83 也更稳，因为减少了对旧版 `KeyboardAvoidingView(height)` 公式的依赖
- 修改集中在现有 UIKit 组件内部，不需要新库

这条路线的实质，是把 Android 的键盘处理从：

- 系统 resize + JS 再 resize

收敛成：

- 系统 resize 负责真实键盘
- JS 高度逻辑只负责 emoji / 扩展菜单

#### 方案 B（保守备选）

如果不能完全拿掉 Android 上的自定义 `KeyboardAvoidingView`，则至少要把它改成**更弱侵入**的策略：

- Android 不再用 `height`
- 改成更接近位移/底部 padding 的方式
- 并且 Android 下不要直接使用 `top` 参与 `keyboardVerticalOffset` 计算，或者需要重新校准它的语义

因为 `height` 最依赖“父容器原始高度基准”稳定，而这正是升级后最可能变化的地方。

#### 方案 C（兜底诊断方案，不建议作为最终实现）

保留现有结构，但增加 Android 调试日志，比较以下值：

- 根容器 onLayout 高度
- MessageInput 外层 onLayout 高度
- keyboard event 的 `endCoordinates.height`
- 自定义 `KeyboardAvoidingView` 算出来的 `bottom`
- 输入框 focus 前后容器 pageY / height

这个方案适合先验证“是否发生了双重收缩 / 基准漂移”，但不适合作为最终修复。

## 更具体的实施建议（先思路，暂不改代码）

### 第一阶段：先验证根因

建议先验证两个实验结论：

1. **只保留 `adjustResize`，临时弱化 Android 的自定义 KeyboardAvoidingView 高度调整后，遮挡是否消失。**
2. **保留现有逻辑，但去掉 Android 下 `keyboardVerticalOffset=top` 后，遮挡是否缓解。**

如果实验 1 成立，基本可确认：

- 问题核心是“系统 resize”和“JS resize”叠加导致。

如果实验 2 成立，说明：

- Android 下 `top` 参与旧公式已经不可靠。

### 第二阶段：正式收敛 Android 逻辑

建议最终结构朝这个方向调整：

- iOS：继续保留当前键盘避让模式（问题不在 iOS）
- Android：
  - 输入条主区域尽量不做二次键盘避让
  - emoji/extension/voice 继续保留内部显隐高度逻辑
  - MessageList 与 MessageInput 的联动，尽量基于“面板是否打开”而不是“猜测键盘像素高度”

### 第三阶段：回归验证矩阵

至少验证以下组合：

- RN 0.76 + Android
- RN 0.83 + Android
- RN 0.83 + iOS
- 普通文本输入
- 键盘 -> emoji 切换
- emoji -> 键盘 切换
- 发送后关闭键盘
- 引用消息 / 编辑消息场景
- 多选模式切换

## 新增验证结论（2026-04-15 第二轮）

用户补充验证结果：

1. 在 `MessageInput.tsx` 中，已经尝试切换为 RN 0.83 自带的 `KeyboardAvoidingView`，Android 问题依旧存在。
2. 本次测试过程没有涉及 emoji 面板，因此可以排除 emoji 高度切换逻辑。
3. 最小复现操作非常纯粹：
   - 点击输入组件，获取焦点，弹出键盘
   - 点击空白区域，失去焦点，隐藏键盘
4. 因此可以进一步排除：
   - 不是 emoji 面板和键盘切换冲突导致
   - 不是当前自定义 `../../ui/Keyboard/KeyboardAvoidingView` 独有实现导致

这意味着问题层级需要继续上移，重点应放到：

- Android Activity 窗口如何处理 IME / WindowInsets
- `adjustResize` 在当前 RN 0.83 + Expo/RN 新架构 + edge-to-edge 环境下是否还按旧方式生效
- 根视图是否根本没有被系统正确 resize

## 对根因的重新收敛

在排除“自定义 KeyboardAvoidingView 实现错误”之后，当前最可疑根因变成：

### 根因候选 1：不是 MessageInput 组件问题，而是 Android 窗口级键盘处理语义变了

当前 example Android 工程里可以确认：

- `android:windowSoftInputMode="adjustResize"`
- `newArchEnabled=true`
- `edgeToEdgeEnabled=true`

参考：
- `examples/uikit-example/android/app/src/main/AndroidManifest.xml:22`
- `examples/uikit-example/android/gradle.properties:38`
- `examples/uikit-example/android/gradle.properties:47`

这三个条件组合在一起非常关键。

如果在 RN 0.83 所对应的新 Android 运行语义中：

- edge-to-edge 已开启
- 系统栏 / 导航栏 / IME inset 处理改成了新的窗口 inset 模式
- `adjustResize` 不再像旧版本那样可靠地推动 React 根视图重新布局

那么就会出现当前现象：

- 输入框获得焦点
- 键盘弹出
- 组件层无论换自定义 KAV 还是官方 KAV，问题都还在

因为真正没有动的是：**Activity 对根窗口的 resize 行为本身。**

### 根因候选 2：问题更像“窗口没有被正确 resize”，而不是“组件不会跟着动”

如果根视图没有因为 IME 出现而缩短高度，那么：

- MessageInput 只是老老实实待在底部
- 键盘直接覆盖到底部区域
- 这时不管包一层官方 KeyboardAvoidingView 还是自定义 KeyboardAvoidingView，都可能表现不正确

也就是说，**当前最优先怀疑的不是组件计算错误，而是 Android 窗口 resize 链路失效或语义变化。**

### 关于最初方案 A 的修正说明

第一轮分析里，方案 A 的原始表达是：

- Android 主输入条更多依赖系统 `adjustResize`
- JS 只管理 emoji / extension / voice

在当时它的隐含前提是：

- 系统 `adjustResize` 仍然可靠

但结合第二轮验证，这个前提现在变得不确定了。

所以，方案 A 不能再理解成“删掉自定义 KAV 就好了”。

更准确地说，方案 A 的真实含义应该是：

- **先证明当前 Android 窗口 resize 机制到底有没有工作**
- 如果根窗口没有正确 resize，那么问题不在 MessageInput 组件，而在 Activity / edge-to-edge / WindowInsets 这一层
- 只有在系统 resize 被证明可靠时，才谈得上“让 JS 少做事”

换句话说，当前优先级最高的工作不是改 MessageInput，而是确认：

**RN 0.83 当前这套 Android 宿主环境里，`adjustResize` 是否已经在 edge-to-edge 模式下失去旧版本语义。**

## 下一步排查重点（原因优先，不急着定实现）

按现在的信息，后续排查应该优先做下面几件事：

### 排查 1：确认问题是否由 `edgeToEdgeEnabled=true` 触发

因为这是当前环境里最像“0.76 能工作、0.83 不工作”的结构性差异之一。

如果关闭 edge-to-edge 后，键盘遮挡明显改善，那么根因基本就可以收敛为：

- Android 新版 edge-to-edge + IME/window inset 语义变化
- 导致 `adjustResize` 不再按旧模型工作

### 排查 2：确认根视图在键盘弹出前后是否真的变高/变矮

重点不是看 MessageInput 本身，而是看：

- ConversationDetail 根容器
- 屏幕根 SafeAreaView
- ReactActivity 内容区域

在键盘弹出前后，高度有没有实际变化。

如果根容器高度完全没变化，那么根因就很明确：

- 不是组件没响应
- 是窗口根本没 resize

### 排查 3：验证这是不是 example 宿主层问题，而不是 UIKit 组件问题

因为目前已知：

- Manifest 有 `adjustResize`
- 官方 KeyboardAvoidingView 也无效
- 复现不依赖 emoji

所以需要警惕：**问题可能主要出在 example app 的 Android 宿主配置，而不是 UIKit MessageInput 逻辑本身。**

## 根因确认（2026-04-15 第三轮，已验证）

### 已完成的关键验证

用户已明确验证：

1. 把 Android 工程中的 `edgeToEdgeEnabled=true` 改为 `edgeToEdgeEnabled=false` 后，重新构建运行，**键盘不再遮挡输入组件**。
2. 但这样做会引入新的界面问题，因此**不能把关闭 edge-to-edge 作为最终方案**。
3. 同时，`examples/product-uikit-demo/android` 属于 Expo 自动生成目录，**不适合把修改直接固化在生成产物里**。

### 结合前面诊断日志后的最终结论

此前诊断日志已经证明：

- `keyboardDidShow` / `keyboardDidHide` 事件能正常收到
- 但键盘弹出/收起过程中，`ConversationDetail` 根容器与 `MessageInput` 相关布局**没有发生 onLayout 变化**

这说明：

- **JS 层知道键盘弹出了**
- 但 **React 根视图没有因为键盘出现而被 Android 窗口系统自动 resize**

再结合“关闭 edge-to-edge 后问题消失”的验证，可以把根因正式收敛为：

## 最终根因

### 根因一句话

**在 RN 0.83 / Expo 当前 Android 宿主环境中，启用 `edgeToEdgeEnabled=true` 后，`adjustResize` 不再维持 RN 0.76 时期那种‘自动压缩根视图高度’的旧语义；因此底部输入区所在的 React 视图树没有随 IME 弹出而整体上移，最终被键盘覆盖。**

### 更准确地拆解

这次回归不是由以下因素直接导致：

- 不是 `MessageInput.tsx` 的普通布局写错
- 不是 emoji 面板切换导致
- 不是自定义 `KeyboardAvoidingView` 独有 bug
- 也不是 AndroidManifest 丢了 `adjustResize`

真正的问题是：

- Android 宿主开启了 `edgeToEdgeEnabled=true`
- 此时窗口与 IME 的关系从“旧式 resize 窗口”转向“基于 WindowInsets / IME Insets 的新语义”
- 在当前 RN 0.83 + Expo 生成宿主的运行表现里，`adjustResize` 已不足以保证 React 根视图自动缩小
- 所以 `MessageInput` 所在布局树根本没被顶上去

### 为什么 RN 0.76 正常，而 RN 0.83 出问题

可归纳为：

- RN 0.76 时期，对应项目宿主环境下，Android 键盘弹出时仍然更接近“旧版 adjustResize 模型”
- RN 0.83 升级后，叠加 Expo / New Architecture / edge-to-edge 环境，Android IME 与窗口 inset 语义发生了变化
- 旧版本里“默认自动顶起底部输入区”的前提不再成立

所以本质上是：

**不是单个组件回归，而是宿主窗口行为模型变了，导致原先依赖系统 resize 的底部输入区策略失效。**

## 这对后续修复意味着什么

### 重要边界结论 1

**单纯继续微调 `MessageInput` 内部的 `KeyboardAvoidingView` 参数，无法从根本上解决问题。**

原因是：

- 根视图都没有 resize
- 组件层只能收到键盘事件，却拿不到可靠的“窗口已缩小”结果
- 所以单靠组件内部小修小补，稳定性会很差

### 重要边界结论 2

如果不想修改 Expo 自动生成的 `android/` 目录，那么解决方案应该优先考虑：

- 是否能通过 Expo 配置层控制 edge-to-edge 行为
- 如果 Expo 配置层做不到，UIKit 就必须在 `MessageInput` 这一层**主动适配 edge-to-edge + IME inset 语义**，而不能再假设宿主窗口会自动 resize

### 重要边界结论 3

最终要兼容的不是“有无 KeyboardAvoidingView”，而是两类 Android 运行模型：

1. **旧模型**：键盘弹出时，窗口会自动 resize
2. **新模型**：edge-to-edge 下，窗口不一定 resize，需要依赖 IME inset / 键盘高度自行调整底部输入区

也就是说，后续 `MessageInput` 的可靠方案必须同时兼容：

- RN 0.76 旧模型
- RN 0.83 新模型

## 当前已确认、不需要再重复怀疑的点

以下结论已经可以视为阶段性确定事实：

- `adjustResize` 配置存在，但在 `edgeToEdgeEnabled=true` 场景下不足以解决问题
- 问题根源主要不在 emoji
- 问题根源主要不在自定义 KeyboardAvoidingView
- `edgeToEdgeEnabled=true` 是问题触发条件之一，而且已经被实验直接验证

## 后续讨论的正确顺序

从现在开始，讨论顺序应该是：

1. **先保留这份根因结论**
2. 再判断是否可以通过 Expo `app.json` / config plugin 的方式控制 edge-to-edge 配置
3. 如果不能可靠通过 Expo 配置解决，就再设计 `MessageInput` 在 edge-to-edge + 非 resize 窗口模型下的兼容方案

也就是说：

**当前“原因”已经明确，后面讨论的是“该在哪一层修”和“如何兼容新旧两种 Android 键盘模型”。**

## 本轮结论摘要

一句话总结：

> 这次 RN 0.83 Android 键盘遮挡问题，根因已经确认：`edgeToEdgeEnabled=true` 改变了 Android 宿主窗口与 IME 的交互模型，导致 `adjustResize` 不再像 RN 0.76 阶段那样自动顶起 React 根视图；因此底部 `MessageInput` 布局没有上移，最终被键盘覆盖。
