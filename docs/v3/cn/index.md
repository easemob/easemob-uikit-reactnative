
- [介绍](#介绍)
  - [仓库结构](#仓库结构)
  - [包介绍](#包介绍)
  - [示例介绍](#示例介绍)
  - [仓库构建说明](#仓库构建说明)
  - [创建项目说明](#创建项目说明)
  - [现有项目集成说明](#现有项目集成说明)
  - [常见问题](#常见问题)
  - [参考引用](#参考引用)


# 介绍

主要介绍内容包括：仓库架构、包介绍、示例介绍、常见问题。

## 仓库结构

该仓库为多包仓库,主要包括 `uikit`, `callkit` 以及对应示例项目。

目前主流项目都会采用该仓库架构。例如：`react-navigation`，`sendbird-uikit-react-native`, `stream-chat-react-native`。如果感兴趣可以在参考引用部分点击对应链接查看。

**结构介绍**

```
.
├── LICENSE
├── docs
├── example
├── examples
│   ├── callkit-example
│   └── uikit-example
├── node_modules
├── package.json
├── packages
│   ├── react-native-chat-callkit
│   └── react-native-chat-uikit
├── patches
├── res
├── scripts
├── templates
├── tsconfig.json
└── yarn.lock
```

**结构说明**

- LICENSE: 许可证文件
- docs: 文档合集，目前最新 V3 版本。
- example: 完整示例项目，依赖本地 npm 包，目前使用了 `callkit` 和 `uikit`。
- examples:
  - callkit-example: `callkit` 包的示例项目。
  - uikit-example: `uikit` 包的示例项目。
- node_modules: 项目依赖的包列表。有 `yarn` 工具管理。
- package.json: 项目配置文件。是该仓库的核心配置。其它子文件夹下的 `package.json` 负责子项目管理。
- packages:
  - react-native-chat-callkit: `callkit` SDK。
  - react-native-chat-uikit: `uikit` SDK。
- patches: 补丁。修复紧急问题。
- res: 资源文件夹。
- scripts: 脚本文件夹。
- templates: 模板文件夹。
- tsconfig.json: TS 语言的配置。
- yarn.lock: 项目依赖配置版本管理文件。

## 包介绍

在 `packages` 文件夹下，主要包括 `react-native-chat-callkit` 和 `react-native-chat-uikit` 包。后续可能根据需要会有更多的包。

- `react-native-chat-callkit`: 主要方便用户集成音视频通话功能。
- `react-native-chat-uikit`: 主要方便用户集成 `react-native-chat-sdk` 功能。 如果感兴趣可以在参考引用部分点击对应链接查看。

[callkit sdk 说明入口](./callkit.md)
[uikit sdk 说明入口](./uikit.md)

## 示例介绍

在 `examples` 文件夹下，主要包括 `callkit` 和 `uikit` 的示例项目。

`callkit-example`: 主要演示 `callkit` SDK 的使用。
`uikit-example`: 主要演示 `uikit` SDK 的使用。

[callkit-example 说明入口](./uikit-example.md)
[uikit-example 说明入口](./uikit-example.md)

在 `example` 下是较为完整的演示项目。

[example 说明入口](./example.md)

## 仓库构建说明

[仓库构建说明入口](./repo-builder.md)

## 创建项目说明

[创建项目说明入口](./create-app.md)

## 现有项目集成说明

[现有项目集成说明入口](./existed-app.md)

## 常见问题

[常见问题文档入口](./qa.md)

## 参考引用

[参考引用文档入口](./ref.md)
