# ESLint 新旧版本配置对比

## 背景

ESLint 在 v9 中引入了全新的 **Flat Config** 配置格式，取代了沿用多年的 **eslintrc** 格式。本项目已升级到 ESLint v9，使用 Flat Config。

本文档对比新旧两种配置格式的差异，说明两套配置共存时的问题，以及如何正确使用当前配置。

## 两种配置格式对比

| 维度         | 旧版（eslintrc）                                              | 新版（Flat Config）                                           |
| ------------ | ------------------------------------------------------------- | ------------------------------------------------------------- |
| ESLint 版本  | ≤ 8.x（v9 向后兼容但不推荐）                                  | v9+                                                           |
| 配置文件名   | `.eslintrc.js`、`.eslintrc.json`、`package.json#eslintConfig` | `eslint.config.js`、`eslint.config.mjs`                       |
| 忽略文件     | `.eslintignore`、`package.json#eslintIgnore`                  | 配置文件中使用 `ignores` 字段                                 |
| 配置查找方式 | 从目标文件目录向上逐级查找，直到 `root: true`                 | 从目标文件目录向上找到最近的 `eslint.config.*`                |
| 插件注册方式 | `plugins: ["simple-import-sort"]`（字符串）                   | `plugins: { 'simple-import-sort': simpleImportSort }`（对象） |
| 扩展方式     | `extends: ["@react-native-community", "prettier"]`            | 需要 `@eslint/compat` 的 `fixupConfigRules` 包裹              |

## 曾经的问题：两套配置共存

### 问题描述

项目中曾同时存在两套 ESLint 配置：

1. **根 `package.json` 中的 `eslintConfig`**（旧格式）

   ```json
   {
     "eslintConfig": {
       "root": true,
       "extends": ["@react-native-community", "prettier"],
       "plugins": ["simple-import-sort"],
       "rules": { ... }
     },
     "eslintIgnore": ["node_modules/", "scripts/", ...]
   }
   ```

2. **各包目录下的 `eslint.config.mjs`**（新 Flat Config 格式）
   ```js
   // packages/react-native-chat-uikit/eslint.config.mjs
   export default defineConfig([
     {
       plugins: { prettier, 'simple-import-sort': simpleImportSort },
       rules: { ... },
     },
     { ignores: ['node_modules/', 'lib/'] },
   ]);
   ```

### 为什么会出问题

ESLint v9 使用 Flat Config 时的行为：

- **命令行 `eslint`**：查找最近的 `eslint.config.*` 文件，**忽略** `package.json#eslintConfig` 和 `.eslintignore`
- **VS Code ESLint 扩展**：根据扩展版本和设置，可能读取旧配置或新配置，导致行为不一致

具体表现为：

| 场景                  | 行为                                                          |
| --------------------- | ------------------------------------------------------------- |
| `yarn lint`（命令行） | 使用各包的 `eslint.config.mjs`，能正常检测 import 排序错误 ✅ |
| VS Code 编辑器内检查  | 可能使用根 `package.json` 的旧配置，或完全无法加载配置 ❌     |
| 开发者认知            | 不清楚哪套配置生效，修改了错误的文件 ❌                       |

### 解决方式

**只保留新版 Flat Config**，删除所有旧格式配置：

- ✅ 删除 `package.json` 中的 `eslintConfig` 字段
- ✅ 删除 `package.json` 中的 `eslintIgnore` 字段
- ✅ 删除 `.eslintignore` 文件（如果存在）
- ✅ 在各包的 `eslint.config.mjs` 中使用 `ignores` 字段代替

## 当前项目配置结构

```
react-native-chat-library/
├── package.json                           # 无 eslintConfig，无 eslintIgnore
├── packages/
│   ├── react-native-chat-uikit/
│   │   └── eslint.config.mjs              # Flat Config（包含 simple-import-sort + prettier）
│   ├── react-native-chat-callkit/
│   │   └── eslint.config.mjs              # 同上
│   └── react-native-chat-room/
│       └── eslint.config.mjs              # 同上
└── examples/
    ├── uikit-example/
    │   └── eslint.config.js               # Flat Config（使用 eslint-config-expo）
    ├── callkit-example/
    │   └── eslint.config.js               # 同上
    └── ...
```

### packages 的 ESLint 配置说明

三个 packages（`uikit`、`callkit`、`room`）使用相同的配置模板：

```js
export default defineConfig([
  {
    extends: fixupConfigRules(compat.extends('@react-native', 'prettier')),
    plugins: { prettier, 'simple-import-sort': simpleImportSort },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'simple-import-sort/imports': 'error',    // import 排序检查
      'simple-import-sort/exports': 'error',    // export 排序检查
      'react-native/no-inline-styles': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'prettier/prettier': ['error', { ... }],  // 格式化检查
    },
  },
  {
    ignores: ['node_modules/', 'lib/'],          // 替代 .eslintignore
  },
]);
```

### examples 的 ESLint 配置说明

examples 使用 Expo 的 ESLint 配置，不包含 `simple-import-sort`：

```js
module.exports = defineConfig([
  expoConfig,
  { ignores: ['dist/*'] },
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      // ...
    },
  },
]);
```

## 如何自查配置是否正确

### 1. 检查是否存在旧配置残留

