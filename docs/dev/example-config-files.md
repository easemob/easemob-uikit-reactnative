# Example 子项目配置文件说明

每个 `examples/` 下的子项目（如 `uikit-example`、`callkit-example`、`product-uikit-demo`、`room-example`、`product-room-demo`）都包含一组标准化的配置文件。本文档介绍每个配置文件的作用、结构以及它们在 monorepo 中的协作关系。

---

## 1. `package.json`

**作用：** Node.js 项目描述文件，定义子项目的元信息、脚本命令和依赖关系。

**关键字段说明：**

| 字段              | 说明                                                    |
| ----------------- | ------------------------------------------------------- |
| `name`            | 子项目名称，如 `uikit-example`、`product-uikit-demo`    |
| `main`            | 入口文件，统一指向 `./index.js`                         |
| `scripts`         | 定义开发/构建/检查等脚本命令                            |
| `dependencies`    | 运行时依赖，包含 Expo、React Native 及本地 workspace 包 |
| `devDependencies` | 开发时依赖，如 TypeScript、ESLint 等工具链              |

**脚本命令参考：**

- `yarn android` / `yarn ios` — 通过 `expo run:android` / `expo run:ios` 启动应用
- `yarn start` — 启动 Expo Dev Client 开发服务器
- `yarn prepare` — 项目初始化一站式命令（prebuild → 生成环境配置 → 补丁等）
- `yarn expo:prebuild` — 运行 `expo prebuild --clean --no-install` 生成原生工程
- `yarn gen:env` / `yarn gen:rename` — 生成环境变量和重命名配置
- `yarn lintcheck` — ESLint 代码检查
- `yarn typecheck` — TypeScript 类型检查
- `yarn clean` — 清理构建产物

**Monorepo 特殊之处：** 本地 packages 通过 `workspace:*` 协议引用（如 `"react-native-chat-uikit": "workspace:*"`），由 Yarn workspaces 自动解析到 monorepo 内的包。

---

## 2. `index.js`

**作用：** 应用程序入口文件，负责注册根组件。

**典型内容：**

```javascript
import 'expo-dev-client';
import { registerRootComponent } from 'expo';
import App from './src/App';

export default registerRootComponent(App);
```

**说明：**

- `import 'expo-dev-client'` — 初始化 Expo Dev Client，支持自定义原生代码的开发调试
- `registerRootComponent(App)` — 使用 Expo 的方式注册根组件（内部封装了 `AppRegistry.registerComponent`），对标准 React Native 入口做了增强，自动处理 Expo 初始化逻辑

---

## 3. `app.json`

**作用：** Expo 应用配置文件，定义 App 的元信息和平台特定配置。该文件会在 `expo prebuild` 阶段被读取，用于生成 iOS/Android 原生工程配置。

**主要配置项：**

| 配置项               | 说明                                                                         |
| -------------------- | ---------------------------------------------------------------------------- |
| `name` / `slug`      | 应用名称和 URL-safe 标识                                                     |
| `version`            | 应用版本号                                                                   |
| `orientation`        | 屏幕方向（`portrait` 竖屏）                                                  |
| `icon`               | 应用图标路径                                                                 |
| `scheme`             | Deep Linking URL scheme                                                      |
| `userInterfaceStyle` | 主题模式（`automatic` 跟随系统）                                             |
| `newArchEnabled`     | 启用 React Native 新架构（Fabric + TurboModules）                            |
| `ios`                | iOS 平台配置：`bundleIdentifier`、权限声明 (`infoPlist`)、推送配置等         |
| `android`            | Android 平台配置：`package` 名、自适应图标等                                 |
| `plugins`            | Expo 插件列表，用于在 prebuild 阶段修改原生工程                              |
| `experiments`        | 实验性功能：`typedRoutes`（类型安全路由）、`reactCompiler`（React Compiler） |

**插件说明（`plugins`）：**

- `expo-router` — 基于文件系统的路由
- `expo-splash-screen` — 启动画面配置
- `expo-font` / `expo-image` / `expo-web-browser` — 各 Expo 模块的原生配置
- `expo-dev-client` — 开发客户端，设置 `launchMode: "most-recent"`
- `@react-native-firebase/app` + `@react-native-firebase/messaging` — Firebase 推送配置（仅部分 product demo 使用）
- `./plugins/withAndroidPermissions` — 自定义本地插件，用于注入 Android 权限声明

---

## 4. `babel.config.js`

**作用：** Babel 编译器配置，定义源码的转译规则。

**为什么需要转译：** 我们编写的源码中包含 JSX 语法（`<View />`）、TypeScript 类型注解、ES2020+ 新语法（可选链 `?.`、空值合并 `??` 等），这些语法 JavaScript 引擎（Hermes / JavaScriptCore）无法直接执行。Babel 将它们转译为引擎可执行的 **标准 JavaScript 代码**（不是二进制），例如：

