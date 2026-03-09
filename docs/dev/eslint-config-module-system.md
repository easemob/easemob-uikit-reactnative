# ESLint 配置文件的模块系统差异（CJS vs ESM）

## 背景

本项目中存在两种 ESLint 配置文件格式：

- **`eslint.config.js`**（CommonJS） — 用于 `examples/` 下的 Expo 项目
- **`eslint.config.mjs`**（ES Modules） — 用于 `packages/` 下的库项目

两者功能完全等价，差异仅在于 JavaScript 模块系统的不同。本文档解释这一差异的原因和影响。

## 两种模块系统对比

| 特性              | `.js`（CommonJS）          | `.mjs`（ES Modules）  |
| ----------------- | -------------------------- | --------------------- |
| 导入语法          | `const x = require('...')` | `import x from '...'` |
| 导出语法          | `module.exports = ...`     | `export default ...`  |
| 顶层 `await`      | ❌ 不支持                  | ✅ 支持               |
| `import.meta.url` | ❌ 不可用                  | ✅ 可用               |
| `__dirname`       | ✅ 内置可用                | ❌ 需手动构造         |
| `__filename`      | ✅ 内置可用                | ❌ 需手动构造         |
| Tree-shaking      | ❌ 不支持                  | ✅ 支持               |
| 模块解析          | 同步                       | 异步                  |

## 文件扩展名如何决定模块系统

Node.js 通过以下规则决定一个文件使用哪种模块系统：

1. **`.mjs`** → 始终以 ES Modules 解析，无论 `package.json` 如何配置
2. **`.cjs`** → 始终以 CommonJS 解析，无论 `package.json` 如何配置
3. **`.js`** → 取决于最近的 `package.json` 中的 `"type"` 字段：
   - `"type": "module"` → 以 ESM 解析
   - `"type": "commonjs"` 或无 `"type"` 字段 → 以 CJS 解析（**默认行为**）

## 项目中的实际应用

### `examples/uikit-example/eslint.config.js`（CJS）

```js
// CommonJS 语法
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      // ...
    },
  },
]);
```

**为什么使用 CJS：**

- Expo 项目的 `package.json` 中没有 `"type": "module"`，因此 `.js` 文件默认以 CJS 解析
- Expo CLI 生成的模板和文档默认使用 CJS 风格
- Expo 生态中 CJS 兼容性最好，几乎所有工具链都支持

### `packages/react-native-chat-uikit/eslint.config.mjs`（ESM）

```js
// ES Modules 语法
import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { defineConfig } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM 中没有内置的 __dirname 和 __filename，需要手动构造
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: fixupConfigRules(compat.extends('@react-native', 'prettier')),
    plugins: { prettier, 'simple-import-sort': simpleImportSort },
    rules: {
      // ...
    },
  },
  {
    ignores: ['node_modules/', 'lib/'],
  },
]);
```

**为什么使用 ESM：**

- `.mjs` 扩展名强制启用 ESM，不受 `package.json` 中 `"type"` 字段影响
- `@eslint/compat`、`@eslint/eslintrc` 等新版 ESLint 工具库优先提供 ESM 导出
- `FlatCompat` 需要 `__dirname`，在 ESM 中需要通过 `import.meta.url` 手动构造

### ESM 中手动构造 `__dirname` 的原因

在 CJS 中，`__dirname` 和 `__filename` 是 Node.js 自动注入的全局变量。但 ESM 放弃了这种设计，改用标准化的 `import.meta.url`。因此需要手动构造：

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// import.meta.url 返回 "file:///Users/.../eslint.config.mjs"
const __filename = fileURLToPath(import.meta.url); // 转换为普通路径
const __dirname = path.dirname(__filename); // 提取目录部分
```

> **注意**：Node.js ≥ 21.2 提供了 `import.meta.dirname` 和 `import.meta.filename`，可以直接使用而无需上述转换。但为兼容较低版本的 Node.js，当前仍使用手动构造方式。

## 总结

| 项目位置    | 配置文件            | 模块系统 | 原因                                    |
| ----------- | ------------------- | -------- | --------------------------------------- |
| `examples/` | `eslint.config.js`  | CJS      | Expo 生态默认 CJS，兼容性好             |
| `packages/` | `eslint.config.mjs` | ESM      | `.mjs` 强制 ESM，适配新版 ESLint 工具库 |

两种方式对 ESLint 的最终行为**没有任何影响**，选择哪种取决于项目的模块系统环境和依赖要求。

## 参考链接

- [Node.js Modules: Determining Module System](https://nodejs.org/api/packages.html#determining-module-system)
- [ESLint Flat Config 配置文件](https://eslint.org/docs/latest/use/configure/configuration-files)
- [MDN: JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
