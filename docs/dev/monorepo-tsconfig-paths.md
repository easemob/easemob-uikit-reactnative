# Monorepo 中 tsconfig paths 配置说明

## 问题

在 monorepo 中，example 引用 workspace 本地库时，IDE 和 ESLint 会报错：

```
Unable to resolve path to module 'react-native-chat-uikit'. eslint(import/no-unresolved)
```

## 根因

不同工具使用不同的模块解析机制：

| 工具                                      | 解析方式                                                         | 状态                       |
| ----------------------------------------- | ---------------------------------------------------------------- | -------------------------- |
| **Metro**（运行时打包）                   | 读取 `package.json` 的 `exports.source` 条件 → `./src/index.tsx` | ✅ 自动走源码              |
| **TypeScript / ESLint / IDE**（静态分析） | 读取 `package.json` 的 `types` / `main` 字段 → `./lib/...`       | ❌ `lib/` 在开发阶段不存在 |

库的 `package.json` 中：

```json
{
  "main": "./lib/module/index.js",
  "types": "./lib/typescript/src/index.d.ts",
  "exports": {
    ".": {
      "source": "./src/index.tsx",
      "types": "./lib/typescript/src/index.d.ts",
      "default": "./lib/module/index.js"
    }
  }
}
```

`types` / `main` 是为**发布到 npm 后的远程依赖消费者**准备的，`lib/` 只在执行 `yarn build` 后才存在。在 monorepo 开发阶段，`lib/` 目录不存在，导致静态分析工具无法解析模块。

## 解决方案

在每个 example 的 `tsconfig.json` 中添加 `paths`，将库名直接映射到其 `src/` 源码入口，使 TypeScript、ESLint 和 IDE 与 Metro 行为保持一致。

### 各 Example 配置

**`uikit-example/tsconfig.json`**

```json
"paths": {
  "@/*": ["./*"],
  "react-native-chat-uikit": ["../../packages/react-native-chat-uikit/src/index.tsx"]
}
```

**`callkit-example/tsconfig.json`**

```json
"paths": {
  "@/*": ["./*"],
  "react-native-chat-callkit": ["../../packages/react-native-chat-callkit/src/index.tsx"]
}
```

**`room-example/tsconfig.json`**

```json
"paths": {
  "@/*": ["./*"],
  "react-native-chat-room": ["../../packages/react-native-chat-room/src/index.tsx"]
}
```

**`product-room-demo/tsconfig.json`**

```json
"paths": {
  "@/*": ["./*"],
  "react-native-chat-room": ["../../packages/react-native-chat-room/src/index.tsx"]
}
```

**`product-uikit-demo/tsconfig.json`**

```json
"paths": {
  "@/*": ["./*"],
  "react-native-chat-uikit": ["../../packages/react-native-chat-uikit/src/index.tsx"],
  "react-native-chat-callkit": ["../../packages/react-native-chat-callkit/src/index.tsx"]
}
```

## 效果

配置后，所有工具统一指向 `src/` 源码：

- IDE 可以直接跳转到库的源码（Cmd+Click）
- ESLint `import/no-unresolved` 报错消除
- TypeScript 类型检查使用源码类型
- `lib/` 只在 `yarn build` 发布准备时才需要生成

## 注意

修改 `tsconfig.json` 后，需要重启 IDE 的 TypeScript Language Server 以刷新识别：

- Cursor / VS Code：`Cmd+Shift+P` → "TypeScript: Restart TS Server"
