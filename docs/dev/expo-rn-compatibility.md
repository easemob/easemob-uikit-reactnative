# Expo SDK 与 React Native 兼容性参考

> 本文档记录 Expo SDK 和 React Native 之间的版本对应关系，避免在项目中重复查询确认。

## 版本对应表（官方）

来源：[Expo Reference](https://docs.expo.dev/versions/latest/)

| Expo SDK   | React Native | React      | RN Web  | 最低 Node.js | 发布日期       |
| ---------- | ------------ | ---------- | ------- | ------------ | -------------- |
| **55.0.0** | **0.83**     | **19.2.0** | -       | -            | **2026-02-25** |
| 54.0.0     | 0.81         | 19.1.0     | 0.21.0  | 20.19.x      | 2025-09-10     |
| 53.0.0     | 0.79         | 19.0.0     | 0.20.0  | 20.18.x      | 2025-04-28     |
| 52.0.0     | 0.76         | 18.3.1     | 0.19.13 | 20.18.x      | 2024-11-10     |

## 关键规则

1. **每个 Expo SDK 版本绑定一个 React Native 大版本**：不能随意混搭
2. **Expo SDK 每年发布 3 次**，通常跟踪最新的 RN 稳定版
3. **升级 Expo SDK 就意味着升级 React Native**，反之亦然
4. **React 版本也被 Expo SDK 绑定**：如 SDK 55 = React 19.2.0

## 本项目采用的版本

| 依赖         | 版本   | 说明                          |
| ------------ | ------ | ----------------------------- |
| Expo SDK     | 55.0.0 | 2026-02-25 发布的正式版       |
| React Native | 0.83.2 | Expo SDK 55 的目标 RN 版本    |
| React        | 19.2.0 | Expo SDK 55 对应的 React 版本 |

## Expo SDK 55 重要变更

- **强制新架构 (New Architecture)**：SDK 55 起不再支持旧架构，`newArchEnabled` 配置项已移除
- **Hermes v1** 可选启用（性能改进）
- 来源：[Expo SDK 55 Beta Changelog](https://expo.dev/changelog/sdk-55-beta)

## npm 安装说明

```bash
# SDK 55 刚发布时 latest tag 可能未更新，可以指定版本安装：
npx expo install expo@55.0.0

# 或使用 next tag：
npx expo install expo@next

# 当 latest tag 更新后：
npx expo install expo@latest
```

## 在 Library 包中的影响

Library 包（packages/react-native-chat-_）使用 `peerDependencies: { "react": "_", "react-native": "\*" }`，
不直接依赖 Expo SDK。Library 的 `devDependencies` 中的 RN 版本应该与 Example 保持一致（0.83.2），
确保 Codegen 和构建工具链的一致性。

## 在 Example 应用中的影响

Example 应用（examples/\*-example）使用 Expo 管理，关键依赖：

- `expo`: `~55.0.0`
- `react-native`: `0.83.2`（由 Expo SDK 55 决定）
- `react`: `19.2.0`（由 Expo SDK 55 决定）

## 版本升级检查清单

当需要升级 Expo SDK / RN 版本时：

1. 查看 [Expo 版本对应表](https://docs.expo.dev/versions/latest/) 确认目标 SDK 对应的 RN 和 React 版本
2. 更新所有 example 的 `expo`、`react`、`react-native` 版本
3. 更新所有 library 的 `devDependencies` 中的 `react`、`react-native` 和 `@react-native/babel-preset` 版本
4. 运行 `npx expo install --fix` 修复 Expo 生态包的版本
5. 重新执行 `pod install` 和 Android gradle sync
