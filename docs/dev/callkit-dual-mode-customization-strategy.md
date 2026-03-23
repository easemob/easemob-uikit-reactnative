# CallKit 双模式能力设计（Headless + UI 注入）

## 背景

CallKit 当前默认提供 `SingleCall` / `MultiCall` UI，适合快速接入，但对不同用户群体存在两类典型诉求：

1. 高级用户：希望完全不使用内置 UI，仅复用信令与状态机能力，自行实现业务 UI。
2. 常规用户：只想快速调整页面样式/布局，不希望从零实现整套通话逻辑。

本文档定义双模式并存方案，兼顾两类用户。

---

## 目标

- 同时支持两种模式：
  - `Headless` 模式（完全自定义 UI）
  - `UI 注入` 模式（按约束替换单聊/群聊 UI）
- 两种模式共享同一套信令和通话状态机。
- 保持现有默认能力兼容（不配置时行为不变）。

---

## 总体方案

## 模式一：Headless（高级用户）

提供完整的通话控制与事件接口，用户不依赖 `SingleCall` / `MultiCall`，自行实现：

- 来电弹窗
- 通话中页面
- 设备控制 UI（静音、摄像头、扬声器、切摄像头等）

核心原则：

- SDK 提供 `能力`，不提供 `页面`。
- 生命周期和时序由 SDK 事件驱动，页面由业务方掌控。

## 模式二：UI 注入（快速改造）

在 `GlobalContainer` 提供可选 UI 注入点，允许替换：

- 单聊通话组件
- 群聊通话组件

注入组件遵循既定约束（props/回调/时序），即可在保留核心流程的前提下快速改 UI。

核心原则：

- SDK 提供 `默认流程 + 可替换壳层`。
- 业务方不必重写底层逻辑即可完成界面改造。

---

## 为什么两种都要支持

两种模式不冲突，且服务不同用户层级：

- `Headless`：自由度最高，适合有完整研发能力的团队。
- `UI 注入`：接入成本最低，适合需要快速交付和小改版的团队。

最终形成能力分层：

- 基础层：信令/状态机/RTC 控制（统一）
- 上层 A：默认 UI
- 上层 B：注入式 UI
- 上层 C：完全自定义 UI

---

## 建议的接口与约束

## A. Headless 模式能力面（建议）

建议对外稳定暴露以下能力：

- 会话控制：
  - `createChannelId`
  - `startSingleAudioCall` / `startSingleVideoCall`
  - `startMultiAudioCall` / `startMultiVideoCall`
  - `acceptCall` / `refuseCall`
  - `hangUpCall` / `cancelCall`
- RTC 控制：
  - `initRTC` / `unInitRTC`
  - `joinChannel` / `leaveChannel`
  - `enableAudio` / `enableVideo`
  - `enableLocalAudio` / `enableLocalVideo`
  - `setEnableSpeakerphone`
  - `switchCamera`
  - `enableAudioVolumeIndication`
- 事件监听：
  - 来电事件（如 `onCallReceived`）
  - 通话事件（如 `onRequestJoin/onSelfJoined/onCallEnded/...`）

## B. UI 注入模式约束面（建议）

建议新增 `GlobalContainer` 可选参数（命名可调整）：

```ts
uiInjection?: {
  SingleCallComponent?: React.ComponentType<SingleCallProps>;
  MultiCallComponent?: React.ComponentType<MultiCallProps>;
}
```

约束原则：

- 注入组件必须遵循 `SingleCallProps` / `MultiCallProps` 的关键语义约束。
- 必须按约定回调 `onClose/onError/onHangUp/onCancel/onRefuse`。
- 禁止绕过核心状态机直接操作内部状态。

---

## 两种模式的边界定义

- `Headless` 负责“完全自定义”，SDK 只保证能力与时序。
- `UI 注入` 负责“快速替换页面”，SDK 保留流程控制。
- 二者共用同一个 controller 实例，不得维护两套信令逻辑。

---

## 兼容性策略

- 默认不传 `uiInjection` 时，保持现有 `SingleCall` / `MultiCall` 行为。
- 现有示例项目不需要立刻迁移。
- 文档明确：
  - 新项目优先选择 `Headless` 或 `UI 注入`。
  - 旧项目可按需渐进迁移。

---

## 实施建议（分阶段）

1. 第一阶段：先完善 `Headless` 接口暴露（能力先行）。
2. 第二阶段：加 `GlobalContainer` 的 UI 注入能力。
3. 第三阶段：补充示例（一个 Headless demo + 一个 UI 注入 demo）。
4. 第四阶段：补迁移文档与最佳实践（时序、生命周期、错误处理）。

---

## 风险与控制

- 风险 1：接口过宽导致维护负担增加。
  - 控制：分层接口，稳定核心最小集合。
- 风险 2：注入组件行为不一致导致流程异常。
  - 控制：明确组件契约与回调必选项。
- 风险 3：双模式并存造成认知复杂。
  - 控制：文档中给出“如何选型”决策表。

---

## 选型建议

- 需要完整业务主导、深度定制、长期演进：选 `Headless`。
- 需要快速改样式、低改造成本、短周期上线：选 `UI 注入`。
- 团队可采用组合策略：先 `UI 注入`，后逐步迁移到 `Headless`。

---

## 最终结论

你的思路是正确且可落地的，建议将其作为 CallKit 的正式能力路线：

- `Headless` 提供高自由度。
- `UI 注入` 提供高效率。
- 二者共享同一内核，避免分叉，实现兼容与演进并存。