- `<Text>Hello</Text>` → `React.createElement(Text, null, 'Hello')`
- TypeScript 类型注解 → 被完全移除
- `user?.name ?? 'Anonymous'` → 等价的 `if/ternary` 表达式

**使用者：** Babel 不会被开发者直接调用，而是由 **Metro bundler** 在打包过程中自动调用——每当 Metro 处理一个源文件时，会根据此配置调用 Babel 进行转译。

**典型内容：**

```javascript
module.exports = require('../../babel.config.examples.js');
```

所有 example 子项目统一委托给 monorepo 根目录的 `babel.config.examples.js`，其内容为：

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

**说明：**

- `api.cache(true)` — 启用配置缓存，避免重复计算配置，提升编译性能
- `babel-preset-expo` — Expo 官方 Babel 预设，集成了 React Native 所需的所有转换插件（JSX 转换、TypeScript 剥离、Flow 剥离、模块系统转换等）
- 统一配置确保所有子项目使用相同的编译行为，避免不一致问题

---

## 5. `metro.config.js`

**作用：** Metro bundler 配置文件。Metro 是 React Native 专用的 JavaScript 打包工具（类似 Web 开发中的 Webpack/Vite）。

**Metro 做什么：** Metro 从 `index.js` 入口出发，递归解析所有 `import`/`require` 依赖，对每个文件调用 Babel 转译，最终将所有模块合并为一个 **JavaScript Bundle 文件**（如 `index.bundle`）。这个 bundle 文件会被部署到手机上，由设备端的 JavaScript 引擎（Hermes）加载并执行。

**谁使用这个 bundle：**

- **开发阶段** — Metro 作为开发服务器运行（`yarn start`），手机端 App 通过网络从 Metro 服务器实时拉取 bundle，支持热更新（Hot Reload）
- **生产构建** — Metro 生成离线 bundle 文件，打包进 iOS `.ipa` 或 Android `.apk`/`.aab` 中，随应用分发到用户设备

**典型内容：**

```javascript
const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const root = path.resolve(__dirname, '../..');

const config = withMetroConfig(getDefaultConfig(__dirname), {
  root,
  dirname: __dirname,
});

module.exports = config;
```

**说明：**

- `getDefaultConfig(__dirname)` — 获取 Expo 默认的 Metro 配置
- `withMetroConfig(...)` — 使用 `react-native-monorepo-config` 工具对配置进行增强，核心解决 monorepo 场景下的问题：
  - **`root`** — 指向 monorepo 根目录，让 Metro 能够解析 `packages/` 下的本地包
  - **`dirname`** — 当前子项目目录，用于正确设置 `watchFolders`（监听哪些目录的文件变更）和 `nodeModulesPaths`（去哪里查找 `node_modules`）
- 所有子项目的 `metro.config.js` 结构完全一致，区别仅在于各自的 `__dirname`

---

## 6. `eslint.config.js`

**作用：** ESLint 静态分析配置文件，使用 ESLint flat config 格式。

**ESLint 检查什么：** ESLint 是静态代码分析工具，它在**不运行代码**的情况下扫描源码，检查两类问题：

1. **代码质量问题** — 潜在的 Bug 和不良实践，例如：
   - 使用了未定义的变量
   - 缺少 React Hook 依赖项（可能导致过期闭包 Bug）
   - React 组件缺少 `displayName`（影响调试体验）
   - 存在无用的空构造函数
2. **代码格式问题**（通过 Prettier 插件）— 缩进、引号风格、分号、换行等排版规范

简而言之，ESLint 不只是"代码格式检查"，更重要的是**捕获潜在 Bug 和维护代码质量**。

**典型内容：**

```javascript
const baseConfig = require('../../eslint.config.examples.js');
module.exports = baseConfig;
```

所有子项目共享根目录的 `eslint.config.examples.js`，其主要规则包括：

- 基于 `eslint-config-expo/flat`（Expo 官方推荐配置，包含 React / React Native / TypeScript 相关规则）
- 集成 `eslint-plugin-prettier`，将 Prettier 格式化差异作为 ESLint 错误上报，实现「格式 + 质量」一站式检查
- 忽略 `dist/*` 目录
- 按项目实际需要调整部分规则（如关闭 `@typescript-eslint/no-unused-vars`）
- 开启 `react/display-name` 规则，确保组件命名可调试

**说明：** 统一的 ESLint 配置确保所有 example 子项目遵循相同的代码规范。运行 `yarn lintcheck` 即可执行检查。

---

## 7. `tsconfig.json`

**作用：** TypeScript 编译器配置，定义类型检查和编辑器智能提示的行为。

**典型内容（以 `uikit-example` 为例）：**

