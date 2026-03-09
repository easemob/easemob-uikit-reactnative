# TypeScript customConditions 与 React Native 类型系统

> 更新日期：2026-03-03
> 基于：react-native 0.83.2 / TypeScript 5.9.3

## 1. 概述

React Native 从 0.80 版本开始，在 `package.json` 中引入了 `exports` 字段和 `react-native-strict-api` 条件导出，提供了一套全新的、从源码自动生成的 TypeScript 类型定义。开发者可以通过 `tsconfig.json` 的 `customConditions` 选项来选择使用哪套类型。

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "customConditions": ["react-native", "react-native-strict-api"],
  },
}
```

## 2. 两种 customConditions 详解

### 2.1 `"react-native"` 条件

| 属性                   | 说明                                                                           |
| ---------------------- | ------------------------------------------------------------------------------ |
| **来源**               | Metro bundler 社区约定，类似 Node.js 的 `"node"` 条件                          |
| **用途**               | 让包的条件导出能够识别 React Native 运行环境                                   |
| **影响范围**           | 主要服务于第三方库（如 Expo 生态包）的平台特定代码解析                         |
| **对 RN 包本身的影响** | **无直接影响**。React Native 自身的 `exports` 字段中没有 `"react-native"` 条件 |
| **默认配置**           | Expo 项目通过 `expo/tsconfig.base` 默认配置                                    |

> **关键点**：`"react-native"` 条件**不会**改变 `react-native` 包的类型解析路径。它是给其他第三方包用的平台标识。

### 2.2 `"react-native-strict-api"` 条件

| 属性                   | 说明                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| **来源**               | React Native 官方，从 0.80 版本开始引入                             |
| **用途**               | 启用从 RN 源码自动生成的严格类型定义                                |
| **影响范围**           | 直接改变 `react-native` 包的类型解析入口                            |
| **对 RN 包本身的影响** | 将类型入口从 `types/index.d.ts` 切换为 `types_generated/index.d.ts` |
| **默认配置**           | 非默认，需手动 opt-in。计划在未来版本成为默认                       |

> **关键点**：这是唯一能激活 React Native 新版严格类型的条件。

### 2.3 对比总结

| 维度                    | `"react-native"` | `"react-native-strict-api"` |
| ----------------------- | :--------------: | :-------------------------: |
| RN `exports` 中是否定义 |    ❌ 未定义     |          ✅ 已定义          |
| 影响 RN 类型解析        |    ❌ 不影响     |      ✅ 切换到新版类型      |
| 影响第三方包解析        |   ✅ 可能影响    |        ❌ 通常不影响        |
| Expo 默认包含           |      ✅ 是       |            ❌ 否            |
| 推荐同时使用            |      ✅ 是       |            ✅ 是            |

## 3. React Native 类型系统的两套方案

### 3.1 旧版类型（Legacy Types）

- **路径**：`node_modules/react-native/types/index.d.ts`
- **入口导出方式**：通配 re-export（`export * from '../Libraries/...'`）
- **类型来源**：手写维护的 `.d.ts` 文件
- **Animated 定义**：位于 `Libraries/Animated/Animated.d.ts`，使用 `namespace Animated { ... }` 包裹
- **特点**：
  - 允许 deep import（`import ... from 'react-native/Libraries/...'`）
  - 类型可能不够精确（手写维护的历史原因）
  - `InterpolationConfigType` 是 namespace 内部类型，**没有** `InterpolationConfig` 别名

### 3.2 新版严格类型（Strict Types）

- **路径**：`node_modules/react-native/types_generated/index.d.ts`
- **入口导出方式**：精确命名导出（`export type { ... } from '...'`）
- **类型来源**：从 React Native 源码（Flow）自动生成
- **Animated 定义**：位于 `types_generated/Libraries/Animated/AnimatedExports.d.ts`
- **特点**：
  - **禁止** deep import（路径设为 `null`）
  - 类型更准确、更严格
  - 提供兼容别名，如 `InterpolationConfigType as InterpolationConfig`
  - 未来将成为默认，旧版类型将被移除

### 3.3 类型差异示例

以 `Animated.InterpolationConfig` 为例：

```typescript
// ✅ 新版严格类型中（types_generated/Libraries/Animated/AnimatedExports.d.ts）
// InterpolationConfigType 被别名为 InterpolationConfig
export type { InterpolationConfigType as InterpolationConfig } from './nodes/AnimatedInterpolation';

