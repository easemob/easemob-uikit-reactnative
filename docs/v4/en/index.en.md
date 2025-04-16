- [Introduction](#introduction)
  - [Repository Structure](#repository-structure)
  - [Package](#package)
  - [Examples](#examples)
  - [Build a Repository](#build-a-repository)
  - [Create a Repository](#create-a-repository)
  - [Route](#route)
  - [Contents Beyond the Repository](#contents-beyond-the-repository)
  - [FAQ](#faq)
  - [Reference](#reference)

# Introduction

This document presents the repository structure, package description, examples, and FAQs.

## Repository Structure

This repository is a multi-package repository that includes `uikit`, `callkit`, `roomkit`, and corresponding example projects.

Currently, mainstream projects adopt this repository structure, for example, `react-navigation`, `sendbird-uikit-react-native`, and `stream-chat-react-native`. If you are interested, you can click the links in the reference section for further details.

**Repository structure**

```
.
├── LICENSE
├── docs
│   └── v4
├── examples
│   ├── room-example
│   ├── product-room-demo
│   ├── product-uikit-demo
│   ├── callkit-example
│   └── uikit-example
├── node_modules
├── package.json
├── packages
│   ├── react-native-chat-room
│   ├── react-native-chat-callkit
│   └── react-native-chat-uikit
├── patches
├── res
├── scripts
├── templates
├── tsconfig.json
└── yarn.lock
```

**Structural Description**

- LICENSE: license file
- docs: a compilation of documents, currently in the latest V3 version.
- example: complete sample project, dependent on local npm packages. Currently, `callkit` and `uikit` are used.
- examples:
  - room-example: sample project of the `room` package.
  - product-room-demo: Sample demonstration project of the `product-room` SDK.
  - product-uikit-demo: Sample demonstration project of the `product-uikit` SDK.
  - callkit-example: sample project of the `callkit` package.
  - uikit-example: sample project of the `uikit` package.
- node_modules: list of project dependencies managed by the `yarn` tool.
- package.json: project configuration file. It is the core configuration of this repository. The `package.json` files in other subfolders are responsible for managing sub-projects.
- packages:
  - react-native-chat-room: `room` SDK。
  - react-native-chat-callkit: `callkit` SDK.
  - react-native-chat-uikit: `uikit` SDK.
- patches: Patches for fixing urgent issues.
- res: Resource folder.
- scripts: Script folder.
- templates: Template folder.
- tsconfig.json: Configuration for TypeScript language.
- yarn.lock: version management file for project dependencies configuration.

## Package

The `packages` folder include `react-native-chat-callkit` and `react-native-chat-uikit` packages. There may be additional packages in the future according to requirements.

- `react-native-chat-room`: Primarily assists users in integrating chatroom functionalities.
- `react-native-chat-callkit`: Primarily assists users in integrating audio and video call functionalities.
- `react-native-chat-uikit`: Primarily assists users in integrating `react-native-chat-sdk` functionalities. If you are interested, you can click the links in the reference section for further details.

[Callkit SDK Documentation Entry](./callkit.en.md)  
[UIkit SDK Documentation Entry](./uikit.en.md)
[room uikit SDK Documentation Entry](./room-uikit.en.md)

## Examples

The `examples` folder mainly includes a list of sample projects.

`callkit-example`: Mainly demonstrates the usage of the `callkit` SDK.
`uikit-example`: Mainly demonstrates the usage of the `uikit` SDK.
`room-example`: Mainly demonstrates the usage of the `room` SDK.
`product-uikit-demo`: Comprehensively demonstrates the usage of `uikit` + `callkit` SDKs.
`product-room-demo`: Comprehensively demonstrates the usage of the `room` SDK.

[Room Quick Start Guide](./room-quick-start.en.md)
[UIKit Quick Start Guide](./uikit-quick-start.en.md)
[CallKit Quick Start Guide](./callkit-quick-start.en.md)

## Build a Repository

See [Build a Repository](./repo-builder.en.md).

## Create a Repository

See [Create a Repository](./create-app.en.md).

## Route

See [Route](./route-app.en.md).

## Contents Beyond the Repository

[Quick start](./quick-start.en.md)  
[Difference between domestic and overseas versions](./diff-repo.en.md)  
[FCM push](./fcm-app.en.md)  
[Local npm package](./npm-package.en.md)  
[Patch npm package](./patch-package.en.md)

## FAQ

See [FAQ](./qa.en.md).

## Reference

See [Reference](./ref.en.md).
