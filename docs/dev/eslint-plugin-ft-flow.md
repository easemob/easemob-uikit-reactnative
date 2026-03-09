# eslint-plugin-ft-flow

## 简介

`eslint-plugin-ft-flow` 是一个 ESLint 插件，用于检查 [Flow](https://flow.org/) 类型注解的语法规范。Flow 是 Facebook 开发的 JavaScript 静态类型检查器，与 TypeScript 功能类似但语法不同。

该插件提供的规则包括：

- `ft-flow/boolean-style` — 布尔类型书写风格
- `ft-flow/define-flow-type` — 标记 Flow 类型定义
- `ft-flow/no-dupe-keys` — 禁止对象类型中的重复键
- `ft-flow/no-primitive-constructor-types` — 禁止使用原始类型构造函数
- `ft-flow/no-types-missing-file-annotation` — 要求含 Flow 类型的文件有 `// @flow` 注解
- `ft-flow/no-weak-types` — 禁止使用弱类型（`any`、`Object`、`Function`）
- 其他关于 Flow 注解格式的规则

## 为什么存在于本项目中

本项目**没有直接依赖**该插件。它是 `@react-native/eslint-config@0.83.2` 的间接依赖：

```
@react-native/eslint-config@0.83.2
  └── eslint-plugin-ft-flow@^2.0.1
```

React Native 官方 eslint 配置默认包含该插件，因为 React Native 核心代码使用 Flow 编写。

## 对本项目的影响

### 功能影响：无

本项目使用 **TypeScript**（`.ts` / `.tsx`），所有源文件中不包含 `// @flow` 注解和 Flow 类型语法。因此 `eslint-plugin-ft-flow` 的所有规则均不会触发，对 lint 结果没有任何影响。

### Peer dependency 冲突

当前安装的版本 `eslint-plugin-ft-flow@2.0.3` 声明的 peer dependency 为：

```json
{ "eslint": "^8.1.0" }
```

而本项目使用 `eslint@^9.25.0`（解析到 9.39.3），不满足 `^8.1.0` 的范围要求，导致 `yarn install` 时产生以下警告：

```
YN0060: eslint is listed by your project with version 9.39.3, which doesn't satisfy
what eslint-plugin-ft-flow (via @react-native/eslint-config) and other dependencies
request (^8.57.0).
```

### 可选的处理方式

由于该插件对本项目无功能影响，此警告可以安全忽略。如果希望消除警告，有以下选项：

1. **在 `package.json` 中通过 `resolutions` 强制升级到 3.x** — `eslint-plugin-ft-flow@3.x` 支持 `eslint ^8.56.0 || ^9.0.0`，但 3.x 将 peer dependency 从 `@babel/eslint-parser` 改为 `hermes-eslint`，可能引入额外依赖。
2. **等待 `@react-native/eslint-config` 更新** — 未来版本可能会升级对 `eslint-plugin-ft-flow` 的依赖范围。
3. **不处理** — 该警告不影响构建和 lint 功能，可以安全忽略。