// ❌ 旧版类型中（Libraries/Animated/Animated.d.ts）
// 在 namespace 内部定义，名称为 InterpolationConfigType，没有 InterpolationConfig 别名
export namespace Animated {
  type InterpolationConfigType = {
    inputRange: number[];
    outputRange: number[] | string[];
    easing?: ((input: number) => number) | undefined;
    extrapolate?: ExtrapolateType | undefined;
    extrapolateLeft?: ExtrapolateType | undefined;
    extrapolateRight?: ExtrapolateType | undefined;
  };
}
```

## 4. React Native 版本与类型系统支持矩阵

| RN 版本  | `types/` (旧版) | `types_generated/` (新版) | `exports` 字段 | `react-native-strict-api` |
| -------- | :-------------: | :-----------------------: | :------------: | :-----------------------: |
| 0.76     |       ✅        |         ❌ 不存在         |    ❌ 没有     |         ❌ 不可用         |
| 0.77     |       ✅        |         ❌ 不存在         |    ❌ 没有     |         ❌ 不可用         |
| 0.78     |       ✅        |         ❌ 不存在         |    ❌ 没有     |         ❌ 不可用         |
| 0.79     |       ✅        |         ❌ 不存在         |    ❌ 没有     |         ❌ 不可用         |
| **0.80** |       ✅        |          ✅ 新增          |    ✅ 新增     | ✅ **首次可用（opt-in）** |
| 0.81     |       ✅        |            ✅             |       ✅       |         ✅ opt-in         |
| 0.82     |       ✅        |            ✅             |       ✅       |         ✅ opt-in         |
| 0.83     |       ✅        |            ✅             |       ✅       |         ✅ opt-in         |
| 未来版本 |   ⚠️ 计划移除   |            ✅             |       ✅       |      ✅ 计划成为默认      |

> **重要**：RN 0.76 ~ 0.79 的用户，无论 `tsconfig.json` 如何配置，都**只能使用旧版类型**。

## 5. 对本项目的影响

### 5.1 uikit 库代码中的类型兼容性

由于 uikit 的 `peerDependencies` 声明支持 `"react-native": ">=0.76.0"`，代码中使用的 RN 类型必须在**旧版类型**（0.76~0.79）和**新版严格类型**（0.80+）中都能正确解析。

**需要特别注意的类型差异**：

| 类型引用                           | 旧版类型 (0.76~0.79) | 新版严格类型 (0.80+) |       兼容性        |
| ---------------------------------- | :------------------: | :------------------: | :-----------------: |
| `Animated.InterpolationConfigType` |       ✅ 存在        |       ✅ 存在        |    ✅ 全版本兼容    |
| `Animated.InterpolationConfig`     |      ❌ 不存在       |   ✅ 存在（别名）    | ❌ 不兼容 0.76~0.79 |
| `Animated.AnimatedInterpolation`   |       ✅ 存在        |       ✅ 存在        |    ✅ 全版本兼容    |
| `Animated.CompositeAnimation`      |       ✅ 存在        |       ✅ 存在        |    ✅ 全版本兼容    |
| `Animated.Value`                   |       ✅ 存在        |       ✅ 存在        |    ✅ 全版本兼容    |

### 5.2 第三方生态兼容性问题与我们的策略

截至现阶段（RN 0.83/0.84），**`react-native-strict-api` 仍然与大多数主流第三方库存在结构性不兼容**。

如果您的项目在 `customConditions` 中同时引入了 `react-native-strict-api`，TypeScript 会优先使用 Strict Types 解析 RN 包。但是，诸如 `react-native-gesture-handler`、`react-native-safe-area-context` 等三方库中的类型定义（如 `ViewStyle`、`StyleProp` 等）依然依赖于旧版类型结构。这就导致了：

1. **类型结构冲突**：例如，旧版 `ViewStyle` 的 `position` 允许 `"fixed"`，而新版仅允许 `static | relative | absolute`；新版的 `StyleProp` 检查更加严格导致数百个额外的 TS 报错。
2. **只要包含 strict-api 就会报错激增**：即使配置为 `["react-native", "react-native-strict-api"]`，由于 exports 匹配优先级的原因，strict-api 会直接生效，从而由于三方库未适配导致大量 TS 报错。

#### 结论与统一策略

鉴于整个生态仍未迁移完毕，为了保障项目的稳定性和兼容性（特别是支持 >= 0.76.0），**本项目及示例采用了如下策略：**

1. **统一的 `tsconfig.json` 配置**：所有子项目（无论是 `uikit` 等库包还是 `product-uikit-demo` 等示例）都仅使用：
   ```jsonc
   {
     "compilerOptions": {
       "moduleResolution": "bundler",
       "customConditions": ["react-native"], // ❌ 不要加入 react-native-strict-api
     },
   }
   ```
2. **参考 Reanimated 的双轨验证**：如果您开发库包并希望前瞻性验证严格类型，可在 `package.json` 的 scripts 中额外配置使用 `--customConditions`，但不直接写入 TS 配置文件。

### 5.3 Expo 项目的注意事项

Expo 的 `tsconfig.base` 默认配置就是 `["react-native"]`。对于使用 Expo 的应用：

- **强烈建议保持默认配置**，不要手动在 `customConditions` 中添加 `"react-native-strict-api"`，否则马上会面临数百个生态三方库引起的类型冲突错误。

## 6. 前提条件

使用 `customConditions` 需要满足以下条件：

| 条件                            | 要求                        |
| ------------------------------- | --------------------------- |
| TypeScript 版本                 | >= 5.0                      |
| `moduleResolution`              | `"bundler"` 或 `"nodenext"` |
| React Native 版本（strict-api） | >= 0.80                     |

## 7. 参考资料

- [React Native TypeScript 文档 - Strict Types](https://reactnative.dev/docs/typescript)
- [React Native 0.80 Release Blog - Strict TypeScript API](https://reactnative.dev/blog/2025/04/08/release-0.80)
- [TypeScript 5.0 - customConditions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#--customconditions)
- [React Native Package Exports RFC](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0534-package-exports-support.md)
- [Metro bundler - Package Exports](https://metrobundler.dev/docs/package-exports)
- [Node.js - Conditional Exports](https://nodejs.org/api/packages.html#conditional-exports)
