_中文 | [English](./README.md)_

---

# 概述

这是一个多包管理仓库。包括 uikit sdk 和 callkit sdk。

## 环境准备

- 操作系统：
  - MacOS 10.15.7 或以上版本
- 工具集合：
  - Xcode 13.4 或以上版本 （如果开发 iOS 平台引用）
  - Android studio 2021.3.1 或以上版本 （如果开发 Android 平台应用）（简称 as）
  - Visual Studio Code latest （简称 vscode）
- 编译运行环境：
  - Java JDK 1.8.0 或以上版本 （推荐使用 Android studio 自带）
  - Objective-C 2.0 或以上版本 （推荐使用 Xcode 自带）
  - Typescript 4.0 或以上版本
  - Nodejs 16.18.0 或以上版本 （推荐使用 brew 安装）
  - yarn 1.22.19 或以上版本 （推荐使用 brew 安装）
  - React-Native 0.63.5 以上
  - npm 以及相关工具 （**不推荐**，相关问题请自行解决）
  - expo 6.0.0 或以上版本

## 源码下载

[下载地址](https://github.com/AgoraIO-Usecase/AgoraChat-UIKit-rn)

```sh
git clone git@github.com:AgoraIO-Usecase/AgoraChat-rn.git
```

## 项目的结构

这是一个多包管理项目，通过 `lerna` 和 `yarn workspace` 实现管理。

- `example`: 较为完整的示例项目，用于演示和测试开发的包。
- `examples/callkit-example`: callkit 示例项目，主要针对 `callkit sdk` 进行演示。
- `packages/react-native-chat-uikit`: uikit 项目
- `packages/react-native-chat-callkit`: callkit 项目

**注意** 项目运行的命令一般都是在项目根目录，而不是对应的包目录或者示例目录。

## 编译和运行

#### 项目初始化

1. 使用 `vscode` 打开项目 `react-native-chat-library`
2. 使用 `terminal` 初始化项目 `yarn`
3. 如果是第一次项目初始化，还需要执行命令 `yarn run generate-source-env`，生成相应的文件。例如：`env.ts`。

**注意** `yarn` 会执行额外的命令，对于不了解命令的开发者，如果需要使用 `npm` 命令替换，需要了解更加相信的内容。
**注意** 在创建该项目的时候，脚手架已经预置了部分 `yarn` 相关的命令，所以，推荐使用 `yarn` 完成绝大部分工作。
**注意** 由于 `example` 使用了 `firebase cloud message (fcm)` 相关内容，如果用户需要使用相关内容，需要设置对应的文件（ios 平台需要 GoogleService-Info.plist， android 平台需要 google-services.json），如果不需要则删除相关内容即可。

#### 通用编译

操作步骤如下：

1.  使用 `terminal` 切换到目录到 `example`
2.  执行命令 `yarn run ios` 命令编译并运行 `iOS` 应用
3.  执行命令 `yarn run android` 命令编译并运行 `Android` 应用

**注意** 不推荐该模式进行编译。
**修改命令** 请参考 `example/package.json` 相关内容。
**参考** 编译和运行命令更多知识请参考 `expo` 相关内容。

#### 通用运行

在开发模式下运行应用，需要额外的本地服务，它可以动态检测到文件源码的修改，动态的进行调试。

1. 使用 `terminal` 工具，切换目录到 `cd example/ios`
2. 使用 `terminal` 工具，执行 `yarn run start` 命令启动服务。

#### iOS 平台

**<span style="color:orange">编译和构建该项目</span>**

在编译阶段，`iOS` 平台需要执行 `pod install` 命令生成 Xcode `xcworkspace` 工程文件。

1. 使用 `terminal` 工具，切换目录到 `cd example/ios`
2. 使用 `terminal` 工具，执行 `pod install` 生成 `example/ios/example.xcworkspace`.
3. 使用 `Xcode` 工具，打开工程文件 `example/ios/example.xcworkspace`
4. 如果使用模拟器，则需要选择 `iOS` 12.4 或者以下版本
5. 如果使用真机，真机需要启用开发者模式，工程项目中需要设置 `singing & capabilities` 相关内容
6. 使用 `Xcode` 工具，执行编译操作。

**注意** 对于不使用 `Xcode` 编译的开发者，可以使用官方推荐的方式编译，如果出现问题一般的不好查找问题原因。
**注意** 自动启动的是 `react-native` 原生的服务，而不是 `expo` 服务，会报错。只需要关闭该服务即可。

**<span style="color:orange">运行该项目</span>**

使用 `expo` 工具提供的命令，启动本地服务，参考 `通用运行` 章节。

**注意** 如果运行的应用没有正确加载，需要刷新页面，或者关闭应用重新启动。对于报错问题一般可以通过相应的提示解决。

#### Android 平台

**<span style="color:orange">编译和构建该项目</span>**

在编译阶段，`Android` 平台需要执行 `sync` 初始化项目。

1. 启动 `android studio (as)` 工具, 打开工程文件 `example/android`，
2. 点击 `sync project with gradle files` 按钮执行 `初始化` 操作，
3. 如果使用模拟器，请选择或者创建 6.0 版本或以上版本的模拟器，
4. 如果是真机，需要开启设备的开发者模式，
5. 当 `sync` 成功后，点击 `run app` 按钮，执行编译和运行该项目。

**注意** 如果是第一次使用 `as`, 可能需要大量下载，等待时间较长。
**注意** 如果遇到 `timeout` 可能是使用了 `m1/m2` arm64 版本的 MacOS 设备导致的，需要使用 `terminal` 执行 `open -a /Applications/Android\ Studio.app` 命令启动 `as`。

**<span style="color:orange">运行该项目</span>**

使用 `expo` 工具提供的命令，启动本地服务，参考 `通用运行` 章节。

**注意** 如果运行的应用没有正确加载，需要刷新页面，或者关闭应用重新启动。对于报错问题一般可以通过相应的提示解决。
**注意** `Android 平台的设备，需要数据转发，该数据转发的命令是 `adb reverse tcp:8081 tcp:8081`。由于 `example`使用`expo` 工具，它帮忙做了，所以不需要手动操作。

# 更多说明

[uikit example helper](./example/README.md)
[callkit example helper](./examples/callkit-example/README.md)
[uikit helper](./packages/react-native-chat-uikit/README.md)
[callkit helper](./packages/react-native-chat-callkit/README.md)

---

# Q & A

如果你有更多疑问请查看这里，如果你有更多建议，也请贡献到这里。

[skip to here](./QA.md)

---

# 思维导图

这个维度的说明可能增加你对该项目的了解。

[skip to here](./swdt.md)
