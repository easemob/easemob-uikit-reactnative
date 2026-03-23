# CallKit UI 与信令解耦改造分析

## 文档目的

本文档用于指导 `packages/react-native-chat-callkit` 的 UI 解耦改造，目标是支持：

- 用户可自定义通话 UI。
- 信令与通话状态机逻辑保持不变或最小改动。
- 维持现有 `SingleCall` / `MultiCall` 的向后兼容。

适用范围：`packages/react-native-chat-callkit`。

---

## 结论摘要

### 结论 1：从实现层面看，UI 与信令是可独立的

当前代码里已经存在较清晰的边界：

- 信令与状态机核心在 `CallManagerImpl` + `CallSignallingHandler`。
- UI 事件消费接口是 `CallViewListener`。
- 来电入口事件是 `CallListener.onCallReceived`。

关键证据：

- `CallViewListener` 定义了 UI 所需通话事件（加入、离开、静音、结束、请求入会等）。
  - `packages/react-native-chat-callkit/src/call/CallViewListener.ts:7`
- `CallManagerImpl` 内部通过 `listener`（ViewListener）和 `userListener`（CallListener）分发事件。
  - `packages/react-native-chat-callkit/src/call/CallManagerImpl.ts:313`
  - `packages/react-native-chat-callkit/src/call/CallManagerImpl.ts:332`
  - `packages/react-native-chat-callkit/src/call/CallManagerImpl.ts:1241`
  - `packages/react-native-chat-callkit/src/call/CallManagerImpl.ts:1278`
  - `packages/react-native-chat-callkit/src/call/CallManagerImpl.ts:1581`

### 结论 2：从当前对外 API 看，用户无法“无改造”完整替换 UI

原因是对外暴露不足：

- 导出的 `CallManager` 接口过窄，仅含 `addListener/removeListener/setLogHandler`。
  - `packages/react-native-chat-callkit/src/call/CallManager.ts:3`
- `createManager` 未在 `call/index.ts` 导出（注释掉）。
  - `packages/react-native-chat-callkit/src/call/index.ts:7`
- `useCallkitSdkContext` 返回类型中的 `call` 被约束为 `CallManager`（窄接口），拿不到 `acceptCall/startCall/joinChannel` 等能力。
  - `packages/react-native-chat-callkit/src/contexts/CallkitSdkContext.tsx:5`
- 现有 `SingleCall/MultiCall` 直接依赖 `createManagerImpl()` 和内部能力，证明这些能力只在“内置 UI”路径可用。
  - `packages/react-native-chat-callkit/src/view/SingleCall.tsx:126`
  - `packages/react-native-chat-callkit/src/view/MultiCall.tsx:241`

### 总判断

- 架构上：可以实现“UI 可替换，信令不改”。
- 当前产品形态：不满足该能力，需要做 API 暴露与控制器层改造。

---

## 当前架构与耦合点

## 1. 初始化与单例管理

- `GlobalContainer` 通过 `createManagerImpl()` 获取全局单例并 `init`。
  - `packages/react-native-chat-callkit/src/containers/GlobalContainer.tsx:25`
  - `packages/react-native-chat-callkit/src/containers/GlobalContainer.tsx:28`
- `CallManagerFactory` 内部维护 `gCallManager` 单例。
  - `packages/react-native-chat-callkit/src/call/CallManagerFactory.ts:14`

影响：

- 优点：全局状态一致。
- 限制：UI 自定义方需要可控地接入同一 manager 实例，否则会出现状态源不一致。

## 2. 来电与呼出路径

### 来电路径

1. 信令消息进入 `CallSignallingHandler`。
2. `CallManagerImpl` 状态机处理后，通过 `userListener.onCallReceived` 通知业务层展示 UI。
   - `packages/react-native-chat-callkit/src/call/CallManagerImpl.ts:1581`
3. 目前示例中，业务层收到事件后直接展示 `SingleCall/MultiCall`。
   - `examples/callkit-example/src/screens/Home.tsx:348`
   - `examples/callkit-example/src/screens/Home.tsx:557`
   - `examples/callkit-example/src/screens/Home.tsx:639`

