[返回父文档](./index.md)

- [callkit-example 示例介绍](#callkit-example-示例介绍)
  - [项目配置](#项目配置)
  - [项目编译](#项目编译)
  - [Rest 服务](#rest-服务)
  - [初始化介绍](#初始化介绍)
  - [页面介绍](#页面介绍)
  - [信令介绍](#信令介绍)
  - [监听器介绍](#监听器介绍)
  - [常见问题](#常见问题)

# callkit-example 示例介绍

该组件库主要用来实现音视频通话功能。主要通过 `chat` 提供的收发消息实现信令部分，通过 `react-native` 实现 UI 组件。

该组件库主要支持单群聊的音视频通话。

该库主要依赖 `react-native-chat-sdk` 和 `react-native-agora` 两个库实现音视频通话。

## 项目配置

参考 `existed-app` 章节。
除此之外，需要注意，该项目为本地依赖，即它会自动使用仓库中提供的本地 npm 包。不需要显示指定。

## 项目编译

项目是仓库的子目录。需要先初始化仓库，再构建项目。

```sh
# 在根目录下
yarn
# 初始化配置 生成 version.ts, env.ts, config.local.ts等文件, 需要填写必要参数
yarn yarn-prepack
# 切换到子目录
cd examples/callkit-example
# 如果是ios平台 需要运行
cd ios && pod install
# 如果是android平台 需要运行 android项目的sync
```

## Rest 服务

该实例项目运行需要配置 `AppServer`。在服务端部署 `AppServer` 服务，在客户端 实现 `RestApi` 接口。（详见 `AppServerClient`）
本示例项目中，配置服务器地址 `RestApi.setServer`, 提供 获取手机号验证码、手机号登录、上传头像、获取 `rtcToken`、获取 `rtcMap`、获取群主头像接口。

详见 `examples/callkit-example/src/utils/AppServer.ts` [源码](../../../examples/callkit-example/src/utils/AppServer.ts)

## 初始化介绍

项目的配置是非常重要的，通常在程序运行的前期就完成。

示例如下：

```tsx
import { GlobalContainer as CallKitContainer } from 'react-native-chat-callkit';
export function App() {
  // ...
  return (
    <CallKitContainer
      option={{
        appKey: gAppKey,
        agoraAppId: agoraAppId,
      }}
      type={accountType as any}
      requestRTCToken={requestRTCToken}
      requestUserMap={requestUserMap}
      requestCurrentUser={requestCurrentUser}
      requestUserInfo={requestUserInfo}
      requestInviteContent={requestInviteContent}
    >
      {/* 更多页面 */}
    </CallKitContainer>
  );
}
```

具体用法详见 `example/src/demo/App.tsx`

## 页面介绍

页面主要分为单聊音视频页面和群聊音视频页面。

- SingleCall: `packages/react-native-chat-callkit/src/view/SingleCall.tsx` [源码](../../../packages/react-native-chat-callkit/src/view/SingleCall.tsx)
- MultiCall: `packages/react-native-chat-callkit/src/view/MultiCall.tsx` [源码](../../../packages/react-native-chat-callkit/src/view/MultiCall.tsx)

详见 `examples/callkit-example/src/screens/Home.tsx`。[源码](../../../examples/callkit-example/src/screens/Home.tsx)

## 信令介绍

单群聊音视频流的控制需要信令（管理和控制音视频多方协作的命令）。主要通过 `CallManager` 完成。目前没有提供单独使用信令而不使用页面的方法，后续会更新。信令管理器主要通过页面间接调用来完成音视频通话。

## 监听器介绍

`CallListener` 监听器对象主要用来接收其它设备发送的音视频通话邀请、以及错误通知。
需要在初始化阶段进行设置。

详见 `examples/callkit-example/src/screens/Home.tsx` [源码](../../../examples/callkit-example/src/screens/Home.tsx)

## 常见问题

1. 音视频目前上线多少？
   参考描述: 音频 128 路、视频 16 路。
