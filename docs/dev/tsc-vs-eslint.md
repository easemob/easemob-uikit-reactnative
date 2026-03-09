# tsc vs ESLint：职责对比

项目中同时使用 `tsc`（TypeScript Compiler）和 `ESLint` 做静态分析，两者职责不同、互为补充。

## tsc — 类型安全

`tsc` 专注于类型系统层面的检查：

- 类型是否匹配（如把 `string` 传给 `number` 类型的参数）
- 接口 / 泛型约束是否满足
- 属性是否存在、是否可空
- 模块导入导出是否正确
- 类型推导与类型收窄

ESLint **无法**执行这些检查——它不运行 TypeScript 的类型推导引擎。

## ESLint — 代码风格与最佳实践

ESLint 专注于代码质量和风格：

- import 排序（`simple-import-sort` 插件）
- 格式化（通过 `prettier` 插件）
- 禁止特定写法（如 `no-inline-styles`、`no-shadow`）
- React / React Native 特定规则（如 Hooks 调用规则、JSX 规范）
- 代码复杂度、命名约定等

`tsc` **不管**这些——类型正确不代表代码风格好。

## 少量重叠

两者在以下几项上有重叠：

| 检查项       | tsc 选项               | ESLint 规则                         |
| ------------ | ---------------------- | ----------------------------------- |
| 未使用的变量 | `noUnusedLocals`       | `@typescript-eslint/no-unused-vars` |
| 未使用的参数 | `noUnusedParameters`   | 同上                                |
| 不可达代码   | `allowUnreachableCode` | `no-unreachable`                    |

**实践中只在一侧开启**，避免重复报错。通常在 `tsconfig.json` 中关闭这些选项，交给 ESLint 的 `@typescript-eslint` 规则来管理，因为 ESLint 可以配合 `--fix` 自动修复，且报告更灵活。

## 总结

| 维度             | tsc                  | ESLint                     |
| ---------------- | -------------------- | -------------------------- |
| 核心能力         | 类型检查             | 代码风格 + 最佳实践        |
| 能否自动修复     | 否                   | 是（`--fix`）              |
| 是否需要类型信息 | 是（自带）           | 可选（typed linting 较慢） |
| 定位             | "代码能不能正确运行" | "代码写得好不好"           |

两者互补而非重复，几乎所有现代 TypeScript 项目都同时使用。
