[返回父文档](./index.md)

- [本地 npm 包的使用和调试](#本地-npm-包的使用和调试)
  - [方法 1: 使用 link 的方式](#方法-1-使用-link-的方式)
      - [1. 准备本地 npm 包](#1-准备本地-npm-包)
      - [2. 修改`package.json`的配置](#2-修改packagejson的配置)
      - [3. 修改 `metro.config.js` 的配置](#3-修改-metroconfigjs-的配置)
      - [4. 重新运行 `yarn run start` 服务让修改生效](#4-重新运行-yarn-run-start-服务让修改生效)
  - [方法 2: 直接使用本地文件](#方法-2-直接使用本地文件)

# 本地 npm 包的使用和调试

如果想要依赖本地包，可能有两种方式。

## 方法 1: 使用 link 的方式

#### 1. 准备本地 npm 包

获取方式很多，使用 `npm pack` 打包命令获取比较常用。

#### 2. 修改`package.json`的配置

在 `package.json` 文件中，修改依赖项

```json
{
  // ... 其它配置
  "dependencies": {
    // ... 其它依赖项
    // "react-native-agora-chat": "1.3.0-beta.0", // 远端依赖方式
    // "react-native-agora-chat": "/Users/asterisk/Codes/rn/react-native-agora-chat-1.3.0-beta.0" // 本地依赖方式。
    "react-native-agora-chat": "link:../../react-native-agora-chat-1.3.0-beta.0" // 相对目录和绝对目录都可以。
  }
}
```

#### 3. 修改 `metro.config.js` 的配置

在 `metro.config.js` 文件中，添加内容如下：

```js
module.exports = {
  // ... 其它配置
  watchFolders: [
    // ... 其它目录
    '/Users/asterisk/Codes/rn/react-native-agora-chat-1.3.0-beta.0', // uikit npm 本地目录
  ],
  resolver: {
    // ... 其它配置
    nodeModulesPaths: [
      // ... 其它目录
      '/Users/asterisk/Codes/rn/react-native-chat-library-2.0/node_modules', // uikit 本身需要的依赖项。当前 repo 根目录的 node_modules
    ],
  },
};
```

#### 4. 重新运行 `yarn run start` 服务让修改生效

`metro.config.js` 文件修改之后，需要重新运行才生效。

## 方法 2: 直接使用本地文件

该方法简单，只需要直接修改 `package.json` 的配置就可以。

```json
{
  // ... 其它配置
  "dependencies": {
    // ... 其它依赖项
    "react-native-agora-chat": "/Users/asterisk/Codes/rn/react-native-agora-chat-1.3.0-beta.0" // 本地依赖方式。
  }
}
```