### 呼出路径

1. `SingleCall/MultiCall` 内部调用 `startSingleAudioCall/startMultiVideoCall...`。
   - `packages/react-native-chat-callkit/src/view/SingleCall.tsx:193`
   - `packages/react-native-chat-callkit/src/view/MultiCall.tsx:363`
2. 信令与状态机由 `CallManagerImpl._startCall` 执行。
   - `packages/react-native-chat-callkit/src/call/CallManagerImpl.ts:958`

## 3. UI 与控制逻辑耦合点

`BasicCall` 把按钮行为直接绑定到 manager 方法：

- 接听：`acceptCall`
- 挂断/取消/拒绝：`hangUpCall/cancelCall/refuseCall`
- 设备控制：`enableLocalAudio/enableLocalVideo/switchCamera/setEnableSpeakerphone`

证据：

- `packages/react-native-chat-callkit/src/view/BasicCall.tsx:245`
- `packages/react-native-chat-callkit/src/view/BasicCall.tsx:335`
- `packages/react-native-chat-callkit/src/view/BasicCall.tsx:306`

影响：

- 默认 UI 可直接使用。
- 外部自定义 UI 无法复用这些控制能力（因为外部拿到的是窄接口 `CallManager`）。

## 4. 事件机制是可复用的

`SingleCall/MultiCall` 本质上是 `CallViewListener` 的实现类：

- `onRequestJoin` 中调用 `joinChannel`
- `onSelfJoined/onRemoteUserJoined` 更新 UI
- `onRemoteUserMuteAudio` 等映射到展示态

证据：

- `packages/react-native-chat-callkit/src/view/SingleCall.tsx:356`
- `packages/react-native-chat-callkit/src/view/MultiCall.tsx:642`

这意味着只要外部 UI 能注册 `CallViewListener`，完全可以自行管理展示，不需改信令核心。

---

## 改造目标（建议）

定义一个“Headless Controller + Default UI”的稳定结构：

- Headless 层：`CallManager`（完整控制面 + 事件面）。
- UI 层：
  - 官方默认 UI：`SingleCall/MultiCall`。
  - 用户自定义 UI：通过同一 controller 接管渲染与交互。

目标不是重写状态机，而是开放并稳定化控制接口。

---

## 改造方案

## 阶段 A（最小可用，推荐先做）

目标：让用户不改信令逻辑即可自定义 UI。

改造内容：

1. 扩展 `CallManager` 接口，暴露 UI 必需能力。
2. 正式导出 `createManager`（或 `createManagerImpl` 的安全包装）。
3. 导出 `CallViewListener` 类型，允许外部 UI 挂载事件。
4. `useCallkitSdkContext` 返回更完整的 manager 类型（或新增 `useCallkitController`）。

建议新增/公开的方法集合（最小集）：

- 会话控制：
  - `createChannelId`
  - `startSingleAudioCall`
  - `startSingleVideoCall`
  - `startMultiAudioCall`
  - `startMultiVideoCall`
  - `acceptCall`
  - `refuseCall`
  - `hangUpCall`
  - `cancelCall`
- RTC 控制：
  - `initRTC` / `unInitRTC`
  - `joinChannel` / `leaveChannel`
  - `enableAudio` / `enableVideo`
  - `enableLocalAudio` / `enableLocalVideo`
  - `switchCamera`
  - `setEnableSpeakerphone`
  - `enableAudioVolumeIndication`
- 事件注册：
  - `addViewListener/removeViewListener`
  - `addListener/removeListener`

优点：

- 不改现有信令状态机。
- 默认 UI 不受影响。
- 外部 UI 直接可实现。

## 阶段 B（可维护性增强）

目标：降低默认 UI 对 `CallManagerImpl` 具体实现的依赖。

改造内容：

1. `BasicCall` 的 `manager` 类型从 `CallManagerImpl` 收敛到新接口（例如 `CallController`）。
2. `SingleCall/MultiCall` 支持可选 `controller` 注入。
3. 默认不传时仍使用内部单例（兼容现有行为）。