```bash
# 检查根 package.json 是否还有 eslintConfig
cat package.json | grep -c '"eslintConfig"'
# 期望输出: 0

# 检查是否存在 .eslintignore
ls .eslintignore 2>/dev/null
# 期望: 文件不存在

# 检查是否存在 .eslintrc* 文件
find . -maxdepth 3 -name '.eslintrc*' -not -path '*/node_modules/*'
# 期望: 无输出
```

### 2. 验证 Flat Config 生效

```bash
# 运行 lint 检查
yarn lint

# 或单独检查某个包
yarn uikit lint
```

如果 `simple-import-sort/imports` 规则能正常报错，说明 Flat Config 已正确生效。

### 3. VS Code 编辑器中的 ESLint 提示

要让 VS Code 的 ESLint 扩展正确使用 Flat Config，需要确认：

- **ESLint 扩展版本 ≥ 3.x**（旧版本不支持 Flat Config）
- 在 VS Code 设置中搜索 `eslint.useFlatConfig`，确保为 `true`
  - 较新版本的 ESLint 扩展会自动检测，无需手动设置

配置正确后，编辑器会对违反规则的代码显示红色下划线，用户可以手动点击 Quick Fix（💡）来修复问题（如 import 排序）。

### 4. VS Code 打开目录层级的影响

**这是一个容易被忽视的关键问题：** 打开不同层级的目录，ESLint 在编辑器中的表现会完全不同。

#### 示例场景

本项目的目录结构如下：

```
/Users/asterisk/tmp2026/2026-02-28/          ← 外层 workspace（含 .vscode/settings.json）
└── react-native-chat-library/               ← 项目根目录（无 .vscode/settings.json）
    ├── packages/
    │   └── react-native-chat-uikit/
    │       └── eslint.config.mjs
    └── examples/
        └── callkit-example/
            └── eslint.config.js
```

外层 `.vscode/settings.json` 配置了：

```json
{
  "eslint.useFlatConfig": true,
  "eslint.workingDirectories": [
    {
      "directory": "react-native-chat-library/packages/react-native-chat-uikit",
      "changeProcessCWD": true
    },
    {
      "directory": "react-native-chat-library/examples/callkit-example",
      "changeProcessCWD": true
    }
  ]
}
```

#### 行为对比

| 打开方式                                  | 读取的 settings.json                  | ESLint CWD 切换         | 编辑器是否报错        |
| ----------------------------------------- | ------------------------------------- | ----------------------- | --------------------- |
| `code /Users/asterisk/tmp2026/2026-02-28` | ✅ 读取到外层 `.vscode/settings.json` | ✅ 正确切换到各子包目录 | ✅ 正常提示错误       |
| `code react-native-chat-library`          | ❌ 该目录无 `.vscode/settings.json`   | ❌ CWD 停留在根目录     | ❌ 无任何 ESLint 提示 |

#### 原因分析

在 Monorepo 中，每个 package 有自己的 `eslint.config.mjs`，ESLint 扩展需要知道每个文件应以哪个目录为工作目录（CWD）来查找对应的配置文件。`eslint.workingDirectories` + `changeProcessCWD: true` 就是解决这个问题的关键配置。

当 VS Code 找不到 `.vscode/settings.json` 时，ESLint 扩展以 workspace 根目录作为 CWD，在 `react-native-chat-library/` 根目录下找不到 `eslint.config.*` 文件（各包的配置分散在子目录中），导致 ESLint 对所有文件静默失败，不报任何错误。

#### 解决方案

在 `react-native-chat-library/` 目录下也创建 `.vscode/settings.json`，使用相对路径重新配置 `eslint.workingDirectories`：

```json
{
  "eslint.useFlatConfig": true,
  "eslint.workingDirectories": [
    {
      "directory": "packages/react-native-chat-uikit",
      "changeProcessCWD": true
    },
    {
      "directory": "packages/react-native-chat-callkit",
      "changeProcessCWD": true
    },
    {
      "directory": "packages/react-native-chat-room",
      "changeProcessCWD": true
    },
    { "directory": "examples/uikit-example", "changeProcessCWD": true },
    { "directory": "examples/callkit-example", "changeProcessCWD": true },
    { "directory": "examples/room-example", "changeProcessCWD": true },
    { "directory": "examples/product-uikit-demo", "changeProcessCWD": true },
    { "directory": "examples/product-room-demo", "changeProcessCWD": true }
  ]
}
```

这样无论从哪个层级打开 VS Code，ESLint 都能正常工作。

## 常见误解

### "Prettier 可以修复 import 排序"

❌ 这是一个常见误解。

- **`simple-import-sort`** 是 ESLint 插件，负责 import 排序
- **Prettier** 负责代码格式化（缩进、引号、换行等），**不处理** import 排序
- 之所以有时感觉 "Prettier 修复了 import 排序"，是因为 VS Code 在保存时可以同时运行 Prettier 格式化和 ESLint autofix，两者的效果叠加产生了这种错觉

### "根目录 package.json 中的 eslintConfig 是必须的"

❌ 在 ESLint v9 Flat Config 模式下：

- `package.json#eslintConfig` 会被**完全忽略**
- `.eslintignore` 文件也会被忽略
- 所有配置必须通过 `eslint.config.*` 文件提供

保留旧配置只会造成混淆，不会有任何实际效果。

## 参考链接

- [ESLint Flat Config 官方迁移指南](https://eslint.org/docs/latest/use/configure/migration-guide)
- [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort)
- [VS Code ESLint 扩展 Flat Config 支持](https://github.com/microsoft/vscode-eslint#version-300)
