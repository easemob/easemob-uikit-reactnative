[返回父文档](./index.md)

# 打包介绍

提供终端使用的 `uikit` 将采用 `npm` 包的形式。对于对仓库修改的自定义内容，或者紧急修复的问题，可能需要用到本地打包测试。

以 `uikit` 打包为例。

1. 修改 `uikit` 的版本号。

在 `package.json` 文件中，修改 version 字段的值。

2. 使用终端命令 `npm pack` 生成 npm 包。

3. 将目标项目中，修改 依赖路径。

例如：在项目 A 中，在 `package.json` 文件中, 修改 `react-native-chat-uikit` 值为 `/Users/asterisk/Downloads/2024-04-19/react-native-chat-uikit-2.0.0-beta.0`


## 常见问题

1. 使用 `yarn link` 命令添加本地依赖。
   1. 这个命令对于 `react-native` 项目可能并不好用，这个依赖可能有native模块。推荐使用上述的方法进行本地依赖。
2. 使用 `repo` 直接依赖。
   1. 由于 `uikit` 处于多包仓库，无法使用该方法。 例如： `yarn add git@https://github.com/AsteriskZuo/react-native-chat-library/tree/dev-2.1/packages/react-native-chat-uikit`。
3. 