```jsonc
{
  "extends": "../../tsconfig.examples.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "react-native-chat-uikit": [
        "../../packages/react-native-chat-uikit/src/index.tsx",
      ],
    },
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"],
}
```

**关键配置：**

| 配置项                      | 说明                                                                                                                  |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `extends`                   | 继承 `tsconfig.examples.json`（基于 `expo/tsconfig.base`，启用 `strict` 模式和 `customConditions: ["react-native"]`） |
| `paths.@/*`                 | 路径别名，`@/xxx` 映射到当前项目根目录，方便使用绝对路径导入                                                          |
| `paths.react-native-chat-*` | 将本地 workspace 包映射到源码目录，让 IDE 能直接跳转到源码进行类型推导                                                |
| `include`                   | 指定需要参与类型检查的文件范围                                                                                        |

**各子项目的差异：** `paths` 中映射的包不同，取决于该 example 依赖哪些本地包：

- `uikit-example` → `react-native-chat-uikit`
- `callkit-example` → `react-native-chat-callkit`
- `product-uikit-demo` → `react-native-chat-uikit` + `react-native-chat-callkit`
- `room-example` / `product-room-demo` → `react-native-chat-room`

---

## 8. `react-native.config.js`

**作用：** React Native CLI 配置文件，用于指导 **autolinking（自动链接）** 机制找到本地原生模块。

**什么是 autolinking：** 很多 React Native 第三方库（如相机、文件系统）包含 iOS/Android 原生代码。在构建时，React Native CLI 需要知道哪些库有原生代码、代码在哪里，然后自动将它们链接到原生工程中（iOS 通过 CocoaPods、Android 通过 Gradle）。对于从 `node_modules` 安装的普通 npm 包，CLI 会自动扫描发现。但对于 monorepo 中通过 `workspace:*` 引用的本地包，CLI 无法自动定位，因此需要在此文件中**显式告知包的路径**。

**它不是替换 `package.json` 的内容，** 而是为原生构建工具提供补充信息——告诉 React Native CLI："这个包的原生代码在这个路径下，请把它链接到原生工程中"。

**典型内容（以 `uikit-example` 为例）：**

```javascript
const path = require('path');

module.exports = {
  project: {
    ios: { automaticPodsInstallation: true },
  },
  dependencies: {
    'react-native-chat-uikit': {
      root: path.join(__dirname, '../../packages/react-native-chat-uikit'),
      platforms: { ios: {}, android: {} },
    },
  },
};
```

**具体流程：**

1. `expo prebuild` 或 `pod install` 时，React Native CLI 读取此文件
2. 根据 `dependencies` 中声明的 `root` 路径，找到本地包目录
3. 扫描该包中的原生代码（如 `ios/` 下的 `.podspec`、`android/` 下的 `build.gradle`）
4. 自动将这些原生依赖注册到 iOS Podfile / Android settings.gradle 中

**字段说明：**

- **`project.ios.automaticPodsInstallation`** — 启用 CocoaPods 自动安装，在依赖变更时自动运行 `pod install`
- **`dependencies`** — 显式声明 monorepo 中的本地包
  - `root` — 包的根目录绝对路径，CLI 从这里查找 `.podspec` 和 `build.gradle`
  - `platforms: { ios: {}, android: {} }` — 声明该包需要在 iOS 和 Android 两个平台上进行原生链接

**各子项目的差异：** `dependencies` 中列出的本地包不同，取决于该 example 依赖哪些包含原生代码的本地包。

---

## 配置文件协作关系总览

```
monorepo root
├── babel.config.examples.js      ← 共享 Babel 配置
├── eslint.config.examples.js     ← 共享 ESLint 配置
├── tsconfig.examples.json        ← 共享 TypeScript 基础配置
│
└── examples/
    └── <sub-project>/
        ├── package.json              ← 项目定义 + 依赖 + 脚本
        ├── index.js                  ← 入口：注册根组件
        ├── app.json                  ← Expo 应用配置 → 生成原生工程
        ├── babel.config.js           ← → 委托到 root/babel.config.examples.js
        ├── metro.config.js           ← Metro 打包器 + monorepo 支持
        ├── eslint.config.js          ← → 委托到 root/eslint.config.examples.js
        ├── tsconfig.json             ← → 继承 root/tsconfig.examples.json + 本地 paths
        └── react-native.config.js    ← RN CLI autolinking + 本地包声明
```

**统一管理策略：**

- `babel.config.js` 和 `eslint.config.js` 直接引用根目录的共享配置，保证一致性
- `tsconfig.json` 继承根目录基础配置，仅在 `paths` 中声明各自需要的本地包映射
- `metro.config.js` 结构一致，通过 `react-native-monorepo-config` 统一处理 monorepo 路径解析
- `react-native.config.js` 按需声明各自依赖的本地原生包
- `app.json` 是各子项目差异最大的文件，包含各自独立的应用名称、包名、图标和插件配置