优点：

- 后续可替换实现。
- 更利于测试与 mock。

## 阶段 C（文档与示例）

目标：提供官方自定义 UI 路径。

改造内容：

1. 新增示例：纯自定义 UI（不依赖 `SingleCall/MultiCall`）。
2. 文档说明：来电场景、呼出场景、组件销毁时机、错误处理建议。
3. 迁移指南：旧用法 vs 新用法。

---

## 预计工作量

按一个熟悉项目的开发者估算：

- 阶段 A：1-2 人日
- 阶段 B：1-2 人日
- 阶段 C：0.5-1 人日
- 回归验证（callkit-example + product-uikit-demo）：0.5-1 人日

总计：3-6 人日。

---

## 风险与注意事项

## 1. 单例副作用风险

`createManagerImpl` 是全局单例，多个 UI 或多个页面同时注册 listener 时，需防止覆盖和泄漏。

建议：

- 明确 `addViewListener/removeViewListener` 生命周期。
- 在文档中要求自定义 UI 卸载时必须 `removeViewListener`。

## 2. 类型兼容风险

扩大 `CallManager` 会影响现有类型定义和使用方编译。

建议：

- 通过新增接口继承而非直接破坏式修改。
- 保留原 `CallManager` 语义，新增 `CallController`（更稳妥）。

## 3. 事件时序风险

`onCallReceived`、`onRequestJoin`、`onCallEnded` 时序由状态机控制，外部 UI 实现不当会出现：

- 未接听就销毁 UI。
- 重复 join/leave。

建议：

- 在示例中给出标准时序模板。
- 在关键方法加状态校验和 warning log。

## 4. 向后兼容风险

不能破坏当前示例行为：

- `callkit-example`
- `product-uikit-demo`

证据路径：

- `examples/callkit-example/src/screens/Home.tsx:348`
- `examples/product-uikit-demo/src/demo/common/AVView.tsx:328`

---

## 验收标准

满足以下条件即可认为“UI 已可独立”：

1. 不使用 `SingleCall/MultiCall` 也能完成 1v1 音视频、多人音视频完整流程。
2. 自定义 UI 仅通过公开 API 完成接听、拒绝、挂断、静音、切摄像头、免提。
3. 来电显示由 `onCallReceived` 驱动，入 RTC 由 `onRequestJoin` 驱动。
4. 信令相关核心文件无业务语义改写（仅允许非行为性整理）。
5. 旧示例不改或极小改动即可继续运行。

---

## 实施建议（落地顺序）

1. 先做阶段 A 的接口开放。
2. 写一个最小自定义 UI demo 验证接口完整性。
3. 再做阶段 B 的默认 UI 控制器收敛。
4. 最后补阶段 C 文档和迁移说明。

---

## 附：当前关键代码索引

- 对外导出入口：
  - `packages/react-native-chat-callkit/src/index.tsx:1`
- call 模块导出：
  - `packages/react-native-chat-callkit/src/call/index.ts:1`
- manager 工厂与单例：
  - `packages/react-native-chat-callkit/src/call/CallManagerFactory.ts:10`
- 窄接口 `CallManager`：
  - `packages/react-native-chat-callkit/src/call/CallManager.ts:3`
- 信令与 UI 事件桥：
  - `packages/react-native-chat-callkit/src/call/CallManagerImpl.ts:1241`
  - `packages/react-native-chat-callkit/src/call/CallManagerImpl.ts:1278`
  - `packages/react-native-chat-callkit/src/call/CallManagerImpl.ts:1581`
- 默认 UI 控制调用：
  - `packages/react-native-chat-callkit/src/view/BasicCall.tsx:245`
  - `packages/react-native-chat-callkit/src/view/SingleCall.tsx:122`
  - `packages/react-native-chat-callkit/src/view/MultiCall.tsx:241`
- 示例接入点：
  - `examples/callkit-example/src/screens/Home.tsx:348`
  - `examples/product-uikit-demo/src/demo/common/AVView.tsx:328`

